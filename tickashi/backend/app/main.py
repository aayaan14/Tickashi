from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import todo_routes  # your router
from app.database import engine, Base
from app.models.todo_model import Todo

# Create the tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend origins (Vercel, local dev)
origins = [
    "https://tickashi.vercel.app",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todo_routes.router)
