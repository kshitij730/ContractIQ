"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Github, History, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface HeaderProps {
    onHistoryClick: () => void;
}

export function Header({ onHistoryClick }: HeaderProps) {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

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
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit', textDecoration: 'none' }}>
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
                    </Link>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="desktop-nav" style={{ display: 'flex', gap: '1.25rem' }}>
                            <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a7b8b2', textDecoration: 'none' }}>Features</a>
                            <a href="#how-it-works" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a7b8b2', textDecoration: 'none' }}>Workflow</a>
                            <a href="#security" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a7b8b2', textDecoration: 'none' }}>Security</a>
                        </div>

                        {!isLoading && user ? (
                            <>
                                <div className="desktop-nav" style={{
                                    padding: '0.45rem 0.8rem',
                                    borderRadius: '999px',
                                    background: 'rgba(25, 198, 167, 0.11)',
                                    border: '1px solid rgba(25, 198, 167, 0.24)',
                                    color: '#9ef4e4',
                                    fontSize: '0.8rem',
                                    fontWeight: 700
                                }}>
                                    {user.company || user.full_name}
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

                                <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.83rem', padding: '0.68rem 0.95rem', borderRadius: '999px' }}>
                                    <LayoutDashboard style={{ width: '16px', height: '16px' }} />
                                    <span>Workspace</span>
                                </Link>

                                <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.83rem', padding: '0.68rem 0.95rem', borderRadius: '999px' }}>
                                    <LogOut style={{ width: '16px', height: '16px' }} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-secondary" style={{ fontSize: '0.83rem', padding: '0.68rem 0.95rem', borderRadius: '999px' }}>
                                    <span>Login</span>
                                </Link>
                                <Link href="/signup" className="btn btn-primary" style={{ fontSize: '0.83rem', padding: '0.68rem 0.95rem', borderRadius: '999px' }}>
                                    <span>Start Free</span>
                                    <ArrowRight style={{ width: '14px', height: '14px' }} />
                                </Link>
                            </>
                        )}

                        <a
                            href="https://github.com/kshitij730/ContractIQ"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary desktop-nav"
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
