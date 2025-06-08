from fastapi import FastAPI
from app.routes import todo_routes

app = FastAPI(debug=True)

app.include_router(todo_routes.router, prefix="/api/todos", tags=["Todos"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Tickashi backend!"}