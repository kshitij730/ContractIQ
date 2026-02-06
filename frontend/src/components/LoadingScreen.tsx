"use client";

import { motion } from "framer-motion";
import { FileText, Search, Brain, CheckCircle2, Sparkles } from "lucide-react";

interface LoadingScreenProps {
    step: string;
}

const steps = [
    { icon: FileText, text: "Extracting text from document...", color: "#6366f1" },
    { icon: Search, text: "Parsing contract clauses...", color: "#8b5cf6" },
    { icon: Brain, text: "Comparing with your expectations...", color: "#ec4899" },
    { icon: Sparkles, text: "Generating AI insights...", color: "#f59e0b" },
];

export function LoadingScreen({ step }: LoadingScreenProps) {
    const currentStepIndex = steps.findIndex(s => step.includes(s.text.split('...')[0]));
    const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)',
                zIndex: 9999
            }}
        >
            {/* Animated Background Particles */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -1000],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: '100%',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: `hsl(${240 + Math.random() * 60}, 70%, 60%)`,
                            boxShadow: `0 0 10px hsl(${240 + Math.random() * 60}, 70%, 60%)`
                        }}
                    />
                ))}
            </div>

            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3rem',
                maxWidth: '600px',
                padding: '2rem'
            }}>
                {/* Central Animated Logo */}
                <div style={{ position: 'relative' }}>
                    {/* Outer Rotating Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            border: '2px solid transparent',
                            borderTopColor: '#6366f1',
                            borderRightColor: '#8b5cf6'
                        }}
                    />

                    {/* Middle Counter-Rotating Ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            border: '2px solid transparent',
                            borderBottomColor: '#ec4899',
                            borderLeftColor: '#f59e0b'
                        }}
                    />

                    {/* Inner Pulsing Circle */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}
                    />

                    {/* Center Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'relative',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.5)'
                        }}
                    >
                        <Brain style={{ width: '48px', height: '48px', color: 'white' }} />
                    </motion.div>
                </div>

                {/* Progress Steps */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {steps.map((stepItem, index) => {
                        const Icon = stepItem.icon;
                        const isActive = index === activeStep;
                        const isCompleted = index < activeStep;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: isActive || isCompleted ? 1 : 0.3,
                                    x: 0,
                                    scale: isActive ? 1.05 : 1
                                }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.5rem',
                                    background: isActive
                                        ? 'rgba(99, 102, 241, 0.15)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '1rem',
                                    border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Progress Bar */}
                                {isActive && (
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            background: `linear-gradient(90deg, transparent, ${stepItem.color}20)`,
                                            zIndex: 0
                                        }}
                                    />
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: isCompleted
                                        ? 'linear-gradient(135deg, #10b981, #059669)'
                                        : isActive
                                            ? `linear-gradient(135deg, ${stepItem.color}, ${stepItem.color}dd)`
                                            : 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    zIndex: 1,
                                    boxShadow: isActive ? `0 4px 14px ${stepItem.color}40` : 'none'
                                }}>
                                    {isCompleted ? (
                                        <CheckCircle2 style={{ width: '20px', height: '20px', color: 'white' }} />
                                    ) : (
                                        <motion.div
                                            animate={isActive ? { rotate: 360 } : {}}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Icon style={{ width: '20px', height: '20px', color: 'white' }} />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Text */}
                                <div style={{
                                    flex: 1,
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <p style={{
                                        fontSize: '0.9375rem',
                                        fontWeight: isActive ? '600' : '500',
                                        color: isActive ? '#ffffff' : '#94a3b8',
                                        margin: 0
                                    }}>
                                        {stepItem.text}
                                    </p>
                                </div>

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: stepItem.color,
                                            boxShadow: `0 0 10px ${stepItem.color}`,
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Loading Text */}
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        textAlign: 'center'
                    }}
                >
                    <p style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#cbd5e1',
                        margin: 0,
                        marginBottom: '0.5rem'
                    }}>
                        Analyzing Your Contract
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#6366f1'
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
