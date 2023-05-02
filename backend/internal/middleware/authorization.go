package middleware

import (
	"fmt"
	"mo3tamad/pkg/oauth2"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func (m *Middleware) Authorization(resource string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		r := strings.Split(resource, "_")

		client := c.Locals("client").(*oauth2.Config)
		ok := m.Authz.Enforcer.HasNamedPolicy("p", client.Scope, r[0], r[1])
		if !ok {
			return m.App.HttpResponseForbidden(c, fmt.Errorf("unauthorized to access this resource"))
		}
		return c.Next()
	}
}
