"use client";

import { motion } from "framer-motion";
import { BrainCircuit, FileSearch, Lock, MailCheck, ScanText, MessageCircleQuestion } from "lucide-react";
import type { CSSProperties } from "react";

const features = [
    {
        icon: ScanText,
        title: "Reads the real document",
        description: "Extracts text from PDFs and images, then turns dense clauses into reviewable signals.",
        color: "#19c6a7",
        metric: "PDF + OCR"
    },
    {
        icon: BrainCircuit,
        title: "Finds hidden imbalance",
        description: "Combines rule checks, semantic matching, and LLM reasoning to catch risk beyond keywords.",
        color: "#62d7ff",
        metric: "Hybrid AI"
    },
    {
        icon: FileSearch,
        title: "Reality-checks the deal",
        description: "Compares the legal text against what you thought you agreed to: pay, IP, liability, and exit terms.",
        color: "#f6b73c",
        metric: "Mismatch map"
    },
    {
        icon: MailCheck,
        title: "Turns risk into action",
        description: "Generates a polished negotiation email and exportable report you can actually use.",
        color: "#ff6b6b",
        metric: "Ready to send"
    },
    {
        icon: MessageCircleQuestion,
        title: "Ask follow-ups",
        description: "Use the contract-aware assistant to ask plain-English questions about your specific report.",
        color: "#c7f36a",
        metric: "Context chat"
    },
    {
        icon: Lock,
        title: "Privacy-minded workflow",
        description: "Uploads are processed temporarily and cleaned up after analysis, with history kept in your browser.",
        color: "#fff9ef",
        metric: "Local history"
    }
];

export function Features() {
    return (
        <section id="features" style={{ padding: '7rem 0', position: 'relative' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ maxWidth: '780px', marginBottom: '3.2rem' }}
                >
                    <p style={{ color: '#19c6a7', fontSize: '0.82rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                        Built for people who cannot afford contract surprises
                    </p>
                    <h2 style={{ fontSize: 'clamp(2.35rem, 5vw, 4.8rem)' }}>
                        A sharper way to review the terms hiding in plain sight.
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#a7b8b2', lineHeight: 1.8, marginTop: '1.15rem', maxWidth: '680px' }}>
                        ContractIQ is designed to make the risk obvious, the explanation useful, and the next step painless.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))',
                    gap: '1.15rem'
                }}>
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="glass-panel feature-card"
                            style={{
                                '--feature-glow': `${feature.color}26`,
                                padding: '1.5rem',
                                borderRadius: '1.45rem'
                            } as CSSProperties}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '2.2rem' }}>
                                <div style={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: 18,
                                    background: `${feature.color}18`,
                                    border: `1px solid ${feature.color}35`,
                                    display: 'grid',
                                    placeItems: 'center'
                                }}>
                                    <feature.icon style={{ width: 26, height: 26, color: feature.color }} />
                                </div>
                                <span style={{ color: feature.color, fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {feature.metric}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '1.32rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                            <p style={{ fontSize: '0.93rem', color: '#a7b8b2', lineHeight: 1.72 }}>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
