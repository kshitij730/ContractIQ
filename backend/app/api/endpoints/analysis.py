from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import Annotated
from app.schemas import AnalysisResponse, AnalysisResult, RiskItem
from app.services.ocr import ocr_service
from app.services.logic import risk_engine
from app.services.llm import llm_service
# from app.services.report_generator import generate_pdf_report
import shutil
import os
from app.core.config import settings

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_contract(
    file: UploadFile = File(...),
    user_explanation: str = Form(...)
):
    # 1. Save file
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    file_path = f"{settings.UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. OCR/Extract Text
    contract_text = ocr_service.process_file(file_path)
    if not contract_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")
    
    # 3. Analyze Risks (Deterministic/ML)
    risk_data = risk_engine.analyze(contract_text, user_explanation)
    
    # 4. Generate AI Explanation & Negotiation (LLM)
    explanation = llm_service.generate_explanation(risk_data, user_explanation)
    negotiation_email = llm_service.generate_negotiation_email(risk_data)
    
    analysis_result = AnalysisResult(
        score=risk_data["score"],
        risks=[RiskItem(**r) for r in risk_data["risks"]],
        contract_summary=risk_data["contract_summary"],
        explanation=explanation,
        negotiation_email=negotiation_email
    )
    
    return AnalysisResponse(analysis=analysis_result)

@router.post("/download-report")
async def download_report(
    score: int = Form(...),
    risks: str = Form(...),
    explanation: str = Form(...),
    email: str = Form(...)
):
    """Generate and download PDF report - Coming soon"""
    return {"message": "PDF download feature coming soon. Please copy the email for now."}

