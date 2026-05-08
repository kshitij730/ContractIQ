"use client";

import { motion } from "framer-motion";
import { RiskCard } from "./RiskCard";
import { ChatBot } from "./Chatbot";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ExportMenu } from "./ExportMenu";
import { Gauge, Copy, BookOpen, Send, ArrowLeft, CheckCircle2, Search, Sparkles, AlertTriangle, Scale, BrainCircuit, Database, TrendingUp } from "lucide-react";
import { useState } from "react";

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

interface DashboardProps {
    score: number;
    risks: Risk[];
    legalVerdicts: LegalVerdict[];
    causalAnalyses: CausalAnalysis[];
    clauseDebates: ClauseDebate[];
    memoryInsights: MemoryInsight[];
    outcomeSimulation?: OutcomeSimulation;
    contractSummary: string;
    explanation: string;
    email: string;
    userExplanation: string;
    onReset: () => void;
}

export function Dashboard({ score, risks, legalVerdicts, causalAnalyses, clauseDebates, memoryInsights, outcomeSimulation, contractSummary, explanation, email, userExplanation, onReset }: DashboardProps) {
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSeverity, setFilterSeverity] = useState("all");

    const getScoreColor = (s: number) => {
        if (s > 80) return "#10b981";
        if (s > 50) return "#f59e0b";
        return "#ef4444";
    };

    const getScoreGradient = (s: number) => {
        if (s > 80) return "linear-gradient(135deg, #10b981, #059669)";
        if (s > 50) return "linear-gradient(135deg, #f59e0b, #d97706)";
        return "linear-gradient(135deg, #ef4444, #dc2626)";
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredRisks = risks.filter(risk => {
        const matchesSearch = risk.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
            risk.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = filterSeverity === "all" || risk.severity.toLowerCase() === filterSeverity.toLowerCase();
        return matchesSearch && matchesSeverity;
    });

    const getVerdictColor = (severity: string) => {
        if (severity === "critical") return "#ef4444";
        if (severity === "high") return "#f97316";
        if (severity === "medium") return "#f59e0b";
        return "#19c6a7";
    };

    const formatInr = (amount: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <div style={{
            paddingTop: '120px',
            paddingBottom: '80px',
            minHeight: '100vh'
        }}>
            <div className="container" style={{ maxWidth: '1400px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '3rem'
                    }}
                >
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Analysis Report
                        </h1>
                        <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
                            Here&apos;s what we found in your contract
                        </p>
                    </div>

                    <button
                        onClick={onReset}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ArrowLeft style={{ width: '18px', height: '18px' }} />
                        <span>New Analysis</span>
                    </button>
                </motion.div>

                {/* Summary Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        marginBottom: '2.5rem',
                        flexWrap: 'wrap'
                    }}
                >
                    <div className="glass-panel" style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        borderLeft: '4px solid #ef4444'
                    }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <Gauge style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Critical/Severe</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
                                {risks.filter(r => r.severity === 'Critical' || r.severity === 'Severe').length}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        borderLeft: '4px solid #f59e0b'
                    }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <AlertTriangle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>High Risk</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
                                {risks.filter(r => r.severity === 'High').length}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        borderLeft: '4px solid #eab308'
                    }}>
                        <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <BookOpen style={{ width: '20px', height: '20px', color: '#eab308' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Medium Risk</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
                                {risks.filter(r => r.severity === 'Medium').length}
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div className="dashboard-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '2rem'
                }}>
                    {/* Left Sidebar - Score & Risks */}
                    <div className="dashboard-sidebar" style={{ gridColumn: 'span 4' }}>
                        <div
                            className="custom-scrollbar"
                            style={{
                                position: 'sticky',
                                top: '100px',
                                maxHeight: 'calc(100vh - 140px)',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                paddingRight: '8px'
                            }}
                        >
                            {/* Score Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel"
                                style={{
                                    padding: '2.5rem',
                                    borderRadius: '1.5rem',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: getScoreGradient(score)
                                }} />

                                <Gauge style={{
                                    width: '32px',
                                    height: '32px',
                                    color: '#64748b',
                                    margin: '0 auto 1rem'
                                }} />

                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '1rem'
                                }}>
                                    Safety Score
                                </h3>

                                <div style={{
                                    fontSize: '4.5rem',
                                    fontWeight: '800',
                                    lineHeight: '1',
                                    color: getScoreColor(score),
                                    marginBottom: '0.5rem',
                                    fontFamily: 'Space Grotesk, sans-serif'
                                }}>
                                    {score}
                                </div>

                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b'
                                }}>
                                    out of 100 points
                                </p>

                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#94a3b8'
                                }}>
                                    {score > 80 && "Low risk - Contract looks fair"}
                                    {score > 50 && score <= 80 && "Medium risk - Review carefully"}
                                    {score <= 50 && "High risk - Negotiate changes"}
                                </div>
                            </motion.div>

                            <div style={{
                                padding: '1.25rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: '1rem',
                                textAlign: 'left',
                                flexShrink: 0
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Sparkles style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Primary Recommendation</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#e2e8f0', margin: 0, fontWeight: '500', lineHeight: '1.5' }}>
                                    {score > 80 && "The contract is generally favorable. You can proceed, but double-check any specific user expectations that were flagged."}
                                    {score > 50 && score <= 80 && "Significant risks identified. We recommend renegotiating the flagged clauses before signing."}
                                    {score <= 50 && "This contract contains critical imbalances. We strongly advise against signing without legal counsel and major revisions."}
                                </p>
                            </div>

                            {/* Risks List */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: 0
                                    }}>
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#ef4444'
                                        }} />
                                        Risks ({filteredRisks.length})
                                    </h3>

                                    {/* Search & Filter Bar */}
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ position: 'relative' }}>
                                            <Search style={{
                                                position: 'absolute',
                                                left: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '12px',
                                                color: '#64748b'
                                            }} />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(148, 163, 184, 0.1)',
                                                    borderRadius: '6px',
                                                    padding: '0.4rem 0.5rem 0.4rem 2rem',
                                                    fontSize: '0.75rem',
                                                    color: 'white',
                                                    width: '100px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                        <select
                                            value={filterSeverity}
                                            onChange={(e) => setFilterSeverity(e.target.value)}
                                            aria-label="Filter risks by severity"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(148, 163, 184, 0.1)',
                                                borderRadius: '6px',
                                                padding: '0.4rem 0.5rem',
                                                fontSize: '0.75rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="all">All</option>
                                            <option value="critical">Critical</option>
                                            <option value="severe">Severe</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {filteredRisks.map((risk, i) => (
                                        <RiskCard
                                            key={i}
                                            index={i}
                                            category={risk.category}
                                            severity={risk.severity}
                                            finding={risk.finding}
                                            expectationCheck={risk.expectation_check}
                                            confidence={risk.confidence}
                                        />
                                    ))}

                                    {filteredRisks.length === 0 && (
                                        <div className="glass-panel" style={{
                                            padding: '2rem',
                                            borderRadius: '1rem',
                                            textAlign: 'center'
                                        }}>
                                            <CheckCircle2 style={{
                                                width: '40px',
                                                height: '40px',
                                                color: '#10b981',
                                                margin: '0 auto 1rem'
                                            }} />
                                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                                No risks found.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content - AI Assessment & Actions */}
                    <div className="dashboard-main" style={{ gridColumn: 'span 8' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* AI Assessment */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-panel"
                                style={{
                                    padding: '2.5rem',
                                    borderRadius: '1.5rem'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '2rem',
                                    paddingBottom: '1.5rem',
                                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <BookOpen style={{ width: '24px', height: '24px', color: '#818cf8' }} />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            marginBottom: '0.25rem'
                                        }}>
                                            AI Assessment
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                            Powered by Llama-3 & Legal Knowledge Base
                                        </p>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.8',
                                    color: '#cbd5e1'
                                }}>
                                    <MarkdownRenderer content={explanation} />
                                </div>
                            </motion.div>

                            {/* Self-Reflective Legal Verdict */}
                            {legalVerdicts.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="glass-panel"
                                    style={{
                                        padding: '2.5rem',
                                        borderRadius: '1.5rem',
                                        border: '1px solid rgba(25, 198, 167, 0.22)'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        marginBottom: '2rem',
                                        paddingBottom: '1.5rem',
                                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, rgba(25, 198, 167, 0.2), rgba(246, 183, 60, 0.16))',
                                            border: '1px solid rgba(25, 198, 167, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Scale style={{ width: '24px', height: '24px', color: '#19c6a7' }} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                                Self-Reflective Legal Verdict
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                Draft analysis, senior-lawyer critique, then refined JSON verdict under Indian Contract Act 1872.
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {legalVerdicts.map((verdict, index) => {
                                            const color = getVerdictColor(verdict.severity);
                                            const needsReview = verdict.confidence < 0.7;

                                            return (
                                                <div
                                                    key={`${verdict.clause}-${index}`}
                                                    style={{
                                                        padding: '1.25rem',
                                                        borderRadius: '1rem',
                                                        background: 'rgba(0, 0, 0, 0.22)',
                                                        border: `1px solid ${color}33`
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                                                            <span style={{
                                                                padding: '0.28rem 0.55rem',
                                                                borderRadius: '999px',
                                                                background: `${color}1f`,
                                                                color,
                                                                fontSize: '0.7rem',
                                                                fontWeight: 800,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.06em'
                                                            }}>
                                                                {verdict.severity}
                                                            </span>
                                                            <span style={{
                                                                padding: '0.28rem 0.55rem',
                                                                borderRadius: '999px',
                                                                background: 'rgba(255, 249, 239, 0.06)',
                                                                color: '#a7b8b2',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 800,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.06em'
                                                            }}>
                                                                {verdict.risk_type.replace("_", " ")}
                                                            </span>
                                                            {needsReview && (
                                                                <span style={{ color: '#f6b73c', fontSize: '0.75rem', fontWeight: 800 }}>
                                                                    Human review advised
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span style={{ color: '#a7b8b2', fontSize: '0.8rem', fontWeight: 700 }}>
                                                            Confidence {Math.round(verdict.confidence * 100)}%
                                                        </span>
                                                    </div>

                                                    <blockquote style={{
                                                        margin: 0,
                                                        padding: '0.9rem 1rem',
                                                        borderLeft: `3px solid ${color}`,
                                                        background: 'rgba(255, 249, 239, 0.04)',
                                                        borderRadius: '0.75rem',
                                                        color: '#e2e8f0',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.65
                                                    }}>
                                                        {verdict.clause}
                                                    </blockquote>

                                                    <div style={{ display: 'grid', gap: '0.85rem', marginTop: '1rem' }}>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff9ef', fontSize: '0.86rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                                                                <BrainCircuit style={{ width: 15, height: 15, color }} />
                                                                Causal chain
                                                            </div>
                                                            <p style={{ color: '#a7b8b2', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
                                                                {verdict.causal_chain}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: '#fff9ef', fontSize: '0.86rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                                                                Specific fix
                                                            </div>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
                                                                {verdict.recommendation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {causalAnalyses.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.28 }}
                                    className="glass-panel"
                                    style={{ padding: '2.5rem', borderRadius: '1.5rem' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(98, 215, 255, 0.14)', border: '1px solid rgba(98, 215, 255, 0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BrainCircuit style={{ width: '22px', height: '22px', color: '#62d7ff' }} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Causal Legal Reasoning</h3>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Cause to legal basis, without hand-wavy warnings.</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {causalAnalyses.map((item, index) => (
                                            <div key={`${item.clause}-${index}`} style={{ padding: '1.1rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(98, 215, 255, 0.16)' }}>
                                                <p style={{ color: '#fff9ef', fontWeight: 700, marginBottom: '0.75rem' }}>{item.clause}</p>
                                                <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
                                                    <strong>Cause:</strong> {item.cause}{" "}
                                                    <strong>{"->"} Mechanism:</strong> {item.mechanism}{" "}
                                                    <strong>{"->"} Consequence:</strong> {item.consequence}{" "}
                                                    <strong>{"->"} Legal Basis:</strong> {item.legal_basis}
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.85rem', color: '#a7b8b2', fontSize: '0.8rem', fontWeight: 700 }}>
                                                    <span>Severity {item.severity}</span>
                                                    <span>Likelihood {Math.round(item.likelihood * 100)}%</span>
                                                    <span>Impact {Math.round(item.impact * 100)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {clauseDebates.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.31 }}
                                    className="glass-panel"
                                    style={{ padding: '2.5rem', borderRadius: '1.5rem' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(246, 183, 60, 0.14)', border: '1px solid rgba(246, 183, 60, 0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Scale style={{ width: '22px', height: '22px', color: '#f6b73c' }} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Two-Agent Clause Debate</h3>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Client-side defense vs exploitability attack, then a moderator verdict.</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {clauseDebates.map((item, index) => (
                                            <div key={`${item.clause}-${index}`} style={{ padding: '1.15rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(246, 183, 60, 0.16)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                    <p style={{ color: '#fff9ef', fontWeight: 700, margin: 0 }}>{item.clause}</p>
                                                    <span style={{ color: item.verdict === "REJECT" ? '#ef4444' : item.verdict === "NEGOTIATE" ? '#f6b73c' : '#19c6a7', fontWeight: 800 }}>
                                                        {item.verdict} · {item.risk_score}/100
                                                    </span>
                                                </div>
                                                <p style={{ color: '#cbd5e1', marginBottom: '0.55rem' }}><strong>Agent A:</strong> {item.agent_a_argument}</p>
                                                <p style={{ color: '#cbd5e1', marginBottom: '0.55rem' }}><strong>Agent B:</strong> {item.agent_b_argument}</p>
                                                {item.agreed_risks.length > 0 && <p style={{ color: '#a7b8b2', marginBottom: '0.45rem' }}><strong>Agreed risks:</strong> {item.agreed_risks.join("; ")}</p>}
                                                {item.disputed_interpretations.length > 0 && <p style={{ color: '#a7b8b2', marginBottom: '0.45rem' }}><strong>Disputed points:</strong> {item.disputed_interpretations.join("; ")}</p>}
                                                <p style={{ color: '#fff9ef', margin: 0 }}><strong>Negotiation leverage:</strong> {item.negotiation_leverage}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {(memoryInsights.length > 0 || outcomeSimulation) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.34 }}
                                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}
                                >
                                    {memoryInsights.length > 0 && (
                                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                                                <Database style={{ width: '22px', height: '22px', color: '#19c6a7' }} />
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Memory & Precedent Insight</h3>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                                {memoryInsights.map((item, index) => (
                                                    <div key={`${item.clause}-${index}`} style={{ padding: '0.95rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                        <p style={{ color: '#fff9ef', fontWeight: 700, marginBottom: '0.4rem' }}>{item.clause_type} clause</p>
                                                        <p style={{ color: '#cbd5e1', marginBottom: '0.4rem' }}>{item.precedent_summary}</p>
                                                        <p style={{ color: '#a7b8b2', marginBottom: '0.35rem' }}>Cases found: {item.similar_cases_found} · Typical winner: {item.winning_party_in_disputes}</p>
                                                        <p style={{ color: '#fff9ef', margin: 0 }}><strong>Fix:</strong> {item.recommended_modification}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {outcomeSimulation && (
                                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                                                <TrendingUp style={{ width: '22px', height: '22px', color: '#ff6b6b' }} />
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Outcome Simulation</h3>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                <span style={{ color: '#fff9ef', fontWeight: 800 }}>Overall {outcomeSimulation.overall_risk_score}/100</span>
                                                <span style={{ color: outcomeSimulation.go_no_go_recommendation === "REJECT" ? '#ef4444' : outcomeSimulation.go_no_go_recommendation === "NEGOTIATE" ? '#f6b73c' : '#19c6a7', fontWeight: 800 }}>
                                                    {outcomeSimulation.go_no_go_recommendation}
                                                </span>
                                            </div>
                                            <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}><strong>Top fix:</strong> {outcomeSimulation.highest_priority_clause_to_fix}</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {outcomeSimulation.scenarios.map((scenario) => (
                                                    <div key={scenario.scenario} style={{ padding: '0.95rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                                                            <strong style={{ color: '#fff9ef', textTransform: 'capitalize' }}>{scenario.scenario}</strong>
                                                            <span style={{ color: '#a7b8b2' }}>{Math.round(scenario.dispute_probability * 100)}% dispute · {scenario.time_to_resolution_months} mo</span>
                                                        </div>
                                                        <p style={{ color: '#cbd5e1', marginBottom: '0.35rem' }}>Exposure: {formatInr(scenario.estimated_financial_exposure_INR)}</p>
                                                        <p style={{ color: '#cbd5e1', marginBottom: '0.35rem' }}><strong>Trigger:</strong> {scenario.key_trigger}</p>
                                                        <p style={{ color: '#fff9ef', margin: 0 }}><strong>Prevention:</strong> {scenario.prevention}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Negotiation Email */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-panel"
                                style={{
                                    padding: '2.5rem',
                                    borderRadius: '1.5rem',
                                    border: '1px solid rgba(236, 72, 153, 0.2)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-50px',
                                    right: '-50px',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '2rem',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))',
                                            border: '1px solid rgba(236, 72, 153, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Send style={{ width: '24px', height: '24px', color: '#f472b6' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                            Negotiation Strategy
                                        </h3>
                                    </div>
                                </div>

                                <div style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.7',
                                    color: '#cbd5e1',
                                    whiteSpace: 'pre-wrap',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    {email}
                                </div>

                                <div style={{
                                    marginTop: '2rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <button
                                        onClick={handleCopyEmail}
                                        className="btn btn-primary"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy style={{ width: '18px', height: '18px' }} />
                                                <span>Copy Email</span>
                                            </>
                                        )}
                                    </button>
                                    <ExportMenu
                                        score={score}
                                        risks={risks}
                                        explanation={explanation}
                                        email={email}
                                    />
                                </div>
                            </motion.div>

                            {/* AI Chatbot */}
                            <ChatBot
                                analysis={{
                                    score,
                                    risks,
                                    legal_verdicts: legalVerdicts,
                                    causal_analyses: causalAnalyses,
                                    clause_debates: clauseDebates,
                                    memory_insights: memoryInsights,
                                    outcome_simulation: outcomeSimulation,
                                    contract_summary: contractSummary,
                                    explanation,
                                    negotiation_email: email
                                }}
                                userExplanation={userExplanation}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
