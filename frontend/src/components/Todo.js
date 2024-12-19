import React, { useState, useEffect } from "react";
import { CheckCircle2, Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import axios from "axios";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/todos";

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      showAlert("Failed to fetch todos", "error");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setLoading(true);
    try {
      const newItem = { 
        id: Date.now().toString(), 
        title: newTodo.trim(), 
        completed: false 
      };
      await axios.post(API_URL, newItem);
      setNewTodo("");
      showAlert("Todo added successfully!");
      fetchTodos();
    } catch (error) {
      showAlert("Failed to add todo", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id) => {
    if (!updatedTitle.trim()) return;
    
    setLoading(true);
    try {
      const updatedItem = { 
        title: updatedTitle.trim(), 
        completed: false 
      };
      await axios.put(`${API_URL}/${id}`, updatedItem);
      setEditingTodo(null);
      setUpdatedTitle("");
      showAlert("Todo updated successfully!");
      fetchTodos();
    } catch (error) {
      showAlert("Failed to update todo", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert("Todo deleted successfully!");
      fetchTodos();
    } catch (error) {
      showAlert("Failed to delete todo", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (todo) => {
    setLoading(true);
    try {
      const updatedItem = { 
        ...todo, 
        completed: !todo.completed 
      };
      await axios.put(`${API_URL}/${todo.id}`, updatedItem);
      showAlert(`Todo marked as ${todo.completed ? 'incomplete' : 'complete'}`);
      fetchTodos();
    } catch (error) {
      showAlert("Failed to update todo status", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            My Todo List
          </h1>

          {/* Alert Component */}
          {alert && (
            <div className={`p-4 mb-4 rounded-lg ${
              alert.type === 'error' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            } flex items-center`}>
              {alert.type === 'error' ? (
                <AlertCircle className="h-5 w-5 mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              )}
              {alert.message}
            </div>
          )}

          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              disabled={loading || !newTodo.trim()}
            >
              <Plus className="h-5 w-5 mr-1" />
              Add
            </button>
          </form>

          {/* Todo List */}
          <div className="space-y-3">
            {todos.length === 0 && !loading ? (
              <div className="text-center py-6 text-gray-500">
                No todos yet. Add one to get started!
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group p-4 rounded-lg border ${
                    todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                  } transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => toggleComplete(todo)}
                        className={`p-1 rounded-full mr-3 ${
                          todo.completed ? 'text-green-500' : 'text-gray-400'
                        } hover:text-green-600 transition-colors`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      
                      {editingTodo === todo.id ? (
                        <input
                          type="text"
                          className="flex-1 px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={updatedTitle}
                          onChange={(e) => setUpdatedTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateTodo(todo.id)}
                          autoFocus
                        />
                      ) : (
                        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {todo.title}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingTodo === todo.id ? (
                        <>
                          <button
                            onClick={() => updateTodo(todo.id)}
                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                            disabled={loading}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingTodo(null);
                              setUpdatedTitle("");
                            }}
                            className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingTodo(todo.id);
                              setUpdatedTitle(todo.title);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            disabled={loading}
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;