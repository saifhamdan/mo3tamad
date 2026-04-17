package server

import (
	"errors"
	"fmt"
	"mo3tamad/model"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetAllCompaines function
func (s *Server) GetAllCompanies(c *fiber.Ctx) error {
	companies := []model.Company{}

	if err := s.DB.Find(&companies).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, companies)
}

// GetCompnay function
func (s *Server) GetCompany(c *fiber.Ctx) error {
	company := model.Company{}
	companyID := c.Params("id")

	if err := s.DB.First(&company, companyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return s.App.HttpResponseNotFound(c, err)
		}
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, company)
}

// ***************** CreateCompany ****************

func (s *Server) CreateCompany(c *fiber.Ctx) error {
	company := model.Company{} // creating empty company struct to make update

	err := c.BodyParser(&company) // parses the request body into the struct we defined (company)
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, err)
		// if there is an error in parsing the request into the struct return error 400 we defined in http.go
	}

	err = s.DB.Create(&company).Error // creat new company in database and return if there is any error
	// This checks if there was an error creating the company in the database
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	// done and created
	return s.App.HttpResponseCreated(c, company)
}

// *********************** DeleteCompany ********************

func (s *Server) DeleteCompany(c *fiber.Ctx) error {
	companyID, err := c.ParamsInt("id")
	if err != nil {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("id param required"))
	}

	if err := s.DB.Delete(&model.Company{}, companyID).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseNoContent(c)
}

// **************************************************** UpdateCompany *********************
func (s *Server) UpdateCompany(c *fiber.Ctx) error {
	// get the company_id from the request
	CompanyID := c.Params("id")
	// create empty company struct
	company := model.Company{}
	// find the company_id in the database and sign it to company empty struct that we create
	if err := s.DB.First(&company, CompanyID).Error; err != nil {
		// if there isn't a record return error 404
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return s.App.HttpResponseNotFound(c, fmt.Errorf("comapny not found"))
		}
		// if there is any other error return error 500
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	// create company struct to hold updated data
	updateData := model.Company{}
	// error 400 in parsing
	if err := c.BodyParser(&updateData); err != nil {
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("invalid request body"))
	}
	// i there isn't errors updatet the company struct with the updated data
	if updateData.Name != "" {
		company.Name = updateData.Name
	}
	if updateData.Desc != "" {
		company.Desc = updateData.Desc
	}
	if updateData.IsVerified {
		company.IsVerified = updateData.IsVerified
	}
	if updateData.Phone_number != "" {
		company.Phone_number = updateData.Phone_number
	}
	// saving the new data in the database, and if there's an erro while saving return error 500 in http.go file
	if err := s.DB.Save(&company).Error; err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	// everything done fine
	return s.App.HttpResponseOK(c, company)
}
