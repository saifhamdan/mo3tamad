package model

type Token struct {
	TokenId      int     `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	AccessToken  string  `gorm:"column:access_token" json:"accessToken,omitempty"`
	RefreshToken string  `gorm:"column:refresh_token" json:"refreshToken,omitempty"`
	Scope        string  `gorm:"column:scope" json:"scope,omitempty"`
	ExpiresIn    int64   `gorm:"column:expires_in" json:"expiresIn,omitempty"`
	AccountId    int     `json:"accountId,omitempty"`
	Account      Account `gorm:"foreignKey:AccountId" json:"account,omitempty"`
	Model
}
