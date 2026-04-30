"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2, LockKeyhole, FileText, Image as ImageIcon } from "lucide-react";

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
        setIsDragging(e.type === "dragenter" || e.type === "dragover");
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
                            border: `1.5px dashed ${isDragging ? '#19c6a7' : 'rgba(255, 249, 239, 0.18)'}`,
                            borderRadius: '1.45rem',
                            padding: '2rem',
                            minHeight: 310,
                            transition: 'all 0.3s ease',
                            background: isDragging
                                ? 'linear-gradient(145deg, rgba(25,198,167,0.13), rgba(246,183,60,0.08))'
                                : 'linear-gradient(145deg, rgba(255,249,239,0.065), rgba(255,249,239,0.025))',
                            overflow: 'hidden'
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

                        <div style={{ position: 'absolute', top: -80, right: -70, width: 190, height: 190, borderRadius: '50%', background: 'rgba(25,198,167,0.14)', filter: 'blur(8px)' }} />

                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', gap: '1.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{
                                    width: '74px',
                                    height: '74px',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, rgba(25,198,167,0.22), rgba(246,183,60,0.14))',
                                    border: '1px solid rgba(255,249,239,0.12)',
                                    display: 'grid',
                                    placeItems: 'center'
                                }}>
                                    <UploadCloud style={{ width: '34px', height: '34px', color: isDragging ? '#19c6a7' : '#fff9ef' }} />
                                </div>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#a7b8b2', fontSize: '0.72rem', fontWeight: 800 }}>
                                    <LockKeyhole style={{ width: 13, height: 13, color: '#19c6a7' }} />
                                    TEMP PROCESSING
                                </span>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.55rem', marginBottom: '0.7rem', color: '#fff9ef' }}>
                                    {isDragging ? "Release to start analysis" : "Drop your contract here"}
                                </h3>
                                <p style={{ fontSize: '0.95rem', color: '#a7b8b2', maxWidth: '390px', lineHeight: 1.7 }}>
                                    Upload a PDF, scan, image, or text file. ContractIQ extracts the clause text and compares it against your expectations.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginTop: 'auto' }}>
                                {[{ icon: FileText, text: 'PDF' }, { icon: ImageIcon, text: 'PNG/JPG' }, { icon: File, text: 'TXT' }].map((item) => (
                                    <span key={item.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.68rem', borderRadius: 999, background: 'rgba(7,16,15,0.42)', border: '1px solid rgba(255,249,239,0.09)', color: '#a7b8b2', fontSize: '0.75rem', fontWeight: 800 }}>
                                        <item.icon style={{ width: 14, height: 14, color: '#f6b73c' }} />
                                        {item.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            width: '100%',
                            padding: '1.3rem',
                            background: 'linear-gradient(145deg, rgba(25,198,167,0.14), rgba(246,183,60,0.08))',
                            border: '1px solid rgba(25, 198, 167, 0.28)',
                            borderRadius: '1.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                            <div style={{
                                width: '58px',
                                height: '58px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, #19c6a7, #f6b73c)',
                                display: 'grid',
                                placeItems: 'center',
                                boxShadow: '0 12px 30px rgba(25, 198, 167, 0.2)',
                                flexShrink: 0
                            }}>
                                <File style={{ width: '28px', height: '28px', color: '#07100f' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 800, color: '#fff9ef', marginBottom: '0.25rem', fontSize: '0.94rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {file.name}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#9ef4e4', display: 'flex', alignItems: 'center', gap: '0.38rem' }}>
                                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                                    Ready for clause extraction
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            aria-label="Remove selected file"
                            style={{
                                padding: '0.55rem',
                                background: 'rgba(255, 249, 239, 0.08)',
                                border: '1px solid rgba(255, 249, 239, 0.1)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                color: '#a7b8b2',
                                display: 'flex',
                                flexShrink: 0
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
