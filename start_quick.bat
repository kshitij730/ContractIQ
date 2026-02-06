@echo off
echo Starting ContractIQ...

start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install fastapi uvicorn python-multipart pydantic-settings groq && uvicorn main:app --reload --port 8000"
start cmd /k "cd frontend && npm run dev"

echo Backend and Frontend launching...
echo Access at http://localhost:3000
