package server

import (
	"bytes"
	"fmt"
	"image"
	"io/ioutil"
	"log"
	"mime/multipart"
	"mo3tamad/model"
	"mo3tamad/pkg/shortuuid"
	"os"

	"github.com/disintegration/imaging"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (s *Server) GetAllExams(c *fiber.Ctx) error {
	exams := []model.Exam{}
	err := s.DB.Preload("Company").Find(&exams).Error
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

	err = s.DB.Preload("Company").First(&res.Exam, exam_id).Error
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

	exam.ThumbnailUrl = shortuuid.New()

	tx := s.DB.Begin()
	err = tx.Create(exam).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseBadRequest(c, err)
	}

	thumbnail, err := c.FormFile("thumbnail")
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseBadRequest(c, err)
	}
	err = storeThumbnail(exam.ThumbnailUrl, thumbnail)
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx.Commit()
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
	err = s.DB.First(exam, exam_id).Error
	if err != nil {
		return s.App.HttpResponseNotFound(c, err)
	}
	err = c.BodyParser(exam)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	tx := s.DB.Begin()
	err = tx.Save(exam).Error
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	thumbnail, _ := c.FormFile("thumbnail")
	err = storeThumbnail(exam.ThumbnailUrl, thumbnail)
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseCreated(c, exam)
}

func storeThumbnail(thumbnailUrl string, thumbnail *multipart.FileHeader) error {
	file, err := thumbnail.Open()
	if err != nil {
		return err
	}
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return err
	}

	// Set the desired output dimensions
	width := 1200
	height := 630

	// Resize the image
	resizedImage := imaging.Resize(img, width, height, imaging.Lanczos)

	// Set the desired output quality (0 to 100)
	// quality := 90

	// Create a new output file
	outputFile, err := os.Create(fmt.Sprintf("public/uploads/thumbnails/%s.webp", thumbnailUrl))
	if err != nil {
		log.Fatal(err)
	}
	defer outputFile.Close()

	// Encode the resized image as WebP with the specified quality
	err = imaging.Encode(outputFile, resizedImage, imaging.JPEG, imaging.JPEGQuality(80))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Image processed and saved successfully!")

	return nil
}

func (s *Server) GetThumbnail(c *fiber.Ctx) error {
	thumbnailUrl := c.Params("thumbnailUrl")
	return c.Download(fmt.Sprintf("public/uploads/thumbnails/%s.webp", thumbnailUrl))
}
