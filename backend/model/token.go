package model

type Token struct {
	TokenId      int     `gorm:"primaryKey;autoIncrement:true;column:token_id" json:"token_id"`
	AccessToken  string  `gorm:"column:access_token" json:"access_token,omitempty"`
	RefreshToken string  `gorm:"column:refresh_token" json:"refresh_token,omitempty"`
	Scope        string  `gorm:"column:scope" json:"scope,omitempty"`
	ExpiresIn    int64   `gorm:"column:expires_in" json:"expires_in,omitempty"`
	AccountId    int     `json:"account_id,omitempty"`
	Account      Account `gorm:"foreignKey:AccountId" json:"account,omitempty"`
	Model
}
