package dto

import (
	"github.com/google/uuid"
)

type GetQuestionFilter struct {
	ID     uuid.UUID
	QuizID uuid.UUID
}

type QuestionDto struct {
	Text         string              `json:"text"`
	Choices      []QuestionChoiceDto `json:"choices"`
	AnswerID     int                 `json:"answerId"`
	Competencies []uuid.UUID         `json:"competencies"`
	Order        int                 `json:"order"`
}

type QuestionChoiceDto struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
}
