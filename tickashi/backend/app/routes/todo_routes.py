from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.todo_model import Todo
from app.schemas.todo_schema import TodoCreate, TodoResponse
from sqlalchemy.exc import SQLAlchemyError
from app.dependencies.auth import verify_token

router = APIRouter(prefix="/todos", tags=["Todos"])

# Create a new Todo
@router.post("/", response_model=TodoResponse)
def create_todo(todo_data: dict, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    try:
        new_todo = Todo(
            task=todo_data["task"],
            is_done=todo_data.get("is_done", False),
            user_id=user_id
        )
        db.add(new_todo)
        db.commit()
        db.refresh(new_todo)
        return new_todo
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch todos")

# Get all Todos
@router.get("/", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    try:
        return db.query(Todo).filter(Todo.user_id == user_id).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch todos")

# Update a Todo
@router.put("/{todo_id}/", response_model=TodoResponse)
def update_todo(todo_id: int, updated_data: dict, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    try:
        todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        todo.task = updated_data.get("task", todo.task)
        todo.is_done = updated_data.get("is_done", todo.is_done)
        db.commit()
        db.refresh(todo)
        return todo
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch todos")

# Delete a Todo
@router.delete("/{todo_id}/")
def delete_todo(todo_id: int, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    try:
        todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        db.delete(todo)
        db.commit()
        return {"message": "Todo deleted"}
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch todos")
