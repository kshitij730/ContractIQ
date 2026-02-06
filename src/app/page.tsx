"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { UploadZone } from "@/components/UploadZone";
import { ContextInput } from "@/components/ContextInput";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Dashboard } from "@/components/Dashboard";
import { HistorySidebar, saveToHistory } from "@/components/HistorySidebar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface Risk {
  category: string;
  severity: string;
  finding: string;
  expectation_check: string;
}

interface AnalysisResult {
  score: number;
  risks: Risk[];
  contract_summary: string;
  explanation?: string;
  negotiation_email?: string;
}

export default function Home() {
  const [stage, setStage] = useState<"landing" | "input" | "loading" | "results">("landing");
  const [file, setFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleStart = () => {
    setStage("input");
  };

  const analyzeContract = async () => {
    if (!file || !explanation) return;
    // ... (rest of analyzeContract)

    setStage("loading");
    setLoadingStep("Extracting text from document...");

    setTimeout(() => setLoadingStep("Parsing contract clauses..."), 1200);
    setTimeout(() => setLoadingStep("Comparing with your expectations..."), 2800);
    setTimeout(() => setLoadingStep("Generating AI insights..."), 4500);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_explanation", explanation);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const res = await fetch(`${baseUrl}/api/v1/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data.analysis);
      setStage("results");

      // Save to history
      saveToHistory(
        file.name,
        data.analysis.score,
        data.analysis.explanation?.substring(0, 150) + "...",
        data.analysis
      );

    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your connection or try again later.");
      setStage("input");
    }
  };

  const resetAnalysis = () => {
    setStage("landing");
    setFile(null);
    setExplanation("");
    setResult(null);
  };

  const handleLoadHistory = (id: string) => {
    const fullData = localStorage.getItem(`contractiq_full_${id}`);
    if (fullData) {
      try {
        const item = JSON.parse(fullData);
        setResult(item);
        setStage("results");
      } catch (err) {
        console.error("Failed to parse history item", err);
      }
    } else {
      // Fallback for items saved before full data saving was added
      const saved = localStorage.getItem('contractiq_history');
      if (saved) {
        const history = JSON.parse(saved);
        const item = history.find((h: any) => h.id === id);
        if (item) {
          alert("This is an older history item without full details. Only newer analyses can be reloaded fully.");
        }
      }
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
      />

      <main style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          {stage === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onStart={handleStart} />
              <Features />
            </motion.div>
          )}

          {stage === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ paddingTop: '120px', paddingBottom: '80px' }}
            >
              <div className="container" style={{ maxWidth: '1100px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <Sparkles style={{ width: '14px', height: '14px', color: '#6366f1' }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#818cf8' }}>
                      Step 1 of 2
                    </span>
                  </motion.div>

                  <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                  }}>
                    Upload & Explain
                  </h2>
                  <p style={{
                    fontSize: '1.0625rem',
                    color: '#94a3b8',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    Upload your contract and describe what you believe the deal is in plain English.
                  </p>
                </div>

                {/* Two Column Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
                  gap: '2rem',
                  marginBottom: '2.5rem'
                }}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '1.5rem' }}
                  >
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}>1</span>
                      Upload Contract
                    </h3>
                    <UploadZone file={file} setFile={setFile} />
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel"
                    style={{ padding: '2rem', borderRadius: '1.5rem' }}
                  >
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}>2</span>
                      Describe the Deal
                    </h3>
                    <ContextInput value={explanation} onChange={setExplanation} />
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <button
                    onClick={() => setStage("landing")}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft style={{ width: '18px', height: '18px' }} />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={analyzeContract}
                    disabled={!file || !explanation}
                    className="btn btn-primary"
                    style={{
                      opacity: (!file || !explanation) ? 0.5 : 1,
                      cursor: (!file || !explanation) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>Analyze Contract</span>
                    <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === "loading" && (
            <LoadingScreen step={loadingStep} />
          )}

          {stage === "results" && result && (
            <Dashboard
              score={result.score}
              risks={result.risks}
              explanation={result.explanation || "No explanation available."}
              email={result.negotiation_email || "No email generated."}
              onReset={resetAnalysis}
            />
          )}
        </AnimatePresence>
      </main>

      {stage === "landing" && <Footer />}
    </>
  );
}
