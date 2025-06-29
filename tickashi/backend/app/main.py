from fastapi import FastAPI
from app.routes import todo_routes
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.database import Base, engine
from app.models.todo_model import Todo

# Create tables (only during startup)
Base.metadata.create_all(bind=engine)

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  #  frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todo_routes.router)

