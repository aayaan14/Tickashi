import { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './AddTodo';

function App() {

  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  function addTodo(newTodoText) {
    const newTodo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  }

  function deleteTodo(idToDelete) {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== idToDelete));
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  function toggleComplete(idToToggle) {
    console.log("Toggling completion for:", idToToggle);
    setTodos(prevTodos => {
      const updated = prevTodos.map(todo =>
        todo.id === idToToggle
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      console.log("Updated todos:", updated);
      return updated;
    });
  }

  // Separate completed and active tasks
  const activeTodos    = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  console.log("Active todos:", activeTodos);
  console.log("Completed todos:", completedTodos);

  return (
    <div className="todo-app-container">
      <div className="header-container">
        <h1>
          ToDo
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </h1>
      </div>
      <AddTodo addTodo={addTodo} />
      <div className="todo-lists-container">
        {/* Active tasks */}
        <ul className="todo-list">
          {activeTodos.length > 0 ? (
            activeTodos.map((todo) => (
              <li
                key={todo.id}
                className="todo-item"
              >
                <label className="todo-checkbox-container">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <span className="checkbox-custom"></span>
                </label>
                <span className="todo-text">{todo.text}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className="empty-message">No tasks yet! Add one above. 🎉</li>
          )}
        </ul>

        {/* Completed tasks section */}
        {completedTodos.length > 0 && (
          <div className="completed-section">
            <div className="completed-header">
              <span>Completed Tasks</span>
              <span className="completed-count">{completedTodos.length}</span>
            </div>
            <ul className="todo-list">
              {completedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="todo-item completed"
                >
                  <label className="todo-checkbox-container">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                    />
                    <span className="checkbox-custom"></span>
                  </label>
                  <span className="todo-text">{todo.text}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                  >
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