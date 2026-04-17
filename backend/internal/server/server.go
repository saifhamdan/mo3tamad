package server

import (
	"mo3tamad/config"
	"mo3tamad/internal/middleware"
	"mo3tamad/pkg/authz"
	"mo3tamad/pkg/cache"
	fiberHttp "mo3tamad/pkg/http"
	"mo3tamad/pkg/logger"
	"mo3tamad/pkg/oauth2"
	"net/http"

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
}

func NewServer(log *logger.Logger, config *config.Config, db *gorm.DB, cache *cache.Cache, validate *validator.Validate, authz *authz.Authz, oauth *oauth2.OAuth2) *Server {

	// fiber instence
	app := fiberHttp.NewApp(log)

	// middleware
	middleware := middleware.NewMiddleware(app, db, authz, oauth, log)

	return &Server{
		Middleware: middleware,
		App:        app,
		Log:        log,
		Config:     config,
		Client:     &http.Client{},
		DB:         db,
		Cache:      cache,
		Validate:   validate,
		Authz:      authz,
		OAuth2:     oauth,
	}
}
