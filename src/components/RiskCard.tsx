"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertOctagon, Info, CheckCircle, Sparkles } from "lucide-react";

interface RiskCardProps {
    category: string;
    severity: string;
    finding: string;
    expectationCheck: string;
    index: number;
    confidence?: number;
}

export function RiskCard({ category, severity, finding, expectationCheck, index, confidence }: RiskCardProps) {
    const getIcon = () => {
        switch (severity.toLowerCase()) {
            case "severe":
            case "critical":
                return <AlertOctagon style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
            case "high":
                return <AlertTriangle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
            case "medium":
                return <Info style={{ width: '20px', height: '20px', color: '#eab308' }} />;
            default:
                return <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />;
        }
    };

    const getBorderColor = () => {
        switch (severity.toLowerCase()) {
            case "severe":
            case "critical":
                return "#ef4444";
            case "high":
                return "#f59e0b";
            case "medium":
                return "#eab308";
            default:
                return "#10b981";
        }
    };

    const getBadgeStyle = () => {
        switch (severity.toLowerCase()) {
            case "severe":
            case "critical":
                return {
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#fca5a5",
                    border: "1px solid rgba(239, 68, 68, 0.3)"
                };
            case "high":
                return {
                    background: "rgba(245, 158, 11, 0.15)",
                    color: "#fcd34d",
                    border: "1px solid rgba(245, 158, 11, 0.3)"
                };
            case "medium":
                return {
                    background: "rgba(234, 179, 8, 0.15)",
                    color: "#fde047",
                    border: "1px solid rgba(234, 179, 8, 0.3)"
                };
            default:
                return {
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#6ee7b7",
                    border: "1px solid rgba(16, 185, 129, 0.3)"
                };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel"
            style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                borderLeft: `3px solid ${getBorderColor()}`,
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getIcon()}
                    <h4 style={{
                        fontWeight: '600',
                        color: '#e2e8f0',
                        fontSize: '0.9375rem'
                    }}>
                        {category}
                    </h4>
                </div>

                <span style={{
                    ...getBadgeStyle(),
                    fontSize: '0.6875rem',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {severity}
                </span>
            </div>

            <p style={{
                color: '#cbd5e1',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                marginBottom: '0.75rem'
            }}>
                {finding}
            </p>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                background: expectationCheck === "AI Flagged"
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(0, 0, 0, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: expectationCheck === "AI Flagged"
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : 'none'
            }}>
                {expectationCheck === "AI Flagged" ? (
                    <>
                        <Sparkles style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                        <span style={{ color: '#818cf8', fontWeight: '600' }}>AI Neural Analysis</span>
                        {confidence && (
                            <span style={{
                                marginLeft: 'auto',
                                color: '#6366f1',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                            }}>
                                {Math.round(confidence * 100)}% Match
                            </span>
                        )}
                    </>
                ) : (
                    <>
                        <span style={{ color: '#64748b', fontWeight: '500' }}>Reality Check:</span>
                        <span style={{
                            color: expectationCheck === "Mismatch" ? "#fca5a5" : "#fcd34d",
                            fontWeight: '600'
                        }}>
                            {expectationCheck}
                        </span>
                    </>
                )}
            </div>
        </motion.div>
    );
}
