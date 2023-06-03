package model

type Level struct {
	LevelId int    `gorm:"primaryKey;autoincremnt:true;column:ID" json:"id,omitempty"`
	Desc    string `gorm:"column:DESC" json:"desc,ompitempty"`
}
