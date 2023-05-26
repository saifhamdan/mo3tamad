package model

import "time"

type Exam struct {
	ExamID           int           `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	Date             time.Time     `gorm:"column:date" json:"date,omitempty"`
	Duration         time.Duration `gorm:"column:duration" json:"duration,omitempty"`
	Title            string        `gorm:"column:title" json:"title,omitempty"`
	Description      string        `gorm:"column:escription" json:"description,omitempty"`
	CertificationUrl string        `gorm:"column:certification_url" json:"certificationUrl,omitempty"`
	PassingScore     int           `gorm:"column:passing_score" json:"passingScore,omitempty"`
	CompanyId        int           `gorm:"column:company_id" json:"companyId,omitempty"`
	Company          Company       `gorm:"forigenKey:CompanyId" json:"company,omitempty"`
	QuestionsCount   int           `gorm:"column:questions_count" json:"questionsCount"`
	Questions        []Question    `gorm:"forigenKey:ExamId"`
	Model
}
