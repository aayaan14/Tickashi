from pydantic import BaseModel
from typing import Optional

class Todo(BaseModel):
    id        : int
    text      : str
    completed : bool = False

class CreateTodo(BaseModel):
    text: str