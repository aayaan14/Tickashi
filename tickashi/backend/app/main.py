from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.routes import todo_routes
    from app.database import Base, engine
    
    # DON'T create tables at startup in serverless environment
    # Only create tables in development or when explicitly called
    if os.getenv("VERCEL_ENV") != "production" and os.getenv("CREATE_TABLES") == "true":
        Base.metadata.create_all(bind=engine)
    
    IMPORTS_SUCCESS = True
except ImportError as e:
    print(f"Import error: {e}")
    IMPORTS_SUCCESS = False
except Exception as e:
    print(f"Database connection error: {e}")
    IMPORTS_SUCCESS = False

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

# Only include router if imports were successful
if IMPORTS_SUCCESS:
    app.include_router(todo_routes.router)

@app.get("/")
def read_root():
    return {
        "message": "Tickashi FastAPI backend is running!",
        "imports_success": IMPORTS_SUCCESS
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "imports": IMPORTS_SUCCESS}

# This is important for Vercel
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)