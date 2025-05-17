import { useState } from "react";

function AddTodo({ addTodo }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() === "") {
      return;
    }
    addTodo(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        className="form-control"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter todo"
      />
      <button type="submit" className="btn btn-primary">Add</button>
    </form>
  );
}

export default AddTodo;