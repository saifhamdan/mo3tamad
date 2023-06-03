package model

import "time"

type Exam struct {
	ExamID           int            `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	Duration         time.Duration  `gorm:"column:duration" json:"duration,omitempty"`
	Title            string         `gorm:"column:title" form:"name" json:"name,omitempty"`
	Description      string         `gorm:"column:escription" form:"desc" json:"desc,omitempty"`
	ThumbnailUrl     string         `gorm:"column:thumbnail_url" json:"thumbnailUrl,omitempty"`
	CertificationUrl string         `gorm:"column:certification_url" json:"certificationUrl,omitempty"`
	PassingScore     int            `gorm:"column:passing_score" json:"passingScore,omitempty"`
	CompanyId        int            `gorm:"column:company_id" json:"companyId,omitempty"`
	Company          Company        `gorm:"forigenKey:CompanyId" json:"company,omitempty"`
	QuestionsCount   int            `gorm:"column:questions_count" json:"questionsCount"`
	LevelId          int            `gorm:"column:level_id" json:"levelId,omitempty"`
	Level            Level          `gorm:"forigenKey:LevelId" json:"level"`
	Questions        []Question     `gorm:"forigenKey:ExamId" json:"questions"`
	Registrations    []Registration `gorm:"forigenKey:ExamId" json:"registrations,omitempty"`
	Comments         []Comment      `gorm:"forigenKey:ExamId" json:"comments,omitempty"`
	Categories       []*Category    `gorm:"many2many:exam_categories;"`
	Model
}
