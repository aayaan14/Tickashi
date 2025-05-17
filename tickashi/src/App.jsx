import { useState, useEffect } from 'react';
import './App.css';
import AddTodo from './AddTodo';

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    // Check for user's preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDarkMode);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  function addTodo(newTodo) {
    setTodos([...todos, newTodo]);
  }

  function deleteTodo(indexToDelete) {
    // Get the element to animate
    const todoElement = document.querySelectorAll('li')[indexToDelete];
    
    if (todoElement) {
      // Add the fadeOut animation
      todoElement.style.animation = 'fadeOut 0.3s ease forwards';
      
      // Remove the todo after animation completes
      setTimeout(() => {
        setTodos(todos.filter((_, index) => index !== indexToDelete));
      }, 300);
    } else {
      // Fallback if element not found
      setTodos(todos.filter((_, index) => index !== indexToDelete));
    }
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  return (
    <>
      <div className="header-container">
        <h1>
          ToDo
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode} 
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </h1>
      </div>
      <AddTodo addTodo={addTodo} />
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;