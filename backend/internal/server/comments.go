package server

import (
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) GetAllComments(c *fiber.Ctx) error {
	comments := []model.Comment{}

	err := s.DB.Find(&comments).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, &comments)
}
func (s *Server) CreateComment(c *fiber.Ctx) error {
	comment := &model.Comment{}
	err := c.BodyParser(comment)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	err = s.DB.Create(comment).Error
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	err = s.DB.Preload("Account").First(comment, comment.CommentId).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	fmt.Println("Acc", comment.Account.AccountId)
	return s.App.HttpResponseCreated(c, comment)
}

func (s *Server) UpdateComment(c *fiber.Ctx) error {
	comment_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	comment := &model.Comment{}
	s.DB.First(comment, comment_id)
	err = c.BodyParser(comment)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	err = s.DB.Save(comment).Error
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	err = s.DB.Preload("Account").First(comment, comment.CommentId).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseCreated(c, comment)
}

func (s *Server) DeleteComment(c *fiber.Ctx) error {
	comment_id, err := c.ParamsInt("id")
	if err != nil {
		s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	s.DB.Delete(&model.Comment{}, comment_id)
	return s.App.HttpResponseNoContent(c)
}
