import React, { useCallback, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import {
    AlignLeft, AlignCenter, AlignRight, Maximize2,
    Image as ImageIcon, Trash2, Crop,
} from 'lucide-react';
import ImageCropModal from './ImageCropModal';

type Align = 'left' | 'center' | 'right' | 'full';

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

export default function ImageNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
    const raw = node.attrs as { src: string; alt?: string; caption: string; align: Align; width: number | null };
    const { alt, caption = '', align = 'center', width } = raw;
    const src = toRelativeUrl(raw.src);

    const [showToolbar,  setShowToolbar]  = useState(false);
    const [showCrop,     setShowCrop]     = useState(false);
    const [localCaption, setLocalCaption] = useState<string>(caption);
    const wrapRef = useRef<HTMLDivElement>(null);
    const imgRef  = useRef<HTMLImageElement>(null);

    /* ── Resize drag ── */
    const resizing = useRef<{ startX: number; startW: number } | null>(null);

    const onResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const img = imgRef.current;
        if (!img) return;
        resizing.current = { startX: e.clientX, startW: img.offsetWidth };

        const onMove = (ev: MouseEvent) => {
            if (!resizing.current) return;
            const delta = ev.clientX - resizing.current.startX;
            const newW  = Math.max(80, resizing.current.startW + delta);
            updateAttributes({ width: Math.round(newW) });
        };
        const onUp = () => {
            resizing.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup',  onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup',   onUp);
    }, [updateAttributes]);

    /* ── Caption blur save ── */
    const saveCaption = () => updateAttributes({ caption: localCaption });

    /* ── Alignment style ── */
    const wrapStyle: React.CSSProperties = {
        display:       'flex',
        flexDirection: 'column',
        alignItems:
            align === 'left'   ? 'flex-start' :
            align === 'right'  ? 'flex-end'   : 'center',
        width: align === 'full' ? '100%' : undefined,
    };

    const imgStyle: React.CSSProperties = {
        width:    align === 'full' ? '100%'   : width ? `${width}px` : undefined,
        maxWidth: align === 'full' ? '100%'   : '100%',
        display:  'block',
        borderRadius: 6,
        boxShadow: selected ? '0 0 0 2px #C9A227' : undefined,
        cursor: 'default',
    };

    return (
        <NodeViewWrapper
            ref={wrapRef}
            className="ae-img-node"
            onMouseEnter={() => setShowToolbar(true)}
            onMouseLeave={() => setShowToolbar(false)}
            style={{ position: 'relative', margin: '16px 0', userSelect: 'none' }}
        >
            <div style={wrapStyle}>
                {/* Floating image toolbar */}
                {showToolbar && (
                    <div className="ae-img-toolbar" contentEditable={false}>
                        {(['left','center','right','full'] as Align[]).map(a => (
                            <button
                                key={a}
                                type="button"
                                title={`Align ${a}`}
                                className={`ae-img-tb-btn ${align === a ? 'ae-img-tb-btn--active' : ''}`}
                                onMouseDown={(e) => { e.preventDefault(); updateAttributes({ align: a }); }}
                            >
                                {a === 'left'   && <AlignLeft  size={12} />}
                                {a === 'center' && <AlignCenter size={12} />}
                                {a === 'right'  && <AlignRight size={12} />}
                                {a === 'full'   && <Maximize2  size={12} />}
                            </button>
                        ))}
                        <div className="ae-img-tb-sep" />
                        <button
                            type="button"
                            title="Crop &amp; edit image"
                            className="ae-img-tb-btn"
                            onMouseDown={(e) => { e.preventDefault(); setShowCrop(true); }}
                        >
                            <Crop size={12} />
                        </button>
                        <button
                            type="button"
                            title="Replace image URL"
                            className="ae-img-tb-btn"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const url = window.prompt('New image URL:', src);
                                if (url) updateAttributes({ src: url });
                            }}
                        >
                            <ImageIcon size={12} />
                        </button>
                        <button
                            type="button"
                            title="Delete image"
                            className="ae-img-tb-btn ae-img-tb-btn--danger"
                            onMouseDown={(e) => { e.preventDefault(); deleteNode(); }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}

                {/* Image with right-edge resize handle */}
                <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt ?? ''}
                        style={imgStyle}
                        draggable={false}
                    />
                    {align !== 'full' && (
                        <div
                            className="ae-img-resize-handle"
                            onMouseDown={onResizeStart}
                            contentEditable={false}
                        />
                    )}
                </div>

                {/* Caption */}
                <div contentEditable={false} style={{ width: align === 'full' ? '100%' : width ? `${width}px` : undefined, maxWidth: '100%' }}>
                    <input
                        type="text"
                        className="ae-img-caption"
                        placeholder="Add a caption…"
                        value={localCaption}
                        onChange={e => setLocalCaption(e.target.value)}
                        onBlur={saveCaption}
                    />
                </div>
            </div>

            {/* Crop modal */}
            {showCrop && (
                <ImageCropModal
                    src={src}
                    onApply={(newSrc) => updateAttributes({ src: newSrc })}
                    onClose={() => setShowCrop(false)}
                />
            )}
        </NodeViewWrapper>
    );
}
