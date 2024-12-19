package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

func ToDoRoutes(r *gin.Engine) {
	r.POST("/todos", controllers.CreateToDoHandler)
	r.GET("/todos", controllers.GetToDosHandler)
	r.PUT("/todos/:id", controllers.UpdateToDoHandler)
	r.DELETE("/todos/:id", controllers.DeleteToDoHandler)
}
