import React from 'react';

/**
 * TipTapContent
 * Renders HTML produced by the TipTap editor in the public-facing viewer.
 * The `.tiptap-content` CSS class mirrors the `.ae-editor--tiptap` editor styles
 * so both surfaces look identical.
 */
interface Props {
    html:       string;
    className?: string;
}

export default function TipTapContent({ html, className = '' }: Props) {
    if (!html) return null;
    return (
        <div
            className={`tiptap-content ${className}`.trim()}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
