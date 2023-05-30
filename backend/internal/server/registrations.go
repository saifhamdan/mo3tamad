package server

import (
	"fmt"
	"mo3tamad/model"
	"time"

	"github.com/gofiber/fiber/v2"
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
	return s.App.HttpResponseNoContent(c)
}

func (s *Server) FinishedExam(c *fiber.Ctx) error {
	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.Where("id=?", registrationId).First(registration).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("registiration not found"))
	}
	currentTime := time.Now()
	registration.FinishedAt = &currentTime
	registration.Status = calculateRegStatus(registration)
	err := s.DB.Save(registration).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) UserCheated(c *fiber.Ctx) error {
	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.Where("id=?", registrationId).First(registration).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("registiration not found"))
	}
	registration.IsCheated = true
	registration.Status = calculateRegStatus(registration)
	s.DB.Save(registration)
	return s.App.HttpResponseOK(c, registration)
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
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	s.DB.Delete(&model.Registration{}, registration_id)
	return s.App.HttpResponseNoContent(c)
}

func calculateRegStatus(reg *model.Registration) string {
	timeNow := time.Now().UnixNano()
	switch {
	case reg.Passed:
		return "passed"
	case !reg.Passed && reg.IsConsidered:
		return "not-passed"
	case reg.IsCheated:
		return "cheated"
	case reg.StartTime == nil && reg.EndTime == nil:
		return "not-started"
	case timeNow >= reg.StartTime.UnixNano() && timeNow <= reg.EndTime.UnixNano():
		return "started"
	case timeNow >= reg.EndTime.UnixNano() && !reg.IsConsidered:
		if reg.FinishedAt == nil {
			reg.FinishedAt = reg.EndTime
		}
		return "waiting-approval"
	default:
		return ""
	}
}
