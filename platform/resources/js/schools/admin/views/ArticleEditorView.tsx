import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate }    from 'react-router-dom';
import {
    ArrowLeft, Save, Send, Globe, CheckCircle2,
    AlertCircle, Search, X, FileText, Tag,
    Image as ImageIcon, Info,
    Home, PenTool, Layout, Eye, Rocket,
} from 'lucide-react';
import type { AdminPage, AdminSection, WorkflowStatus } from '../types';
import {
    fetchPage, fetchSections, updatePage,
    composeSection, updateSectionCompose,
    workflowSubmit, workflowApprove, workflowPublish,
} from '../api/adminClient';
import WorkflowBadge    from '../components/WorkflowBadge';
import { useAuth }      from '../context/AuthContext';
import TipTapEditor     from '../components/TipTapEditor';
import type { TipTapEditorHandle } from '../components/TipTapEditor';
import Button           from '../components/Button';
import MediaModal       from '../components/MediaModal';

/* ─── Types ─────────────────────────────────────────────────────── */
type EditorTab = "Editing" | 'publish';

interface TabDef {
    id:    EditorTab;
    label: string;
    icon:  React.ReactNode;
}

const TABS: TabDef[] = [
    { id: 'Editing',    label: 'Editing',    icon: <Home    size={13} /> },
    { id: 'publish', label: 'Publish', icon: <Rocket  size={13} /> },
];

/* ─── Search helpers ─────────────────────────────────────────────── */
interface SearchMatch { from: number; to: number }

