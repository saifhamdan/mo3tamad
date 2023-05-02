// Developer: Saif Hamdan
package http

import (
	"mo3tamad/pkg/logger"

	"github.com/goccy/go-json"

	"github.com/gofiber/fiber/v2"
)

const (
	ErrBadRequest          = "Bad request"
	ErrInternalServerError = "Internal server error"
	ErrAlreadyExists       = "Already exists"
	ErrNotFound            = "Not Found"
	ErrUnauthorized        = "Unauthorized"
	ErrForbidden           = "Forbidden"
	ErrBadQueryParams      = "Invalid query params"
	ErrRequestTimeout      = "Request Timeout"
	ErrEndpointNotFound    = "The endpoint you requested doesn't exist on server"
)

type App struct {
	// fiber app instence
	*fiber.App
	// logger
	Log *logger.Logger
}

func NewApp(log *logger.Logger) *App {
	newapp := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	return &App{
		App: newapp,
		Log: log,
	}
}

type HttpResponse struct {
	// Response flag indicates whether the HTTP request was successful or not
	Success bool `json:"success"`
	// Http status Code
	Code int `json:"code"`
	// if the request were successful the data will be saved here
	Data interface{} `json:"data"`
	// Generic General Error Message defined in the system
	Error string `json:"error"`
	// More detailed error message indicates why the request was unsuccessful
	Message string `json:"message"`
}

// http 200 ok http response
func (a *App) HttpResponseOK(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusOK).JSON(
		&HttpResponse{
			Success: true,
			Code:    fiber.StatusOK,
			Data:    data,
			Error:   "",
			Message: "",
		})
}

// http 201 created http response
func (a *App) HttpResponseCreated(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusCreated).JSON(
		&HttpResponse{
			Success: true,
			Code:    fiber.StatusCreated,
			Data:    data,
			Error:   "",
			Message: "",
		})
}

// http 204 no content http response
func (a *App) HttpResponseNoContent(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNoContent).JSON(
		&HttpResponse{
			Success: true,
			Code:    fiber.StatusNoContent,
			Data:    nil,
			Error:   "",
			Message: "",
		})
}

// http 400 bad request http response
func (a *App) HttpResponseBadRequest(c *fiber.Ctx, message error) error {
	a.Log.Logger.Error(message.Error())
	return c.Status(fiber.StatusBadRequest).JSON(
		&HttpResponse{
			Success: false,
			Code:    fiber.StatusBadRequest,
			Data:    nil,
			Error:   ErrBadRequest,
			Message: message.Error(),
		})
}

// http 400 bad query params http response
func (a *App) HttpResponseBadQueryParams(c *fiber.Ctx, message error) error {
	a.Log.Logger.Error(message.Error())
	return c.Status(fiber.StatusBadRequest).JSON(
		&HttpResponse{
			Success: false,
			Code:    fiber.StatusBadRequest,
			Data:    nil,
			Error:   ErrBadQueryParams,
			Message: message.Error(),
		})
}

// http 404 not found http response
func (a *App) HttpResponseNotFound(c *fiber.Ctx, message error) error {
	a.Log.Logger.Error(message.Error())
	return c.Status(fiber.StatusNotFound).JSON(
		&HttpResponse{
			Success: false,
			Code:    fiber.StatusNotFound,
			Data:    nil,
			Error:   ErrNotFound,
			Message: message.Error(),
		})
}

// http 500 internal server error response
func (a *App) HttpResponseInternalServerErrorRequest(c *fiber.Ctx, message error) error {
	a.Log.Logger.Error(message.Error())
	return c.Status(fiber.StatusInternalServerError).JSON(
		&HttpResponse{
			Success: false,
			Code:    fiber.StatusInternalServerError,
			Data:    nil,
			Error:   ErrInternalServerError,
			Message: message.Error(),
		})
}

// http 403 The client does not have access rights to the content;
// that is, it is unauthorized, so the server is refusing to give the requested resource
func (a *App) HttpResponseForbidden(c *fiber.Ctx, message error) error {
	a.Log.Logger.Error(message.Error())
	return c.Status(fiber.StatusForbidden).JSON(
		&HttpResponse{
			Success: false,
			Code:    fiber.StatusForbidden,
			Data:    nil,
			Error:   ErrForbidden,
			Message: message.Error(),
		})
}

// http 401 the client must authenticate itself to get the requested response
func (a *App) HttpResponseUnauthorized(c *fiber.Ctx, message error) error {
	a.Log.Logger.Error(message.Error())
	return c.Status(fiber.StatusUnauthorized).JSON(
		&HttpResponse{
			Success: false,
			Code:    fiber.StatusUnauthorized,
			Data:    nil,
			Error:   ErrUnauthorized,
			Message: message.Error(),
		})
}
