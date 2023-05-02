// Developer: Saif Hamdan

package middleware

import (
	"encoding/base64"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// middleware that parses incoming reqests that has basic auth and
// parse it, then it saves the credientals in c.Locals
func (m *Middleware) BasicAuthParser(c *fiber.Ctx) error {
	// Get the Authorization header value
	authHeader := c.Get("Authorization")

	// Check if the header is not empty and starts with "Basic "
	if authHeader != "" && strings.HasPrefix(authHeader, "Basic ") {
		// Decode the base64-encoded username and password
		auth := strings.SplitN(authHeader, " ", 2)[1]
		decoded, err := base64.StdEncoding.DecodeString(auth)
		if err != nil {
			return m.App.HttpResponseUnauthorized(c, fmt.Errorf(""))
		}

		// Split the decoded value into username and password
		credentials := strings.SplitN(string(decoded), ":", 2)

		// Set the username and password in the request context
		c.Locals("username", credentials[0])
		c.Locals("password", credentials[1])
		return c.Next()
	}
	return m.App.HttpResponseUnauthorized(c, fmt.Errorf(""))
}
