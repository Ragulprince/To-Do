package main

import (
    "backend/routes"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    // Create a Gin router
    r := gin.Default()

    
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, 
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"}, 
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, 
        AllowCredentials: true, 
    }))

    // Register routes
    routes.ToDoRoutes(r)

    
    r.Run(":8080")
}
