package model

type Company struct {
	CompanyId    int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	Name         string `gorm:"column:name" json:"name,omitempty"`
	Desc         string `gorm:"column:desc" json:"desc,omitempty"`
	IsVerified   bool   `gorm:"default:true;column:is_verified" json:"isVerified"`
	Phone_number string `gorm:"column:phone_number" json:"phoneNumber,omitempty"`
	Model
}
