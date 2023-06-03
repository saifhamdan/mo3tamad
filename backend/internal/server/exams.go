package server

import (
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (s *Server) GetAllExams(c *fiber.Ctx) error {
	exams := []model.Exam{}
	err := s.DB.Preload("Company").Preload("Categories").Preload("Level").Find(&exams).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, &exams)
}

func (s *Server) GetAllExamsByCompanyId(c *fiber.Ctx) error {
	companyId, err := c.ParamsInt("companyId")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("companyId param is required"))
	}

	exams := []model.Exam{}
	err = s.DB.Where("company_id = ?", companyId).Preload("Company").Find(&exams).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, &exams)
}

func (s *Server) GetExam(c *fiber.Ctx) error {
	type Res struct {
		model.Exam
		Registration *model.Registration `json:"registration,omitempty"`
	}
	res := &Res{}
	exam_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	reg := &model.Registration{}
	err = s.DB.Where("account_id = ? AND exam_id = ?", GetAccountId(c), exam_id).First(reg).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
		} else {
			return s.App.HttpResponseInternalServerErrorRequest(c, err)
		}
	} else {
		res.Registration = reg
	}

	err = s.DB.Preload("Company").Preload("Comments").Preload("Categories").Preload("Level").First(&res.Exam, exam_id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return s.App.HttpResponseNotFound(c, err)
		}
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, res)
}

func (s *Server) CreateExam(c *fiber.Ctx) error {
	exam := &model.Exam{}
	err := c.BodyParser(exam)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	err = s.DB.Create(exam).Error
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	return s.App.HttpResponseCreated(c, exam)
}

func (s *Server) DeleteExam(c *fiber.Ctx) error {
	exam_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	s.DB.Delete(&model.Exam{}, exam_id)
	return s.App.HttpResponseNoContent(c)
}

func (s *Server) UpdateExam(c *fiber.Ctx) error {
	exam_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	exam := &model.Exam{}
	s.DB.Where("id=?", exam_id).Delete(&model.Category{})
	s.DB.First(exam, exam_id)
	err = c.BodyParser(exam)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	s.DB.Save(exam)
	return s.App.HttpResponseCreated(c, exam)
}
