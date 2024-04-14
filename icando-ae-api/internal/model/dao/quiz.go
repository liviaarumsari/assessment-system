package dao

import (
	"github.com/google/uuid"
	"icando/internal/model/base"
	"time"
)

type QuizDao struct {
	ID           uuid.UUID        `json:"id"`
	Name         *string          `json:"name"`
	Subject      base.StringArray `json:"subject" gorm:"type:text[]"`
	PassingGrade float64          `json:"passingGrade"`
	PublishedAt  *time.Time       `json:"publishedAt"`
	Deadline     *time.Time       `json:"deadline"`
	Creator      *TeacherDao      `json:"creator,omitempty"`
	Updater      *TeacherDao      `json:"updater,omitempty"`
	Questions    []QuestionDao    `json:"questions"`
}

type ParentQuizDao struct {
	ID              uuid.UUID        `json:"id"`
	Name            *string          `json:"name"`
	Subject         base.StringArray `json:"subject" gorm:"type:text[]"`
	PassingGrade    float64          `json:"passingGrade"`
	LastPublishedAt *time.Time       `json:"lastPublishedAt"`
	CreatedBy       string           `json:"createdBy"`
}
