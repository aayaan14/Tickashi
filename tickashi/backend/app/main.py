from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import todo_routes
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "https://tickashi.vercel.app",
    "https://tickashi.vercel.app/",
    "http://localhost:5173",
    "http://localhost:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"],        
)

app.include_router(todo_routes.router)
