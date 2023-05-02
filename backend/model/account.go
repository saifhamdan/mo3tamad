package model

type Account struct {
	AccountId int    `gorm:"primaryKey;autoIncrement:true;column:account_id" json:"id,omitempty"`
	Name      string `gorm:"column:name" json:"name,omitempty"`
	Email     string `gorm:"unique;column:email" json:"email,omitempty"`
	Mobile    string `gorm:"column:mobile" json:"mobile,omitempty"`
	Password  string `gorm:"column:password" json:"password,omitempty"`
	RoleID    int    `gorm:"column:role_id" json:"role_id,omitempty"`
	Role      Role   `gorm:"foreignKey:RoleID" json:"role,omitempty"`
	Active    bool   `gorm:"default:true;column:active" json:"active"`
	Status    string `gorm:"column:status" json:"status,omitempty"`
	Model
}
