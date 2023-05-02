// Developer: Saif Hamdan

package middleware

import (
	"mo3tamad/pkg/authz"
	"mo3tamad/pkg/http"
	"mo3tamad/pkg/logger"
	"mo3tamad/pkg/oauth2"

	"gorm.io/gorm"
)

type Middleware struct {
	// Fiber App
	App *http.App
	// MySql DB
	DB *gorm.DB
	// Authorization
	Authz *authz.Authz
	// Authentucation
	OAuth2 *oauth2.OAuth2
	// zab logger for log to files and stdout
	Log *logger.Logger
}

func NewMiddleware(app *http.App, db *gorm.DB, authz *authz.Authz, oauth2 *oauth2.OAuth2, log *logger.Logger) *Middleware {

	m := &Middleware{
		App:    app,
		DB:     db,
		Authz:  authz,
		OAuth2: oauth2,
		Log:    log,
	}

	return m
}
