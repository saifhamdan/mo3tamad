package model

type Option struct {
	OptionId   int       `gorm:"primaryKey;autoIncrement:true;column:id" json:"option_id,omitempty"`
	QuestionId int       `gorm:"column:question_id" json:"question_id,omitempty"`
	Text       string    `gorm:"column:option_text" json:"option_text,omitempty"`
	IsCorrect  bool      `gorm:"column:is_correct" json:"is_correct,omitempty"`
	Question   *Question `gorm:"forigenKey:question_id" json:"question,omitempty"`
	Model
}
