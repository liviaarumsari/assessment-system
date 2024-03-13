package model

import (
	"github.com/google/uuid"
	"icando/internal/model/dao"
	"icando/internal/model/enum"
)

type Teacher struct {
	Model
	ID            uuid.UUID `gorm:"primarykey"`
	FirstName     string
	LastName      string
	Email         string
	Password      string
	InstitutionID uuid.UUID
	Institution   *Institution
	Role          enum.TeacherRole
}

func (s Teacher) ToDao() dao.TeacherDao {
	return dao.TeacherDao{
		ID:            s.ID,
		FirstName:     s.FirstName,
		LastName:      s.LastName,
		Email:         &s.Email,
		InstitutionID: s.InstitutionID,
	}
}
