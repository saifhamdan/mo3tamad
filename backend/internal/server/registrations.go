package server

import (
	"fmt"
	"mo3tamad/model"
	"mo3tamad/pkg/certificate"
	"mo3tamad/pkg/email"
	"mo3tamad/pkg/shortuuid"
	"time"

	"github.com/gofiber/fiber/v2"
)

const (
	EXAM_STATUS_PASSED           = "passed"
	EXAM_STATUS_NOT_PASSED       = "not-passed"
	EXAM_STATUS_CHEATED          = "cheated"
	EXAM_STATUS_STARTED          = "started"
	EXAM_STATUS_NOT_STARTED      = "not-started"
	EXAM_STATUS_WAITING_APPROVAL = "waiting-approval"
)

func (s *Server) CreateRegister(c *fiber.Ctx) error {
	registration := &model.Registration{}
	accountId, _ := c.ParamsInt("account_id")
	examId, _ := c.ParamsInt("exam_id")

	if err := s.DB.Where("account_id = ? AND exam_id=?", accountId, examId).First(registration).Error; err == nil {
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("User has already registerd for the exam"))
	}

	registration.IsCheated = false
	registration.Status = calculateRegStatus(registration)
	registration.AccountId = accountId
	registration.ExamId = examId
	tx := s.DB.Begin()
	err := tx.Create(registration).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	exam := &model.Exam{}

	if err = tx.Preload("Questions").First(exam, examId).Error; err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	trans := []model.Trans{}
	for _, q := range exam.Questions {
		trans = append(trans, model.Trans{
			RegistrationId: registration.RegistrationId,
			AccountId:      registration.AccountId,
			QuestionId:     q.QuestionId,
		})

	}

	if err = tx.Create(&trans).Error; err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	tx.Commit()
	return s.App.HttpResponseCreated(c, registration)
}

