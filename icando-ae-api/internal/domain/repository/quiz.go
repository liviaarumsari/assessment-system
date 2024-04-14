package repository

import (
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"icando/internal/model"
	"icando/internal/model/dao"
	"icando/internal/model/dto"
	"icando/lib"
	"math"
	"sort"
	"strings"
)

type QuizRepository struct {
	db *gorm.DB
}

func NewQuizRepository(db *lib.Database) QuizRepository {
	return QuizRepository{
		db: db.DB,
	}
}

func (r *QuizRepository) GetQuiz(filter dto.GetQuizFilter) (*model.Quiz, error) {
	query := r.db.Session(&gorm.Session{})

	if filter.WithCreator {
		query = query.Preload("Creator")
	}

	if filter.WithUpdater {
		query = query.Preload("Updater")
	}

	if filter.WithQuestions {
		query = query.Preload("Questions.Competencies")
	}

	if filter.ID != uuid.Nil {
		query = query.Where("id = ?", filter.ID)
	}

	var quiz model.Quiz
	err := query.First(&quiz).Error
	if err != nil {
		return nil, err
	}

	if filter.WithQuestions {
		sort.Slice(
			quiz.Questions, func(i, j int) bool {
				return quiz.Questions[i].Order < quiz.Questions[j].Order
			},
		)
	}

	return &quiz, nil
}

func (r *QuizRepository) CreateQuiz(quiz model.Quiz) (model.Quiz, error) {
	err := r.db.Create(&quiz).Error
	return quiz, err
}

func (r *QuizRepository) UpdateQuiz(quiz model.Quiz) error {
	return r.db.Save(&quiz).Error
}

func (r *QuizRepository) GetAllQuiz(filter dto.GetAllQuizzesFilter) ([]dao.ParentQuizDao, *dao.MetaDao, error) {
	query := r.db.Table("quizzes").Select(
		`quizzes.id, quizzes.name, quizzes.subject, quizzes.passing_grade, MAX(c.published_at) as last_published_at, t.first_name || ' ' || t.last_name as created_by`,
	).
		Joins("INNER JOIN teachers t ON quizzes.created_by=t.id").
		Joins("LEFT JOIN quizzes c ON quizzes.id=c.parent_quiz").
		Where("quizzes.parent_quiz IS NULL")

	if filter.Query != nil {
		query.Where("LOWER(name) LIKE ?", strings.ToLower(fmt.Sprintf("%%%s%%", *filter.Query)))
	}
	if filter.Subject != nil {
		query.Where("subject @> ?", filter.Subject)
	}

	query.Group("quizzes.id, t.first_name, t.last_name")

	var totalItem int64
	err := query.Session(&gorm.Session{}).Count(&totalItem).Error
	if err != nil {
		return nil, nil, err
	}

	meta := dao.MetaDao{
		Page:      filter.Page,
		Limit:     filter.Limit,
		TotalItem: totalItem,
		TotalPage: int(math.Ceil(float64(totalItem) / float64(filter.Limit))),
	}
	Paginate(query, filter.Page, filter.Limit)

	quizzes := []dao.ParentQuizDao{}
	err = query.Session(&gorm.Session{}).Scan(&quizzes).Error

	return quizzes, &meta, err
}
