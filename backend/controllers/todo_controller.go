package controllers

import (
	"net/http"
	"sync"
	"backend/models"

	"github.com/gin-gonic/gin"
)

var (
	todoStore = make(map[string]models.ToDo) // In-memory map to store To-Dos
	mutex     = sync.Mutex{}                 // Mutex to prevent race conditions
)

// Create a new To-Do
func CreateToDoHandler(c *gin.Context) {
	var todo models.ToDo
	if err := c.ShouldBindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	mutex.Lock()
	todoStore[todo.ID] = todo
	mutex.Unlock()

	c.JSON(http.StatusCreated, gin.H{"message": "To-Do created", "data": todo})
}

// Get all To-Dos
func GetToDosHandler(c *gin.Context) {
	mutex.Lock()
	todos := make([]models.ToDo, 0, len(todoStore))
	for _, todo := range todoStore {
		todos = append(todos, todo)
	}
	mutex.Unlock()

	c.JSON(http.StatusOK, todos)
}

// Update an existing To-Do
func UpdateToDoHandler(c *gin.Context) {
	id := c.Param("id")
	var updatedToDo models.ToDo

	if err := c.ShouldBindJSON(&updatedToDo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	mutex.Lock()
	if _, exists := todoStore[id]; !exists {
		mutex.Unlock()
		c.JSON(http.StatusNotFound, gin.H{"error": "To-Do not found"})
		return
	}

	updatedToDo.ID = id // Ensure the ID remains the same
	todoStore[id] = updatedToDo
	mutex.Unlock()

	c.JSON(http.StatusOK, gin.H{"message": "To-Do updated", "data": updatedToDo})
}

// Delete a To-Do
func DeleteToDoHandler(c *gin.Context) {
	id := c.Param("id")

	mutex.Lock()
	if _, exists := todoStore[id]; !exists {
		mutex.Unlock()
		c.JSON(http.StatusNotFound, gin.H{"error": "To-Do not found"})
		return
	}

	delete(todoStore, id)
	mutex.Unlock()

	c.JSON(http.StatusOK, gin.H{"message": "To-Do deleted"})
}
