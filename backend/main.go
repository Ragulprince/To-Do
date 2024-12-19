package main

import (
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Create a Gin router
	r := gin.Default()

	// Register routes
	routes.ToDoRoutes(r)

	// Start the server
	r.Run(":8080")
}
