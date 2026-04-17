package model

type Comment struct {
	CommentId int     `gorm:"primaryKey;autoIncrement:true;column:id" json:"id,omitempty"`
	ExamId    int     `gorm:"column:exam_id" json:"examId,omitempty"`
	AccountId int     `gorm:"column:accountId" json:"accountId,omitempty"`
	Desc      string  `gorm:"column:desc" json:"desc,omitempty"`
	Exam      Exam    `gorm:"forigenKey:ExamId" json:"exam,omitempty"`
	Account   Account `gorm:"forigenKey:AccountId" json:"account,omitempty"`
	Model
}
