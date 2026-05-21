"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, FileText, Clock, ChevronRight, X } from "lucide-react";

interface AnalysisHistory {
    id: string;
    timestamp: number;
    fileName: string;
    score: number;
    summary: string;
}

interface FullAnalysisData {
    score: number;
    risks: Array<{
        category: string;
        severity: string;
        finding: string;
        expectation_check: string;
        confidence?: number;
    }>;
    legal_verdicts?: Array<{
        clause: string;
        risk_type: string;
        severity: string;
        causal_chain: string;
        confidence: number;
        recommendation: string;
    }>;
    causal_analyses?: Array<{
        clause: string;
        cause: string;
        mechanism: string;
        consequence: string;
        legal_basis: string;
        severity: string;
        likelihood: number;
        impact: number;
    }>;
    clause_debates?: Array<{
        clause: string;
        agent_a_argument: string;
        agent_b_argument: string;
        agreed_risks: string[];
        disputed_interpretations: string[];
        risk_score: number;
        verdict: string;
        negotiation_leverage: string;
    }>;
    memory_insights?: Array<{
        clause: string;
        clause_type: string;
        similar_cases_found: number;
        precedent_summary: string;
        historical_risk_level: string;
        winning_party_in_disputes: string;
        recommended_modification: string;
    }>;
    outcome_simulation?: {
        overall_risk_score: number;
        go_no_go_recommendation: string;
        highest_priority_clause_to_fix: string;
        scenarios: Array<{
            scenario: string;
            dispute_probability: number;
            estimated_financial_exposure_INR: number;
            time_to_resolution_months: number;
            key_trigger: string;
            prevention: string;
        }>;
    };
    contract_summary: string;
    explanation?: string;
    negotiation_email?: string;
}

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadHistory: (id: string) => void;
    userKey?: string;
}

const getHistoryStorageKey = (userKey?: string) => userKey ? `contractiq_history_${userKey}` : "contractiq_history";
const getFullStorageKey = (id: string, userKey?: string) => userKey ? `contractiq_full_${userKey}_${id}` : `contractiq_full_${id}`;

export function HistorySidebar({ isOpen, onClose, onLoadHistory, userKey }: HistorySidebarProps) {
    const [history, setHistory] = useState<AnalysisHistory[]>([]);
    const historyStorageKey = getHistoryStorageKey(userKey);

    useEffect(() => {
        const saved = localStorage.getItem(historyStorageKey);
        if (saved) {
            queueMicrotask(() => setHistory(JSON.parse(saved)));
        } else {
            queueMicrotask(() => setHistory([]));
        }
    }, [isOpen, historyStorageKey]);

    const deleteHistoryItem = (id: string) => {
        const updated = history.filter(item => item.id !== id);
        setHistory(updated);
        localStorage.setItem(historyStorageKey, JSON.stringify(updated));
        localStorage.removeItem(getFullStorageKey(id, userKey));
    };

    const clearAllHistory = () => {
        if (confirm('Are you sure you want to clear all history?')) {
            history.forEach((item) => localStorage.removeItem(getFullStorageKey(item.id, userKey)));
            setHistory([]);
            localStorage.removeItem(historyStorageKey);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 1000
                            }}
                        />

                        <motion.div
                            initial={{ x: -400 }}
                            animate={{ x: 0 }}
                            exit={{ x: -400 }}
                            transition={{ type: 'spring', damping: 25 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '380px',
                                background: 'rgba(17, 24, 39, 0.98)',
                                backdropFilter: 'blur(20px)',
                                borderRight: '1px solid rgba(148, 163, 184, 0.1)',
                                zIndex: 1001,
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <History style={{ width: '24px', height: '24px', color: '#19c6a7' }} />
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                                        Analysis History
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#94a3b8'
                                    }}
                                >
                                    <X style={{ width: '18px', height: '18px' }} />
                                </button>
                            </div>

                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '1rem'
                            }}>
                                {history.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem 1rem',
                                        color: '#64748b'
                                    }}>
                                        <FileText style={{ width: '48px', height: '48px', margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p style={{ fontSize: '0.9375rem' }}>No analysis history yet</p>
                                        <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                                            Your protected workspace history will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {history.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => {
                                                    onLoadHistory(item.id);
                                                    onClose();
                                                }}
                                                style={{
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    borderRadius: '0.75rem',
                                                    border: '1px solid rgba(148, 163, 184, 0.1)',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{
                                                            fontSize: '0.9375rem',
                                                            fontWeight: '600',
                                                            color: '#e2e8f0',
                                                            marginBottom: '0.25rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {item.fileName}
                                                        </h3>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontSize: '0.75rem',
                                                            color: '#64748b'
                                                        }}>
                                                            <Clock style={{ width: '12px', height: '12px' }} />
                                                            <span>{formatDate(item.timestamp)}</span>
                                                        </div>
                                                    </div>

                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <div style={{
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.375rem',
                                                            background: item.score > 80 ? 'rgba(16, 185, 129, 0.2)' : item.score > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                            color: item.score > 80 ? '#6ee7b7' : item.score > 50 ? '#fcd34d' : '#fca5a5',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700'
                                                        }}>
                                                            {item.score}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteHistoryItem(item.id);
                                                            }}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: '#64748b',
                                                                padding: '0.25rem'
                                                            }}
                                                        >
                                                            <Trash2 style={{ width: '14px', height: '14px' }} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p style={{
                                                    fontSize: '0.8125rem',
                                                    color: '#94a3b8',
                                                    margin: 0,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {item.summary}
                                                </p>

                                                <ChevronRight style={{
                                                    position: 'absolute',
                                                    right: '0.5rem',
                                                    bottom: '0.5rem',
                                                    width: '16px',
                                                    height: '16px',
                                                    color: '#64748b'
                                                }} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {history.length > 0 && (
                                <div style={{
                                    padding: '1rem',
                                    borderTop: '1px solid rgba(148, 163, 184, 0.1)'
                                }}>
                                    <button
                                        onClick={clearAllHistory}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '0.75rem',
                                            color: '#fca5a5',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Trash2 style={{ width: '16px', height: '16px' }} />
                                        <span>Clear All History</span>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export function saveToHistory(fileName: string, score: number, summary: string, fullData: FullAnalysisData, userKey?: string) {
    const id = Date.now().toString();
    const historyItem: AnalysisHistory = {
        id,
        timestamp: Date.now(),
        fileName,
        score,
        summary
    };

    const historyStorageKey = getHistoryStorageKey(userKey);
    const existing = localStorage.getItem(historyStorageKey);
    const history: AnalysisHistory[] = existing ? JSON.parse(existing) : [];
    history.unshift(historyItem);

    if (history.length > 50) {
        history.splice(50);
    }

    localStorage.setItem(historyStorageKey, JSON.stringify(history));
    localStorage.setItem(getFullStorageKey(id, userKey), JSON.stringify(fullData));

    return id;
}

export function getStoredAnalysis(id: string, userKey?: string) {
    return localStorage.getItem(getFullStorageKey(id, userKey));
}
