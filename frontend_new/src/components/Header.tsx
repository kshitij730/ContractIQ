"use client";

import { motion } from "framer-motion";
import { Shield, Github, History } from "lucide-react";

interface HeaderProps {
    onHistoryClick: () => void;
}

export function Header({ onHistoryClick }: HeaderProps) {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
            style={{
                background: 'rgba(10, 14, 26, 0.8)',
                backdropFilter: 'blur(20px)'
            }}
        >
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px'
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
                        }}>
                            <Shield style={{ width: '22px', height: '22px', color: 'white' }} />
                        </div>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            fontFamily: 'Space Grotesk, sans-serif',
                            letterSpacing: '-0.02em'
                        }}>
                            Contract<span style={{ color: '#6366f1' }}>IQ</span>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'none', gap: '24px' }} className="md-flex">
                            <a href="#features" style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#94a3b8', textDecoration: 'none' }}>Features</a>
                            <a href="#how-it-works" style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#94a3b8', textDecoration: 'none' }}>How it Works</a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onHistoryClick}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: '10px',
                                    color: '#818cf8',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                <History style={{ width: '18px', height: '18px' }} />
                                <span>History</span>
                            </motion.button>

                            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
                                <Github style={{ width: '16px', height: '16px' }} />
                                <span>GitHub</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </motion.header>
    );
}
