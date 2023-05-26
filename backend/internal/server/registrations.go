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
	err := c.BodyParser(registration)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	if err := s.DB.Where("account_id = ? AND exam_id=?", accountId, examId).First(registration).Error; err == nil {
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("User has already registerd for the exam"))
	}

	registration.AccountId = accountId
	registration.ExamId = examId
	tx := s.DB.Begin()
	err = tx.Create(registration).Error
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

	if err := s.DB.First(registration, registrationId).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("Registiration not found"))
	}

	registration.Status = "progress"
	registration.StartTime = time.Now()
	registration.EndTime = time.Now()

	questions := []model.Question{}
	err := s.DB.Where("exam_id=?", registration.ExamId).Find(&questions).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	response := map[string]interface{}{
		"registration": registration,
		"questions":    questions,
	}

	s.DB.Save(registration)
	return s.App.HttpResponseOK(c, response)
}

func (s *Server) FinishedExam(c *fiber.Ctx) error {
	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.Where("id=?", registrationId).First(registration).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("Registiration not found"))
	}
	registration.Status = "finished"
	registration.EndTime = time.Now()
	s.DB.Save(registration)
	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) UserCheated(c *fiber.Ctx) error {
	registration := &model.Registration{}
	registrationId, _ := c.ParamsInt("id")

	if err := s.DB.Where("id=?", registrationId).First(registration).Error; err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("Registiration not found"))
	}
	registration.IsCheated = true
	s.DB.Save(registration)
	return s.App.HttpResponseOK(c, registration)
}

func (s *Server) GetRegByUserId(c *fiber.Ctx) error {

	userId, _ := c.ParamsInt("id")
	registration := []model.Registration{}
	if err := s.DB.Where("account_id=?", userId).Find(&registration).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, registration)
}
func (s *Server) GetRegByExamId(c *fiber.Ctx) error {
	examId, _ := c.ParamsInt("id")
	registration := []model.Registration{}
	if err := s.DB.Where("exam_id=?", examId).Find(&registration).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
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
