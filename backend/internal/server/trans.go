package server

import (
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) UserAnswerd(c *fiber.Ctx) error {
	transId, err := c.ParamsInt("transId")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("transId is required"))

	}

	trans := &model.Trans{}
	fmt.Println(transId)
	err = s.DB.First(trans, transId).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	reg := &model.Registration{}
	err = s.DB.First(reg, trans.RegistrationId).Error
	if err != nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("reg not found"))
	}

	reg.Status = calculateRegStatus(reg)
	if reg.Status != EXAM_STATUS_STARTED {
		return s.App.HttpResponseForbidden(c, fmt.Errorf("the exam has not started yet or the exam is finished"))
	}

	answerId := c.QueryInt("answerId")
	if answerId == 0 {
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("answerId required"))
	}

	trans.AnswerId = answerId
	err = s.DB.Save(trans).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseNoContent(c)
}
