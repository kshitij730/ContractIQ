import json
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.auth import get_current_active_user
from app.models.user import User
from app.schemas import (
    AnalysisResponse,
    AnalysisResult,
    CausalRiskItem,
    ChatRequest,
    ChatResponse,
    ClauseDebateItem,
    LegalVerdictItem,
    MemoryInsightItem,
    OutcomeSimulationItem,
    RiskItem,
)
from app.services.llm import llm_service
from app.services.logic import risk_engine
from app.services.ocr import ocr_service
from app.services.report_generator import generate_pdf_report
from app.core.config import settings

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt"}
MAX_UPLOAD_BYTES = 15 * 1024 * 1024


def _safe_upload_path(filename: str) -> Path:
    original = Path(filename or "contract.txt")
    suffix = original.suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload PDF, PNG, JPG, JPEG, or TXT files.",
        )

    upload_dir = Path(settings.UPLOAD_FOLDER)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir / f"{uuid.uuid4().hex}{suffix}"


async def _save_upload(file: UploadFile, destination: Path) -> None:
    total = 0
    with open(destination, "wb") as buffer:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            total += len(chunk)
            if total > MAX_UPLOAD_BYTES:
                raise HTTPException(status_code=413, detail="File is too large. Maximum upload size is 15 MB.")
            buffer.write(chunk)


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_contract(
    file: UploadFile = File(...),
    user_explanation: str = Form(...),
    current_user: User = Depends(get_current_active_user),
):
    file_path = _safe_upload_path(file.filename)

    try:
        await _save_upload(file, file_path)

        contract_text = ocr_service.process_file(str(file_path))
        if not contract_text or len(contract_text.strip()) < 40:
            raise HTTPException(
                status_code=400,
                detail="Could not extract enough text from the file. Try a text-based PDF or clearer scan.",
            )

        risk_data = risk_engine.analyze(contract_text, user_explanation)
        explanation = llm_service.generate_explanation(risk_data, user_explanation)
        negotiation_email = llm_service.generate_negotiation_email(risk_data)
        legal_verdicts = llm_service.generate_self_reflective_verdict(contract_text, user_explanation, risk_data)
        causal_analyses = llm_service.generate_causal_analyses(contract_text, risk_data)
        clause_debates = llm_service.generate_clause_debates(contract_text, risk_data)
        memory_insights = llm_service.generate_memory_insights(contract_text, risk_data)
        outcome_simulation = llm_service.generate_outcome_simulation(risk_data, contract_text)

        analysis_result = AnalysisResult(
            score=risk_data["score"],
            risks=[RiskItem(**r) for r in risk_data["risks"]],
            legal_verdicts=[LegalVerdictItem(**v) for v in legal_verdicts],
            causal_analyses=[CausalRiskItem(**item) for item in causal_analyses],
            clause_debates=[ClauseDebateItem(**item) for item in clause_debates],
            memory_insights=[MemoryInsightItem(**item) for item in memory_insights],
            outcome_simulation=OutcomeSimulationItem(**outcome_simulation),
            contract_summary=risk_data["contract_summary"],
            explanation=explanation,
            negotiation_email=negotiation_email,
        )

        return AnalysisResponse(analysis=analysis_result)
    finally:
        try:
            if file_path.exists():
                file_path.unlink()
        except OSError:
            pass


@router.post("/chat", response_model=ChatResponse)
async def chat_with_contract(
    payload: ChatRequest,
    current_user: User = Depends(get_current_active_user),
):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    answer = llm_service.answer_contract_question(
        question=question,
        analysis=payload.analysis.model_dump(),
        user_explanation=payload.user_explanation or "",
    )
    return ChatResponse(answer=answer)


@router.post("/download-report")
async def download_report(
    score: int = Form(...),
    risks: str = Form(...),
    explanation: str = Form(...),
    email: str = Form(...),
    current_user: User = Depends(get_current_active_user),
):
    try:
        parsed_risks = json.loads(risks)
        if not isinstance(parsed_risks, list):
            raise ValueError("risks must be a list")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid risks payload.") from exc

    pdf_path = generate_pdf_report(score, parsed_risks, explanation, email)
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=Path(pdf_path).name,
    )
