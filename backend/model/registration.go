package model

import "time"

type Registration struct {
	RegistrationId int       `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	AccountId      int       `gorm:"column:account_id" json:"accountId,omitempty"`
	ExamId         int       `gorm:"column:exam_id" json:"examId,omitempty"`
	StartTime      time.Time `gorm:"column:start_time" json:"startTime"`
	EndTime        time.Time `gorm:"column:end_time" json:"endTime"`
	IsCheated      bool      `gorm:"column:is_cheated" json:"isCheated"`
	Result         int       `gorm:"column:result" json:"result"`
	Passed         bool      `gorm:"column:passed" json:"passed"`
	Status         string    `gorm:"column:status" json:"status,omitempty"`
	Account        *Account  `gorm:"foriegnKey:AccountId"`
	Exam           *Exam     `gorm:"forigenKey:ExamId"`
	//Trans         []Trans   `gorm:"forigenKey:RegistrationId"`
	Model
}
