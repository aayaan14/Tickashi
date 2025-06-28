from fastapi import APIRouter, HTTPException
from app.models.todo_model import Todo
from app import database

router = APIRouter()

@router.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    todo.id = len(database.todos) + 1
    database.todos.append(todo)
    return todo

@router.get("/todos", response_model=list[Todo])
def get_todos():
    return database.todos

@router.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated: Todo):
    for i, todo in enumerate(database.todos):
        if todo.id == todo_id:
            database.todos[i].task = updated.task
            database.todos[i].is_done = updated.is_done
            return database.todos[i]
    raise HTTPException(status_code=404, detail="Todo not found")

@router.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    for i, todo in enumerate(database.todos):
        if todo.id == todo_id:
            del database.todos[i]
            return {"message": "Todo deleted"}
    raise HTTPException(status_code=404, detail="Todo not found")