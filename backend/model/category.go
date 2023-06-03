package model

type Category struct {
	CategoryId int    `gorm:"primaryKey;autoIncrement:auto;column:id" json:"id,omitempty"`
	Desc       string `gorm:"column:desc" json:"desc,omitempty"`
	//Exams      []*Exam `gorm:"many2many:exam_categories;"`
}
