package designer

import (
	"github.com/gin-gonic/gin"
	"icando/internal/handler/designer"
	"icando/internal/middleware"
)

type QuizRoute struct {
	quizHandler    designer.QuizHandler
	authMiddleware middleware.AuthMiddleware
}

func (r QuizRoute) Setup(group *gin.RouterGroup) {
	group = group.Group("/quiz")
	group.POST("", r.quizHandler.Create)
	group.POST("/publish", r.quizHandler.Publish)
	group.GET("/:id", r.quizHandler.Get)
	group.PATCH("", r.quizHandler.Update)
	group.GET("", r.quizHandler.GetAll)
	group.GET("/:id/history", r.quizHandler.GetQuizHistory)

}

func NewQuizRoute(
	handler designer.QuizHandler,
) *QuizRoute {
	return &QuizRoute{
		quizHandler: handler,
	}
}
