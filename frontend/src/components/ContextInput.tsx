"use client";

import { MessageSquare } from "lucide-react";

interface ContextInputProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

export function ContextInput({ value, onChange, disabled }: ContextInputProps) {
    return (
        <div style={{ width: '100%' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <MessageSquare style={{ width: '18px', height: '18px', color: '#6366f1' }} />
                <label style={{
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#e2e8f0'
                }}>
                    Your Understanding of the Deal
                </label>
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="input-field"
                style={{
                    height: '180px',
                    resize: 'none',
                    fontSize: '0.9375rem',
                    lineHeight: '1.6'
                }}
                placeholder="e.g., I'm a freelancer getting paid $50/hr. Payment terms are Net 30. I own all the IP I create. Either party can cancel with 2 weeks notice..."
            />

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.75rem'
            }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Be as specific as possible about payment, IP, termination, and liability.
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#475569' }}>
                    {value.length} characters
                </span>
            </div>
        </div>
    );
}
