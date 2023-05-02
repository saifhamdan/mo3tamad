package model

import (
	"fmt"

	"gorm.io/gorm"
)

// resources type can only be those
const ResourceTypeAPI = "api"
const ResourceTypePage = "page"
const ResourceTypeScreen = "screen"

type Resource struct {
	ResourceId int      `gorm:"primaryKey;autoIncrement:true;column:resource_id;" json:"resource_id"`
	Type       string   `gorm:"column:type" json:"type,omitempty" validate:"required"`
	Desc       string   `gorm:"column:desc" json:"desc,omitempty" validate:"required"`
	Status     string   `gorm:"column:status" json:"status,omitempty"`
	Actions    []Action `gorm:"foreignKey:ResourceId;column:resource_id;constraint:OnDelete:CASCADE;" json:"actions,omitempty"`
	Model
}

// Group Model Validetor
func (r *Resource) ResourceValidetor(tx *gorm.DB) error {

	if r.Type != ResourceTypeAPI && r.Type != ResourceTypePage && r.Type != ResourceTypeScreen {
		return fmt.Errorf("resouce type should be either an api, page or screen")
	}

	return nil
}

// gorm hooks runs everytime before creating new Group to validate
func (r *Resource) BeforeCreate(tx *gorm.DB) error {
	return r.ResourceValidetor(tx)
}

// gorm hooks runs everytime before updating the Group to validate
func (r *Resource) BeforeUpdate(tx *gorm.DB) error {
	return r.ResourceValidetor(tx)
}
