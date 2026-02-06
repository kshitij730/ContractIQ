"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";

interface UploadZoneProps {
    file: File | null;
    setFile: (f: File | null) => void;
}

export function UploadZone({ file, setFile }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            border: `2px dashed ${isDragging ? '#6366f1' : 'rgba(148, 163, 184, 0.2)'}`,
                            borderRadius: '1.5rem',
                            padding: '3rem 2rem',
                            transition: 'all 0.3s ease',
                            background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                            transform: isDragging ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleChange}
                            accept=".pdf,.png,.jpg,.jpeg,.txt"
                        />

                        <div style={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <UploadCloud style={{
                                    width: '36px',
                                    height: '36px',
                                    color: isDragging ? '#6366f1' : '#94a3b8'
                                }} />
                            </div>

                            <div>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem',
                                    color: '#ffffff'
                                }}>
                                    {isDragging ? "Drop it here!" : "Upload Contract"}
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    maxWidth: '320px'
                                }}>
                                    Drag & drop your PDF or Image here, or click to browse
                                </p>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#475569',
                                    marginTop: '0.5rem'
                                }}>
                                    Supports: PDF, PNG, JPG, TXT
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            width: '100%',
                            padding: '1.5rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
                            }}>
                                <File style={{ width: '28px', height: '28px', color: 'white' }} />
                            </div>
                            <div>
                                <p style={{
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    marginBottom: '0.25rem',
                                    fontSize: '0.9375rem'
                                }}>
                                    {file.name}
                                </p>
                                <p style={{
                                    fontSize: '0.8125rem',
                                    color: '#818cf8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                }}>
                                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                                    Ready for analysis
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            style={{
                                padding: '0.5rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#94a3b8',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
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
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
