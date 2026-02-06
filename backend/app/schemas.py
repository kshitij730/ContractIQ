from pydantic import BaseModel
from typing import List, Optional

class RiskItem(BaseModel):
    category: str
    severity: str
    finding: str
    expectation_check: str

class AnalysisResult(BaseModel):
    score: int
    risks: List[RiskItem]
    contract_summary: str
    explanation: Optional[str] = None
    negotiation_email: Optional[str] = None

class UserExpectation(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    analysis: AnalysisResult
