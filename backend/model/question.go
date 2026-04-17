package model

type Question struct {
	QuestionId int      `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	ExamId     int      `gorm:"column:exam_id" json:"examId,omitempty"`
	Text       string   `gorm:"column:text" json:"text,omitempty"`
	Options    []Option `gorm:"foreignKey:QuestionId;OnDelete:CASCADE;" json:"options,omitempty"`
	Exam       *Exam    `gorm:"forigenKey:ExamId" json:"exam,omitempty"`
	Model
}
