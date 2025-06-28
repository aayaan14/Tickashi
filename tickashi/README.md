# Tickashi Todo App

A full-stack Todo application built with React (frontend) and FastAPI (backend).

## Features

- Add, view, and delete todos.
- Responsive and user-friendly UI.
- Backend API for managing todos.
- CORS enabled for frontend-backend communication.

---

## Project Structure

```
Tickashi/
├── backend/          # Backend code (FastAPI)
│   ├── app/
│   │   ├── main.py   # FastAPI entry point
│   │   ├── routes/   # API routes
│   │   └── ...       # Other backend files
├── frontend/         # Frontend code (React)
│   ├── src/
│   │   ├── App.jsx   # React app entry point
│   │   ├── App.css   # Styling for the app
│   │   └── ...       # Other frontend files
└── README.md         # Project documentation
```

---

## Prerequisites

- **Node.js** (for frontend)
- **Python 3.9+** (for backend)
- **FastAPI** and **Uvicorn** (backend dependencies)

---

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The backend will be available at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd tickashi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

---

## API Endpoints

- **GET /todos**: Fetch all todos.
- **POST /todos**: Add a new todo.
- **DELETE /todos/{id}**: Delete a todo by ID.

---

## Screenshots

### Todo App UI
![Todo App UI](https://via.placeholder.com/800x400?text=Todo+App+UI)

---

## License

This project is licensed under the MIT License.