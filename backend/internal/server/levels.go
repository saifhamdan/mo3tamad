package server

import (
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) GetAllLevels(c *fiber.Ctx) error {
	level := []model.Level{}
	err := s.DB.Find(&level).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, &level)
}
