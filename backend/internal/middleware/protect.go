package middleware

import (
	"context"
	"fmt"
	"strings"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
)

func (m *Middleware) Protect(c *fiber.Ctx) error {
	if strings.LastIndex(c.Path(), "login") != -1 {
		return c.Next()
	}
	authHeader := c.Get("Authorization")
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.Split(authHeader, " ")[1]
		ctx := context.Background()

		// if it exists then it's valid, otherwise it's not
		cfg, err := m.OAuth2.Inspect(ctx, token)
		if err == redis.Nil {
			return m.App.HttpResponseUnauthorized(c, fmt.Errorf("expired or invalid token"))
		}

		// store client's session in the request
		c.Locals("client", cfg)
		c.Locals("accountId", cfg.ClientId)
		c.Locals("token", token)

		return c.Next()
	}
	return m.App.HttpResponseUnauthorized(c, fmt.Errorf("missing Authorization header"))
}
