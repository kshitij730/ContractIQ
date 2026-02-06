"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";

const SUGGESTED_QUESTIONS = [
    "What does 'Net 90' payment terms mean?",
    "How does the AI detect hidden risks?",
    "What is unlimited liability and why is it risky?"
];

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your AI legal assistant. Ask me anything about your contract analysis or legal terms you don't understand."
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (question?: string) => {
        const messageText = question || input;
        if (!messageText.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: messageText }]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response (in production, call your backend)
        setTimeout(() => {
            let response = "";

            if (messageText.toLowerCase().includes("net 90")) {
                response = "Net 90 means the client has 90 days to pay you after receiving your invoice. This is quite long and can hurt your cash flow. Industry standard is usually Net 30 (30 days). You should negotiate for shorter payment terms.";
            } else if (messageText.toLowerCase().includes("hidden risks") || messageText.toLowerCase().includes("ai detect")) {
                response = "I use a hybrid of Rule-Based and Machine Learning (ML) analysis. While rules find specific terms, my Semantic Analysis Transformer model 'understands' the meaning of sentences. It detects risks that don't use exact keywords by comparing them to thousands of known risky clauses using high-dimensional vector embeddings.";
            } else if (messageText.toLowerCase().includes("terminate")) {
                response = "If the contract allows the client to 'terminate immediately without notice,' it means they can end the agreement at any time without warning or reason. This is very risky for you as a contractor because you have no job security. You should negotiate for at least 14-30 days notice.";
            } else if (messageText.toLowerCase().includes("unlimited liability")) {
                response = "Unlimited liability means there's no cap on how much you could be held financially responsible for if something goes wrong. This is extremely risky! You could lose personal assets. Always negotiate for a liability cap (e.g., limited to the contract value or a specific dollar amount).";
            } else {
                response = "That's a great question! Based on the contract analysis, I recommend reviewing the specific clause in question. If you need more detailed legal advice, consider consulting with a contract attorney. Is there a specific section of the contract you'd like me to explain?";
            }

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            position: 'fixed',
                            bottom: '2rem',
                            right: '2rem',
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            transition: 'transform 0.2s'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle style={{ width: '28px', height: '28px', color: 'white' }} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '2rem',
                            right: '2rem',
                            width: '420px',
                            maxWidth: 'calc(100vw - 4rem)',
                            height: '600px',
                            maxHeight: 'calc(100vh - 8rem)',
                            borderRadius: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1000,
                            overflow: 'hidden',
                            background: 'rgba(17, 24, 39, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
                            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                                }}>
                                    <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: '700', fontSize: '1.0625rem', color: '#ffffff' }}>AI Assistant</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ask me anything</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#94a3b8',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = '#94a3b8';
                                }}
                            >
                                <X style={{ width: '18px', height: '18px' }} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            background: 'rgba(10, 14, 26, 0.5)'
                        }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '0.875rem 1.125rem',
                                        borderRadius: '1rem',
                                        background: msg.role === "user"
                                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                            : 'rgba(255, 255, 255, 0.08)',
                                        color: 'white',
                                        fontSize: '0.9375rem',
                                        lineHeight: '1.6',
                                        boxShadow: msg.role === "user"
                                            ? '0 4px 14px rgba(99, 102, 241, 0.3)'
                                            : '0 2px 8px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                                >
                                    <div style={{
                                        padding: '0.875rem 1.125rem',
                                        borderRadius: '1rem',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        display: 'flex',
                                        gap: '0.375rem'
                                    }}>
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: '#94a3b8'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggested Questions */}
                            {messages.length === 1 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <p style={{
                                        fontSize: '0.8125rem',
                                        color: '#64748b',
                                        marginBottom: '0.75rem',
                                        fontWeight: '500'
                                    }}>
                                        Suggested questions:
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {SUGGESTED_QUESTIONS.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(q)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'rgba(99, 102, 241, 0.15)',
                                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                                    borderRadius: '0.75rem',
                                                    color: '#cbd5e1',
                                                    fontSize: '0.875rem',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
                                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                                }}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: '1.25rem',
                            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                            background: 'rgba(0, 0, 0, 0.3)'
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask a question..."
                                    className="input-field"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.9375rem'
                                    }}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '0.75rem 1.25rem',
                                        opacity: input.trim() ? 1 : 0.5,
                                        cursor: input.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <Send style={{ width: '18px', height: '18px' }} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
