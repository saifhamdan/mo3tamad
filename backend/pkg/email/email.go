package email

import (
	"net/smtp"
)

// Sender data.
var from string = "mo3tamadjo@gmail.com"
var password string = "shal1234"

// smtp server configuration.
var smtpHost string = "smtp.gmail.com"
var smtpPort string = "587"

func SendEmail(to []string, html string) error {
	// Message.
	message := []byte(html)

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
}
