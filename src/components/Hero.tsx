"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles, ShieldCheck, AlertTriangle, Clock3 } from "lucide-react";

interface HeroProps {
    onStart: () => void;
}

const riskRows = [
    { label: "Net 90 payment window", tag: "Cashflow", tone: "#f6b73c" },
    { label: "Immediate termination", tag: "Critical", tone: "#ff6b6b" },
    { label: "Broad IP transfer", tag: "Hidden", tone: "#62d7ff" },
];

export function Hero({ onStart }: HeroProps) {
    return (
        <section style={{ position: 'relative', paddingTop: '72px' }}>
            <div className="container">
                <div className="hero-shell">
                    <motion.div
                        className="hero-copy"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65 }}
                    >
                        <div className="hero-badge">
                            <Sparkles style={{ width: 16, height: 16 }} />
                            AI contract review for freelancers and small teams
                        </div>

                        <h1 className="hero-title">
                            Contracts, decoded before they <span className="serif-accent text-gradient">cost you.</span>
                        </h1>

                        <p className="hero-subtitle">
                            Upload an agreement, explain what you were promised, and ContractIQ turns the legal fog into a safety score, red flags, and a negotiation-ready response.
                        </p>

                        <div className="hero-actions">
                            <button
                                onClick={onStart}
                                className="btn btn-primary"
                                style={{ fontSize: '1.02rem', padding: '1rem 1.55rem' }}
                            >
                                <FileText style={{ width: 20, height: 20 }} />
                                <span>Analyze My Contract</span>
                                <ArrowRight style={{ width: 20, height: 20 }} />
                            </button>

                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn btn-secondary"
                                style={{ fontSize: '1.02rem', padding: '1rem 1.55rem' }}
                            >
                                See how it protects you
                            </button>
                        </div>

                        <div className="trust-row">
                            <div className="trust-pill">
                                <strong>15MB</strong>
                                <span>PDF/image uploads</span>
                            </div>
                            <div className="trust-pill">
                                <strong>3 layers</strong>
                                <span>Rules, ML, LLM insight</span>
                            </div>
                            <div className="trust-pill">
                                <strong>Private</strong>
                                <span>No long-term storage</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, x: 36, rotate: 1 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ delay: 0.15, duration: 0.75, ease: "easeOut" }}
                    >
                        <div className="contract-preview">
                            <div className="preview-topbar">
                                <div className="window-dots"><span /><span /><span /></div>
                                <span style={{ color: '#a7b8b2', fontSize: '0.78rem', fontWeight: 700 }}>LIVE RISK SCAN</span>
                            </div>

                            <div className="preview-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.4rem' }}>
                                    <div>
                                        <p style={{ color: '#6f827c', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Service Agreement.pdf</p>
                                        <h3 style={{ fontSize: '1.55rem', marginTop: '0.35rem' }}>Clause intelligence</h3>
                                    </div>
                                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(25, 198, 167, 0.14)', display: 'grid', placeItems: 'center', border: '1px solid rgba(25, 198, 167, 0.24)' }}>
                                        <ShieldCheck style={{ color: '#19c6a7', width: 24, height: 24 }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.85rem', alignItems: 'center', marginBottom: '1.2rem' }}>
                                    <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,249,239,0.08)', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: '12%' }}
                                            animate={{ width: '42%' }}
                                            transition={{ duration: 1.1, delay: 0.55 }}
                                            style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #ff6b6b, #f6b73c)' }}
                                        />
                                    </div>
                                    <span style={{ fontWeight: 800, color: '#f6b73c' }}>42/100</span>
                                </div>

                                {riskRows.map((risk, index) => (
                                    <motion.div
                                        className="risk-line"
                                        key={risk.label}
                                        initial={{ opacity: 0, x: 18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.12 }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <AlertTriangle style={{ width: 18, height: 18, color: risk.tone }} />
                                            <span style={{ color: '#fff9ef', fontWeight: 600 }}>{risk.label}</span>
                                        </div>
                                        <span className="risk-tag" style={{ background: `${risk.tone}1f`, color: risk.tone, border: `1px solid ${risk.tone}40` }}>
                                            {risk.tag}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            className="floating-score"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Clock3 style={{ width: 18, height: 18, color: '#0d1b1a', marginBottom: 8 }} />
                            <strong>30s</strong>
                            <span style={{ fontSize: '0.75rem', color: '#40524c', fontWeight: 700 }}>to negotiation clarity</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
