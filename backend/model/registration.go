package model

import "time"

type Registration struct {
	RegistrationId int        `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	AccountId      int        `gorm:"column:account_id" json:"accountId,omitempty"`
	ExamId         int        `gorm:"column:exam_id" json:"examId,omitempty"`
	StartTime      *time.Time `gorm:"column:start_time" json:"startTime"`
	EndTime        *time.Time `gorm:"column:end_time" json:"endTime"`
	FinishedAt     *time.Time `gorm:"column:finished_at" json:"finishedAt"`
	IsCheated      bool       `gorm:"column:is_cheated" json:"isCheated"`
	IsConsidered   bool       `gorm:"column:is_considered" json:"isConsidered"`
	Passed         bool       `gorm:"column:passed" json:"passed"`
	Result         int        `gorm:"column:result" json:"result"`
	Status         string     `gorm:"column:status" json:"status,omitempty"`
	Account        Account    `gorm:"foriegnKey:AccountId" json:"account,omitempty"`
	Exam           Exam       `gorm:"forigenKey:ExamId" json:"exam,omitempty"`
	Trans          []Trans    `gorm:"forigenKey:RegistrationId" json:"trans,omitempty"`
	Model
}
