package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type AssessmentQuestion struct {
	MasterID    int    `json:"master_id"`
	Question    string `json:"question"`
	Category    string `json:"category"`
	SubCategory string `json:"sub_category"`
}

type CXAssessmentResponse struct {
	Status string               `json:"status"`
	Data   []AssessmentQuestion `json:"data"`
}

func (s *Server) GetAssessmentsCategories(c *fiber.Ctx) error {
	res, err := s.getCXCategories()

	if err != nil {
		s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, res)
}

func (s *Server) GetAssessmentsSubCategories(c *fiber.Ctx) error {
	res, err := s.getCXSubCategories()

	if err != nil {
		s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, res)
}

func (s *Server) GetCXAssessment(c *fiber.Ctx) error {

	url := fmt.Sprintf("%s/api/compose/namespace/321576423183613954/module/321583133096935426/record/?query=&incTotal=true&incPageNavigation=true&sort=createdAt+ASC",
		s.Config.CortezaAPI)
	reqass, err := http.NewRequest("GET", url, nil)
	if err != nil {
		s.Log.Logger.Panic(err)
		return err
	}

	reqass.Header.Set("Authorization", "Bearer "+s.Token)
	reqass.Header.Set("Accept", "application/json")

	resp, err := s.Client.Do(reqass)
	if err != nil {
		s.Log.Logger.Panic(err)
		return err
	}
	defer resp.Body.Close()

	categoryMap, err := s.getCXCategories()
	if err != nil {
		s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	subCategoryMap, err := s.getCXSubCategories()
	if err != nil {
		s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	var assessmentQuestions []AssessmentQuestion

	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		s.Log.Logger.Panic(err)
		return err
	}
	res := data["response"].(map[string]interface{})
	set := res["set"].([]interface{})
	for _, t := range set {
		item := t.(map[string]interface{})
		values := item["values"].([]interface{})
		question := values[1].(map[string]interface{})
		id := values[2].(map[string]interface{})
		category := values[0].(map[string]interface{})
		subCategory := values[3].(map[string]interface{})
		idInt, _ := strconv.Atoi(id["value"].(string))
		assessmentQuestions = append(assessmentQuestions,
			AssessmentQuestion{
				MasterID:    idInt,
				Question:    question["value"].(string),
				Category:    categoryMap[category["value"].(string)],
				SubCategory: subCategoryMap[subCategory["value"].(string)],
			})
	}

	return c.JSON(assessmentQuestions)
}

func (s *Server) getCXCategories() (map[string]string, error) {
	catMap := make(map[string]string)
	urlCategory := fmt.Sprintf("%s/api/compose/namespace/321576423183613954/module/321582286585724930/record/?query=",
		s.Config.CortezaAPI)
	reqCat, err := http.NewRequest("GET", urlCategory, nil)
	if err != nil {
		s.Log.Logger.Panic(err)
		return nil, err
	}

	reqCat.Header.Set("Authorization", "Bearer "+s.Token)
	reqCat.Header.Set("Accept", "application/json")

	resp, err := s.Client.Do(reqCat)
	if err != nil {
		s.Log.Logger.Panic(err)
		return nil, err
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		s.Log.Logger.Panic(err)
		return nil, err
	}

	res := data["response"].(map[string]interface{})
	set := res["set"].([]interface{})
	for _, t := range set {

		item := t.(map[string]interface{})
		values := item["values"].([]interface{})
		id := values[0].(map[string]interface{})
		category := values[1].(map[string]interface{})
		catMap[id["value"].(string)] = category["value"].(string)
	}
	return catMap, nil
}

func (s *Server) getCXSubCategories() (map[string]string, error) {
	catSubMap := make(map[string]string)
	urlSubCategory := fmt.Sprintf("%s/api/compose/namespace/321576423183613954/module/321600064243892226/record/?query=",
		s.Config.CortezaAPI)
	reqSubCat, err := http.NewRequest("GET", urlSubCategory, nil)
	if err != nil {
		s.Log.Logger.Panic(err)
		return nil, err
	}

	reqSubCat.Header.Set("Authorization", "Bearer "+s.Token)
	reqSubCat.Header.Set("Accept", "application/json")

	resp, err := s.Client.Do(reqSubCat)
	if err != nil {
		s.Log.Logger.Panic(err)
		return nil, err
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		s.Log.Logger.Panic(err)
		return nil, err
	}

	res := data["response"].(map[string]interface{})
	set := res["set"].([]interface{})
	for _, t := range set {

		item := t.(map[string]interface{})
		values := item["values"].([]interface{})
		id := values[0].(map[string]interface{})
		category := values[1].(map[string]interface{})
		catSubMap[id["value"].(string)] = category["value"].(string)
	}
	return catSubMap, nil
}
