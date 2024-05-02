package repository

import (
	"icando/internal/model/dao"
	"icando/internal/model/dto"
	"icando/lib"

	"gorm.io/gorm"
)

type AnalyticsRepository struct {
	db *gorm.DB
}

func NewAnalyticsRepository(db *lib.Database) AnalyticsRepository {
	return AnalyticsRepository{
		db: db.DB,
	}
}

func (r *AnalyticsRepository) GetQuizPerformance(filter *dto.GetQuizPerformanceFilter) (*dao.QuizPerformanceDao, error) {
	query := r.db.Table("student_quizzes").
		Joins("JOIN quizzes ON student_quizzes.quiz_id = quizzes.id").
		Joins("NATURAL JOIN quiz_classes").
		Joins("NATURAL JOIN class_teacher").
		Select(`
			COUNT(CASE WHEN total_score >= passing_grade THEN 1 END) AS quizzes_passed, 
			COUNT(CASE WHEN total_score < passing_grade THEN 1 END) AS quizzes_failed
			`)

	if filter.QuizID != nil {
		query = query.Where("quiz_id = ?", filter.QuizID)
	}

	if filter.StudentID != nil {
		query = query.Where("student_id = ?", filter.StudentID)
	}

	if filter.TeacherID != nil {
		query = query.Where("teacher_id = ?", filter.TeacherID)
	}

	var result dao.QuizPerformanceDao
	err := query.Scan(&result).Error
	if err != nil {
		return nil, err
	}

	return &result, nil
}
