# ContractIQ - Advanced AI Contract Safety & Discrepancy Detector

**ContractIQ** is a state-of-the-art SaaS platform designed to protect freelancers, small businesses, and individuals from unfair legal terms. By leveraging a **Hybrid Intelligence Engine**, it identifies discrepancies between your verbal agreements and the actual legalese in contracts, providing a comprehensive safety analysis in seconds.

---

## 🌐 Live Deployment
- **Frontend**: [contract-iq.vercel.app](https://contract-cahqhaft6-kshitij730s-projects.vercel.app/)
- **Backend API**: [huggingface.co/spaces/kshitij230/contract-iq-api](https://kshitij230-contract-iq-api.hf.space)

---

## 🧠 Core Intelligence System

ContractIQ operates on a unique **Triple-Layer Analysis Architecture** that ensures no risky clause goes undetected.

### 1. Document Extraction Layer (OCR)
Our system uses a sophisticated OCR pipeline to convert unstructured legal documents (PDFs, Images, Scans) into analysis-ready text.
- **Engine**: [Mindee docTR](https://github.com/mindee/doctr) (Document Text Recognition).
- **Technology**: Built on top of **TensorFlow/PyTorch** with state-of-the-art vision models (e.g., DBNet for detection and CRNN for recognition).
- **Capabilities**: Handles complex layouts, multi-column contracts, and distorted scans with high fidelity.
- **Fallback**: Includes a robust fallback mechanism for plain-text files and simulated environments to ensure zero downtime.

### 2. The Hybrid Risk Engine (`RiskEngine`)
The "Brain" of the application (located in `backend/app/services/logic.py`) combines two distinct methodologies:

#### **Deterministic Rule Engine (Precision)**
- Scans for hard-coded legal patterns and specific keywords.
- Targets high-impact clauses like **Unlimited Liability**, **Net 90+ Payment Terms**, and **Immediate Termination**.
- Compares these findings directly against your "Reality Check" (User Expectations).

#### **Neural Semantic Engine (Recall)**
- **Model**: `all-MiniLM-L6-v2` (Sentence-Transformers).
- **Function**: Converts every contract clause into a **384-dimensional vector embedding**.
- **Strategy**: Calculates **Cosine Similarity** between contract clauses and a vector database of "Risky Legal Patterns."
- **Benefit**: Detects risks even if the contract uses creative or evasive wording (e.g., "The client shall have the prerogative to dissolve this pact without prior intimation" is flagged as an immediate termination risk, even without the word "termination").

### 3. LLM Reasoning Layer (Insight)
Powered by **Groq (Llama-3.3-70b)**, our reasoning layer provides the "Why" and "What Next?"
- **Deep Explainer**: Translates legalese into plain English, explaining the real-world impact (e.g., "This IP clause means you can't reuse your own code for other clients").
- **Negotiation Autopilot**: Generates professional, firm, and legally-informed emails targeted at renegotiating the specific risks found during analysis.
- **Context-Aware Chat**: Our integrated chatbot knows the details of your specific contract and can answer questions like "Does this contract have a non-compete?"

---

## ✨ Key Features & UX Highlights

### 🎨 Premium Interface
- **Glassmorphism Dashboard**: Fully responsive UI designed with a premium, lab-inspired aesthetic.
- **Independent Sticky Sidebar**: Unified view of Safety Score and Identified Risks that stays in view as you read the AI assessment.
- **Animated Loading Experience**: Real-time progress updates with 60FPS Framer Motion animations.

### 🛠️ Tooling & Productivity
- **Risk Search & Filtering**: Instantly find specific risks or filter by severity (Critical, Severe, High, Medium).
- **Persistent History**: Every analysis is saved locally (Privacy First). Revisit any report via the global History sidebar in the header.
- **Privacy-First Design**: Contracts are processed in memory and never stored long-term on our servers. Analysis results stay in your browser.

---

## �️ Technology Stack Deep Dive

### **Backend (Python 3.10+)**
- **FastAPI**: Asynchronous web framework for high-throughput analysis.
- **Mindee docTR**: The OCR powerhouse for document parsing.
- **Sentence-Transformers**: Local ML model execution for neural risk detection.
- **Groq API**: Large Language Model orchestration for reasoning.
- **Uvicorn**: Lighting-fast ASGI server.

### **Frontend (Next.js 16)**
- **Next.js (App Router)**: React framework with server-side rendering capability.
- **Framer Motion**: For production-grade animations and gesture handling.
- **Lucide React**: Holistic set of beautifully crafted open-source icons.
- **Vanilla CSS**: Optimized, high-performance styling without heavy framework overhead.

---

## 🏗️ Project Architecture

```bash
ContractAI/
├── frontend/
│   ├── src/components/
│   │   ├── Dashboard.tsx        # Dynamic results engine
│   │   ├── HistorySidebar.tsx  # localStorage persistence layer
│   │   ├── ChatBot.tsx          # Contextual legal assistant
│   │   └── RiskCard.tsx         # Severity-aware risk visualizer
│   └── src/app/globals.css      # Custom design system tokens
├── backend/
│   ├── app/services/
│   │   ├── ocr.py               # Document processing (docTR)
│   │   ├── ml_service.py        # Neural vector embedding logic
│   │   ├── logic.py             # Rule-based vs ML hybrid engine
│   │   └── llm.py               # Groq Llama-3 integration layer
│   └── main.py                  # API orchestration
└── start_quick.bat              # Zero-config startup script
```

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+
- Node.js 18+
- Groq API Key ([console.groq.com](https://console.groq.com/))

### 2. One-Command Setup (Windows)
```bash
.\start_quick.bat
```

### 3. Manual Installation
**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

**Frontend (Root):**
```bash
npm install
npm run dev
```

---

## 🛡️ Security & Privacy
ContractIQ is built with a **Privacy-First** philosophy.
- **Ephemeral Processing**: Documents are processed in-memory. We do not maintain a permanent database of your contracts.
- **Local History**: Your analysis history is stored in your browser's `localStorage`, not on our cloud.
- **Anonymization Ready**: Our LLM prompts are designed to focus on clauses, not personal data.

---

**Built with ❤️ for a fairer legal world.**
