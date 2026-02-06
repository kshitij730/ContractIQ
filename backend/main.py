from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.core.config import settings

app = FastAPI(
    title="ContractIQ API",
    description="Backend for ContractIQ - Discrepancy Detection & Negotiation System",
    version="1.0.0"
)

# CORS Middleware
origins = ["*"] # Allow all for deployment flexibility

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.endpoints import analysis
app.include_router(analysis.router, prefix="/api/v1", tags=["analysis"])

@app.get("/")
async def root():
    return {"message": "ContractIQ API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
