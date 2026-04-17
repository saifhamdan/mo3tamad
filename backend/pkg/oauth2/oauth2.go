// Developer: Saif Hamdan

package oauth2

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"math/rand"
	"mo3tamad/config"
	"mo3tamad/model"
	"mo3tamad/pkg/cache"

	"github.com/goccy/go-json"

	"gorm.io/gorm"
)

type Config struct {
	// client name
	ClientName string
	// Client Id
	ClientId int
	// Client Secret Id
	ClientSecretId string
	// ip address
	IpAddress string
	// email
	Email string
	// Username
	Username string
	// Access token
	AccessToken string
	// Refresh token
	RefreshToken string
	// Client's Scope based on Casbin Role
	Scope string
	// sessions Expiration date
	ExpiresIn int64
}

type OAuth2 struct {
	// Store tokens in Cache
	Cache *cache.Cache
	// DB gorm
	DB *gorm.DB
	// password credentials expireation data from .env
	TokenExpiresIn int64
}

func NewOAuth2(cache *cache.Cache, db *gorm.DB, cfg *config.Config) *OAuth2 {
	return &OAuth2{
		Cache:          cache,
		DB:             db,
		TokenExpiresIn: cfg.HttpOAuthTokenExpiresIn,
	}
}

// func (o *OAuth2) ClientCredentialsToken(ctx context.Context, expiresIn int64, config *Config) (*model.Token, error) {
// 	tokenstr := o.GenerateToken()
// 	token := &model.Token{
// 		AccountId:   config.ClientId,
// 		Scope:       config.Scope,
// 		AccessToken: tokenstr,
// 		ExpiresIn:   o.TokenExpiresIn,
// 	}

// 	js, err := json.Marshal(config)
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = o.Cache.Set(ctx, token.AccessToken, js, 0)
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = o.DB.Create(token).Error

// 	if err != nil {
// 		o.DeleteToken(ctx, token.AccessToken)
// 		return nil, err
// 	}

// 	return token, nil
// }

func (o *OAuth2) PasswordCredentialsToken(ctx context.Context, config *Config) (*model.Token, error) {
	tokenstr := o.GenerateToken()
	reftokenstr := o.GenerateToken()
	token := &model.Token{
		Scope:        config.Scope,
		AccessToken:  tokenstr,
		RefreshToken: reftokenstr,
		ExpiresIn:    o.TokenExpiresIn,
	}

	config.AccessToken = tokenstr
	config.RefreshToken = reftokenstr

	js, err := json.Marshal(config)
	if err != nil {
		return nil, err
	}

	err = o.Cache.Set(ctx, token.AccessToken, js, 0)
	if err != nil {
		return nil, err
	}

	err = o.DB.Create(token).Error
	if err != nil {
		o.DeleteToken(ctx, token.AccessToken)
		return nil, err
	}
	return token, nil
}

func (o *OAuth2) Inspect(ctx context.Context, accessToken string) (*Config, error) {
	js, err := o.Cache.Get(ctx, accessToken)
	if err != nil {
		return nil, err
	}

	config := &Config{}
	err = json.Unmarshal([]byte(js), config)
	if err != nil {
		return nil, err
	}

	return config, nil
}

func (o *OAuth2) RefreshToken(ctx context.Context, accessToken string, refreshToken string) (*model.Token, error) {
	// find the old token
	js, err := o.Cache.Get(ctx, accessToken)
	if err != nil {
		return nil, err
	}

	config := &Config{}
	err = json.Unmarshal([]byte(js), config)
	if err != nil {
		return nil, err
	}

	if config.RefreshToken != refreshToken {
		return nil, fmt.Errorf("invalid refresh token")
	}

	// remove the current token
	err = o.Cache.Delete(ctx, accessToken)
	if err != nil {
		return nil, err
	}

	// generate new token
	tokenstr := o.GenerateToken()
	reftokenstr := o.GenerateToken()
	token := &model.Token{
		Scope:        config.Scope,
		AccessToken:  tokenstr,
		RefreshToken: reftokenstr,
		ExpiresIn:    o.TokenExpiresIn,
	}

	err = o.Cache.Set(ctx, token.AccessToken, []byte(js), 0)
	if err != nil {
		return nil, err
	}

	return token, nil
}

// returns true(valid) if the token exists otherwise returns false(unvalid)
func (o *OAuth2) Verify(ctx context.Context, accessToken string) bool {
	_, err := o.Cache.Get(ctx, accessToken)
	return err == nil
}

// deletes token if exists
func (o *OAuth2) DeleteToken(ctx context.Context, accessToken string) error {
	if ok := o.Verify(ctx, accessToken); !ok {
		return fmt.Errorf("token doesn't exist")
	}

	err := o.DB.Where(&model.Token{AccessToken: accessToken}).Delete(&model.Token{}).Error
	if err != nil {
		return err
	}

	err = o.Cache.Delete(ctx, accessToken)
	if err != nil {
		return err
	}

	return nil
}

// // deletes session if exists
// func (o *OAuth2) DeleteToken(ctx context.Context, accessToken string) error {
// 	if ok := o.Verify(ctx, accessToken); !ok {
// 		return fmt.Errorf("token doesn't exist")
// 	}

// 	err := o.DB.Where(&model.Session{AccessToken: accessToken}).Delete(&model.Session{}).Error
// 	if err != nil {
// 		return err
// 	}

// 	err = o.Cache.Delete(ctx, accessToken)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// Generate SHA256 hash, then encode it base64
func (o *OAuth2) GenerateToken() string {
	// Generate a random byte array
	randomBytes := randStringBytes()

	// Hash the message using SHA256
	hash := sha256.Sum256(randomBytes)

	// Encode the hash using base64 URL encoding
	encodedToken := base64.URLEncoding.EncodeToString(hash[:])

	return encodedToken
}

// Get All Active Sessions
func (o *OAuth2) GetAllSessions() []model.Session {
	// o.Cache.
	return nil
}

const letterBytes = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func randStringBytes() []byte {
	b := make([]byte, 32)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return b
}