/* ─── Component ─────────────────────────────────────────────────── */
export default function ArticleEditorView() {
    const { id }   = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { can }  = useAuth();

    /* Page data */
    const [page,    setPage]    = useState<AdminPage | null>(null);
    const [section, setSection] = useState<AdminSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [error,   setError]   = useState<string | null>(null);
    const [saved,   setSaved]   = useState(false);

    /* Article fields */
    const [title,         setTitle]         = useState('');
    const [excerpt,       setExcerpt]       = useState('');
    const [category,      setCategory]      = useState('');
    const [tags,          setTags]          = useState('');
    const [slug,          setSlug]          = useState('');
    const [html,          setHtml]          = useState('');
    const [words,         setWords]         = useState(0);
    const [chars,         setChars]         = useState(0);
    const [coverImageUrl, setCoverImageUrl] = useState('');

    /* UI state */
    const [activeTab,       setActiveTab]       = useState<EditorTab>('Editing');
    const [showCoverModal,  setShowCoverModal]  = useState(false);

    /* Search state */
    const [searchQuery,   setSearchQuery]   = useState('');
    const [searchActive,  setSearchActive]  = useState(false);
    const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
    const [searchIdx,     setSearchIdx]     = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);

    /* Editor refs */
    const editorRef      = useRef<TipTapEditorHandle>(null);
    const editorInstance = useRef<import('@tiptap/react').Editor | null>(null);

    /* ── Load ─────────────────────────────────────────────────── */
    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [p, secs] = await Promise.all([
                fetchPage(id),
                fetchSections({ page_id: id }),
            ]);
            setPage(p);
            setTitle(p.identity_title?.en ?? '');
            setSlug(p.slug);

            const ogImage  = (p as any).meta_og_image as { url?: string } | null;
            const rawCover = ogImage?.url ?? '';
            let normCover  = rawCover;
            try {
                if (rawCover) {
                    const u = new URL(rawCover);
                    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                        normCover = u.pathname + u.search + u.hash;
                    }
                }
            } catch { /* already relative */ }
            setCoverImageUrl(normCover);

            const bodySec = secs.data.find(
                (s: AdminSection) => s.type === 'prose_body' || s.type === 'rich_text',
            );
            if (bodySec) {
                setSection(bodySec);
                const bodyBlock = bodySec.blocks?.find((b: { type: string }) => b.type === 'rich_text');
                const content   = bodyBlock?.content as Record<string, unknown> | null;
                const enContent = (content?.en as Record<string, unknown>)?.fields as Record<string, string> | undefined;
                setHtml(enContent?.body ?? '');
                if (enContent?.excerpt)  setExcerpt(enContent.excerpt);
                if (enContent?.category) setCategory(enContent.category);
                if (enContent?.tags) {
                    const rawTags = enContent.tags as string | string[];
                    setTags(Array.isArray(rawTags) ? rawTags.join(', ') : rawTags);
                }
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load article');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    /* ── Save ─────────────────────────────────────────────────── */
    const handleSave = async (currentHtml: string) => {
        if (!id || !page) return;
        setSaving(true);
        setError(null);
        try {
            await updatePage(id, {
                slug,
                identity_title: { en: title },
                meta_og_image:  coverImageUrl.trim() ? { url: coverImageUrl.trim() } : null,
            });

            const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

            const blockPayload = {
                blocks:        [{ type: 'rich_text', fields: { body: currentHtml, excerpt, category, tags: parsedTags } }],
                identity_name: 'Article Body',
            };

            if (section) {
                await updateSectionCompose(section.id, blockPayload);
            } else {
                const newSec = await composeSection({
                    page_id:           id,
                    type:              'prose_body',
                    ordering_position: 0,
                    ...blockPayload,
                });
                setSection(newSec);
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!id) return;
        await handleSave(html);
        try { await workflowSubmit('page', id); await load(); }
        catch (e) { setError(e instanceof Error ? e.message : 'Submit failed'); }
    };

    const handleApprove = async () => {
        if (!id) return;
        try { await workflowApprove('page', id); await load(); }
        catch (e) { setError(e instanceof Error ? e.message : 'Approve failed'); }
    };

    const handlePublish = async () => {
        if (!id) return;
        try { await workflowPublish('page', id); await load(); }
        catch (e) { setError(e instanceof Error ? e.message : 'Publish failed'); }
    };

    /* ── Search ───────────────────────────────────────────────── */
    const runSearch = useCallback((query: string) => {
        const editor = editorInstance.current;
        if (!editor || !query.trim()) {
            setSearchMatches([]);
            return;
        }
        const matches: SearchMatch[] = [];
        const q = query.toLowerCase();
        editor.state.doc.descendants((node, pos) => {
            if (node.isText && node.text) {
                let idx = 0;
                while (true) {
                    const found = node.text.toLowerCase().indexOf(q, idx);
                    if (found === -1) break;
                    matches.push({ from: pos + found, to: pos + found + q.length });
                    idx = found + 1;
                }
            }
        });
        setSearchMatches(matches);
        setSearchIdx(0);
        if (matches.length > 0 && editor) {
            editor.commands.setTextSelection(matches[0]);
            editor.commands.scrollIntoView();
        }
    }, []);

    const navigateSearch = useCallback((dir: 1 | -1) => {
        const editor = editorInstance.current;
        if (!editor || searchMatches.length === 0) return;
        const next = (searchIdx + dir + searchMatches.length) % searchMatches.length;
        setSearchIdx(next);
        editor.commands.setTextSelection(searchMatches[next]);
        editor.commands.scrollIntoView();
    }, [searchIdx, searchMatches]);

    useEffect(() => {
        if (searchActive) searchInputRef.current?.focus();
    }, [searchActive]);

    /* ── Keyboard shortcut: Ctrl+F ────────────────────────────── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setSearchActive(true);
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchActive) {
                setSearchActive(false);
                setSearchQuery('');
                setSearchMatches([]);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [searchActive]);

    /* ── Editor ready callback ────────────────────────────────── */
    const handleEditorReady = useCallback((editor: import('@tiptap/react').Editor) => {
        editorInstance.current = editor;
    }, []);

    /* ── Derived ─────────────────────────────────────────────── */
    if (loading) return (
        <div className="ae-load-screen">
            <div className="ae-load-spinner" />
            <span>Loading editor…</span>
        </div>
    );
    if (!page) return <div className="adm-error-banner">Article not found.</div>;

    const canPublish = can('publish');
    const canApprove = can('approve');
    const canSubmit  = can('submit_for_review');
    const status     = page.status as WorkflowStatus;
    const minRead    = Math.ceil(words / 200) || 0;

    /* ── Metadata sidebar (right panel of Publish tab) ─────────── */
    const metaPanel = (
        <div className="ae-publish-panel">

            {/* Slug */}
            <div className="ae-publish-field">
                <label className="ae-publish-field__label">
                    <FileText size={11} /> URL Slug
                </label>
                <input
                    className="ae-publish-field__input"
                    value={slug}
                    onChange={e => { setSlug(e.target.value); setSaved(false); }}
                    placeholder="article-slug"
                />
            </div>

            {/* Category */}
            <div className="ae-publish-field">
                <label className="ae-publish-field__label">
                    <Tag size={11} /> Category
                </label>
                <input
                    className="ae-publish-field__input"
                    value={category}
                    onChange={e => { setCategory(e.target.value); setSaved(false); }}
                    placeholder="e.g. Platform News"
                />
            </div>

            {/* Tags */}
            <div className="ae-publish-field">
                <label className="ae-publish-field__label">
                    <Tag size={11} /> Tags
                </label>
                <input
                    className="ae-publish-field__input"
                    value={tags}
                    onChange={e => { setTags(e.target.value); setSaved(false); }}
                    placeholder="enterprise, accore, api"
                />
            </div>

            <div className="ae-publish-sep" />

            {/* Cover image */}
            <div className="ae-publish-field ae-publish-field--cover">
                <label className="ae-publish-field__label">
                    <ImageIcon size={11} /> Cover Image
                </label>
                <div className="ae-publish-cover">
                    {coverImageUrl ? (
                        <div className="ae-publish-cover__preview">
                            <img
                                src={coverImageUrl}
                                alt="Cover"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <button
                                type="button"
                                className="ae-publish-cover__clear"
                                onClick={() => setCoverImageUrl('')}
                                title="Remove cover image"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="ae-publish-cover__pick"
                            onClick={() => setShowCoverModal(true)}
                        >
                            <ImageIcon size={16} />
                            <span>Select Cover Image</span>
                        </button>
                    )}
                    {coverImageUrl && (
                        <button
                            type="button"
                            className="ae-publish-cover__change"
                            onClick={() => setShowCoverModal(true)}
                        >
                            Change image
                        </button>
                    )}
                </div>
            </div>

            <div className="ae-publish-sep" />

            {/* Article info */}
            <div className="ae-publish-field">
                <label className="ae-publish-field__label"><Info size={11} /> Status</label>
                <WorkflowBadge status={status} />
            </div>
            {(page as any).created_at && (
                <div className="ae-publish-field">
                    <label className="ae-publish-field__label">Created</label>
                    <span className="ae-publish-value">
                        {new Date((page as any).created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            )}
            {page.published_at && (
                <div className="ae-publish-field">
                    <label className="ae-publish-field__label">Published</label>
                    <span className="ae-publish-value">
                        {new Date(page.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            )}

            <div className="ae-publish-sep" />

            {/* Workflow actions */}
            <div className="ae-publish-actions">
                <Button
                    variant="ghost"
                    size="sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => handleSave(html)}
                    loading={saving}
                    loadingText={<><Save size={13} /> Saving…</>}
                >
                    <Save size={13} /> Save Draft
                </Button>

                {canSubmit && status === 'draft' && (
                    <Button
                        variant="primary"
                        size="sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handleSubmit}
                        loading={saving}
                        loadingText={<><Send size={13} /> Submitting…</>}
                    >
                        <Send size={13} /> Submit for Review
                    </Button>
                )}
                {canApprove && status === 'in_review' && (
                    <Button
                        variant="approve"
                        size="sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handleApprove}
                        disabled={saving}
                    >
                        <CheckCircle2 size={13} /> Approve
                    </Button>
                )}
                {canPublish && status === 'approved' && (
                    <Button
                        variant="publish"
                        size="sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handlePublish}
                        disabled={saving}
                    >
                        <Globe size={13} /> Publish Now
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="ae-root ae-root--standalone">

            {/* ══ Top bar ══════════════════════════════════════════ */}
            <div className="ae-topbar ae-topbar--standalone">

                {/* Left: back + article name */}
                <div className="ae-topbar__left">
                    <Button
                        className="ae-back-btn"
                        onClick={() => navigate('/admin/articles')}
                        title="Back to articles"
                    >
                        <ArrowLeft size={15} />
                        <span>Articles</span>
                    </Button>
                    {title && (
                        <>
                            <span className="ae-topbar__sep">›</span>
                            <span className="ae-topbar__article-name">{title}</span>
                        </>
                    )}
                </div>

                {/* Center: search bar */}
                <div className="ae-topbar__center">
                    <div className={`ae-search-bar ${searchActive ? 'ae-search-bar--active' : ''}`}>
                        <Search size={13} className="ae-search-bar__icon" />
                        <input
                            ref={searchInputRef}
                            className="ae-search-bar__input"
                            placeholder="Find in article…"
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); runSearch(e.target.value); }}
                            onFocus={() => setSearchActive(true)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') navigateSearch(e.shiftKey ? -1 : 1);
                                if (e.key === 'Escape') { setSearchActive(false); setSearchQuery(''); setSearchMatches([]); }
                            }}
                        />
                        {searchQuery && (
                            <span className="ae-search-bar__count">
                                {searchMatches.length > 0 ? `${searchIdx + 1}/${searchMatches.length}` : 'No matches'}
                            </span>
                        )}
                        {searchQuery && (
                            <>
                                <button type="button" className="ae-search-bar__nav" onClick={() => navigateSearch(-1)} title="Previous (Shift+Enter)">↑</button>
                                <button type="button" className="ae-search-bar__nav" onClick={() => navigateSearch(1)}  title="Next (Enter)">↓</button>
                                <button type="button" className="ae-search-bar__clear" onClick={() => { setSearchQuery(''); setSearchMatches([]); setSearchActive(false); }}>
                                    <X size={12} />
                                </button>
                            </>
                        )}
                        {!searchActive && (
                            <span className="ae-search-bar__hint">Ctrl+F</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ Ribbon tab strip ══════════════════════════════════ */}
            <div className="ae-ribbon-strip">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`ae-ribbon-tab ${activeTab === tab.id ? 'ae-ribbon-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}

                {/* Right: stats + badge + actions */}
                <div className="ae-topbar__right">
                    <div className="ae-topbar__stats">
                        <span title="Words">{words.toLocaleString()} w</span>
                        <span className="ae-topbar__stats-dot">·</span>
                        <span title="Characters">{chars.toLocaleString()} ch</span>
                        <span className="ae-topbar__stats-dot">·</span>
                        <span title="Reading time">{minRead} min</span>
                    </div>

                    <div className="ae-topbar__divider" />

                    <WorkflowBadge status={status} />

                    <div className="ae-topbar__actions">
                        {error && (
                            <span className="ae-save-err" title={error}>
                                <AlertCircle size={13} /> Error
                            </span>
                        )}
                        {saved && (
                            <span className="ae-save-ok">
                                <CheckCircle2 size={13} /> Saved
                            </span>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(html)}
                            loading={saving}
                            loadingText={<><Save size={13} /> Saving…</>}
                        >
                            <Save size={13} />
                            Save
                        </Button>

                        {canSubmit && status === 'draft' && (
                            <Button variant="primary" size="sm" onClick={handleSubmit} loading={saving} loadingText={<><Send size={13} /> Submitting…</>}>
                                <Send size={13} /> Submit
                            </Button>
                        )}
                        {canApprove && status === 'in_review' && (
                            <Button variant="approve" size="sm" onClick={handleApprove} disabled={saving}>
                                <CheckCircle2 size={13} /> Approve
                            </Button>
                        )}
                        {canPublish && status === 'approved' && (
                            <Button variant="publish" size="sm" onClick={handlePublish} disabled={saving}>
                                <Globe size={13} /> Publish
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ Body ═════════════════════════════════════════════ */}
            {activeTab === 'publish' ? (
                /* Publish tab: full-width two-column form */
                <div className="ae-publish-form">

                    {/* Left: article identity */}
                    <div className="ae-publish-article">
                        <div className="ae-publish-article__section">
                            <div className="ae-publish-article__label">Headline</div>
                            <input
                                className="ae-publish-article__title"
                                value={title}
                                onChange={e => { setTitle(e.target.value); setSaved(false); }}
                                placeholder="Article headline…"
                            />
                        </div>

                        <div className="ae-publish-article__section">
                            <div className="ae-publish-article__label">Summary · Excerpt</div>
                            <textarea
                                className="ae-publish-article__excerpt"
                                value={excerpt}
                                onChange={e => { setExcerpt(e.target.value); setSaved(false); }}
                                placeholder="A concise description shown in article listings and social previews…"
                                rows={6}
                            />
                        </div>
                        {metaPanel}
                    </div>
                </div>
            ) : (

                /* Editor tabs: writing area */
                <div className="ae-body">
                    <div className="ae-editor-col">
                        {!loading && (
                            <TipTapEditor
                                ref={editorRef}
                                content={html}
                                onChange={(newHtml, wordCount) => {
                                    setHtml(newHtml);
                                    setWords(wordCount);
                                    setChars(newHtml.replace(/<[^>]*>/g, '').length);
                                    setSaved(false);
                                }}
                                editable
                                onEditorReady={handleEditorReady}
                            />
                        )}
                    </div>
                </div>

            )}

            {/* ══ Cover image modal ════════════════════════════════ */}
            {showCoverModal && (
                <MediaModal
                    onInsert={(src) => {
                        setCoverImageUrl(src);
                        setShowCoverModal(false);
                    }}
                    onClose={() => setShowCoverModal(false)}
                />
            )}
        </div>
    );
}
