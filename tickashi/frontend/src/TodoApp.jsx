// TodoApp.jsx
import { useEffect, useState } from 'react';
import AddTodo from './AddTodo';
import useDarkMode from './hooks/useDarkMode';
import { API_URL } from './config';

function TodoApp({ session }) {
    const [todos, setTodos] = useState([]);
    const [darkMode, setDarkMode] = useDarkMode();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        fetch(`${API_URL}/todos/`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setTodos(
                    data.map((todo) => ({
                        id: todo.id,
                        task: todo.task,
                        completed: todo.is_done,
                    }))
                );
            })
            .catch((err) => {
                console.error('Failed to fetch todos:', err);
                setTodos([]); // Set empty array on error
            })
            .finally(() => setIsLoading(false));
    }, [session]);

    function addTodo(newTodoText) {
        if (!newTodoText.trim()) return;

        setIsSubmitting(true);
        fetch(`${API_URL}/todos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ task: newTodoText, is_done: false }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
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
            .catch((err) => {
                console.error('Failed to add todo:', err);
                alert('Failed to add todo. Please try again.');
            })
            .finally(() => setIsSubmitting(false));
    }

    function deleteTodo(idToDelete) {
        setIsSubmitting(true);
        fetch(`${API_URL}/todos/${idToDelete}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                setTodos((prev) => prev.filter((todo) => todo.id !== idToDelete));
            })
            .catch((err) => {
                console.error('Failed to delete todo:', err);
                alert('Failed to delete todo. Please try again.');
            })
            .finally(() => setIsSubmitting(false));
    }

    function toggleComplete(idToToggle) {
        setIsSubmitting(true);
        const todoToUpdate = todos.find((t) => t.id === idToToggle);
        if (!todoToUpdate) {
            setIsSubmitting(false);
            return;
        }

        fetch(`${API_URL}/todos/${idToToggle}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                task: todoToUpdate.task,
                is_done: !todoToUpdate.completed,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((updatedTodo) =>
                setTodos((prev) =>
                    prev.map((todo) =>
                        todo.id === idToToggle
                            ? { ...todo, completed: updatedTodo.is_done }
                            : todo
                    )
                )
            )
            .catch((err) => {
                console.error('Failed to update todo:', err);
                alert('Failed to update todo. Please try again.');
            })
            .finally(() => setIsSubmitting(false));
    }

    const activeTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    if (isLoading) return <div className="loading">Loading todos...</div>;

    return (
        <div className="todo-app-container">
            <div className="header-container">
                <h1>
                    ToDo
                    <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </h1>
            </div>

            <AddTodo addTodo={addTodo} isSubmitting={isSubmitting} />

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
                                        disabled={isSubmitting}
                                    />
                                    <span className="checkbox-custom"></span>
                                </label>
                                <span className="todo-text">{todo.task}</span>
                                <button
                                    className="delete-btn"
                                    disabled={isSubmitting}
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    {isSubmitting ? '...' : 'Delete'}
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
                                            disabled={isSubmitting}
                                        />
                                        <span className="checkbox-custom"></span>
                                    </label>
                                    <span className="todo-text">{todo.task}</span>
                                    <button
                                        className="delete-btn"
                                        disabled={isSubmitting}
                                        onClick={() => deleteTodo(todo.id)}
                                    >
                                        {isSubmitting ? '...' : 'Delete'}
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

export default TodoApp;