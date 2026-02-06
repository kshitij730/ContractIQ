import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const renderMarkdown = (text: string) => {
        // Split by newlines to handle paragraphs
        const lines = text.split('\n');

        return lines.map((line, index) => {
            if (!line.trim()) return <br key={index} />;

            // Process inline markdown
            let processedLine = line;
            const elements: React.ReactNode[] = [];
            let lastIndex = 0;

            // Bold: **text** or __text__
            const boldRegex = /(\*\*|__)(.*?)\1/g;
            // Italic: *text* or _text_
            const italicRegex = /(\*|_)(.*?)\1/g;
            // Code: `text`
            const codeRegex = /`([^`]+)`/g;
            // Links: [text](url)
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

            // Combine all matches
            const allMatches: Array<{ index: number, length: number, type: string, content: string, url?: string }> = [];

            let match: RegExpExecArray | null;
            while ((match = boldRegex.exec(line)) !== null) {
                allMatches.push({
                    index: match.index,
                    length: match[0].length,
                    type: 'bold',
                    content: match[2]
                });
            }

            while ((match = italicRegex.exec(line)) !== null) {
                // Skip if it's part of a bold
                const currentMatch = match; // Capture for inner scope
                const isBold = allMatches.some(m =>
                    m.type === 'bold' && currentMatch.index >= m.index && currentMatch.index < m.index + m.length
                );
                if (!isBold) {
                    allMatches.push({
                        index: match.index,
                        length: match[0].length,
                        type: 'italic',
                        content: match[2]
                    });
                }
            }

            while ((match = codeRegex.exec(line)) !== null) {
                allMatches.push({
                    index: match.index,
                    length: match[0].length,
                    type: 'code',
                    content: match[1]
                });
            }

            while ((match = linkRegex.exec(line)) !== null) {
                allMatches.push({
                    index: match.index,
                    length: match[0].length,
                    type: 'link',
                    content: match[1],
                    url: match[2]
                });
            }

            // Sort by index
            allMatches.sort((a, b) => a.index - b.index);

            // Build elements
            allMatches.forEach((m, i) => {
                // Add text before this match
                if (m.index > lastIndex) {
                    elements.push(line.substring(lastIndex, m.index));
                }

                // Add the formatted element
                switch (m.type) {
                    case 'bold':
                        elements.push(<strong key={`b-${index}-${i}`}>{m.content}</strong>);
                        break;
                    case 'italic':
                        elements.push(<em key={`i-${index}-${i}`}>{m.content}</em>);
                        break;
                    case 'code':
                        elements.push(
                            <code key={`c-${index}-${i}`} style={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.875em',
                                fontFamily: 'monospace',
                                color: '#818cf8'
                            }}>
                                {m.content}
                            </code>
                        );
                        break;
                    case 'link':
                        elements.push(
                            <a key={`l-${index}-${i}`} href={m.url} target="_blank" rel="noopener noreferrer" style={{
                                color: '#6366f1',
                                textDecoration: 'underline'
                            }}>
                                {m.content}
                            </a>
                        );
                        break;
                }

                lastIndex = m.index + m.length;
            });

            // Add remaining text
            if (lastIndex < line.length) {
                elements.push(line.substring(lastIndex));
            }

            // If no markdown found, just return the line
            if (elements.length === 0) {
                elements.push(line);
            }

            // Check for headings
            if (line.startsWith('### ')) {
                return <h3 key={index} style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '1rem', marginBottom: '0.5rem' }}>{elements.slice(1)}</h3>;
            } else if (line.startsWith('## ')) {
                return <h2 key={index} style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.25rem', marginBottom: '0.75rem' }}>{elements.slice(1)}</h2>;
            } else if (line.startsWith('# ')) {
                return <h1 key={index} style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '1.5rem', marginBottom: '1rem' }}>{elements.slice(1)}</h1>;
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                return <li key={index} style={{ marginLeft: '1.5rem', marginBottom: '0.25rem' }}>{elements.slice(1)}</li>;
            } else {
                return <p key={index} style={{ marginBottom: '0.75rem' }}>{elements}</p>;
            }
        });
    };

    return <div>{renderMarkdown(content)}</div>;
}