func (s *Server) StartedExam(c *fiber.Ctx) error {

	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.Preload("Exam").First(registration, registrationId).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("registiration not found"))
	}
	registration.Status = calculateRegStatus(registration)
	if registration.Status != EXAM_STATUS_NOT_STARTED {
		return s.App.HttpResponseForbidden(c, fmt.Errorf("the exam has started or your time is up"))
	}

	currentTime := time.Now()
	dd := registration.Exam.Duration * time.Minute
	currentTimeAfterDuration := currentTime.Add(dd)
	registration.StartTime = &currentTime
	registration.EndTime = &currentTimeAfterDuration
	registration.Status = calculateRegStatus(registration)

	err := s.DB.Save(registration).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) FinishedExam(c *fiber.Ctx) error {
	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.Preload("Exam").Preload("Trans.Question.Options").First(registration, registrationId).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("registiration not found"))
	}

	registration.Status = calculateRegStatus(registration)
	if registration.Status != EXAM_STATUS_STARTED {
		return s.App.HttpResponseForbidden(c, fmt.Errorf("the exam has not started yet or the exam is finished"))
	}

	currentTime := time.Now()
	registration.FinishedAt = &currentTime
	registration.Status = calculateRegStatus(registration)

	mark := 0
	for _, t := range registration.Trans {
		for _, o := range t.Question.Options {
			if o.OptionId == t.AnswerId {
				if o.IsCorrect {
					mark++
				} else {
					break
				}
			}
		}
	}

	registration.Result = (mark / len(registration.Trans)) * 100
	if registration.Result <= registration.Exam.PassingScore {
		registration.Passed = false
		registration.IsConsidered = true
	}
	fmt.Println(registration.Result)

	err := s.DB.Save(registration).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) UserCheated(c *fiber.Ctx) error {
	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.First(registration, registrationId).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("registiration not found"))
	}

	registration.Status = calculateRegStatus(registration)
	if registration.Status != EXAM_STATUS_STARTED {
		return s.App.HttpResponseForbidden(c, fmt.Errorf("the exam has not started yet or the exam is finished"))
	}

	registration.IsCheated = true
	registration.Status = calculateRegStatus(registration)
	s.DB.Save(registration)
	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) ApproveApplicant(c *fiber.Ctx) error {
	registration_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	reg := &model.Registration{}
	err = s.DB.Preload("Account").Preload("Exam.Company").First(reg, registration_id).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	currentTime := time.Now()
	reg.Passed = true
	reg.IsConsidered = true
	reg.Status = calculateRegStatus(reg)
	reg.CertificateUrl = shortuuid.New()
	reg.IssuedAt = &currentTime

	tx := s.DB.Begin()
	err = tx.Save(reg).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	err = certificate.GenerateCertificate(reg.CertificateUrl, reg.Account.Name, reg.Exam.Company.Name, reg.Exam.Title, reg.Result, reg.IssuedAt)
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	err = email.ApproveEmail([]string{reg.Account.Email}, reg.Account.Name, reg.Exam.Company.Name, reg.Exam.Title, reg.CertificateUrl, reg.ExamId, reg.Result, reg.IssuedAt)
	if err != nil {
		tx.Rollback()
		certificate.DeleteCertificate(reg.CertificateUrl)
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseOK(c, reg)
}

func (s *Server) DeclineApplicant(c *fiber.Ctx) error {
	registration_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	reg := &model.Registration{}
	err = s.DB.Preload("Account").Preload("Exam.Company").First(reg, registration_id).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	reg.Passed = false
	reg.IsConsidered = true
	reg.Status = calculateRegStatus(reg)

	tx := s.DB.Begin()
	err = tx.Save(reg).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	err = email.DeclineEmail([]string{reg.Account.Email}, reg.Account.Name, reg.Exam.Company.Name, reg.Exam.Title, reg.Exam.Company.Phone_number)
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseOK(c, reg)
}

func (s *Server) GetRegByUserId(c *fiber.Ctx) error {

	userId := GetAccountId(c)
	registration := []*model.Registration{}
	if err := s.DB.Preload("Exam").Where("account_id=?", userId).Find(&registration).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	for i := range registration {
		registration[i].Status = calculateRegStatus(registration[i])
		fmt.Println(registration[i].Status)
	}

	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) GetRegistration(c *fiber.Ctx) error {
	regId, _ := c.ParamsInt("id")
	registration := &model.Registration{}
	if err := s.DB.Preload("Exam").Preload("Trans.Question.Options").First(&registration, regId).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	registration.Status = calculateRegStatus(registration)

	if registration.Status != EXAM_STATUS_STARTED && registration.Status != EXAM_STATUS_NOT_STARTED {
		return s.App.HttpResponseForbidden(c, fmt.Errorf("the exam has not started yet or your time is up"))
	}

	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) GetRegByExamId(c *fiber.Ctx) error {
	examId, _ := c.ParamsInt("id")
	registration := []*model.Registration{}
	if err := s.DB.Preload("Exam").Preload("Account").Where("exam_id=?", examId).Find(&registration).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	for i := range registration {
		registration[i].Status = calculateRegStatus(registration[i])
	}

	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) DeleteRegistration(c *fiber.Ctx) error {
	registration_id, err := c.ParamsInt("id")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	s.DB.Delete(&model.Registration{}, registration_id)
	return s.App.HttpResponseNoContent(c)
}

func calculateRegStatus(reg *model.Registration) string {
	timeNow := time.Now().UnixNano()
	switch {
	case reg.Passed:
		return EXAM_STATUS_PASSED
	case !reg.Passed && reg.IsConsidered:
		return EXAM_STATUS_NOT_PASSED
	case reg.IsCheated:
		return EXAM_STATUS_CHEATED
	case reg.FinishedAt != nil && !reg.IsConsidered:
		return EXAM_STATUS_WAITING_APPROVAL
	case reg.StartTime == nil && reg.EndTime == nil:
		return EXAM_STATUS_NOT_STARTED
	case timeNow >= reg.StartTime.UnixNano() && timeNow <= reg.EndTime.UnixNano():
		return EXAM_STATUS_STARTED
	default:
		return ""
	}
}

func (s *Server) GetCertificate(c *fiber.Ctx) error {
	certUrl := c.Params("certUrl")

	certType := c.Query("type")

	if certType != "pdf" && certType != "png" {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("type is img and pdf only"))
	}

	return c.Download(fmt.Sprintf("public/certificates/%s.%s", certUrl, certType))
}
