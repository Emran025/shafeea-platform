import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { ExternalLink, Trash2, Play } from 'lucide-react';

/* ── URL parsers ─────────────────────────────────────────────── */
function parseEmbedUrl(raw: string): { type: 'youtube'|'vimeo'|'twitter'|null; src: string; originalUrl: string } {
    const url = raw.trim();

    // YouTube
    const ytMatch =
        url.match(/youtu\.be\/([^?&\s]+)/) ||
        url.match(/youtube\.com\/watch\?v=([^&\s]+)/) ||
        url.match(/youtube\.com\/embed\/([^?&\s]+)/);
    if (ytMatch) {
        return {
            type: 'youtube',
            src:  `https://www.youtube.com/embed/${ytMatch[1]}?modestbranding=1&rel=0`,
            originalUrl: url,
        };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
        return {
            type: 'vimeo',
            src:  `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0`,
            originalUrl: url,
        };
    }

    // Twitter / X
    const twitterMatch = url.match(/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/);
    if (twitterMatch) {
        return {
            type: 'twitter',
            src:  `https://platform.twitter.com/embed/Tweet.html?id=${twitterMatch[1]}`,
            originalUrl: url,
        };
    }

    return { type: null, src: '', originalUrl: url };
}

export { parseEmbedUrl };

/* ── NodeView component ─────────────────────────────────────── */
export default function EmbedNodeView({ node, deleteNode }: NodeViewProps) {
    const { src, embedType, originalUrl } = node.attrs as {
        src: string; embedType: 'youtube'|'vimeo'|'twitter'; originalUrl: string;
    };
    const [hover, setHover] = useState(false);

    const typeLabel: Record<string, string> = {
        youtube: 'YouTube',
        vimeo:   'Vimeo',
        twitter: 'Twitter / X',
    };

    const aspectClass =
        embedType === 'twitter' ? 'ae-embed--twitter' : 'ae-embed--video';

    return (
        <NodeViewWrapper
            className="ae-embed-wrap"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            contentEditable={false}
        >
            <div className={`ae-embed-card ${aspectClass}`}>
                {/* Header badge */}
                <div className="ae-embed-badge">
                    <Play size={10} />
                    <span>{typeLabel[embedType] ?? 'Embed'}</span>
                </div>

                {/* Responsive iframe */}
                <div className="ae-embed-ratio">
                    <iframe
                        src={src}
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title={`${typeLabel[embedType]} embed`}
                    />
                </div>

                {/* Hover actions */}
                {hover && (
                    <div className="ae-embed-actions" contentEditable={false}>
                        <a
                            href={originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ae-embed-action-btn"
                            title="Open original"
                        >
                            <ExternalLink size={12} />
                        </a>
                        <button
                            type="button"
                            className="ae-embed-action-btn ae-embed-action-btn--danger"
                            title="Delete embed"
                            onMouseDown={(e) => { e.preventDefault(); deleteNode(); }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}
