import React, { useCallback, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import {
    LayoutGrid, Layers, Plus, Trash2, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

export interface GalleryImage {
    src: string;
    alt: string;
    caption: string;
}

type GalleryLayout = 'row' | 'stack';

function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
            return u.pathname + u.search + u.hash;
        }
    } catch { /* already relative */ }
    return url;
}

export default function ImageGalleryNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
    const rawImages:   GalleryImage[] = node.attrs.images     ?? [];
    const images = rawImages.map(img => ({ ...img, src: toRelativeUrl(img.src) }));
    const layout:      GalleryLayout  = node.attrs.layout     ?? 'row';
    const columns:     number          = node.attrs.columns    ?? 2;
    const gap:         number          = node.attrs.gap        ?? 12;
    const stackOffset: number          = node.attrs.stackOffset ?? 16;

    const [showToolbar, setShowToolbar] = useState(false);
    const [editingCaption, setEditingCaption] = useState<number | null>(null);

    /* ── Helpers ── */
    const updateImage = (idx: number, patch: Partial<GalleryImage>) => {
        const next = images.map((img, i) => i === idx ? { ...img, ...patch } : img);
        updateAttributes({ images: next });
    };

    const removeImage = (idx: number) => {
        const next = images.filter((_, i) => i !== idx);
        if (next.length === 0) { deleteNode(); return; }
        updateAttributes({ images: next, columns: Math.min(columns, next.length) });
    };

    const moveImage = (from: number, to: number) => {
        if (to < 0 || to >= images.length) return;
        const next = [...images];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        updateAttributes({ images: next });
    };

    const setLayout = (l: GalleryLayout) => updateAttributes({ layout: l });
    const setColumns = (c: number) => updateAttributes({ columns: Math.min(c, images.length) });
    const setGap = (g: number) => updateAttributes({ gap: g });
    const setStackOffset = (o: number) => updateAttributes({ stackOffset: o });

    /* ── Row layout styles ── */
    const rowContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: gap,
        flexWrap: 'wrap',
    };
    const rowItemStyle: React.CSSProperties = {
        flex: `0 0 calc(${100 / columns}% - ${gap * (columns - 1) / columns}px)`,
        minWidth: 0,
    };

    /* ── Stack layout styles ── */
    const stackContainerStyle: React.CSSProperties = {
        position: 'relative',
        height: images.length > 0 ? `${240 + stackOffset * (images.length - 1)}px` : 'auto',
    };
    const stackItemStyle = (idx: number): React.CSSProperties => ({
        position: 'absolute',
        top:  idx * stackOffset,
        left: idx * stackOffset,
        right: -(idx * stackOffset),
        zIndex: images.length - idx,
        boxShadow: '0 4px 20px rgba(15,39,65,0.18)',
        borderRadius: 8,
        overflow: 'hidden',
    });

    /* ── Prompt for image URL ── */
    const addImagePrompt = useCallback(() => {
        const url = window.prompt('New image URL:');
        if (!url) return;
        const next = [...images, { src: url, alt: '', caption: '' }];
        updateAttributes({ images: next, columns: Math.min(columns + 1, 4) });
    }, [images, columns, updateAttributes]);

    return (
        <NodeViewWrapper
            className="ae-gallery-node"
            onMouseEnter={() => setShowToolbar(true)}
            onMouseLeave={() => setShowToolbar(false)}
            style={{
                position: 'relative',
                margin: '20px 0',
                outline: selected ? '2px solid #C9A227' : 'none',
                borderRadius: 10,
                padding: 4,
            }}
        >
            {/* ── Floating gallery toolbar ── */}
            {showToolbar && (
                <div className="ae-gallery-toolbar" contentEditable={false}>
                    {/* Layout toggle */}
                    <button
                        type="button"
                        className={`ae-img-tb-btn ${layout === 'row' ? 'ae-img-tb-btn--active' : ''}`}
                        title="Side by side (row)"
                        onMouseDown={(e) => { e.preventDefault(); setLayout('row'); }}
                    >
                        <LayoutGrid size={12} />
                    </button>
                    <button
                        type="button"
                        className={`ae-img-tb-btn ${layout === 'stack' ? 'ae-img-tb-btn--active' : ''}`}
                        title="Layered (stack)"
                        onMouseDown={(e) => { e.preventDefault(); setLayout('stack'); }}
                    >
                        <Layers size={12} />
                    </button>

                    <div className="ae-img-tb-sep" />

                    {/* Column controls (row only) */}
                    {layout === 'row' && (
                        <>
                            {([2, 3, 4] as const).map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`ae-img-tb-btn ${columns === c ? 'ae-img-tb-btn--active' : ''}`}
                                    title={`${c} columns`}
                                    onMouseDown={(e) => { e.preventDefault(); setColumns(c); }}
                                    disabled={images.length < c}
                                    style={{ fontSize: 10, width: 20, fontWeight: 700 }}
                                >
                                    {c}
                                </button>
                            ))}
                            <div className="ae-img-tb-sep" />
                            {/* Gap control */}
                            <span className="ae-gallery-label">Gap</span>
                            {([6, 12, 20] as const).map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    className={`ae-img-tb-btn ${gap === g ? 'ae-img-tb-btn--active' : ''}`}
                                    title={`${g}px gap`}
                                    onMouseDown={(e) => { e.preventDefault(); setGap(g); }}
                                    style={{ fontSize: 10, width: 20, fontWeight: 600 }}
                                >
                                    {g}
                                </button>
                            ))}
                            <div className="ae-img-tb-sep" />
                        </>
                    )}

                    {/* Stack offset (stack only) */}
                    {layout === 'stack' && (
                        <>
                            <span className="ae-gallery-label">Offset</span>
                            {([8, 16, 24] as const).map(o => (
                                <button
                                    key={o}
                                    type="button"
                                    className={`ae-img-tb-btn ${stackOffset === o ? 'ae-img-tb-btn--active' : ''}`}
                                    title={`${o}px offset`}
                                    onMouseDown={(e) => { e.preventDefault(); setStackOffset(o); }}
                                    style={{ fontSize: 10, width: 20, fontWeight: 600 }}
                                >
                                    {o}
                                </button>
                            ))}
                            <div className="ae-img-tb-sep" />
                        </>
                    )}

                    {/* Add image */}
                    <button
                        type="button"
                        className="ae-img-tb-btn"
                        title="Add image"
                        onMouseDown={(e) => { e.preventDefault(); addImagePrompt(); }}
                    >
                        <Plus size={12} />
                    </button>

                    <div className="ae-img-tb-sep" />

                    {/* Delete gallery */}
                    <button
                        type="button"
                        className="ae-img-tb-btn ae-img-tb-btn--danger"
                        title="Delete gallery"
                        onMouseDown={(e) => { e.preventDefault(); deleteNode(); }}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}

            {/* ── Row layout ── */}
            {layout === 'row' && (
                <div style={rowContainerStyle} contentEditable={false}>
                    {images.map((img, idx) => (
                        <div key={idx} style={rowItemStyle} className="ae-gallery-item">
                            <div className="ae-gallery-item__img-wrap">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    style={{ width: '100%', display: 'block', borderRadius: 6, objectFit: 'cover' }}
                                    draggable={false}
                                />
                                {showToolbar && (
                                    <div className="ae-gallery-item__controls">
                                        <button
                                            type="button"
                                            className="ae-gallery-item-btn"
                                            title="Move left"
                                            onMouseDown={(e) => { e.preventDefault(); moveImage(idx, idx - 1); }}
                                            disabled={idx === 0}
                                        ><ChevronLeft size={11} /></button>
                                        <button
                                            type="button"
                                            className="ae-gallery-item-btn"
                                            title="Move right"
                                            onMouseDown={(e) => { e.preventDefault(); moveImage(idx, idx + 1); }}
                                            disabled={idx === images.length - 1}
                                        ><ChevronRight size={11} /></button>
                                        <button
                                            type="button"
                                            className="ae-gallery-item-btn ae-gallery-item-btn--danger"
                                            title="Remove"
                                            onMouseDown={(e) => { e.preventDefault(); removeImage(idx); }}
                                        ><X size={11} /></button>
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                className="ae-img-caption"
                                placeholder="Caption…"
                                value={img.caption}
                                onChange={e => updateImage(idx, { caption: e.target.value })}
                                onFocus={() => setEditingCaption(idx)}
                                onBlur={() => setEditingCaption(null)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Stack (layered) layout ── */}
            {layout === 'stack' && (
                <div style={stackContainerStyle} contentEditable={false}>
                    {images.map((img, idx) => (
                        <div key={idx} style={stackItemStyle(idx)} className="ae-gallery-item ae-gallery-item--stacked">
                            <img
                                src={img.src}
                                alt={img.alt}
                                style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 280 }}
                                draggable={false}
                            />
                            {showToolbar && (
                                <div className="ae-gallery-item__controls ae-gallery-item__controls--stack">
                                    <button
                                        type="button"
                                        className="ae-gallery-item-btn"
                                        title="Bring forward"
                                        onMouseDown={(e) => { e.preventDefault(); moveImage(idx, idx - 1); }}
                                        disabled={idx === 0}
                                    ><ChevronLeft size={11} /></button>
                                    <button
                                        type="button"
                                        className="ae-gallery-item-btn"
                                        title="Send back"
                                        onMouseDown={(e) => { e.preventDefault(); moveImage(idx, idx + 1); }}
                                        disabled={idx === images.length - 1}
                                    ><ChevronRight size={11} /></button>
                                    <button
                                        type="button"
                                        className="ae-gallery-item-btn ae-gallery-item-btn--danger"
                                        title="Remove"
                                        onMouseDown={(e) => { e.preventDefault(); removeImage(idx); }}
                                    ><X size={11} /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </NodeViewWrapper>
    );
}
