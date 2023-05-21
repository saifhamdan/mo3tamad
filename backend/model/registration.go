package model

import "time"

type Registration struct {
	RegistrationId int       `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	AccountId      int       `gorm:"column:account_id" json:"account_id,omitempty"`
	ExamId         int       `gorm:"column:exam_id" json:"exam_id,omitempty"`
	StartTime      time.Time `gorm:"column:start_time" json:"start_time"`
	EndTime        time.Time `gorm:"column:end_time" json:"end_time"`
	IsCheated      bool      `gorm:"column:is_cheated" json:"is_cheated"`
	//CheatedTime    []int     `gorm:"foriegnKey:RegistrationId" jorm:"cheated_times"`
	Result  int      `gorm:"column:result" json:"result"`
	Passed  bool     `gorm:"column:passed" json:"passed"`
	Status  string   `gorm:"column:status" json:"status,omitempty"`
	Account *Account `gorm:"foriegnKey:AccountId"`
	Exam    *Exam    `gorm:"forigenKey:ExamId"`
	Model
}
