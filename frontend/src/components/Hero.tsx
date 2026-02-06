"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

interface HeroProps {
    onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '72px',
            position: 'relative'
        }}>
            <div className="container">
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '4rem 0'
                }}>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '9999px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            marginBottom: '2rem'
                        }}
                    >
                        <Sparkles style={{ width: '16px', height: '16px', color: '#6366f1' }} />
                        <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#818cf8'
                        }}>
                            AI-Powered Legal Safety
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.03em'
                        }}
                    >
                        Don't sign what you{' '}
                        <br />
                        <span className="text-gradient">
                            don't understand.
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: '1.25rem',
                            lineHeight: '1.8',
                            color: '#94a3b8',
                            marginBottom: '3rem',
                            maxWidth: '700px',
                            margin: '0 auto 3rem'
                        }}
                    >
                        Upload any contract and tell us what you <em>think</em> the deal is.
                        ContractIQ highlights every discrepancy, hidden risk, and unfair clause instantly.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <button
                            onClick={onStart}
                            className="btn btn-primary"
                            style={{
                                fontSize: '1.0625rem',
                                padding: '1rem 2rem'
                            }}
                        >
                            <FileText style={{ width: '20px', height: '20px' }} />
                            <span>Analyze Contract</span>
                            <ArrowRight style={{ width: '20px', height: '20px' }} />
                        </button>

                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn btn-secondary"
                            style={{
                                fontSize: '1.0625rem',
                                padding: '1rem 2rem'
                            }}
                        >
                            Explore Features
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            marginTop: '4rem',
                            display: 'flex',
                            gap: '2rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            fontSize: '0.875rem',
                            color: '#64748b'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#10b981'
                            }} />
                            <span>No signup required</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#10b981'
                            }} />
                            <span>Results in 30 seconds</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#10b981'
                            }} />
                            <span>Privacy first</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
