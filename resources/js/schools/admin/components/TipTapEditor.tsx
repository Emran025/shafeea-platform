import React, {
    forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { Extension, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { FontFamily as FontFamilyExt } from '@tiptap/extension-font-family';
import { Fragment, Node as PMNode } from '@tiptap/pm/model';

import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Highlighter, Code, Code2, Heading2, Heading3, Heading4,
    Pilcrow, List, ListOrdered, Quote, Minus, Link as LinkIcon,
    Link2Off, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
    AlignJustify, Undo2, Redo2, RemoveFormatting,
    Table as TableIcon, Type, ChevronDown, X, Keyboard,
    Palette, Trash2, Plus, Check, Film,
    Sparkles, Maximize, Minimize, GripVertical, Play,
    Wand2, Languages, FileText,
    Layout,
    PenTool,
    Home,
    Eye,
    Rocket,
} from 'lucide-react';

import SlashMenuList from './SlashMenuList';
import type { SlashCommand } from './SlashMenuList';
import ImageNodeViewComponent from './ImageNodeView';
import EmbedNodeViewComponent, { parseEmbedUrl } from './EmbedNodeView';
import MediaModal from './MediaModal';
import type { GalleryImage } from './MediaModal';
import ImageGalleryNodeViewComponent from './ImageGalleryNodeView';
import { correctBorderRadius } from 'framer-motion';

/* ─── Types ────────────────────────────────────────────────────── */
export type RibbonTab = 'home' | 'insert' | 'format' | 'view';

export interface TipTapEditorProps {
    content:         string;
    onChange:        (html: string, words: number) => void;
    editable?:       boolean;
    ribbonTab?:      RibbonTab;
    onEditorReady?:  (editor: Editor) => void;
}

export interface TipTapEditorHandle {
    openLink:      () => void;
    openMedia:     () => void;
    openShortcuts: () => void;
}

/* ─── Types ─────────────────────────────────────────────────────── */
type EditorTab = RibbonTab;

interface TabDef {
    id:    EditorTab;
    label: string;
    icon:  React.ReactNode;
}

const TABS: TabDef[] = [
    { id: 'home',    label: 'Home',    icon: <Home    size={13} /> },
    { id: 'insert',  label: 'Insert',  icon: <PenTool size={13} /> },
    { id: 'format',  label: 'Format',  icon: <Layout  size={13} /> },
    { id: 'view',    label: 'View',    icon: <Eye     size={13} /> },
];

/* ─── Direction extension ───────────────────────────────────────── */
const Direction = Extension.create({
    name: 'direction',
    addGlobalAttributes() {
        return [{
            types: ['heading', 'paragraph', 'blockquote'],
            attributes: {
                dir: {
                    default: null,
                    parseHTML: (el: HTMLElement) => el.getAttribute('dir'),
                    renderHTML: (attrs: { dir?: string | null }) => {
                        if (!attrs.dir) return {};
                        return { dir: attrs.dir };
                    },
                },
            },
        }];
    },
});

/* ─── ImageNode extension ───────────────────────────────────────── */
const ImageNode = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            caption: {
                default: '',
                parseHTML: (el: HTMLElement) => el.getAttribute('data-caption') ?? '',
                renderHTML: (attrs: { caption?: string }) =>
                    attrs.caption ? { 'data-caption': attrs.caption } : {},
            },
            align: {
                default: 'center',
                parseHTML: (el: HTMLElement) => el.getAttribute('data-align') ?? 'center',
                renderHTML: (attrs: { align?: string }) => ({ 'data-align': attrs.align }),
            },
            width: {
                default: null,
                parseHTML: (el: HTMLElement) => {
                    const w = el.getAttribute('width') ?? el.style.width;
                    return w ? parseInt(w as string) : null;
                },
                renderHTML: (attrs: { width?: number | null }) =>
                    attrs.width ? { width: String(attrs.width) } : {},
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeViewComponent);
    },
});

/* ─── ImageGalleryNode extension ────────────────────────────────── */
const ImageGalleryNode = Node.create({
    name: 'imageGallery',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            images:      { default: [] },
            layout:      { default: 'row' },
            columns:     { default: 2 },
            gap:         { default: 12 },
            stackOffset: { default: 16 },
        };
    },
    parseHTML() { return [{ tag: 'div[data-image-gallery]' }]; },
    renderHTML({ HTMLAttributes }) {
        return ['div', {
            'data-image-gallery': 'true',
            'data-images':        JSON.stringify(HTMLAttributes.images ?? []),
            'data-layout':        HTMLAttributes.layout ?? 'row',
            'data-columns':       String(HTMLAttributes.columns ?? 2),
            'data-gap':           String(HTMLAttributes.gap ?? 12),
            'data-stack-offset':  String(HTMLAttributes.stackOffset ?? 16),
        }];
    },
    addNodeView() { return ReactNodeViewRenderer(ImageGalleryNodeViewComponent); },
});

/* ─── EmbedNode extension ───────────────────────────────────────── */
const EmbedNode = Node.create({
    name: 'embed',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            src:         { default: '' },
            embedType:   { default: 'youtube' },
            originalUrl: { default: '' },
        };
    },
    parseHTML() { return [{ tag: 'div[data-embed-type]' }]; },
    renderHTML({ HTMLAttributes }) {
        return ['div', {
            'data-embed-type': HTMLAttributes.embedType,
            'data-src':        HTMLAttributes.src,
            'data-original':   HTMLAttributes.originalUrl,
        }];
    },
    addNodeView() { return ReactNodeViewRenderer(EmbedNodeViewComponent); },
});

