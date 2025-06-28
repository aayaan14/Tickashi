import { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './AddTodo';
import useDarkMode from './hooks/useDarkMode';
import { API_URL } from './config';

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched todos from backend:", data);
        setTodos(data);
      });
  }, []);


  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function addTodo(newTodoText) {
    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ task: newTodoText, is_done: false })
    })
      .then(res => res.json())
      .then(newTodo => setTodos(prev => [...prev, newTodo]));
  }

  function deleteTodo(idToDelete) {
    fetch(`${API_URL}/todos/${idToDelete}`, {
      method: "DELETE"
    })
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== idToDelete)));
  }

  function toggleComplete(idToToggle) {
    const todoToUpdate = todos.find(t => t.id === idToToggle);
    if (!todoToUpdate) return;

    fetch(`${API_URL}/todos/${idToToggle}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        task: todoToUpdate.task,
        is_done: !todoToUpdate.completed
      })
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(prev => prev.map(todo =>
          todo.id === idToToggle ? { ...todo, completed: updatedTodo.is_done } : todo
        ));
      });
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

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
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                  Delete
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
                  <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                    Delete
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
