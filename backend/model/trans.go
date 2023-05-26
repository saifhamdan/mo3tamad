package model

type Trans struct {
	TransId        int      `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	AccountId      int      `gorm:"column:account_id" json:"accountId,omitempty"`
	RegistrationId int      `gorm:"column:registration_id" json:"registrationId,omitempty"`
	AnswerId       int      `gorm:"column:answer" json:"answer,omitempty"`
	QuestionId     int      `gorm:"column:question_id" json:"questionId,omitempty"`
	Question       Question `gorm:"forigenKey:QuestionId" json:"question,omitempty"`
}