/* ─── Font config ───────────────────────────────────────────────── */
const FONTS = [
    { label: 'Inter (EN)',  value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
    { label: 'Georgia (EN)', value: 'Georgia, serif' },
    { label: 'Roboto (EN)', value: 'Roboto, ui-sans-serif, sans-serif' },
    { label: 'Cairo (AR)',  value: 'Cairo, ui-sans-serif, sans-serif' },
    { label: 'Tajawal (AR)', value: 'Tajawal, ui-sans-serif, sans-serif' },
    { label: 'Monospace',   value: "'Fira Code', 'Cascadia Code', monospace" },
];

const PRESET_COLORS = [
    '#0F2741','#1D4ED8','#7C3AED','#DC2626','#D97706','#059669',
    '#000000','#374151','#6B7280','#D1D5DB','#FFFFFF','#C9A227',
];

const PRESET_HIGHLIGHTS = [
    '#FEF9C3','#DBEAFE','#F3E8FF','#FEE2E2','#DCFCE7','#FED7AA',
    '#E0F2FE','#F0FDF4','#FDF4FF','#FFF7ED','#ECFDF5','#FFF1F2',
];

/* ─── Toolbar button ─────────────────────────────────────────────── */
interface TBtnProps {
    active?:    boolean;
    title:      string;
    onClick:    (e: React.MouseEvent) => void;
    children:   React.ReactNode;
    danger?:    boolean;
    disabled?:  boolean;
    className?: string;
}

export function TBtn({ active, title, onClick, children, danger, disabled, className = '' }: TBtnProps) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            className={[
                'ae-toolbar-btn',
                active  ? 'ae-toolbar-btn--active' : '',
                danger  ? 'ae-toolbar-btn--danger' : '',
                className,
            ].filter(Boolean).join(' ')}
            onMouseDown={(e) => { e.preventDefault(); onClick(e); }}
        >
            {children}
        </button>
    );
}

export function Sep() { return <div className="ae-toolbar__sep" />; }

/* ─── Color popover ─────────────────────────────────────────────── */
interface ColorPopoverProps {
    presets:  string[];
    value?:   string;
    onSelect: (color: string) => void;
    onClear?: () => void;
    onClose:  () => void;
}

