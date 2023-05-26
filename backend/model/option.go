package model

type Option struct {
	OptionId   int       `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	QuestionId int       `gorm:"column:question_id" json:"questionId,omitempty"`
	Text       string    `gorm:"column:text" json:"text,omitempty"`
	IsCorrect  bool      `gorm:"column:is_correct" json:"isCorrect,omitempty"`
	Question   *Question `gorm:"forigenKey:question_id" json:"question,omitempty"`
	Model
}
