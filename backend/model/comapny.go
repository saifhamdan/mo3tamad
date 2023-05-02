package model

type Company struct {
	CompanyId int `gorm:"primaryKey;autoIncrement:true;column:company_id" json:"id,omitempty"`
}
