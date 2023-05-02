package model

import (
	"gorm.io/gorm"
)

type Role struct {
	RoleId int    `gorm:"primaryKey;autoIncrement:true;column:role_id" json:"id,omitempty" example:"1"`
	Desc   string `gorm:"column:desc" json:"desc,omitempty" validate:"required" example:"admin"`
	Status string `gorm:"column:status" json:"status,omitempty" example:"status"`
	Model
}

// Group Model Validetor
func (r *Role) RoleValidetor(tx *gorm.DB) error {
	return nil
}

// gorm hooks runs everytime before creating new Group to validate
func (r *Role) BeforeCreate(tx *gorm.DB) error {
	return r.RoleValidetor(tx)
}

// gorm hooks runs everytime before updating the Group to validate
func (r *Role) BeforeUpdate(tx *gorm.DB) error {
	return r.RoleValidetor(tx)
}
