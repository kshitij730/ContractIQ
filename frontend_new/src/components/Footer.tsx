"use client";

import { motion } from "framer-motion";
import { Shield, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            background: 'rgba(10, 14, 26, 0.5)',
            marginTop: '6rem'
        }}>
            <div className="container">
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    padding: '4rem 0 3rem'
                }}>
                    {/* Brand Column */}
                    <div style={{ maxWidth: '280px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
                            }}>
                                <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
                            </div>
                            <span style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                                Contract<span style={{ color: '#6366f1' }}>IQ</span>
                            </span>
                        </div>
                        <p style={{
                            fontSize: '0.9375rem',
                            color: '#64748b',
                            lineHeight: '1.6'
                        }}>
                            AI-powered contract analysis for freelancers and small businesses who can't afford expensive legal reviews.
                        </p>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: '#e2e8f0',
                            marginBottom: '1.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Product
                        </h4>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <li>
                                <a href="#features" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    How it Works
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#faq" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: '#e2e8f0',
                            marginBottom: '1.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Company
                        </h4>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <li>
                                <a href="#about" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#blog" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#contact" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: '#e2e8f0',
                            marginBottom: '1.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Legal
                        </h4>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <li>
                                <a href="#privacy" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#terms" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#security" style={{
                                    fontSize: '0.9375rem',
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                    paddingTop: '2rem',
                    paddingBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        margin: 0
                    }}>
                        © {new Date().getFullYear()} ContractIQ. All rights reserved.
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#64748b'
                    }}>
                        <span>Built with</span>
                        <Heart style={{
                            width: '14px',
                            height: '14px',
                            color: '#ef4444',
                            fill: '#ef4444'
                        }} />
                        <span>for transparency in contracts</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
