package server

import (
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) GetAllCategories(c *fiber.Ctx) error {
	category := []model.Category{}
	err := s.DB.Find(&category).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, &category)
}
