package server

import (
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) UserAnswerd(c *fiber.Ctx) error {
	trans := &model.Trans{}
	transId, _ := c.ParamsInt("id")
	answer, _ := c.ParamsInt("answer")
	if err := s.DB.Where("id = ?", transId).First(trans).Error; err == nil {
		return s.App.HttpResponseNotFound(c, fmt.Errorf("trans not found"))
	}
	trans.AnswerId = answer
	s.DB.Save(trans)
	return s.App.HttpResponseOK(c, trans)
}
