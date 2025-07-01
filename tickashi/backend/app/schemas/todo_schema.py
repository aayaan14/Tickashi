from pydantic import BaseModel

# Schema for creating a new todo
class TodoCreate(BaseModel):
    task    : str
    is_done : bool = False

# Schema for responding with todo data (e.g., after reading from DB)
class TodoResponse(BaseModel):
    id      : int
    task    : str
    is_done : bool

    class Config:
        orm_mode = True  # Enables reading data from SQLAlchemy model instances
