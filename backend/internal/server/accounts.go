package server

import (
	"fmt"
	"mo3tamad/model"
	"mo3tamad/pkg/oauth2"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (s *Server) GetAllAccounts(c *fiber.Ctx) error {

	accounts := []model.Account{}
	err := s.DB.Model(&model.Account{}).
		Preload("Role").
		Omit("password").
		Find(&accounts).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, accounts)
}

func (s *Server) GetAllAccountsByCompanyId(c *fiber.Ctx) error {
	companyId, err := c.ParamsInt("companyId")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("companyId param is required"))
	}

	accounts := []model.Account{}
	err = s.DB.Model(&model.Account{}).
		Where("company_id = ?", companyId).
		Preload("Role").
		Omit("password").
		Find(&accounts).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, accounts)
}

func (s *Server) GetAccount(c *fiber.Ctx) error {
	accountID, err := c.ParamsInt("id")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}

	account := &model.Account{}
	err = s.DB.Omit("password").First(account, accountID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return s.App.HttpResponseNotFound(c, err)
		}
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	account.Password = ""

	return s.App.HttpResponseOK(c, account)
}

func (s *Server) GetMyProfile(c *fiber.Ctx) error {
	user := GetUserCfg(c)

	me := &model.Account{}
	err := s.DB.Preload("Company").Preload("Role").Omit("password").First(me, user.ClientId).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	me.Password = ""

	return s.App.HttpResponseOK(c, me)
}

func (s *Server) UpdateMyProfile(c *fiber.Ctx) error {
	user := GetUserCfg(c)

	me := &model.Account{}
	err := s.DB.First(me, user.ClientId).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	pw := me.Password
	companyId := me.CompanyId

	err = c.BodyParser(me)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	me.Password = pw
	me.CompanyId = companyId
	err = s.DB.Save(me).Error

	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, me)
}

func (s *Server) CreateAccount(c *fiber.Ctx) error {
	account := &model.Account{}

	err := c.BodyParser(account)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	pw, err := oauth2.EncryptPassword(account.Password)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("no password found"))
	}
	account.Password = pw
	account.Active = true
	account.Status = "active"

	err = s.DB.Create(account).Error
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	return s.App.HttpResponseCreated(c, account)
}

func (s *Server) DeleteAccount(c *fiber.Ctx) error {
	accountID, err := c.ParamsInt("id")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id is required"))
	}

	s.DB.Delete(&model.Account{}, accountID)

	return s.App.HttpResponseNoContent(c)
}

func (s *Server) UpdateAccount(c *fiber.Ctx) error {
	accountID, err := c.ParamsInt("id")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param is required"))
	}
	account := &model.Account{}
	err = s.DB.First(account, accountID).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	pw := account.Password
	companyId := account.CompanyId

	err = c.BodyParser(account)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	// keep the old password because this is not a place change passwords
	account.Password = pw
	account.CompanyId = companyId

	s.DB.Save(account)

	return s.App.HttpResponseCreated(c, account)
}
