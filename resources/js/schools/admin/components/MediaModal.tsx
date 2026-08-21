import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    X, Film, Upload, Image as ImageIcon, Layers,
    Link as LinkIcon, Play, Check, Loader2, FolderOpen,
    LayoutGrid, Search, RefreshCw, ImagePlus,
    Paperclip,
} from 'lucide-react';

/* ─── URL normalizer ─────────────────────────────────────────────
 * Old records stored absolute URLs with APP_URL (http://localhost/...).
 * Convert those to root-relative paths so they work on any hostname.
 * ─────────────────────────────────────────────────────────────── */
function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
            return u.pathname + u.search + u.hash;
        }
    } catch { /* not an absolute URL — already relative */ }
    return url;
}

/* ─── Types ─────────────────────────────────────────────────────── */
export interface GalleryImage {
    src: string;
    alt: string;
    caption: string;
}

interface LibraryItem {
    id: string;
    url: string;
    name: string;
    alt: string;
    width?: number;
    height?: number;
    size?: number;
}

type MediaTab = 'upload' | 'library' | 'url' | 'embed';

interface MediaModalProps {
    onInsert:        (src: string, alt: string) => void;
    onGalleryInsert?: (images: GalleryImage[], layout: 'row' | 'stack') => void;
    onClose:         () => void;
}

/* ─── Upload helpers ────────────────────────────────────────────── */
const ACCEPT = 'image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/avif';
const MAX_BYTES = 20 * 1024 * 1024;

