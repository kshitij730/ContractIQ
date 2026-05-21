# ContractIQ

ContractIQ is an AI-powered contract review platform built for freelancers, founders, agencies, and small businesses who need fast legal risk visibility before signing an agreement.

It combines OCR, rule-based detection, semantic clause matching, LLM reasoning, negotiation support, and scenario simulation into a single workflow. The goal is simple: turn dense contract language into clear decisions.

## Live Links

- Frontend: [https://contract-iq-xi.vercel.app/](https://contract-iq-xi.vercel.app/)
- Backend API: [https://kshitij230-contract-iq-api.hf.space](https://kshitij230-contract-iq-api.hf.space)
- Repository: [https://github.com/kshitij730/ContractIQ](https://github.com/kshitij730/ContractIQ)

## What ContractIQ Does

Upload a contract PDF, image, or text file and ContractIQ will:

- extract contract text from uploaded documents
- compare contract language against user expectations
- detect legal and commercial red flags
- explain risks in plain English
- generate negotiation-ready recommendations
- simulate likely real-world outcomes if the agreement is disputed
- support follow-up Q&A through a contract-aware chatbot
- let users export a polished report

## Why It Stands Out

ContractIQ is not just a clause highlighter. It layers multiple reasoning systems together:

- OCR and document extraction for PDFs, scans, and images
- deterministic legal pattern detection for precision
- semantic clause similarity for hidden or reworded risks
- self-reflective legal analysis that critiques its own first-pass output
- causal reasoning that explains why a clause is risky step by step
- adversarial clause debate between a client-side and opposing counsel view
- memory-style precedent synthesis for similar clause patterns
- outcome simulation across best, likely, and worst-case scenarios

## Core Features

### 1. Document Ingestion

- Supports PDF, image, and plain text uploads
- Uses `pypdf` for text-based PDF extraction
- Uses OCR fallback logic for image-style documents
- Handles temporary file cleanup after analysis
- Enforces safer upload handling with file validation and size checks

### 2. Hybrid Risk Detection

The backend combines two complementary systems:

- Rule engine:
  - catches explicit risk patterns like one-sided termination, unlimited liability, weak payment protections, or missing caps
- Semantic analysis:
  - identifies risky meaning even when the clause uses softer or indirect wording

This helps ContractIQ catch both obvious and subtle contract issues.

### 3. Self-Reflective Legal Verdicts

ContractIQ runs a structured three-phase reasoning flow:

1. Draft analysis
2. Self-critique by a skeptical senior-lawyer persona
3. Final refined verdict in strict JSON format

Each verdict includes:

- exact clause text
- risk type
- severity
- causal chain
- confidence score
- recommendation

Low-confidence items are flagged for human review.

### 4. Causal Legal Reasoning

Instead of just saying a clause is risky, ContractIQ explains:

`CAUSE -> MECHANISM -> CONSEQUENCE -> LEGAL BASIS`

This helps users understand not only what is wrong, but how the clause can create financial or legal harm in practice.

### 5. Clause Debate Engine

Every important clause can be analyzed from two sides:

- Agent A: the client's lawyer
- Agent B: opposing counsel

The system then synthesizes:

- agreed risks
- disputed interpretations
- balanced risk score
- final recommendation: `SIGN`, `NEGOTIATE`, or `REJECT`

### 6. Legal Memory Retrieval

ContractIQ can generate precedent-style insights from retrieved context and similar analysis memory, including:

- clause type identification
- similar cases found
- precedent summary
- historical risk level
- typical winning side in disputes
- recommended modification

If no similar memory is available, it says so explicitly.

### 7. Outcome Simulation

The platform simulates:

- best case
- most likely case
- worst case

Each scenario includes:

- dispute probability
- estimated financial exposure in INR
- time to resolution in months
- key trigger
- one preventive contract change

It also returns:

- overall risk score
- go / no-go recommendation
- highest-priority clause to fix

### 8. Chat and Report Export

- Contract-aware chatbot for follow-up legal questions
- downloadable PDF report for sharing and documentation
- persistent browser-side history for past analyses

## Product Experience

The frontend is designed as a premium legal-tech experience rather than a generic dashboard:

- bold landing page and upgraded visual system
- animated onboarding and transitions with Framer Motion
- responsive analysis dashboard
- history sidebar for saved reports
- severity-aware cards and filters
- export menu and chat assistance in the same workflow

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Framer Motion
- Lucide React
- Custom CSS design system

### Backend

- FastAPI
- Uvicorn
- Groq API
- pypdf
- python-doctr
- sentence-transformers
- scikit-learn
- FAISS
- PyTorch ecosystem
- ReportLab
- WeasyPrint

## Project Structure

```text
ContractIQ/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   `-- endpoints/
|   |   |       `-- analysis.py
|   |   |-- services/
|   |   |   |-- llm.py
|   |   |   |-- logic.py
|   |   |   |-- ml_service.py
|   |   |   |-- ocr.py
|   |   |   `-- report_generator.py
|   |   `-- schemas.py
|   |-- main.py
|   `-- requirements.txt
|-- public/
|-- src/
|   |-- app/
|   |   |-- globals.css
|   |   `-- page.tsx
|   `-- components/
|       |-- Chatbot.tsx
|       |-- ContextInput.tsx
|       |-- Dashboard.tsx
|       |-- ExportMenu.tsx
|       |-- Features.tsx
|       |-- Header.tsx
|       |-- Hero.tsx
|       |-- HistorySidebar.tsx
|       `-- UploadZone.tsx
|-- start_quick.bat
|-- package.json
`-- README.md
```

## End-to-End Flow

```text
User Upload
  -> OCR / PDF Text Extraction
  -> Clause Segmentation
  -> Rule-Based Risk Checks
  -> Semantic Risk Matching
  -> LLM Explanation Layer
  -> Self-Reflective Verdicts
  -> Causal Analysis
  -> Clause Debate
  -> Memory / Precedent Insight
  -> Outcome Simulation
  -> Dashboard + Chat + PDF Export
```

## Local Setup

### Requirements

- Node.js 18+
- Python 3.10+
- Groq API key

### Environment Variables

Create a `backend/.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=replace_with_a_long_random_secret
DATABASE_URL=sqlite:///./contractiq.db
CORS_ORIGINS=http://localhost:3000,https://contract-iq-xi.vercel.app
ACCESS_TOKEN_EXPIRE_MINUTES=720
```

Create a frontend `.env.local` file when your backend is not running on the default local URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If you are running optional retrieval, vector memory, or external deployment layers later, add those separately based on your deployment setup.

### Quick Start on Windows

```powershell
.\start_quick.bat
```

This launches:

- backend at `http://localhost:8000`
- frontend at `http://localhost:3000`

### Manual Setup

#### Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend

```powershell
npm install
npm run dev
```

## Useful Commands

```powershell
# frontend
npm run dev
npm run build
npm run lint

# backend
cd backend
py -m compileall .
python main.py
```

## Output Types Returned by the Backend

The analysis pipeline can return:

- `risks`
- `summary`
- `explanation`
- `negotiation_email`
- `legal_verdicts`
- `causal_analyses`
- `clause_debates`
- `memory_insights`
- `outcome_simulation`

This makes the platform suitable for:

- UI dashboards
- downloadable reports
- chat-assisted review
- future audit trails or clause memory systems

## Security and Privacy Notes

ContractIQ is built with a privacy-first direction:

- login and signup are backed by JWT authentication
- contract analysis, chat, and PDF export routes are protected
- backend CORS origins are environment-driven instead of open by default
- frontend and backend send security headers for safer browser behavior
- uploaded files are processed temporarily
- local history is scoped to the signed-in user in the browser
- contract analysis is geared toward minimizing long-term file retention
- file validation and upload limits reduce unsafe input handling

That said, this is still an AI-assisted review tool, not a substitute for licensed legal advice in high-stakes matters.

## DevSecOps Baseline

The repository includes a first production-readiness layer:

- GitHub Actions CI for frontend lint/build and backend compile checks
- CodeQL scanning for Python and TypeScript
- scheduled security workflow with Bandit, pip-audit, and npm audit
- Dependabot updates for npm, pip, and GitHub Actions
- `SECURITY.md` for vulnerability reporting
- environment examples for local and deployed setups

## Current Strengths

- rich reasoning coverage beyond basic clause extraction
- strong demo value for legal-tech portfolios, hackathons, and startup pitches
- modern frontend experience
- structured outputs that can be expanded into enterprise workflows

## Recommended Next Upgrades

- real vector database integration for precedent memory
- citation-backed Indian case retrieval
- clause redlining suggestions inline in the document
- multi-contract comparison workspace
- team collaboration and shared report links
- billing, usage limits, and organization-level history

## Disclaimer

ContractIQ is an AI legal-risk assistant for preliminary review and decision support. It should not be treated as a replacement for a qualified advocate or law firm, especially for high-value, regulated, or litigation-sensitive contracts.

## Author

Built by [Kshitij Sharma](https://github.com/kshitij730)

If you want to improve ContractIQ further, strong next directions are:

1. real legal memory retrieval with embeddings and citations
2. clause redlining and suggested rewrite generation
3. multi-user SaaS features with auth and saved workspaces
