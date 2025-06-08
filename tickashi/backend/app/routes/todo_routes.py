from fastapi import APIRouter, HTTPException
from app.models.todo_model import Todo, CreateTodo
from app import database

router = APIRouter()

@router.get("/", response_model=list[Todo])
def get_all_todos():
    return database.fake_db

@router.post("/", response_model=Todo)
def create_todo(todo_data: CreateTodo):
    global todo_id
    new_todo = Todo(id=database.todo_id, text=todo_data.text, completed=False)
    database.fake_db.append(new_todo)
    database.todo_id += 1
    return new_todo

@router.put("/{todo_id}/complete", response_model=Todo)
def toggle_todo_complete(todo_id: int):
    for todo in database.fake_db:
        if todo.id == todo_id:
            todo.completed = not todo.completed
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")