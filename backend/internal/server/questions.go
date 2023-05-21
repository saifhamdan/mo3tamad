package server

import (
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (s *Server) GetAllQuestions(c *fiber.Ctx) error {
	questions := []model.Question{}
	err := s.DB.Find(&questions).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, questions)
}

func (s *Server) GetQuestion(c *fiber.Ctx) error {
	question_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	var Question model.Question
	result := s.DB.First(&Question, question_id)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return s.App.HttpResponseNotFound(c, err)
		}
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, Question)
}

func (s *Server) GetQuestionByExamId(c *fiber.Ctx) error {
	exam_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	err = s.DB.Find(&model.Exam{}, exam_id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return s.App.HttpResponseNotFound(c, err)
		}
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	questions := []model.Question{}

	err = s.DB.Where("exam_id=?", exam_id).Find(&questions).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, questions)
}

func (s *Server) CreateQuestion(c *fiber.Ctx) error {
	question := &model.Question{}
	err := c.BodyParser(question)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	err = s.DB.Create(question).Error
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	return s.App.HttpResponseCreated(c, question)
}

func (s *Server) DeleteQuestion(c *fiber.Ctx) error {
	question_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	s.DB.Where("question_id=?", question_id).Delete(&model.Option{})
	s.DB.Delete(&model.Question{}, question_id)
	return s.App.HttpResponseNoContent(c)
}

func (s *Server) UpdateQuestion(c *fiber.Ctx) error {
	question_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	question := &model.Question{}
	s.DB.Where("question_id=?", question_id).Delete(&model.Option{})
	s.DB.First(question, question_id)
	err = c.BodyParser(question)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	s.DB.Save(question)
	return s.App.HttpResponseCreated(c, question)
}
