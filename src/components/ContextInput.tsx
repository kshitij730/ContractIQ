"use client";

import { MessageSquare, BadgeCheck, Scale, WalletCards, ShieldAlert } from "lucide-react";

interface ContextInputProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

const prompts = [
    { icon: WalletCards, text: "Payment timing" },
    { icon: Scale, text: "Ownership/IP" },
    { icon: ShieldAlert, text: "Liability limits" },
];

export function ContextInput({ value, onChange, disabled }: ContextInputProps) {
    return (
        <div className="input-shell" style={{ width: '100%' }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 14, background: 'rgba(246, 183, 60, 0.14)', display: 'grid', placeItems: 'center', border: '1px solid rgba(246, 183, 60, 0.24)' }}>
                        <MessageSquare style={{ width: '18px', height: '18px', color: '#f6b73c' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff9ef' }}>
                            What were you promised?
                        </label>
                        <p style={{ color: '#6f827c', fontSize: '0.78rem', marginTop: 2 }}>
                            Your plain-English version helps us detect mismatches.
                        </p>
                    </div>
                </div>
                <BadgeCheck style={{ color: value.length > 60 ? '#19c6a7' : '#6f827c', width: 22, height: 22, flexShrink: 0 }} />
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="input-field"
                style={{
                    height: '205px',
                    resize: 'none',
                    fontSize: '0.95rem',
                    lineHeight: '1.72',
                    borderRadius: '1.1rem',
                    padding: '1.15rem'
                }}
                placeholder="Example: I will be paid $50/hr within 30 days. I keep ownership of my reusable tools. Either side must give 2 weeks notice before cancellation. Liability should be capped to project fees."
            />

            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginTop: '0.9rem' }}>
                {prompts.map((prompt) => (
                    <button
                        type="button"
                        key={prompt.text}
                        onClick={() => onChange(value ? `${value}\n${prompt.text}: ` : `${prompt.text}: `)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.55rem 0.7rem',
                            borderRadius: 999,
                            border: '1px solid rgba(255,249,239,0.1)',
                            background: 'rgba(255,249,239,0.045)',
                            color: '#a7b8b2',
                            cursor: 'pointer',
                            fontSize: '0.76rem',
                            fontWeight: 700
                        }}
                    >
                        <prompt.icon style={{ width: 14, height: 14, color: '#19c6a7' }} />
                        {prompt.text}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.85rem', color: '#6f827c', fontSize: '0.78rem' }}>
                <span>Tip: include payment, IP, termination, and liability expectations.</span>
                <span>{value.length} chars</span>
            </div>
        </div>
    );
}
