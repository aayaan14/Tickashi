import { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './AddTodo';
import useDarkMode from './hooks/useDarkMode';

import { API_URL } from './config';

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(
          data.map((todo) => ({
            id: todo.id,
            task: todo.task,
            completed: todo.is_done,
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch todos:", err))
      .finally(() => setIsLoading(false));
  }, []);


  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function addTodo(newTodoText) {
    setIsSubmitting(true);
    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTodoText, is_done: false })
    })
      .then((res) => res.json())
      .then((newTodo) =>
        setTodos((prev) => [
          ...prev,
          {
            id: newTodo.id,
            task: newTodo.task,
            completed: newTodo.is_done,
          },
        ])
      )
      .finally(() => setIsSubmitting(false));
  }

  function deleteTodo(idToDelete) {
    setIsSubmitting(true);
    fetch(`${API_URL}/todos/${idToDelete}`, {
      method: "DELETE",
    }).then(() =>
      setTodos((prev) => prev.filter((todo) => todo.id !== idToDelete))
    )
      .finally(() => setIsSubmitting(false));
  }

  function toggleComplete(idToToggle) {
    setIsSubmitting(true);
    const todoToUpdate = todos.find((t) => t.id === idToToggle);
    if (!todoToUpdate) return;

    fetch(`${API_URL}/todos/${idToToggle}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: todoToUpdate.task,
        is_done: !todoToUpdate.completed,
      }),
    })
      .then((res) => res.json())
      .then((updatedTodo) =>
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === idToToggle
              ? { ...todo, completed: updatedTodo.is_done }
              : todo
          )
        )
      )
      .finally(() => setIsSubmitting(false));
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (isLoading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-app-container">
      <div className="header-container">
        <h1>
          ToDo
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </h1>
      </div>

      <AddTodo addTodo={addTodo} />

      <div className="todo-lists-container">
        <ul className="todo-list">
          {activeTodos.length > 0 ? (
            activeTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label className="todo-checkbox-container">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <span className="checkbox-custom"></span>
                </label>
                <span className="todo-text">{todo.task}</span>
                <button
                  className="delete-btn"
                  disabled={isSubmitting}
                  onClick={() => deleteTodo(todo.id)}
                >
                  {isSubmitting ? "..." : "Delete"}
                </button>

              </li>
            ))
          ) : (
            <li className="empty-message">No tasks yet! Add one above. 🎉</li>
          )}
        </ul>

        {completedTodos.length > 0 && (
          <div className="completed-section">
            <div className="completed-header">
              <span>Completed Tasks</span>
              <span className="completed-count">{completedTodos.length}</span>
            </div>
            <ul className="todo-list">
              {completedTodos.map((todo) => (
                <li key={todo.id} className="todo-item completed">
                  <label className="todo-checkbox-container">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                    />
                    <span className="checkbox-custom"></span>
                  </label>
                  <span className="todo-text">{todo.task}</span>
                  <button
                    className="delete-btn"
                    disabled={isSubmitting}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    {isSubmitting ? "..." : "Delete"}
                  </button>

                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
