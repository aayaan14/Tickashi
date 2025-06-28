from pydantic import BaseModel
from typing import Optional

class Todo(BaseModel):
    id        : Optional[int] = None
    task      : str
    is_done   : bool = False
