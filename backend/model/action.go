package model

type Action struct {
	ActionId   int    `gorm:"primaryKey;autoIncrement:true;column:action_id" json:"action_id"`
	Desc       string `gorm:"column:desc" json:"desc,omitempty"`
	ResourceId int    `gorm:"column:resource_id" json:"resource_id,omitempty"`
	Checked    bool   `gorm:"column:checked" json:"checked"`
}
