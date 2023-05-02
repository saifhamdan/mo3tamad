package model

import (
	"time"
)

type Model struct {
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	CreatedBy int64     `gorm:"column:created_by" json:"created_by,omitempty"`
	UpdatedBy int64     `gorm:"column:updated_by" json:"updated_by,omitempty"`
	//DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
