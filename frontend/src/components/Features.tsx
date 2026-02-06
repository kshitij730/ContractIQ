"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Lock, TrendingUp } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "AI-Powered Analysis",
        description: "Advanced ML models detect hidden risks and unfair clauses instantly.",
        color: "#6366f1"
    },
    {
        icon: Zap,
        title: "Instant Results",
        description: "Get a comprehensive risk report in under 30 seconds.",
        color: "#f59e0b"
    },
    {
        icon: Lock,
        title: "Privacy First",
        description: "Your contracts are processed securely and never stored.",
        color: "#10b981"
    },
    {
        icon: TrendingUp,
        title: "Negotiation Ready",
        description: "Get AI-generated emails to negotiate better terms.",
        color: "#ec4899"
    }
];

export function Features() {
    return (
        <section id="features" style={{
            padding: '6rem 0',
            background: 'rgba(17, 24, 39, 0.3)'
        }}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '4rem',
                        maxWidth: '700px',
                        margin: '0 auto 4rem'
                    }}
                >
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Why ContractIQ?
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#94a3b8',
                        lineHeight: '1.7'
                    }}>
                        Built for freelancers and small businesses who can't afford expensive legal reviews.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                borderRadius: '1.5rem',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                                border: `1px solid ${feature.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <feature.icon style={{
                                    width: '28px',
                                    height: '28px',
                                    color: feature.color
                                }} />
                            </div>

                            {/* Content */}
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '0.75rem',
                                color: '#ffffff'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: '0.9375rem',
                                color: '#94a3b8',
                                lineHeight: '1.6'
                            }}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
