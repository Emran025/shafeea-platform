import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    X, Check, RotateCw, RotateCcw, FlipHorizontal, FlipVertical,
    Loader2, Crop,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────── */
interface CropRect {
    x: number; y: number; w: number; h: number;
}
type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'move';

interface ImageCropModalProps {
    src:     string;
    onApply: (newSrc: string) => void;
    onClose: () => void;
}

const HANDLE_SIZE = 10;

/* ─── Crop Modal ─────────────────────────────────────────────────── */
export default function ImageCropModal({ src, onApply, onClose }: ImageCropModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef    = useRef<HTMLCanvasElement>(null);
    const imageRef     = useRef<HTMLImageElement | null>(null);

    const [imgLoaded,  setImgLoaded]  = useState(false);
    const [imgError,   setImgError]   = useState(false);
    const [uploading,  setUploading]  = useState(false);
    const [uploadErr,  setUploadErr]  = useState<string | null>(null);

    /* Display dimensions of the canvas on screen */
    const [dispW,  setDispW]  = useState(0);
    const [dispH,  setDispH]  = useState(0);
    /* Natural dimensions of the source image */
    const [natW,   setNatW]   = useState(0);
    const [natH,   setNatH]   = useState(0);

    /* Crop rect in canvas-display-pixel coordinates */
    const [crop,     setCrop]     = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
    const [rotation, setRotation] = useState(0);   // degrees: 0 | 90 | 180 | 270
    const [flipH,    setFlipH]    = useState(false);
    const [flipV,    setFlipV]    = useState(false);

    /* Drag state */
    const dragRef = useRef<{ handle: Handle; startX: number; startY: number; initCrop: CropRect } | null>(null);

    /* ── Load image ── */
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imageRef.current = img;
            setNatW(img.naturalWidth);
            setNatH(img.naturalHeight);
            setImgLoaded(true);
        };
        img.onerror = () => setImgError(true);
        img.src = src;
    }, [src]);

    /* ── Compute display size once loaded ── */
    useEffect(() => {
        if (!imgLoaded || !containerRef.current) return;
        const maxW = Math.min(containerRef.current.clientWidth - 32, 760);
        const maxH = 440;
        const ratio = natW / natH;
        let dw = maxW, dh = maxW / ratio;
        if (dh > maxH) { dh = maxH; dw = maxH * ratio; }
        setDispW(Math.round(dw));
        setDispH(Math.round(dh));
        setCrop({ x: 0, y: 0, w: Math.round(dw), h: Math.round(dh) });
    }, [imgLoaded, natW, natH]);

    /* ── Draw canvas ── */
    useEffect(() => {
        if (!imgLoaded || !dispW || !dispH) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width  = dispW;
        canvas.height = dispH;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, dispW, dispH);

        /* Draw transformed image */
        ctx.save();
        ctx.translate(dispW / 2, dispH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(imageRef.current!, -dispW / 2, -dispH / 2, dispW, dispH);
        ctx.restore();

        /* Dark overlay */
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, dispW, dispH);

        /* Clear crop window */
        ctx.clearRect(crop.x, crop.y, crop.w, crop.h);

        /* Redraw image inside crop window (no overlay) */
        ctx.save();
        ctx.beginPath();
        ctx.rect(crop.x, crop.y, crop.w, crop.h);
        ctx.clip();
        ctx.translate(dispW / 2, dispH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(imageRef.current!, -dispW / 2, -dispH / 2, dispW, dispH);
        ctx.restore();

        /* Crop border */
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth   = 1.5;
        ctx.strokeRect(crop.x + 0.5, crop.y + 0.5, crop.w - 1, crop.h - 1);

        /* Rule-of-thirds grid lines */
        ctx.strokeStyle = 'rgba(201,162,39,0.4)';
        ctx.lineWidth   = 0.75;
        for (let i = 1; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(crop.x + (crop.w / 3) * i, crop.y);
            ctx.lineTo(crop.x + (crop.w / 3) * i, crop.y + crop.h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(crop.x, crop.y + (crop.h / 3) * i);
            ctx.lineTo(crop.x + crop.w, crop.y + (crop.h / 3) * i);
            ctx.stroke();
        }

        /* Corner + edge handles */
        const hs = HANDLE_SIZE;
        const handles: [number, number][] = [
            [crop.x,               crop.y],
            [crop.x + crop.w / 2 - hs / 2, crop.y],
            [crop.x + crop.w - hs,  crop.y],
            [crop.x + crop.w - hs,  crop.y + crop.h / 2 - hs / 2],
            [crop.x + crop.w - hs,  crop.y + crop.h - hs],
            [crop.x + crop.w / 2 - hs / 2, crop.y + crop.h - hs],
            [crop.x,               crop.y + crop.h - hs],
            [crop.x,               crop.y + crop.h / 2 - hs / 2],
        ];
        ctx.fillStyle   = '#FFFFFF';
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth   = 1.5;
        handles.forEach(([hx, hy]) => {
            ctx.fillRect(hx, hy, hs, hs);
            ctx.strokeRect(hx + 0.5, hy + 0.5, hs - 1, hs - 1);
        });

    }, [imgLoaded, dispW, dispH, crop, rotation, flipH, flipV]);

    /* ── Hit test ── */
    const hitHandle = (x: number, y: number): Handle | null => {
        const hs = HANDLE_SIZE;
        const c  = crop;
        const zones: [Handle, number, number][] = [
            ['nw', c.x,                           c.y],
            ['n',  c.x + c.w / 2 - hs / 2,       c.y],
            ['ne', c.x + c.w - hs,                c.y],
            ['e',  c.x + c.w - hs,                c.y + c.h / 2 - hs / 2],
            ['se', c.x + c.w - hs,                c.y + c.h - hs],
            ['s',  c.x + c.w / 2 - hs / 2,       c.y + c.h - hs],
            ['sw', c.x,                           c.y + c.h - hs],
            ['w',  c.x,                           c.y + c.h / 2 - hs / 2],
        ];
        for (const [h, hx, hy] of zones) {
            if (x >= hx && x <= hx + hs + 4 && y >= hy && y <= hy + hs + 4) return h;
        }
        if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) return 'move';
        return null;
    };

    const canvasCoords = (e: React.MouseEvent): { x: number; y: number } => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const { x, y } = canvasCoords(e);
        const handle    = hitHandle(x, y);
        if (!handle) return;
        e.preventDefault();
        dragRef.current = { handle, startX: x, startY: y, initCrop: { ...crop } };
    };

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!dragRef.current || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const dx   = x - dragRef.current.startX;
        const dy   = y - dragRef.current.startY;
        const ic   = dragRef.current.initCrop;
        const MIN  = 20;

        setCrop(prev => {
            let { x: cx, y: cy, w: cw, h: ch } = ic;
            const h = dragRef.current!.handle;

            if (h === 'move') {
                cx = Math.max(0, Math.min(dispW - cw, cx + dx));
                cy = Math.max(0, Math.min(dispH - ch, cy + dy));
            } else {
                if (h.includes('n')) { const ny = Math.min(cy + ch - MIN, cy + dy); ch = ch - (ny - cy); cy = ny; }
                if (h.includes('s')) { ch = Math.max(MIN, Math.min(dispH - cy, ch + dy)); }
                if (h.includes('w')) { const nx = Math.min(cx + cw - MIN, cx + dx); cw = cw - (nx - cx); cx = nx; }
                if (h.includes('e')) { cw = Math.max(MIN, Math.min(dispW - cx, cw + dx)); }
                cx = Math.max(0, cx); cy = Math.max(0, cy);
                cw = Math.min(dispW - cx, cw); ch = Math.min(dispH - cy, ch);
            }
            return { x: cx, y: cy, w: cw, h: ch };
        });
    }, [dispW, dispH]);

    const onMouseUp = useCallback(() => { dragRef.current = null; }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup',   onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup',   onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    /* ── Cursor style ── */
    const [cursor, setCursor] = useState('default');
    const CURSORS: Record<Handle, string> = {
        nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
        e: 'e-resize', se: 'se-resize', s: 's-resize',
        sw: 'sw-resize', w: 'w-resize', move: 'move',
    };
    const onCanvasMove = (e: React.MouseEvent) => {
        const { x, y } = canvasCoords(e);
        const h = hitHandle(x, y);
        setCursor(h ? CURSORS[h] : 'crosshair');
    };

    /* ── Apply: export crop then upload ── */
    const handleApply = async () => {
        if (!imageRef.current || !dispW) return;
        setUploading(true);
        setUploadErr(null);

        try {
            const scaleX = natW / dispW;
            const scaleY = natH / dispH;

            /* Rotate pivot */
            const rad    = (rotation * Math.PI) / 180;
            const centerX = natW / 2;
            const centerY = natH / 2;

            /* Map crop rect back to natural coords */
            const points = [
                [crop.x * scaleX, crop.y * scaleY],
                [(crop.x + crop.w) * scaleX, crop.y * scaleY],
                [(crop.x + crop.w) * scaleX, (crop.y + crop.h) * scaleY],
                [crop.x * scaleX, (crop.y + crop.h) * scaleY],
            ];

            /* Un-rotate each point */
            const unrotated = points.map(([px, py]) => {
                const tx = px - centerX, ty = py - centerY;
                return [
                    Math.cos(-rad) * tx - Math.sin(-rad) * ty + centerX,
                    Math.sin(-rad) * tx + Math.cos(-rad) * ty + centerY,
                ];
            });
            const xs = unrotated.map(p => p[0]);
            const ys = unrotated.map(p => p[1]);
            const minX = Math.max(0, Math.min(...xs));
            const minY = Math.max(0, Math.min(...ys));
            const maxX = Math.min(natW, Math.max(...xs));
            const maxY = Math.min(natH, Math.max(...ys));
            const cw   = maxX - minX;
            const ch   = maxY - minY;

            /* Draw cropped + flipped result */
            const out = document.createElement('canvas');
            out.width  = Math.round(cw);
            out.height = Math.round(ch);
            const ctx2 = out.getContext('2d')!;
            ctx2.save();
            ctx2.translate(out.width / 2, out.height / 2);
            ctx2.scale(flipH ? -1 : 1, flipV ? -1 : 1);
            ctx2.drawImage(imageRef.current, minX, minY, cw, ch, -out.width / 2, -out.height / 2, out.width, out.height);
            ctx2.restore();

            const blob = await new Promise<Blob | null>(res => out.toBlob(res, 'image/jpeg', 0.92));
            if (!blob) throw new Error('Canvas export failed');

            const form = new FormData();
            form.append('file', blob, 'cropped.jpg');
            const uploadToken = localStorage.getItem('acc_admin_token') ?? '';
            const res = await fetch('/api/admin/media/upload', {
                method:  'POST',
                headers: { 'X-Actor-ID': '00000000-0000-0000-0000-000000000001', Authorization: `Bearer ${uploadToken}` },
                body:    form,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message ?? `Upload failed (${res.status})`);
            }
            const data = await res.json();
            onApply(data.url);
            onClose();
        } catch (e: any) {
            /* Fallback: use dataURL if server upload fails */
            try {
                const out   = document.createElement('canvas');
                out.width   = crop.w;
                out.height  = crop.h;
                const ctx2  = out.getContext('2d')!;
                ctx2.drawImage(canvasRef.current!, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
                onApply(out.toDataURL('image/jpeg', 0.85));
                onClose();
            } catch {
                setUploadErr(e.message ?? 'Failed to apply crop');
            }
        } finally {
            setUploading(false);
        }
    };

    /* ── Rotate helpers ── */
    const rotateCW  = () => setRotation(r => (r + 90) % 360);
    const rotateCCW = () => setRotation(r => (r + 270) % 360);

    /* ── Reset crop ── */
    const resetCrop = () => setCrop({ x: 0, y: 0, w: dispW, h: dispH });

    return (
        <div className="ae-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="ae-crop-modal">
                <div className="ae-media-modal__head">
                    <div className="ae-media-modal__title"><Crop size={15} /> Edit Image</div>
                    <button type="button" className="ae-dialog-close" onMouseDown={onClose}><X size={15} /></button>
                </div>

                {/* Toolbar */}
                <div className="ae-crop-toolbar">
                    <button type="button" className="ae-crop-tool-btn" title="Rotate counter-clockwise" onClick={rotateCCW} disabled={!imgLoaded}>
                        <RotateCcw size={14} />
                    </button>
                    <button type="button" className="ae-crop-tool-btn" title="Rotate clockwise" onClick={rotateCW} disabled={!imgLoaded}>
                        <RotateCw size={14} />
                    </button>
                    <div className="ae-crop-toolbar-sep" />
                    <button type="button" className={`ae-crop-tool-btn ${flipH ? 'ae-crop-tool-btn--active' : ''}`} title="Flip horizontal" onClick={() => setFlipH(v => !v)} disabled={!imgLoaded}>
                        <FlipHorizontal size={14} />
                    </button>
                    <button type="button" className={`ae-crop-tool-btn ${flipV ? 'ae-crop-tool-btn--active' : ''}`} title="Flip vertical" onClick={() => setFlipV(v => !v)} disabled={!imgLoaded}>
                        <FlipVertical size={14} />
                    </button>
                    <div className="ae-crop-toolbar-sep" />
                    <button type="button" className="ae-crop-tool-btn" title="Reset crop" onClick={resetCrop} disabled={!imgLoaded}>
                        <Crop size={14} /> <span style={{ fontSize: 11, marginLeft: 4 }}>Reset</span>
                    </button>
                    <div style={{ flex: 1 }} />
                    {imgLoaded && (
                        <span className="ae-crop-dimensions">
                            {Math.round(crop.w)} × {Math.round(crop.h)} px
                        </span>
                    )}
                </div>

                {/* Canvas area */}
                <div ref={containerRef} className="ae-crop-canvas-wrap">
                    {!imgLoaded && !imgError && (
                        <div className="ae-crop-loading"><Loader2 size={28} className="ae-spin" /> Loading image…</div>
                    )}
                    {imgError && (
                        <div className="ae-crop-loading ae-crop-loading--error">
                            Failed to load image. It may be protected by CORS policy.
                        </div>
                    )}
                    {imgLoaded && dispW > 0 && (
                        <canvas
                            ref={canvasRef}
                            width={dispW}
                            height={dispH}
                            style={{ cursor, display: 'block', margin: '0 auto' }}
                            onMouseDown={onMouseDown}
                            onMouseMove={onCanvasMove}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="ae-crop-footer">
                    {uploadErr && <div className="ae-upload-error" style={{ flex: 1 }}>{uploadErr}</div>}
                    <button type="button" className="ae-link-dialog__remove" onClick={onClose}>
                        <X size={13} /> Cancel
                    </button>
                    <button
                        type="button"
                        className="ae-link-dialog__confirm"
                        onClick={handleApply}
                        disabled={!imgLoaded || uploading}
                    >
                        {uploading
                            ? <><Loader2 size={13} className="ae-spin" /> Saving…</>
                            : <><Check size={13} /> Apply &amp; Replace</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
