package server

import (
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (s *Server) GetAllQuestions(c *fiber.Ctx) error {
	questions := []model.Question{}

	err := s.DB.Preload("Options").Find(&questions).Error
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
	result := s.DB.Preload("Options").First(&Question, question_id)
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

	exam := &model.Exam{}
	err = s.DB.Preload("Questions").First(exam, exam_id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return s.App.HttpResponseNotFound(c, err)
		}
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, exam)
}

func (s *Server) CreateQuestion(c *fiber.Ctx) error {
	question := &model.Question{}
	err := c.BodyParser(question)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	tx := s.DB.Begin()
	err = tx.Create(question).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseBadRequest(c, err)
	}

	exam := &model.Exam{}
	err = tx.First(exam, question.ExamId).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseBadRequest(c, err)
	}
	exam.QuestionsCount = exam.QuestionsCount + 1

	tx.Save(exam)

	tx.Commit()
	return s.App.HttpResponseCreated(c, question)
}

func (s *Server) DeleteQuestion(c *fiber.Ctx) error {
	question_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	tx := s.DB.Begin()
	question := &model.Question{}
	err = s.DB.Delete(question, question_id).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	exam := &model.Exam{}
	err = tx.First(exam, question.ExamId).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseBadRequest(c, err)
	}

	exam.QuestionsCount = exam.QuestionsCount - 1
	tx.Save(exam)

	tx.Commit()

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
