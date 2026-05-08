from pydantic import BaseModel, Field
from typing import List, Optional

class RiskItem(BaseModel):
    category: str
    severity: str
    finding: str
    expectation_check: str
    confidence: Optional[float] = None

class LegalVerdictItem(BaseModel):
    clause: str
    risk_type: str
    severity: str
    causal_chain: str
    confidence: float
    recommendation: str

class CausalRiskItem(BaseModel):
    clause: str
    cause: str
    mechanism: str
    consequence: str
    legal_basis: str
    severity: str
    likelihood: float
    impact: float

class ClauseDebateItem(BaseModel):
    clause: str
    agent_a_argument: str
    agent_b_argument: str
    agreed_risks: List[str]
    disputed_interpretations: List[str]
    risk_score: int
    verdict: str
    negotiation_leverage: str

class MemoryInsightItem(BaseModel):
    clause: str
    clause_type: str
    similar_cases_found: int
    precedent_summary: str
    historical_risk_level: str
    winning_party_in_disputes: str
    recommended_modification: str

class OutcomeScenarioItem(BaseModel):
    scenario: str
    dispute_probability: float
    estimated_financial_exposure_INR: int
    time_to_resolution_months: int
    key_trigger: str
    prevention: str

class OutcomeSimulationItem(BaseModel):
    overall_risk_score: int
    go_no_go_recommendation: str
    highest_priority_clause_to_fix: str
    scenarios: List[OutcomeScenarioItem]

class AnalysisResult(BaseModel):
    score: int
    risks: List[RiskItem]
    legal_verdicts: List[LegalVerdictItem] = Field(default_factory=list)
    causal_analyses: List[CausalRiskItem] = Field(default_factory=list)
    clause_debates: List[ClauseDebateItem] = Field(default_factory=list)
    memory_insights: List[MemoryInsightItem] = Field(default_factory=list)
    outcome_simulation: Optional[OutcomeSimulationItem] = None
    contract_summary: str
    explanation: Optional[str] = None
    negotiation_email: Optional[str] = None

class UserExpectation(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    analysis: AnalysisResult

class ChatRequest(BaseModel):
    question: str
    analysis: AnalysisResult
    user_explanation: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
