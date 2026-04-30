"use client";

import { motion } from "framer-motion";
import { Shield, Github, History, ArrowRight } from "lucide-react";

interface HeaderProps {
    onHistoryClick: () => void;
}

export function Header({ onHistoryClick }: HeaderProps) {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: 'rgba(7, 16, 15, 0.72)',
                backdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255, 249, 239, 0.08)'
            }}
        >
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px',
                    gap: '1rem'
                }}>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit', textDecoration: 'none' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            background: 'linear-gradient(135deg, #19c6a7 0%, #f6b73c 100%)',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 12px 28px rgba(25, 198, 167, 0.24)'
                        }}>
                            <Shield style={{ width: '22px', height: '22px', color: '#07100f' }} />
                        </div>
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            letterSpacing: '-0.04em'
                        }}>
                            Contract<span style={{ color: '#19c6a7' }}>IQ</span>
                        </span>
                    </a>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="desktop-nav" style={{ display: 'flex', gap: '1.25rem' }}>
                            <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a7b8b2', textDecoration: 'none' }}>Features</a>
                            <a href="#how-it-works" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a7b8b2', textDecoration: 'none' }}>Workflow</a>
                        </div>

                        <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onHistoryClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '0.68rem 0.95rem',
                                background: 'rgba(255, 249, 239, 0.06)',
                                border: '1px solid rgba(255, 249, 239, 0.12)',
                                borderRadius: '999px',
                                color: '#fff9ef',
                                fontSize: '0.83rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            <History style={{ width: '16px', height: '16px', color: '#19c6a7' }} />
                            <span>History</span>
                        </motion.button>

                        <a
                            href="https://github.com/kshitij730/ContractIQ"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.83rem', padding: '0.68rem 0.95rem', borderRadius: '999px' }}
                        >
                            <Github style={{ width: '16px', height: '16px' }} />
                            <span>GitHub</span>
                            <ArrowRight style={{ width: '14px', height: '14px' }} />
                        </a>
                    </nav>
                </div>
            </div>
        </motion.header>
    );
}
