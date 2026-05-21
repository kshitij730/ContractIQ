"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { UploadZone } from "@/components/UploadZone";
import { ContextInput } from "@/components/ContextInput";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Dashboard } from "@/components/Dashboard";
import { HistorySidebar, getStoredAnalysis, saveToHistory } from "@/components/HistorySidebar";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

interface Risk {
  category: string;
  severity: string;
  finding: string;
  expectation_check: string;
  confidence?: number;
}

interface LegalVerdict {
  clause: string;
  risk_type: string;
  severity: string;
  causal_chain: string;
  confidence: number;
  recommendation: string;
}

interface CausalAnalysis {
  clause: string;
  cause: string;
  mechanism: string;
  consequence: string;
  legal_basis: string;
  severity: string;
  likelihood: number;
  impact: number;
}

interface ClauseDebate {
  clause: string;
  agent_a_argument: string;
  agent_b_argument: string;
  agreed_risks: string[];
  disputed_interpretations: string[];
  risk_score: number;
  verdict: "SIGN" | "NEGOTIATE" | "REJECT";
  negotiation_leverage: string;
}

interface MemoryInsight {
  clause: string;
  clause_type: string;
  similar_cases_found: number;
  precedent_summary: string;
  historical_risk_level: string;
  winning_party_in_disputes: string;
  recommended_modification: string;
}

interface OutcomeScenario {
  scenario: "best" | "likely" | "worst";
  dispute_probability: number;
  estimated_financial_exposure_INR: number;
  time_to_resolution_months: number;
  key_trigger: string;
  prevention: string;
}

interface OutcomeSimulation {
  overall_risk_score: number;
  go_no_go_recommendation: "SIGN" | "NEGOTIATE" | "REJECT";
  highest_priority_clause_to_fix: string;
  scenarios: OutcomeScenario[];
}

interface AnalysisResult {
  score: number;
  risks: Risk[];
  legal_verdicts: LegalVerdict[];
  causal_analyses: CausalAnalysis[];
  clause_debates: ClauseDebate[];
  memory_insights: MemoryInsight[];
  outcome_simulation?: OutcomeSimulation;
  contract_summary: string;
  explanation?: string;
  negotiation_email?: string;
}

