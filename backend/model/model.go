package model

import (
	"time"
)

type Model struct {
	CreatedAt time.Time `gorm:"column:created_at" json:"createdAt,omitempty"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updatedAt,omitempty"`
	CreatedBy int64     `gorm:"column:created_by" json:"createdBy,omitempty"`
	UpdatedBy int64     `gorm:"column:updated_by" json:"updatedBy,omitempty"`

	//DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
