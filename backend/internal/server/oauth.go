// Developer: Saif Hamdan
package server

import (
	"context"
	"fmt"
	"mo3tamad/model"
	"mo3tamad/pkg/oauth2"
	"strings"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
)

const GRANT_TYPE_CLIENT_CREDENTIALS = "client_credentials"

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (s *Server) Login(c *fiber.Ctx) error {
	username := c.Locals("username").(string)
	password := c.Locals("password").(string)

	// later on find the user if exists in db
	user := &model.Account{}
	s.DB.Preload("Role").First(user, &model.Account{Email: username})

	// check password is correct
	ok := oauth2.ComparePassword(user.Password, password)
	if !ok {
		return s.App.HttpResponseUnauthorized(c, fmt.Errorf("incorrect password or email"))
	}

	// check account is active
	if !user.Active {
		return s.App.HttpResponseUnauthorized(c, fmt.Errorf("the account has been deactivated"))
	}

	// get Role
	role := &model.Role{}
	err := s.DB.First(role, user.RoleID).Error
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, fmt.Errorf("something went wrong"))
	}

	cfg := &oauth2.Config{
		ClientName:     user.Name,
		Email:          user.Email,
		Username:       "",
		Scope:          role.Desc,
		ClientId:       user.AccountId,
		ClientSecretId: "",
		IpAddress:      c.IP(),
	}

	ctx := context.Background()
	token, err := s.OAuth2.PasswordCredentialsToken(ctx, cfg)
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, fiber.ErrInternalServerError)
	}

	// make a session
	session := &model.Session{
		AccountId: cfg.ClientId,
		IpAddress: c.IP(),
	}
	s.StoreSession(session)

	type LoginResponse struct {
		*model.Token
		*model.Session
	}

	res := &LoginResponse{
		Token:   token,
		Session: session,
	}

	return s.App.HttpResponseOK(c, res)
}

func (s *Server) RefreshToken(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		oldToken := strings.Split(authHeader, " ")[1]

		type Body struct {
			RefreshToken string `json:"refresh_token"`
		}

		body := &Body{}
		c.BodyParser(body)
		if body.RefreshToken == "" {
			return s.App.HttpResponseBadRequest(c, fmt.Errorf("invalid refresh token"))
		}

		// if it exists then it's valid, otherwise it's not
		ctx := context.Background()
		newToken, err := s.OAuth2.RefreshToken(ctx, oldToken, body.RefreshToken)
		if err != nil {
			if err == redis.Nil {
				return s.App.HttpResponseUnauthorized(c, fmt.Errorf("token doesn't exist or expired"))
			}
			return s.App.HttpResponseInternalServerErrorRequest(c, err)
		}

		return s.App.HttpResponseOK(c, newToken)
	}
	return s.App.HttpResponseUnauthorized(c, fmt.Errorf("missing Authorization header"))
}

func (s *Server) Logout(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		accessToken := strings.Split(authHeader, " ")[1]

		sessionId := c.Params("session_id")
		if sessionId == "" {
			return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("missing session_id param"))
		}

		ctx := context.Background()
		cfg, err := s.OAuth2.Inspect(ctx, accessToken)
		if err != nil {
			return s.App.HttpResponseNotFound(c, err)
		}
		s.OAuth2.DeleteToken(ctx, cfg.AccessToken)
		if err != nil {
			return s.App.HttpResponseInternalServerErrorRequest(c, err)
		}

		s.DB.Delete(&model.Session{}, sessionId)

		return s.App.HttpResponseNoContent(c)
	}
	return s.App.HttpResponseUnauthorized(c, fmt.Errorf("missing Authorization header"))
}

// func (o *Server) Token(c *fiber.Ctx) error {
// 	type Query struct {
// 		// Token Type, currently one type is available
// 		GrantType string `query:"grant_type" validate:"required"`
// 		// Specify the role of the token
// 		Scope string `query:"scope" validate:"required"`
// 	}

// 	// get username & password
// 	fmt.Print(c.Locals("username"), " ", c.Locals("password"))

// 	// TODO: check user's email and password

// 	query := &Query{}
// 	err := c.QueryParser(query)
// 	if err != nil {
// 		return o.App.HttpResponseBadRequest(c, err)
// 	}

// 	if query.GrantType != GRANT_TYPE_CLIENT_CREDENTIALS {
// 		return o.App.HttpResponseBadRequest(c, fmt.Errorf("invalid grant type"))
// 	}

// 	role := &model.Role{}
// 	err = o.DB.Where(&model.Role{Desc: query.Scope}).First(role).Error
// 	if err != nil {
// 		if err == gorm.ErrRecordNotFound {
// 			return o.App.HttpResponseBadRequest(c, fmt.Errorf("invalid scope type"))
// 		}
// 		return o.App.HttpResponseInternalServerErrorRequest(c, fiber.ErrInternalServerError)
// 	}

// 	// demo
// 	cfg := &oauth2.Config{
// 		ClientName:     "saif",
// 		Email:          "saif",
// 		Username:       "saif",
// 		Scope:          "admin",
// 		ClientId:       3123,
// 		ClientSecretId: "saif",
// 	}
// 	ctx := context.Background()
// 	token, err := o.OAuth2.ClientCredentialsToken(ctx, 86400, cfg)
// 	if err != nil {
// 		return o.App.HttpResponseInternalServerErrorRequest(c, fiber.ErrInternalServerError)
// 	}

// 	return o.App.HttpResponseCreated(c, token)
// }

// func (o *Server) SessionTimeout(session *model.Session) {
// 	time.Sleep(time.Duration(session.ExpiresIn) * time.Second)

// 	ctx := context.Background()
// 	err := o.OAuth2.DeleteSession(ctx, session.AccessToken)
// 	if err != nil {
// 		o.Log.Logger.Error(err)
// 	}
// 	o.SessionTrigger <- struct{}{}
// }
