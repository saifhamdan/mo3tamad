package model

import (
	"mo3tamad/pkg/shortuuid"

	"gorm.io/gorm"
)

type Session struct {
	SessionId string  `gorm:"primaryKey;column:session_id" json:"session_id,omitempty"`
	AccountId int     `json:"account_id,omitempty"`
	Account   Account `gorm:"foreignKey:AccountId" json:"account,omitempty"`
	IpAddress string  `gorm:"ip_address" json:"ip_address"`
	Model
}

func (s *Session) BeforeCreate(tx *gorm.DB) error {
	s.SessionId = shortuuid.New()
	return nil
}
