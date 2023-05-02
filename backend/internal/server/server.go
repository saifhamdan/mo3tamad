package server

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mo3tamad/config"
	"mo3tamad/internal/middleware"
	"mo3tamad/pkg/authz"
	"mo3tamad/pkg/cache"
	fiberHttp "mo3tamad/pkg/http"
	"mo3tamad/pkg/logger"
	"mo3tamad/pkg/oauth2"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Server struct {
	// Middleware
	Middleware *middleware.Middleware
	// wrapped fiber instence
	App *fiberHttp.App
	// zab logger for log to files and stdout
	Log *logger.Logger
	// config env variables
	Config *config.Config
	// net/http Client instence
	Client *http.Client
	// MySQL DB
	DB *gorm.DB
	// Authorization
	Authz *authz.Authz
	// OAuth2.0
	OAuth2 *oauth2.OAuth2
	// Cache for Redis Caching
	Cache *cache.Cache
	// Validator
	Validate *validator.Validate
	// Corteza Token
	Token string
	// Corteza Basic Auth
	cortezaBasicAuth string
}

func NewServer(log *logger.Logger, config *config.Config, db *gorm.DB, cache *cache.Cache, validate *validator.Validate, authz *authz.Authz, oauth *oauth2.OAuth2) *Server {

	// fiber instence
	app := fiberHttp.NewApp(log)

	// middleware
	middleware := middleware.NewMiddleware(app, db, authz, oauth, log)

	str := fmt.Sprintf("%s:%s", config.CortezaEmail, config.CortezaPassword)
	hash := base64.StdEncoding.EncodeToString([]byte(str))
	cortezaBasicAuth := fmt.Sprintf("Basic %s", hash)

	return &Server{
		Middleware:       middleware,
		App:              app,
		Log:              log,
		Config:           config,
		Client:           &http.Client{},
		DB:               db,
		Cache:            cache,
		Validate:         validate,
		Authz:            authz,
		OAuth2:           oauth,
		Token:            "",
		cortezaBasicAuth: cortezaBasicAuth,
	}
}

func (s *Server) GenerateCortezaToken() error {
	// make url
	url := fmt.Sprintf("%s/auth/oauth2/token?grant_type=client_credentials&scope=api",
		s.Config.CortezaAPI)

	// generate token for Corteza API by Auth
	for {
		req, err := http.NewRequest("POST", url, nil)
		if err != nil {
			s.Log.Logger.DPanicln(err)
			return err
		}

		req.Header.Set("Authorization", s.cortezaBasicAuth)
		req.Header.Set("Accept", "application/json")

		resp, err := s.Client.Do(req)
		if err != nil {
			s.Log.Logger.DPanicln(err)
			return err
		}

		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			s.Log.Logger.DPanicln(err)
			return err
		}

		type authData struct {
			Token string `json:"access_token"`
		}

		var data authData
		err = json.Unmarshal(body, &data)
		if err != nil {
			s.Log.Logger.DPanicln(err)
			return err
		}

		s.Token = data.Token

		time.Sleep(time.Minute * 5)
	}
}
