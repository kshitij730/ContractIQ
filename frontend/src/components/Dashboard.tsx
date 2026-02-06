"use client";

import { motion } from "framer-motion";
import { RiskCard } from "./RiskCard";
import { ChatBot } from "./Chatbot";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ExportMenu } from "./ExportMenu";
import { Gauge, Copy, BookOpen, Send, ArrowLeft, CheckCircle2, Search, Filter, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
    score: number;
    risks: any[];
    explanation: string;
    email: string;
    onReset: () => void;
}

export function Dashboard({ score, risks, explanation, email, onReset }: DashboardProps) {
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
                            Here's what we found in your contract
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '2rem'
                }}>
                    {/* Left Sidebar - Score & Risks */}
                    <div style={{ gridColumn: 'span 4' }}>
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
                                    {score > 80 && "✅ Low risk - Contract looks fair"}
                                    {score > 50 && score <= 80 && "⚠️ Medium risk - Review carefully"}
                                    {score <= 50 && "🚨 High risk - Negotiate changes"}
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
                    <div style={{ gridColumn: 'span 8' }}>
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
                            <ChatBot />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
