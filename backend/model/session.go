package model

import (
	"mo3tamad/pkg/shortuuid"

	"gorm.io/gorm"
)

type Session struct {
	SessionId string  `gorm:"primaryKey;column:id" json:"id,omitempty"`
	AccountId int     `json:"accountId,omitempty"`
	Account   Account `gorm:"foreignKey:AccountId" json:"account,omitempty"`
	IpAddress string  `gorm:"ip_address" json:"ipAddress"`
	Model
}

func (s *Session) BeforeCreate(tx *gorm.DB) error {
	s.SessionId = shortuuid.New()
	return nil
}