function formatBytes(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function MediaModal({ onInsert, onGalleryInsert, onClose }: MediaModalProps) {
    const [tab, setTab] = useState<MediaTab>('upload');

    /* ── Upload tab state ── */
    const [dragOver,       setDragOver]       = useState(false);
    const [pendingFile,    setPendingFile]     = useState<File | null>(null);
    const [previewUrl,     setPreviewUrl]      = useState<string | null>(null);
    const [altInput,       setAltInput]        = useState('');
    const [uploading,      setUploading]       = useState(false);
    const [uploadError,    setUploadError]     = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Library tab state ── */
    const [library,        setLibrary]         = useState<LibraryItem[]>([]);
    const [libLoading,     setLibLoading]      = useState(false);
    const [libError,       setLibError]        = useState<string | null>(null);
    const [searchQuery,    setSearchQuery]     = useState('');
    const [selected,       setSelected]        = useState<Set<string>>(new Set());
    const [galleryLayout,  setGalleryLayout]   = useState<'row' | 'stack'>('row');

    /* ── URL tab state ── */
    const [urlInput, setUrlInput] = useState('');
    const [urlAlt,   setUrlAlt]   = useState('');
    const [urlAlign, setUrlAlign] = useState<'left' | 'center' | 'right' | 'full'>('center');

    /* ── Embed tab state ── */
    const [embedUrl, setEmbedUrl] = useState('');

    /* ── Load library on tab switch ── */
    useEffect(() => {
        if (tab === 'library' && library.length === 0) fetchLibrary();
    }, [tab]);

    /* ── Clean up preview object URL ── */
    useEffect(() => {
        return () => { if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const fetchLibrary = async () => {
        setLibLoading(true);
        setLibError(null);
        try {
            const token = localStorage.getItem('acc_admin_token') ?? '';
        const res = await fetch('/api/admin/media?status=ready&per_page=80', {
                headers: { Accept: 'application/json', 'X-Actor-ID': '00000000-0000-0000-0000-000000000001', Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const rows: LibraryItem[] = (json.data ?? []).map((m: any) => ({
                id:     m.id,
                url:    toRelativeUrl(m.delivery_base_url),
                name:   m.identity_name ?? m.identity_original_filename ?? 'Untitled',
                alt:    m.locale_meta?.en?.alt_text ?? '',
                width:  m.dimensions_width,
                height: m.dimensions_height,
                size:   m.source_size_bytes,
            }));
            setLibrary(rows);
        } catch (e: any) {
            setLibError(e.message ?? 'Failed to load library');
        } finally {
            setLibLoading(false);
        }
    };

    /* ── File selection ── */
    const handleFiles = useCallback((files: FileList | null) => {
        const file = files?.[0];
        if (!file) return;
        if (file.size > MAX_BYTES) { setUploadError(`File too large (max ${formatBytes(MAX_BYTES)})`); return; }
        if (!file.type.startsWith('image/')) { setUploadError('Only image files are supported'); return; }
        setUploadError(null);
        setPendingFile(file);
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setAltInput(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
    }, [previewUrl]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    /* ── Upload to server ── */
    const handleUpload = async () => {
        if (!pendingFile) return;
        setUploading(true);
        setUploadError(null);
        try {
            const form = new FormData();
            form.append('file', pendingFile);
            if (altInput) form.append('alt_text', altInput);
            form.append('name', altInput || pendingFile.name.replace(/\.[^.]+$/, ''));

            const token = localStorage.getItem('acc_admin_token') ?? '';
            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                headers: { 'X-Actor-ID': '00000000-0000-0000-0000-000000000001', Authorization: `Bearer ${token}` },
                body: form,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message ?? `Upload failed (${res.status})`);
            }
            const data = await res.json();
            onInsert(toRelativeUrl(data.url), altInput);
            onClose();
        } catch (e: any) {
            setUploadError(e.message ?? 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    /* ── Library selection ── */
    const toggleSelect = (item: LibraryItem) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(item.id)) next.delete(item.id);
            else next.add(item.id);
            return next;
        });
    };

    const insertSelected = () => {
        const items = library.filter(i => selected.has(i.id));
        if (items.length === 0) return;
        if (items.length === 1) {
            onInsert(items[0].url, items[0].alt);
        } else if (onGalleryInsert) {
            onGalleryInsert(items.map(i => ({ src: i.url, alt: i.alt, caption: '' })), galleryLayout);
        } else {
            items.forEach(i => onInsert(i.url, i.alt));
        }
        onClose();
    };

    const filteredLibrary = library.filter(i =>
        !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ── Render ─────────────────────────────────────────────────── */
    return (
        <div className="ae-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="ae-media-modal">
                {/* Header */}
                <div className="ae-media-modal__head">
                    <div className="ae-media-modal__title"><Film size={15} /> Insert Media</div>
                    <button type="button" className="ae-dialog-close" onClick={onClose}><X size={15} /></button>
                </div>

                {/* Tabs */}
                <div className="ae-media-modal__tabs">
                    <button type="button" className={`ae-media-tab ${tab === 'upload'  ? 'ae-media-tab--active' : ''}`} onClick={() => setTab('upload')}>
                        <Upload size={12} style={{ marginRight: 5 }} /> Upload
                        <Paperclip size={12} style={{ marginRight: 5 }} /> Upload
                    </button>
                    <button type="button" className={`ae-media-tab ${tab === 'library' ? 'ae-media-tab--active' : ''}`} onClick={() => setTab('library')}>
                        <FolderOpen size={12} style={{ marginRight: 5 }} /> Library
                    </button>
                    <button type="button" className={`ae-media-tab ${tab === 'url'     ? 'ae-media-tab--active' : ''}`} onClick={() => setTab('url')}>
                        <LinkIcon size={12} style={{ marginRight: 5 }} /> URL
                    </button>
                    <button type="button" className={`ae-media-tab ${tab === 'embed'   ? 'ae-media-tab--active' : ''}`} onClick={() => setTab('embed')}>
                        <Play size={12} style={{ marginRight: 5 }} /> Embed
                    </button>
                </div>

                {/* ── Upload tab ───────────────────────────────── */}
                {tab === 'upload' && (
                    <div className="ae-media-upload-panel">
                        {!pendingFile ? (
                            <div
                                className={`ae-upload-dropzone ${dragOver ? 'ae-upload-dropzone--over' : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ACCEPT}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                                <div className="ae-upload-dropzone__icon">
                                    <ImagePlus size={36} strokeWidth={1.5} />
                                </div>
                                <div className="ae-upload-dropzone__primary">
                                    Drag &amp; drop an image here
                                </div>
                                <div className="ae-upload-dropzone__secondary">
                                    or click to browse — JPEG, PNG, WebP, GIF, SVG · max 20 MB
                                </div>
                            </div>
                        ) : (
                            <div className="ae-upload-preview-panel">
                                <div className="ae-upload-preview-img-wrap">
                                    <img src={previewUrl!} alt="Preview" className="ae-upload-preview-img" />
                                    <button
                                        type="button"
                                        className="ae-upload-preview-clear"
                                        onClick={() => { setPendingFile(null); setPreviewUrl(null); setUploadError(null); }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <div className="ae-upload-preview-meta">
                                    <div className="ae-upload-file-info">
                                        <span className="ae-upload-file-name">{pendingFile.name}</span>
                                        <span className="ae-upload-file-size">{formatBytes(pendingFile.size)}</span>
                                    </div>
                                    <div className="ae-media-field">
                                        <label>Alt text (accessibility description)</label>
                                        <input
                                            className="ae-link-dialog__input"
                                            value={altInput}
                                            onChange={e => setAltInput(e.target.value)}
                                            placeholder="Describe the image for screen readers"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {uploadError && (
                            <div className="ae-upload-error">{uploadError}</div>
                        )}

                        <div className="ae-media-url-form" style={{ paddingTop: 0, paddingBottom: 0, gap: 0 }}>
                            <button
                                type="button"
                                className="ae-link-dialog__confirm"
                                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                                onClick={handleUpload}
                                disabled={!pendingFile || uploading}
                            >
                                {uploading
                                    ? <><Loader2 size={13} className="ae-spin" /> Uploading…</>
                                    : <><Upload size={13} /> Upload &amp; Insert</>
                                }
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Library tab ──────────────────────────────── */}
                {tab === 'library' && (
                    <div className="ae-media-library-panel">
                        <div className="ae-library-toolbar">
                            <div className="ae-library-search">
                                <Search size={13} className="ae-library-search__icon" />
                                <input
                                    type="text"
                                    className="ae-library-search__input"
                                    placeholder="Search images…"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button type="button" className="ae-library-refresh-btn" onClick={fetchLibrary} title="Refresh">
                                <RefreshCw size={13} />
                            </button>
                        </div>

                        {libLoading && (
                            <div className="ae-library-state">
                                <Loader2 size={24} className="ae-spin" />
                                <span>Loading library…</span>
                            </div>
                        )}
                        {libError && !libLoading && (
                            <div className="ae-library-state ae-library-state--error">
                                <span>{libError}</span>
                                <button type="button" onClick={fetchLibrary}>Retry</button>
                            </div>
                        )}
                        {!libLoading && !libError && filteredLibrary.length === 0 && (
                            <div className="ae-library-state">
                                <ImageIcon size={32} strokeWidth={1.2} />
                                <span>{library.length === 0 ? 'No images uploaded yet. Use the Upload tab to add images.' : 'No results match your search.'}</span>
                            </div>
                        )}
                        {!libLoading && filteredLibrary.length > 0 && (
                            <div className="ae-media-grid ae-media-grid--library">
                                {filteredLibrary.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`ae-media-thumb ${selected.has(item.id) ? 'ae-media-thumb--selected' : ''}`}
                                        onClick={() => toggleSelect(item)}
                                        title={item.name}
                                    >
                                        <img src={item.url} alt={item.alt || item.name} loading="lazy" />
                                        <span>{item.name}</span>
                                        {selected.has(item.id) && (
                                            <div className="ae-media-thumb__check"><Check size={10} strokeWidth={3} /></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {selected.size > 0 && (
                            <div className="ae-library-footer">
                                {selected.size > 1 && onGalleryInsert && (
                                    <div className="ae-library-layout-row">
                                        <span className="ae-library-layout-label">Insert as:</span>
                                        <button
                                            type="button"
                                            className={`ae-library-layout-btn ${galleryLayout === 'row' ? 'ae-library-layout-btn--active' : ''}`}
                                            onClick={() => setGalleryLayout('row')}
                                        >
                                            <LayoutGrid size={12} /> Side by side
                                        </button>
                                        <button
                                            type="button"
                                            className={`ae-library-layout-btn ${galleryLayout === 'stack' ? 'ae-library-layout-btn--active' : ''}`}
                                            onClick={() => setGalleryLayout('stack')}
                                        >
                                            <Layers size={12} /> Layered
                                        </button>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="ae-link-dialog__confirm"
                                    style={{ flex: 1 }}
                                    onClick={insertSelected}
                                >
                                    <Check size={13} />
                                    {selected.size === 1
                                        ? 'Insert Image'
                                        : `Insert ${selected.size} Images${onGalleryInsert ? ` as Gallery` : ''}`}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── URL tab ──────────────────────────────────── */}
                {tab === 'url' && (
                    <div className="ae-media-url-form">
                        <div className="ae-media-field">
                            <label>Image URL</label>
                            <input
                                className="ae-link-dialog__input"
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                autoFocus
                            />
                        </div>
                        <div className="ae-media-field">
                            <label>Alt text (optional)</label>
                            <input
                                className="ae-link-dialog__input"
                                value={urlAlt}
                                onChange={e => setUrlAlt(e.target.value)}
                                placeholder="Describe the image"
                            />
                        </div>
                        <div className="ae-media-field">
                            <label>Alignment</label>
                            <div className="ae-media-align-row">
                                {(['left', 'center', 'right', 'full'] as const).map(a => (
                                    <button
                                        key={a}
                                        type="button"
                                        className={`ae-media-align-btn ${urlAlign === a ? 'ae-media-align-btn--active' : ''}`}
                                        onClick={() => setUrlAlign(a)}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="ae-link-dialog__confirm"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => { if (urlInput) { onInsert(urlInput, urlAlt); onClose(); } }}
                            disabled={!urlInput}
                        >
                            <Check size={13} /> Insert Image
                        </button>
                    </div>
                )}

                {/* ── Embed tab ────────────────────────────────── */}
                {tab === 'embed' && (
                    <div className="ae-media-url-form">
                        <div className="ae-media-field">
                            <label>YouTube, Vimeo, or Twitter/X URL</label>
                            <input
                                className="ae-link-dialog__input"
                                value={embedUrl}
                                onChange={e => setEmbedUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=…"
                                autoFocus
                            />
                        </div>
                        <div className="ae-embed-hint">
                            <Play size={11} /> Paste any YouTube, Vimeo, or Twitter/X link
                        </div>
                        <button
                            type="button"
                            className="ae-link-dialog__confirm"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => {
                                onClose();
                                window.dispatchEvent(new CustomEvent('ae:insert-embed', { detail: embedUrl }));
                            }}
                            disabled={!embedUrl}
                        >
                            <Check size={13} /> Insert Embed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
