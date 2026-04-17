// Developer: Saif Hamdan

package middleware

import (
	"encoding/json"
	"fmt"
	"regexp"

	"github.com/gofiber/fiber/v2"
)

func (m *Middleware) RequestsLogger(c *fiber.Ctx) error {
	var body interface{}
	err := c.BodyParser(&body)
	data := ""
	if err != nil {
		data = "{}"
	} else {
		d, err := json.Marshal(body)
		if err != nil {
			data = "{}"
		} else {
			re := regexp.MustCompile(`\\|\n| `)
			data = re.ReplaceAllString((string(d)), "")
			// data = re.ReplaceAllString((string(d)), "")
			// data = strings.ReplaceAll(data, "\\\"", "\"")
		}
	}

	msg := fmt.Sprintf("%s, %s, %s, %s, %s", c.IP(), "user_session", c.Path(), c.Method(), data)
	m.Log.Logger.Info(msg)

	return c.Next()
}
