package certificate

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/SebastiaanKlippert/go-wkhtmltopdf"
)

func GenerateCertificate(certUrl, name, companyName, examName string, grade int, issuedAt *time.Time) error {

	html, err := ioutil.ReadFile("pkg/certificate/certificate.html")
	if err != nil {
		return err
	}

	// Replace dynamic content in HTML
	htmlContent := string(html)
	date := issuedAt.Format("Jan 2 2006")
	htmlContent = strings.Replace(htmlContent, "{{name}}", name, 1)
	htmlContent = strings.Replace(htmlContent, "{{company}}", companyName, 1)
	htmlContent = strings.Replace(htmlContent, "{{exam}}", examName, 1)
	htmlContent = strings.Replace(htmlContent, "{{grade}}", strconv.Itoa(grade)+"%", 1)
	htmlContent = strings.Replace(htmlContent, "{{date}}", date, 1)
	// Add more replace operations for other dynamic content

	// Create a temporary HTML file
	tmpFile, err := ioutil.TempFile("", "temp*.html")
	if err != nil {
		return err
	}
	defer os.Remove(tmpFile.Name())

	// Write HTML content to the temporary file
	_, err = tmpFile.Write([]byte(htmlContent))
	if err != nil {
		return err
	}

	// Generate PDF from HTML
	pdfg, err := wkhtmltopdf.NewPDFGenerator()
	if err != nil {
		return err
	}

	pdfg.MarginBottom.Set(0)
	pdfg.MarginTop.Set(0)
	pdfg.MarginLeft.Set(0)
	pdfg.MarginRight.Set(0)
	pdfg.PageWidth.Set(435)
	pdfg.PageHeight.Set(274)

	// pdfg.PageSize.Set(wkhtmltopdf.PageSizeA1)
	// pdfg.PageSize.Set(wkhtmltopdf.PageSizeA1) // Set the desired size here
	pdfg.AddPage(wkhtmltopdf.NewPage(tmpFile.Name()))

	err = pdfg.Create()
	if err != nil {
		return err
	}

	// Save the PDF to a file
	pdfFileDest := fmt.Sprintf("public/certificates/%s.pdf", certUrl)
	err = pdfg.WriteFile(pdfFileDest)
	if err != nil {
		return err
	}

	imgFileDest := fmt.Sprintf("public/certificates/%s", certUrl)
	cmd := exec.Command("pdftoppm", "-singlefile", "-png", pdfFileDest, imgFileDest)
	err = cmd.Run()
	if err != nil {
		return err
	}
	return nil
}

func DeleteCertificate(certUrl string) {
	pdfDest := fmt.Sprintf("public/certificates/%s.pdf", certUrl)
	pngDest := fmt.Sprintf("public/certificates/%s.png", certUrl)

	err := os.Remove(pdfDest)
	if err != nil {
		fmt.Println("Error deleting file:", err)
	}
	err = os.Remove(pngDest)
	if err != nil {
		fmt.Println("Error deleting file:", err)
	}
}
