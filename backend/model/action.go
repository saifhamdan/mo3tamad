package model

type Action struct {
	ActionId   int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Desc       string `gorm:"column:desc" json:"desc,omitempty"`
	ResourceId int    `gorm:"column:resource_id" json:"resourceId,omitempty"`
	Checked    bool   `gorm:"column:checked" json:"checked"`
}