function ColorPopover({ presets, value, onSelect, onClear, onClose }: ColorPopoverProps) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const t = e.target;
            if (ref.current && t instanceof globalThis.Node && !ref.current.contains(t)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    return (
        <div ref={ref} className="ae-color-pop">
            <div className="ae-color-pop__grid">
                {presets.map(c => (
                    <button
                        key={c}
                        type="button"
                        title={c}
                        className={`ae-color-swatch ${value === c ? 'ae-color-swatch--active' : ''}`}
                        style={{ background: c, border: c === '#FFFFFF' ? '1.5px solid #E2E8F0' : undefined }}
                        onMouseDown={(e) => { e.preventDefault(); onSelect(c); onClose(); }}
                    >
                        {value === c && <Check size={10} strokeWidth={3} />}
                    </button>
                ))}
            </div>
            <div className="ae-color-pop__row">
                <input
                    type="color"
                    className="ae-color-native"
                    defaultValue={value ?? '#000000'}
                    onInput={(e) => onSelect((e.target as HTMLInputElement).value)}
                />
                <span className="ae-color-pop__label">Custom</span>
                {onClear && (
                    <button type="button" className="ae-color-pop__clear" onMouseDown={(e) => { e.preventDefault(); onClear(); onClose(); }}>
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}

/* ─── Link dialog ───────────────────────────────────────────────── */
interface LinkDialogProps {
    initial:   string;
    onConfirm: (url: string) => void;
    onRemove:  () => void;
    onClose:   () => void;
}

function LinkDialog({ initial, onConfirm, onRemove, onClose }: LinkDialogProps) {
    const [url, setUrl] = useState(initial || 'https://');
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { inputRef.current?.select(); }, []);

    return (
        <div className="ae-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="ae-link-dialog">
                <div className="ae-link-dialog__head">
                    <LinkIcon size={15} />
                    <span>Insert / Edit Link</span>
                    <button type="button" className="ae-dialog-close" onMouseDown={onClose}><X size={14} /></button>
                </div>
                <input
                    ref={inputRef}
                    className="ae-link-dialog__input"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={e => { if (e.key === 'Enter') { onConfirm(url); onClose(); } if (e.key === 'Escape') onClose(); }}
                />
                <div className="ae-link-dialog__actions">
                    {initial && (
                        <button type="button" className="ae-link-dialog__remove" onMouseDown={() => { onRemove(); onClose(); }}>
                            <Link2Off size={13} /> Remove
                        </button>
                    )}
                    <button type="button" className="ae-link-dialog__confirm" onMouseDown={() => { onConfirm(url); onClose(); }}>
                        <Check size={13} /> Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Floating bubble menu ──────────────────────────────────────── */
type AiAction = 'improve' | 'summarize' | 'translate';

interface FloatingBubbleMenuProps {
    editor:        Editor;
    onAiAction?:   (action: AiAction) => void;
}

function FloatingBubbleMenu({ editor, onAiAction }: FloatingBubbleMenuProps) {
    const [visible,  setVisible]  = useState(false);
    const [pos,      setPos]      = useState({ top: 0, left: 0 });
    const [aiOpen,   setAiOpen]   = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const aiRef     = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            const { from, to, empty } = editor.state.selection;
            if (empty) { setVisible(false); setAiOpen(false); return; }
            try {
                const start = editor.view.coordsAtPos(from);
                const end   = editor.view.coordsAtPos(to - 1);
                const midX  = (start.left + end.right) / 2;
                setPos({ top: start.top - 52, left: midX });
                setVisible(true);
            } catch { setVisible(false); }
        };
        const onBlur  = () => { hideTimer.current = setTimeout(() => { setVisible(false); setAiOpen(false); }, 200); };
        const onFocus = () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
        editor.on('selectionUpdate', update);
        editor.on('blur',  onBlur);
        editor.on('focus', onFocus);
        return () => {
            editor.off('selectionUpdate', update);
            editor.off('blur',  onBlur);
            editor.off('focus', onFocus);
        };
    }, [editor]);

    useEffect(() => {
        if (!aiOpen) return;
        const handler = (e: MouseEvent) => {
            const t = e.target;
            if (aiRef.current && t instanceof globalThis.Node && !aiRef.current.contains(t)) setAiOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [aiOpen]);

    if (!visible) return null;

    const AI_ACTIONS: { action: AiAction; icon: React.ReactNode; label: string }[] = [
        { action: 'improve',   icon: <Wand2    size={12} />, label: 'Improve Writing' },
        { action: 'summarize', icon: <FileText size={12} />, label: 'Summarize'       },
        { action: 'translate', icon: <Languages size={12} />, label: 'Translate'      },
    ];

    return createPortal(
        <div
            className="ae-bubble-menu"
            style={{ position: 'fixed', top: pos.top, left: pos.left, transform: 'translateX(-50%)', zIndex: 9999 }}
            onMouseDown={(e) => { e.preventDefault(); if (hideTimer.current) clearTimeout(hideTimer.current); }}
        >
            <TBtn active={editor.isActive('bold')}      title="Bold"         onClick={() => editor.chain().focus().toggleBold().run()}>      <Bold          size={13} strokeWidth={2.5} /></TBtn>
            <TBtn active={editor.isActive('italic')}    title="Italic"       onClick={() => editor.chain().focus().toggleItalic().run()}>    <Italic        size={13} /></TBtn>
            <TBtn active={editor.isActive('underline')} title="Underline"    onClick={() => editor.chain().focus().toggleUnderline().run()}> <UnderlineIcon size={13} /></TBtn>
            <TBtn active={editor.isActive('strike')}    title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}>  <Strikethrough size={13} /></TBtn>
            <div className="ae-bubble-sep" />
            <TBtn active={editor.isActive('highlight')} title="Highlight"    onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter   size={13} /></TBtn>
            <TBtn active={editor.isActive('link')}      title="Link"         onClick={() => editor.chain().focus().setLink({ href: 'https://' }).run()}><LinkIcon size={13} /></TBtn>
            <TBtn active={editor.isActive('code')}      title="Code"         onClick={() => editor.chain().focus().toggleCode().run()}>      <Code          size={13} /></TBtn>
            <div className="ae-bubble-sep" />
            <div ref={aiRef} style={{ position: 'relative' }}>
                <TBtn active={aiOpen} title="AI Actions" onClick={() => setAiOpen(o => !o)} className="ae-bubble-ai-btn">
                    <Sparkles size={13} />
                </TBtn>
                {aiOpen && (
                    <div className="ae-ai-submenu">
                        {AI_ACTIONS.map(({ action, icon, label }) => (
                            <button
                                key={action}
                                type="button"
                                className="ae-ai-action"
                                onMouseDown={(e) => { e.preventDefault(); setAiOpen(false); onAiAction?.(action); }}
                            >
                                {icon}<span>{label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}

/* ─── Drag Handle ───────────────────────────────────────────────── */
function DragHandle({ editor, dir }: { editor: Editor; dir: 'ltr' | 'rtl' }) {
    const [handle, setHandle] = useState<{ top: number; blockIdx: number } | null>(null);
    const [drag,   setDrag]   = useState<{ fromIdx: number; dropIdx: number; dropTop: number } | null>(null);
    const rafId      = useRef(0);
    const isDragging = useRef(false);

    const getBlocks = useCallback((): HTMLElement[] =>
        Array.from((editor.view.dom as HTMLElement).children) as HTMLElement[],
    [editor]);

    const blockAtY = useCallback((y: number) => {
        const blocks = getBlocks();
        let found = -1;
        blocks.forEach((el, i) => {
            const r = el.getBoundingClientRect();
            if (y >= r.top - 4 && y <= r.bottom + 4) found = i;
        });
        return found;
    }, [getBlocks]);

    const dropTargetAt = useCallback((y: number) => {
        const blocks = getBlocks();
        let dropIdx = blocks.length;
        let dropTop = 0;
        for (let i = 0; i < blocks.length; i++) {
            const r = blocks[i].getBoundingClientRect();
            if (y < r.top + r.height / 2) { dropIdx = i; dropTop = r.top; break; }
            dropTop = r.bottom;
        }
        return { dropIdx, dropTop };
    }, [getBlocks]);

    useEffect(() => {
        const dom = editor.view.dom as HTMLElement;
        const onMove = (e: MouseEvent) => {
            if (isDragging.current) return;
            cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => {
                const idx = blockAtY(e.clientY);
                if (idx < 0) { setHandle(null); return; }
                const r = getBlocks()[idx]?.getBoundingClientRect();
                if (r) setHandle({ top: r.top + r.height / 2, blockIdx: idx });
            });
        };
        const onLeave = () => { if (!isDragging.current) setHandle(null); };
        dom.addEventListener('mousemove', onMove);
        dom.addEventListener('mouseleave', onLeave);
        return () => {
            dom.removeEventListener('mousemove', onMove);
            dom.removeEventListener('mouseleave', onLeave);
            cancelAnimationFrame(rafId.current);
        };
    }, [editor, blockAtY, getBlocks]);

    const moveBlock = useCallback((fromIdx: number, toIdx: number) => {
        if (fromIdx === toIdx) return;
        const { doc } = editor.state;
        const nodes: PMNode[] = [];
        doc.forEach(node => nodes.push(node));
        if (fromIdx < 0 || fromIdx >= nodes.length) return;
        const reordered = [...nodes];
        const [moved] = reordered.splice(fromIdx, 1);
        const insertAt = toIdx > fromIdx ? toIdx - 1 : toIdx;
        reordered.splice(Math.max(0, Math.min(insertAt, reordered.length)), 0, moved);
        try {
            const newContent = Fragment.fromArray(reordered);
            editor.view.dispatch(editor.state.tr.replaceWith(0, doc.content.size, newContent));
        } catch { /* ignore */ }
    }, [editor]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (!handle) return;
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        isDragging.current = true;
        const { dropIdx, dropTop } = dropTargetAt(e.clientY);
        setDrag({ fromIdx: handle.blockIdx, dropIdx, dropTop });
    }, [handle, dropTargetAt]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!drag) return;
        e.preventDefault();
        const { dropIdx, dropTop } = dropTargetAt(e.clientY);
        setDrag(d => d ? { ...d, dropIdx, dropTop } : null);
    }, [drag, dropTargetAt]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!drag) return;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        moveBlock(drag.fromIdx, drag.dropIdx);
        setDrag(null);
        isDragging.current = false;
    }, [drag, moveBlock]);

    if (!handle && !drag) return null;

    const pmRect    = (editor.view.dom as HTMLElement).getBoundingClientRect();
    const OFFSET    = 30;
    const handleLeft  = dir === 'rtl' ? undefined : pmRect.left - OFFSET;
    const handleRight = dir === 'rtl' ? window.innerWidth - pmRect.right + 4 : undefined;

    return createPortal(
        <>
            {handle && (
                <div
                    className={`ae-drag-handle ${drag ? 'ae-drag-handle--dragging' : ''}`}
                    style={{ position: 'fixed', top: handle.top, left: handleLeft, right: handleRight, transform: 'translateY(-50%)', zIndex: 9990 }}
                    title="Drag to reorder block"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                >
                    <GripVertical size={14} />
                </div>
            )}
            {drag && (
                <div
                    className="ae-drop-indicator"
                    style={{ position: 'fixed', top: drag.dropTop, left: pmRect.left, width: pmRect.width, pointerEvents: 'none', zIndex: 9989 }}
                />
            )}
        </>,
        document.body,
    );
}

/* ─── Font dropdown ─────────────────────────────────────────────── */
export function FontFamilyPicker({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = FONTS.find(f => editor.isActive('textStyle', { fontFamily: f.value }));

    useEffect(() => {
        const h = (e: MouseEvent) => { const t = e.target; if (ref.current && t instanceof globalThis.Node && !ref.current.contains(t)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div ref={ref} className="ae-font-picker">
            <button type="button" className="ae-toolbar-btn ae-font-picker__btn" title="Font Family" onMouseDown={(e) => { e.preventDefault(); setOpen(o => !o); }}>
                <Type size={13} />
                <span className="ae-font-picker__label">{current ? current.label.split(' ')[0] : 'Font'}</span>
                <ChevronDown size={11} />
            </button>
            {open && (
                <div className="ae-font-picker__menu">
                    {FONTS.map(f => (
                        <button key={f.value} type="button" className={`ae-font-picker__item ${current?.value === f.value ? 'ae-font-picker__item--active' : ''}`} style={{ fontFamily: f.value }}
                            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setFontFamily(f.value).run(); setOpen(false); }}>
                            {current?.value === f.value && <Check size={12} />}
                            {f.label}
                        </button>
                    ))}
                    <button type="button" className="ae-font-picker__item ae-font-picker__clear"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetFontFamily().run(); setOpen(false); }}>
                        <RemoveFormatting size={12} /> Default
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── Table dropdown ────────────────────────────────────────────── */
export function TableDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inTable = editor.isActive('table');

    useEffect(() => {
        const h = (e: MouseEvent) => { const t = e.target; if (ref.current && t instanceof globalThis.Node && !ref.current.contains(t)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    type TableAction = { label: string; icon: React.ReactNode; action: () => void; divider?: boolean; danger?: boolean };

    const insertActions: TableAction[] = [
        { label: 'Insert 3×3 Table', icon: <TableIcon size={13} />, action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
        { label: 'Insert 4×4 Table', icon: <TableIcon size={13} />, action: () => editor.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run() },
    ];

    const tableActions: TableAction[] = [
        { label: 'Add Row Above',    icon: <Plus   size={13} />, action: () => editor.chain().focus().addRowBefore().run() },
        { label: 'Add Row Below',    icon: <Plus   size={13} />, action: () => editor.chain().focus().addRowAfter().run() },
        { label: 'Delete Row',       icon: <Trash2 size={13} />, action: () => editor.chain().focus().deleteRow().run(), danger: true },
        { label: 'Add Column Left',  icon: <Plus   size={13} />, action: () => editor.chain().focus().addColumnBefore().run(), divider: true },
        { label: 'Add Column Right', icon: <Plus   size={13} />, action: () => editor.chain().focus().addColumnAfter().run() },
        { label: 'Delete Column',    icon: <Trash2 size={13} />, action: () => editor.chain().focus().deleteColumn().run(), danger: true },
        { label: 'Merge Cells',      icon: <Plus   size={13} />, action: () => editor.chain().focus().mergeCells().run(), divider: true },
        { label: 'Split Cell',       icon: <Plus   size={13} />, action: () => editor.chain().focus().splitCell().run() },
        { label: 'Delete Table',     icon: <Trash2 size={13} />, action: () => editor.chain().focus().deleteTable().run(), divider: true, danger: true },
    ];

    return (
        <div ref={ref} className="ae-table-drop">
            <TBtn active={inTable} title="Table" onClick={() => setOpen(o => !o)}>
                <TableIcon size={13} /><ChevronDown size={10} />
            </TBtn>
            {open && (
                <div className="ae-table-drop__menu">
                    {!inTable && <div className="ae-table-drop__header">Insert Table</div>}
                    {inTable  && <div className="ae-table-drop__header">Table Options</div>}
                    {(inTable ? tableActions : insertActions).map((a, i) => (
                        <React.Fragment key={i}>
                            {a.divider && <div className="ae-table-drop__divider" />}
                            <button type="button" className={`ae-table-drop__item ${a.danger ? 'ae-table-drop__item--danger' : ''}`}
                                onMouseDown={(e) => { e.preventDefault(); a.action(); setOpen(false); }}>
                                {a.icon} {a.label}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Keyboard shortcut overlay ─────────────────────────────────── */
function ShortcutOverlay({ onClose }: { onClose: () => void }) {
    const shortcuts = [
        ['Ctrl+B', 'Bold'],              ['Ctrl+I', 'Italic'],
        ['Ctrl+U', 'Underline'],         ['Ctrl+Shift+X', 'Strikethrough'],
        ['Ctrl+Z', 'Undo'],              ['Ctrl+Shift+Z', 'Redo'],
        ['Ctrl+K', 'Insert Link'],       ['Ctrl+Alt+1', 'Heading 1'],
        ['Ctrl+Alt+2', 'Heading 2'],     ['Ctrl+Alt+3', 'Heading 3'],
        ['Tab', 'Indent list'],          ['Shift+Tab', 'Outdent list'],
        ['Ctrl+Shift+B', 'Blockquote'],  ['Ctrl+E', 'Code (inline)'],
        ['Ctrl+Alt+C', 'Code block'],    ['Ctrl+L', 'Bullet list'],
        ['Ctrl+Shift+L', 'Ordered list'],['Ctrl+\\', 'Clear formatting'],
        ['/', 'Slash command menu'],
    ];

    return (
        <div className="ae-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="ae-shortcut-overlay">
                <div className="ae-link-dialog__head">
                    <Keyboard size={15} />
                    <span>Keyboard Shortcuts</span>
                    <button type="button" className="ae-dialog-close" onClick={onClose}><X size={14} /></button>
                </div>
                <div className="ae-shortcut-overlay__grid">
                    {shortcuts.map(([key, desc]) => (
                        <div key={key} className="ae-shortcut-overlay__row">
                            <kbd className="ae-kbd">{key}</kbd>
                            <span>{desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Slash state ────────────────────────────────────────────────── */
interface SlashState {
    open:   boolean;
    query:  string;
    from:   number;
    coords: { top: number; left: number };
}

/* ─── Main component ─────────────────────────────────────────────── */
const TipTapEditor = forwardRef<TipTapEditorHandle, TipTapEditorProps>(
function TipTapEditor({ content, onChange, editable = true, onEditorReady }, ref) {
    const [showLink,      setShowLink]      = useState(false);
    const [showMedia,     setShowMedia]     = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showTextColor, setShowTextColor] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    const [docDir,        setDocDir]        = useState<'ltr'|'rtl'>('ltr');
    const [zenMode,       setZenMode]       = useState(false);

    const [slash, setSlash] = useState<SlashState>({
        open: false, query: '', from: 0, coords: { top: 0, left: 0 },
    });

    /* Expose imperative handles */
    useImperativeHandle(ref, () => ({
        openLink:      () => setShowLink(true),
        openMedia:     () => setShowMedia(true),
        openShortcuts: () => setShowShortcuts(true),
    }));

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading:     { levels: [2, 3, 4] },
                codeBlock:   { languageClassPrefix: 'language-' },
                bulletList:  { keepMarks: true },
                orderedList: { keepMarks: true },
            }),
            Underline,
            TextStyle,
            FontFamilyExt,
            Color,
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick:    false,
                autolink:       true,
                HTMLAttributes: { class: 'ae-link' },
            }),
            ImageNode.configure({ allowBase64: false }),
            ImageGalleryNode,
            EmbedNode,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Start writing… or type / for commands' }),
            CharacterCount,
            Typography,
            Direction,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content,
        editable,
        editorProps: {
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain')?.trim() ?? '';
                const parsed = parseEmbedUrl(text);
                if (parsed.type) {
                    const nodeType = view.state.schema.nodes['embed'];
                    if (nodeType) {
                        const node = nodeType.create({ src: parsed.src, embedType: parsed.type, originalUrl: parsed.originalUrl });
                        view.dispatch(view.state.tr.replaceSelectionWith(node));
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor: e }) => {
            const wordCount = e.storage.characterCount?.words?.() ?? 0;
            onChange(e.getHTML(), wordCount);

            const { $from, empty } = e.state.selection;
            if (!empty) { setSlash(s => s.open ? { ...s, open: false } : s); return; }
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
            const match = textBefore.match(/^\/(\w*)$/);
            if (match) {
                try {
                    const coords = e.view.coordsAtPos($from.pos);
                    setSlash({ open: true, query: match[1], from: $from.start(), coords: { top: coords.bottom + 8, left: coords.left } });
                } catch {
                    setSlash(s => ({ ...s, open: false }));
                }
            } else {
                setSlash(s => s.open ? { ...s, open: false } : s);
            }
        },
    });

    /* Notify parent when editor is ready */
    useEffect(() => {
        if (editor && onEditorReady) onEditorReady(editor);
    }, [editor, onEditorReady]);

    /* Embed insertion from MediaModal */
    useEffect(() => {
        if (!editor) return;
        const handler = (e: Event) => {
            const url = (e as CustomEvent<string>).detail;
            if (!url) return;
            const parsed = parseEmbedUrl(url);
            if (!parsed.type) return;
            const nodeType = editor.state.schema.nodes['embed'];
            if (nodeType) {
                const node = nodeType.create({ src: parsed.src, embedType: parsed.type, originalUrl: parsed.originalUrl });
                editor.view.dispatch(editor.state.tr.replaceSelectionWith(node));
            }
        };
        window.addEventListener('ae:insert-embed', handler);
        return () => window.removeEventListener('ae:insert-embed', handler);
    }, [editor]);

    /* Zen mode escape */
    useEffect(() => {
        if (!zenMode) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setZenMode(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [zenMode]);

    const setLink = useCallback(() => setShowLink(true), []);

    const handleLinkConfirm = useCallback((url: string) => {
        if (!editor) return;
        if (!url || url === 'https://') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor]);

    const handleImageInsert = useCallback((src: string, alt: string) => {
        if (!editor) return;
        editor.chain().focus().setImage({ src, alt }).run();
    }, [editor]);

    const handleGalleryInsert = useCallback((images: GalleryImage[], layout: 'row' | 'stack') => {
        if (!editor) return;
        editor.chain().focus().insertContent({
            type: 'imageGallery',
            attrs: { images, layout, columns: Math.min(images.length, layout === 'row' ? 3 : 2), gap: 12, stackOffset: 16 },
        }).run();
    }, [editor]);

    const toggleDir = useCallback((dir: 'ltr'|'rtl') => {
        setDocDir(dir);
        if (!editor) return;
        editor.chain().focus().updateAttributes('paragraph', { dir }).run();
        editor.chain().focus().updateAttributes('heading',   { dir }).run();
    }, [editor]);

    const execSlash = useCallback((cmd: SlashCommand) => {
        if (!editor) return;
        const to   = editor.state.selection.from;
        const from = slash.from;
        editor.chain().focus().deleteRange({ from, to }).run();
        cmd.action(editor);
        setSlash({ open: false, query: '', from: 0, coords: { top: 0, left: 0 } });
    }, [editor, slash]);

    const handleAiAction = useCallback((_action: AiAction) => {
        console.info(`[AI Action] ${_action} — integrate with AI API`);
    }, []);

    if (!editor) return null;

    const canUndo      = editor.can().undo();
    const canRedo      = editor.can().redo();
    const currentColor = editor.getAttributes('textStyle').color as string | undefined;
    const currentHL    = editor.getAttributes('highlight').color  as string | undefined;
    const linkHref     = editor.getAttributes('link').href        as string | undefined;
    const [activeTab,       setActiveTab]       = useState<EditorTab>('home');

    /* ─── Ribbon tab content ─────────────────────────────────────── */
    const renderRibbonGroup = () => {
        if (!activeTab) return renderFullToolbar();

        switch (activeTab) {
            case 'home': return (
                <div className="ae-toolbar">
                    <div className="ae-toolbar__group">
                        <TBtn title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={13} /></TBtn>
                        <TBtn title="Redo (Ctrl+Shift+Z)" disabled={!canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={13} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group"><FontFamilyPicker editor={editor} /></div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn active={editor.isActive('bold')}      title="Bold (Ctrl+B)"      onClick={() => editor.chain().focus().toggleBold().run()}>      <Bold          size={13} strokeWidth={2.5} /></TBtn>
                        <TBtn active={editor.isActive('italic')}    title="Italic (Ctrl+I)"    onClick={() => editor.chain().focus().toggleItalic().run()}>    <Italic        size={13} /></TBtn>
                        <TBtn active={editor.isActive('underline')} title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}> <UnderlineIcon size={13} /></TBtn>
                        <TBtn active={editor.isActive('strike')}    title="Strikethrough"      onClick={() => editor.chain().focus().toggleStrike().run()}>    <Strikethrough size={13} /></TBtn>
                        <TBtn active={editor.isActive('code')}      title="Inline Code"        onClick={() => editor.chain().focus().toggleCode().run()}>      <Code          size={13} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group" style={{ position: 'relative' }}>
                        <div className="ae-color-btn-wrap">
                            <TBtn title="Text Color" onClick={() => { setShowTextColor(o => !o); setShowHighlight(false); }}>
                                <Palette size={13} />
                                <span className="ae-color-indicator" style={{ background: currentColor ?? '#1E293B' }} />
                            </TBtn>
                            {showTextColor && <ColorPopover presets={PRESET_COLORS} value={currentColor} onSelect={(c) => editor.chain().focus().setColor(c).run()} onClear={() => editor.chain().focus().unsetColor().run()} onClose={() => setShowTextColor(false)} />}
                        </div>
                        <div className="ae-color-btn-wrap">
                            <TBtn active={editor.isActive('highlight')} title="Highlight" onClick={() => { setShowHighlight(o => !o); setShowTextColor(false); }}>
                                <Highlighter size={13} />
                                <span className="ae-color-indicator" style={{ background: currentHL ?? '#FEF9C3' }} />
                            </TBtn>
                            {showHighlight && <ColorPopover presets={PRESET_HIGHLIGHTS} value={currentHL} onSelect={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()} onClear={() => editor.chain().focus().unsetHighlight().run()} onClose={() => setShowHighlight(false)} />}
                        </div>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn title="Clear All Formatting" danger onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting size={13} /></TBtn>
                    </div>
                </div>
            );

            case 'insert': return (
                <div className="ae-toolbar">
                    <div className="ae-toolbar__group">
                        <TBtn active={editor.isActive('link')} title="Insert / Edit Link (Ctrl+K)" onClick={setLink}><LinkIcon size={13} /><span style={{ fontSize: 11, marginLeft: 4 }}>Link</span></TBtn>
                        <TBtn title="Remove Link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off size={13} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn title="Insert Image / Media" onClick={() => setShowMedia(true)}><ImageIcon size={13} /><span style={{ fontSize: 11, marginLeft: 4 }}>Image</span></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group"><TableDropdown editor={editor} /></div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn active={editor.isActive('blockquote')} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={13} /><span style={{ fontSize: 11, marginLeft: 4 }}>Quote</span></TBtn>
                        <TBtn active={editor.isActive('codeBlock')}  title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 size={13} /><span style={{ fontSize: 11, marginLeft: 4 }}>Code</span></TBtn>
                        <TBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={13} /><span style={{ fontSize: 11, marginLeft: 4 }}>Divider</span></TBtn>
                    </div>
                </div>
            );

            case 'format': return (
                <div className="ae-toolbar">
                    <div className="ae-toolbar__group">
                        <TBtn active={editor.isActive('heading', { level: 2 })} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></TBtn>
                        <TBtn active={editor.isActive('heading', { level: 3 })} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></TBtn>
                        <TBtn active={editor.isActive('heading', { level: 4 })} title="Heading 4" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 size={14} /></TBtn>
                        <TBtn active={editor.isActive('paragraph') && !editor.isActive('heading')} title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow size={13} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn active={editor.isActive('bulletList')}  title="Bullet List"   onClick={() => editor.chain().focus().toggleBulletList().run()}>  <List        size={14} /></TBtn>
                        <TBtn active={editor.isActive('orderedList')} title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()}> <ListOrdered size={14} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn active={editor.isActive({ textAlign: 'left' })}    title="Align Left"    onClick={() => editor.chain().focus().setTextAlign('left').run()}>    <AlignLeft    size={13} /></TBtn>
                        <TBtn active={editor.isActive({ textAlign: 'center' })}  title="Align Center"  onClick={() => editor.chain().focus().setTextAlign('center').run()}>  <AlignCenter  size={13} /></TBtn>
                        <TBtn active={editor.isActive({ textAlign: 'right' })}   title="Align Right"   onClick={() => editor.chain().focus().setTextAlign('right').run()}>   <AlignRight   size={13} /></TBtn>
                        <TBtn active={editor.isActive({ textAlign: 'justify' })} title="Justify"       onClick={() => editor.chain().focus().setTextAlign('justify').run()}> <AlignJustify size={13} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn active={docDir === 'ltr'} title="Left-to-Right (English)" onClick={() => toggleDir('ltr')}><span className="ae-dir-label">LTR</span></TBtn>
                        <TBtn active={docDir === 'rtl'} title="Right-to-Left (Arabic)"  onClick={() => toggleDir('rtl')}><span className="ae-dir-label">RTL</span></TBtn>
                    </div>
                </div>
            );

            case 'view': return (
                <div className="ae-toolbar">
                    <div className="ae-toolbar__group">
                        <TBtn title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={13} /></TBtn>
                        <TBtn title="Redo (Ctrl+Shift+Z)" disabled={!canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={13} /></TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn
                            active={zenMode}
                            title={zenMode ? 'Exit Zen Mode (Esc)' : 'Enter Zen / Focus Mode'}
                            onClick={() => setZenMode(z => !z)}
                            className="ae-zen-toggle"
                        >
                            {zenMode ? <Minimize size={13} /> : <Maximize size={13} />}
                            <span style={{ fontSize: 11, marginLeft: 4 }}>{zenMode ? 'Exit Focus' : 'Focus Mode'}</span>
                        </TBtn>
                        <TBtn title="Keyboard Shortcuts" onClick={() => setShowShortcuts(true)}>
                            <Keyboard size={13} />
                            <span style={{ fontSize: 11, marginLeft: 4 }}>Shortcuts</span>
                        </TBtn>
                    </div>
                    <Sep />
                    <div className="ae-toolbar__group">
                        <TBtn title="Clear All Formatting" danger onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                            <RemoveFormatting size={13} />
                            <span style={{ fontSize: 11, marginLeft: 4 }}>Clear Format</span>
                        </TBtn>
                    </div>
                </div>
            );

            default: return renderFullToolbar();
        }
    };

    /* ─── Full toolbar (legacy / fallback) ──────────────────────── */
    function renderFullToolbar() {
        return (
            <div className="ae-toolbar">
                <div className="ae-toolbar__group">
                    <TBtn title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={13} /></TBtn>
                    <TBtn title="Redo (Ctrl+Shift+Z)" disabled={!canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={13} /></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group"><FontFamilyPicker editor={editor} /></div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn active={editor.isActive('bold')}      title="Bold (Ctrl+B)"      onClick={() => editor.chain().focus().toggleBold().run()}>      <Bold          size={13} strokeWidth={2.5} /></TBtn>
                    <TBtn active={editor.isActive('italic')}    title="Italic (Ctrl+I)"    onClick={() => editor.chain().focus().toggleItalic().run()}>    <Italic        size={13} /></TBtn>
                    <TBtn active={editor.isActive('underline')} title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}> <UnderlineIcon size={13} /></TBtn>
                    <TBtn active={editor.isActive('strike')}    title="Strikethrough"      onClick={() => editor.chain().focus().toggleStrike().run()}>    <Strikethrough size={13} /></TBtn>
                    <TBtn active={editor.isActive('code')}      title="Inline code"        onClick={() => editor.chain().focus().toggleCode().run()}>      <Code          size={13} /></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group" style={{ position: 'relative' }}>
                    <div className="ae-color-btn-wrap">
                        <TBtn title="Text color" onClick={() => { setShowTextColor(o => !o); setShowHighlight(false); }}>
                            <Palette size={13} />
                            <span className="ae-color-indicator" style={{ background: currentColor ?? '#1E293B' }} />
                        </TBtn>
                        {showTextColor && <ColorPopover presets={PRESET_COLORS} value={currentColor} onSelect={(c) => editor.chain().focus().setColor(c).run()} onClear={() => editor.chain().focus().unsetColor().run()} onClose={() => setShowTextColor(false)} />}
                    </div>
                    <div className="ae-color-btn-wrap">
                        <TBtn active={editor.isActive('highlight')} title="Highlight" onClick={() => { setShowHighlight(o => !o); setShowTextColor(false); }}>
                            <Highlighter size={13} />
                            <span className="ae-color-indicator" style={{ background: currentHL ?? '#FEF9C3' }} />
                        </TBtn>
                        {showHighlight && <ColorPopover presets={PRESET_HIGHLIGHTS} value={currentHL} onSelect={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()} onClear={() => editor.chain().focus().unsetHighlight().run()} onClose={() => setShowHighlight(false)} />}
                    </div>
                </div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn active={editor.isActive('heading', { level: 2 })} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></TBtn>
                    <TBtn active={editor.isActive('heading', { level: 3 })} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></TBtn>
                    <TBtn active={editor.isActive('heading', { level: 4 })} title="Heading 4" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 size={14} /></TBtn>
                    <TBtn active={editor.isActive('paragraph') && !editor.isActive('heading')} title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow size={13} /></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn active={editor.isActive('bulletList')}  title="Bullet list"   onClick={() => editor.chain().focus().toggleBulletList().run()}>  <List        size={14} /></TBtn>
                    <TBtn active={editor.isActive('orderedList')} title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}> <ListOrdered size={14} /></TBtn>
                    <TBtn active={editor.isActive('blockquote')}  title="Blockquote"    onClick={() => editor.chain().focus().toggleBlockquote().run()}>  <Quote       size={13} /></TBtn>
                    <TBtn active={editor.isActive('codeBlock')}   title="Code block"    onClick={() => editor.chain().focus().toggleCodeBlock().run()}>   <Code2       size={13} /></TBtn>
                    <TBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={13} /></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn active={editor.isActive('link')} title="Insert / edit link (Ctrl+K)" onClick={setLink}><LinkIcon size={13} /></TBtn>
                    <TBtn title="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off size={13} /></TBtn>
                    <TBtn title="Insert image / embed" onClick={() => setShowMedia(true)}><ImageIcon size={13} /></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group"><TableDropdown editor={editor} /></div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn active={editor.isActive({ textAlign: 'left' })}    title="Align left"    onClick={() => editor.chain().focus().setTextAlign('left').run()}>    <AlignLeft    size={13} /></TBtn>
                    <TBtn active={editor.isActive({ textAlign: 'center' })}  title="Align center"  onClick={() => editor.chain().focus().setTextAlign('center').run()}>  <AlignCenter  size={13} /></TBtn>
                    <TBtn active={editor.isActive({ textAlign: 'right' })}   title="Align right"   onClick={() => editor.chain().focus().setTextAlign('right').run()}>   <AlignRight   size={13} /></TBtn>
                    <TBtn active={editor.isActive({ textAlign: 'justify' })} title="Justify"       onClick={() => editor.chain().focus().setTextAlign('justify').run()}> <AlignJustify size={13} /></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn active={docDir === 'ltr'} title="Left-to-Right (English)" onClick={() => toggleDir('ltr')}><span className="ae-dir-label">LTR</span></TBtn>
                    <TBtn active={docDir === 'rtl'} title="Right-to-Left (Arabic)"  onClick={() => toggleDir('rtl')}><span className="ae-dir-label">RTL</span></TBtn>
                </div>
                <Sep />
                <div className="ae-toolbar__group">
                    <TBtn title="Clear all formatting" danger onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting size={13} /></TBtn>
                    <TBtn title="Keyboard shortcuts" onClick={() => setShowShortcuts(true)}><Keyboard size={13} /></TBtn>
                    <TBtn active={zenMode} title={zenMode ? 'Exit Zen Mode (Esc)' : 'Enter Zen / Focus Mode'} onClick={() => setZenMode(z => !z)} className="ae-zen-toggle">
                        {zenMode ? <Minimize size={13} /> : <Maximize size={13} />}
                    </TBtn>
                </div>
                <div className="ae-toolbar__stats">
                    <span title="Words">{(editor?.storage.characterCount?.words?.() ?? 0).toLocaleString()} w</span>
                    <span title="Characters">{(editor?.storage.characterCount?.characters?.() ?? 0).toLocaleString()} ch</span>
                    <span title="Reading time" className="ae-toolbar__stats-read">{Math.ceil((editor?.storage.characterCount?.words?.() ?? 0) / 200) || 0} min</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`ae-tiptap-wrap ${zenMode ? 'ae-tiptap-wrap--zen' : ''}`}>
            {zenMode && (
                <div className="ae-zen-bar">
                    <span className="ae-zen-bar__hint">Zen Mode — press <kbd>Esc</kbd> to exit</span>
                    <button type="button" className="ae-zen-bar__exit" onClick={() => setZenMode(false)}>
                        <X size={13} /> Exit
                    </button>
                </div>
            )}

            {/* ══ Ribbon tab strip ══════════════════════════════════ */}
            <div className='editor-bar'>
                <div className="ae-editor-bar-strip">
                    {
                    
                    TABS.map((tab,index) => (
                        <button
                        key={tab.id}
                        type="button"
                        style={{
                            borderRadius: index === 0 
                                ? "12px 0 0 0" 
                                : index === TABS.length - 1 
                                    ? "0 12px 0 0" 
                                    : "0"
                        }}
                        className={`ae-editor-bar-tab ${activeTab === tab.id ? 'ae-ribbon-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
                {renderRibbonGroup()}
            </div>
            <EditorContent editor={editor} className="ae-editor ae-editor--tiptap" dir={docDir} />

            {editable && <DragHandle editor={editor} dir={docDir} />}

            {slash.open && (
                <SlashMenuList
                    editor={editor}
                    query={slash.query}
                    coords={slash.coords}
                    dir={docDir}
                    onClose={() => setSlash(s => ({ ...s, open: false }))}
                    onExec={execSlash}
                />
            )}

            <FloatingBubbleMenu editor={editor} onAiAction={handleAiAction} />

            {showLink && (
                <LinkDialog
                    initial={linkHref ?? ''}
                    onConfirm={handleLinkConfirm}
                    onRemove={() => editor.chain().focus().unsetLink().run()}
                    onClose={() => setShowLink(false)}
                />
            )}
            {showMedia && (
                <MediaModal
                    onInsert={handleImageInsert}
                    onGalleryInsert={handleGalleryInsert}
                    onClose={() => setShowMedia(false)}
                />
            )}
            {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
        </div>
    );
});

export default TipTapEditor;