export default function Home() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [stage, setStage] = useState<"landing" | "input" | "loading" | "results">("landing");
  const [file, setFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (!user && stage !== "landing") {
      setStage("landing");
      setResult(null);
    }
  }, [user, stage]);

  const handleStart = () => {
    if (!user) {
      router.push("/signup");
      return;
    }
    setStage("input");
  };

  const analyzeContract = async () => {
    if (!file || !explanation || !token || !user) return;

    setStage("loading");
    setLoadingStep("Authenticating secure workspace...");

    setTimeout(() => setLoadingStep("Extracting text from document..."), 900);
    setTimeout(() => setLoadingStep("Parsing contract clauses..."), 1800);
    setTimeout(() => setLoadingStep("Comparing with your expectations..."), 3200);
    setTimeout(() => setLoadingStep("Generating AI insights..."), 4600);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_explanation", explanation);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const res = await fetch(`${baseUrl}/api/v1/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data.analysis);
      setStage("results");

      saveToHistory(
        file.name,
        data.analysis.score,
        data.analysis.explanation?.substring(0, 150) + "...",
        data.analysis,
        user.email
      );
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your connection or try again later.");
      setStage("input");
    }
  };

  const resetAnalysis = () => {
    setStage(user ? "input" : "landing");
    setFile(null);
    setExplanation("");
    setResult(null);
  };

  const handleLoadHistory = (id: string) => {
    const fullData = getStoredAnalysis(id, user?.email);
    if (fullData) {
      try {
        const item = JSON.parse(fullData);
        setResult(item);
        setStage("results");
      } catch (err) {
        console.error("Failed to parse history item", err);
      }
    } else {
      alert("This history item is no longer available in full detail.");
    }
  };

  return (
    <>
      <div className="bg-gradient-mesh" />
      <Header onHistoryClick={() => setIsHistoryOpen(true)} />

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadHistory={handleLoadHistory}
        userKey={user?.email}
      />

      <main style={{ position: "relative", minHeight: "100vh" }}>
        <AnimatePresence mode="wait">
          {stage === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onStart={handleStart} />
              <section id="security" className="container" style={{ paddingBottom: "2rem" }}>
                <div className="glass-panel security-banner">
                  <div>
                    <p className="hero-badge" style={{ marginBottom: "1rem" }}>
                      <ShieldCheck style={{ width: 16, height: 16 }} />
                      Product Security Layer
                    </p>
                    <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", marginBottom: "0.75rem" }}>
                      Secure workspace access, protected APIs, and DevSecOps guardrails built in.
                    </h2>
                    <p style={{ color: "var(--text-secondary)", maxWidth: 720 }}>
                      ContractIQ now ships with account-based access, protected analysis routes, CI checks, code scanning, dependency monitoring, and production security headers so the product feels sellable, not just impressive.
                    </p>
                  </div>
                  <div className="security-points">
                    <span>JWT auth</span>
                    <span>Protected exports</span>
                    <span>CodeQL + CI</span>
                    <span>Dependabot</span>
                  </div>
                </div>
              </section>
              <Features />
            </motion.div>
          )}

          {stage === "input" && user && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ paddingTop: "120px", paddingBottom: "80px" }}
            >
              <div className="container" style={{ maxWidth: "1100px" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      background: "rgba(25, 198, 167, 0.11)",
                      border: "1px solid rgba(25, 198, 167, 0.24)",
                      marginBottom: "1.5rem"
                    }}
                  >
                    <Sparkles style={{ width: "14px", height: "14px", color: "#19c6a7" }} />
                    <span style={{ fontSize: "0.8125rem", fontWeight: "700", color: "#9ef4e4" }}>
                      Secure Workspace for {user.company || user.full_name}
                    </span>
                  </motion.div>

                  <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                    Build Your Contract Reality Check
                  </h2>
                  <p style={{ fontSize: "1.0625rem", color: "#a7b8b2", maxWidth: "640px", margin: "0 auto" }}>
                    Upload the contract, capture your commercial understanding, and generate a secure, client-ready legal risk report.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: "2rem", borderRadius: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #19c6a7, #f6b73c)", fontSize: "0.875rem", fontWeight: "700" }}>1</span>
                      Upload Contract
                    </h3>
                    <UploadZone file={file} setFile={setFile} />
                  </motion.div>

                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: "2rem", borderRadius: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #19c6a7, #f6b73c)", fontSize: "0.875rem", fontWeight: "700" }}>2</span>
                      Describe the Deal
                    </h3>
                    <ContextInput value={explanation} onChange={setExplanation} />
                  </motion.div>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <button onClick={() => setStage("landing")} className="btn btn-secondary">
                    <ArrowLeft style={{ width: "18px", height: "18px" }} />
                    <span>Back</span>
                  </button>
                  <button onClick={analyzeContract} disabled={!file || !explanation} className="btn btn-primary" style={{ opacity: (!file || !explanation) ? 0.5 : 1, cursor: (!file || !explanation) ? "not-allowed" : "pointer" }}>
                    <span>Analyze Contract</span>
                    <ArrowRight style={{ width: "18px", height: "18px" }} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === "loading" && <LoadingScreen step={loadingStep} />}

          {stage === "results" && result && (
            <Dashboard
              score={result.score}
              risks={result.risks}
              legalVerdicts={result.legal_verdicts || []}
              causalAnalyses={result.causal_analyses || []}
              clauseDebates={result.clause_debates || []}
              memoryInsights={result.memory_insights || []}
              outcomeSimulation={result.outcome_simulation}
              contractSummary={result.contract_summary}
              explanation={result.explanation || "No explanation available."}
              email={result.negotiation_email || "No email generated."}
              userExplanation={explanation}
              onReset={resetAnalysis}
            />
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="auth-loading-overlay">
            <div className="glass-panel auth-loading-card">
              <Sparkles style={{ width: 20, height: 20, color: "var(--accent-primary)" }} />
              <span>Loading secure workspace...</span>
            </div>
          </div>
        )}
      </main>

      {stage === "landing" && <Footer />}
    </>
  );
}
