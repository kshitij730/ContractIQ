@echo off
echo Starting ContractIQ...

start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"
start cmd /k "npm install && npm run dev"

echo Backend and Frontend launching...
echo Access at http://localhost:3000
