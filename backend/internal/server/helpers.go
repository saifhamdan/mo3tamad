package server

import (
	"mo3tamad/pkg/oauth2"

	"github.com/gofiber/fiber/v2"
)

func GetUserCfg(c *fiber.Ctx) *oauth2.Config {
	return c.Locals("client").(*oauth2.Config)
}

func GetAccountId(c *fiber.Ctx) int {
	return c.Locals("accountId").(int)
}
