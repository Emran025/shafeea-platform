import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Editor } from '@tiptap/react';
import {
    Heading2, Heading3, Heading4, Pilcrow,
    List, ListOrdered, Quote, Code2, Minus,
    Image as ImageIcon, Table as TableIcon,
} from 'lucide-react';

/* ── Command definitions ───────────────────────────────────────── */
export interface SlashCommand {
    id:      string;
    icon:    React.ReactNode;
    label:   string;
    desc:    string;
    action:  (editor: Editor) => void;
}

const COMMANDS: SlashCommand[] = [
    {
        id: 'heading2', icon: <Heading2 size={16} />, label: 'Heading 1', desc: 'Big section heading',
        action: e => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        id: 'heading3', icon: <Heading3 size={16} />, label: 'Heading 2', desc: 'Medium section heading',
        action: e => e.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        id: 'heading4', icon: <Heading4 size={16} />, label: 'Heading 3', desc: 'Small section heading',
        action: e => e.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
        id: 'paragraph', icon: <Pilcrow size={16} />, label: 'Paragraph', desc: 'Plain text block',
        action: e => e.chain().focus().setParagraph().run(),
    },
    {
        id: 'bullet', icon: <List size={16} />, label: 'Bullet List', desc: 'Unordered list',
        action: e => e.chain().focus().toggleBulletList().run(),
    },
    {
        id: 'ordered', icon: <ListOrdered size={16} />, label: 'Numbered List', desc: 'Ordered list',
        action: e => e.chain().focus().toggleOrderedList().run(),
    },
    {
        id: 'blockquote', icon: <Quote size={16} />, label: 'Blockquote', desc: 'Highlighted quote',
        action: e => e.chain().focus().toggleBlockquote().run(),
    },
    {
        id: 'codeblock', icon: <Code2 size={16} />, label: 'Code Block', desc: 'Monospace code block',
        action: e => e.chain().focus().toggleCodeBlock().run(),
    },
    {
        id: 'divider', icon: <Minus size={16} />, label: 'Divider', desc: 'Horizontal separator',
        action: e => e.chain().focus().setHorizontalRule().run(),
    },
    {
        id: 'image', icon: <ImageIcon size={16} />, label: 'Image', desc: 'Insert image from URL',
        action: e => {
            const url = window.prompt('Image URL:');
            if (url) e.chain().focus().setImage({ src: url }).run();
        },
    },
    {
        id: 'table', icon: <TableIcon size={16} />, label: 'Table', desc: '3×3 table',
        action: e => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
];

/* ── Props ─────────────────────────────────────────────────────── */
export interface SlashMenuListProps {
    editor:  Editor;
    query:   string;
    coords:  { top: number; left: number };
    dir:     'ltr' | 'rtl';
    onClose: () => void;
    onExec:  (cmd: SlashCommand) => void;
}

/* ── Component ─────────────────────────────────────────────────── */
export default function SlashMenuList({ editor, query, coords, dir, onClose, onExec }: SlashMenuListProps) {
    const [active, setActive] = useState(0);
    const listRef  = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const filtered = COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase()),
    );

    useEffect(() => { setActive(0); }, [query]);

    useEffect(() => {
        itemRefs.current[active]?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!filtered.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                setActive(i => (i + 1) % filtered.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                setActive(i => (i - 1 + filtered.length) % filtered.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                if (filtered[active]) onExec(filtered[active]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handler, true);
        return () => window.removeEventListener('keydown', handler, true);
    }, [active, filtered, onExec, onClose]);

    if (!filtered.length) return null;

    const style: React.CSSProperties = {
        position: 'fixed',
        top:  coords.top,
        left: dir === 'rtl' ? undefined : coords.left,
        right: dir === 'rtl' ? `calc(100vw - ${coords.left}px)` : undefined,
        zIndex: 9998,
    };

    return createPortal(
        <motion.div
            ref={listRef}
            className="ae-slash-menu"
            style={style}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
        >
            <div className="ae-slash-menu__header">
                {query ? `"/${query}"` : 'Insert block'}
            </div>
            <div className="ae-slash-menu__list">
                {filtered.map((cmd, i) => (
                    <button
                        key={cmd.id}
                        ref={el => { itemRefs.current[i] = el; }}
                        type="button"
                        className={`ae-slash-item ${i === active ? 'ae-slash-item--active' : ''}`}
                        onMouseEnter={() => setActive(i)}
                        onMouseDown={(e) => { e.preventDefault(); onExec(cmd); }}
                    >
                        <span className="ae-slash-item__icon">{cmd.icon}</span>
                        <span className="ae-slash-item__text">
                            <span className="ae-slash-item__label">{cmd.label}</span>
                            <span className="ae-slash-item__desc">{cmd.desc}</span>
                        </span>
                    </button>
                ))}
            </div>
        </motion.div>,
        document.body,
    );
}
