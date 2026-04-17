package email

import (
	"fmt"
	"io/ioutil"
	"net/smtp"
	"strconv"
	"strings"
	"time"
)

// Sender data.
var from string = "mo3tamadjo@gmail.com"
var password string = "bgesyqcpzepgvqok"

// smtp server configuration.
var smtpHost string = "smtp.gmail.com"
var smtpPort string = "587"

func SendEmail(to []string, subject, html string) error {
	// Create the email message.
	headers := make(map[string]string)
	headers["From"] = from
	headers["To"] = strings.Join(to, ",")
	headers["Subject"] = subject
	headers["Content-Type"] = "text/html; charset=UTF-8"

	var emailBody strings.Builder
	for key, value := range headers {
		emailBody.WriteString(key + ": " + value + "\r\n")
	}
	emailBody.WriteString("\r\n" + html)

	// Message.
	message := []byte(emailBody.String())

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
}

func ApproveEmail(to []string, name, companyName, examName, certUrl string, examId, grade int, issuedAt *time.Time) error {
	html, err := ioutil.ReadFile("pkg/email/approve.html")
	if err != nil {
		return err
	}

	date := issuedAt.Format("Jan 2 2006")
	htmlContent := string(html)
	htmlContent = strings.Replace(htmlContent, "{{name}}", name, 1)
	htmlContent = strings.Replace(htmlContent, "{{company}}", companyName, 1)
	htmlContent = strings.Replace(htmlContent, "{{exam}}", examName, 1)
	//htmlContent = strings.Replace(htmlContent, "{{certUrl}}", examName, 1)
	htmlContent = strings.Replace(htmlContent, "{{examId}}", strconv.Itoa(examId), 1)
	htmlContent = strings.Replace(htmlContent, "{{grade}}", strconv.Itoa(grade)+"%", 1)
	htmlContent = strings.Replace(htmlContent, "{{date}}", date, 1)

	return SendEmail(to, "Congratulations! You've Successfully Passed the Exam and Achieved Certification", htmlContent)
}

func DeclineEmail(to []string, name, companyName, examName, companyPhone string) error {
	html, err := ioutil.ReadFile("pkg/email/decline.html")
	if err != nil {
		return err
	}

	htmlContent := string(html)
	htmlContent = strings.Replace(htmlContent, "{{name}}", name, 1)
	htmlContent = strings.Replace(htmlContent, "{{company}}", companyName, 1)
	htmlContent = strings.Replace(htmlContent, "{{companyphone}}", companyPhone, 1)
	htmlContent = strings.Replace(htmlContent, "{{exam}}", examName, 2)

	return SendEmail(to, fmt.Sprintf("%s Result Notification", examName), htmlContent)
}
