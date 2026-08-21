import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import NewsletterBanner from './NewsletterBanner';
import { getTextField } from '../../utils/blockFields';
import { getDemoNewsImage } from '../../admin/lang/demoMedia';
import { SITE_LANG } from '../lang/en';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

const L = SITE_LANG.news;

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

interface PublishedArticle {
    id:               string;
    slug:             string;
    identity_title:   Record<string, string> | null;
    published_at:     string | null;
    updated_at:       string;
    cover_image_url:  string | null;
    category:         string | null;
    tags:             string[];
    excerpt:          string | null;
    title?:           string;
}

const cardVariant = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function slugImage(slug: string): string {
    const idx = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 8;
    return getDemoNewsImage(idx).url;
}

function titleToSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
}

function articleTitle(a: PublishedArticle): string {
    return a.title
        ?? a.identity_title?.en
        ?? (a.identity_title ? Object.values(a.identity_title)[0] : null)
        ?? a.slug;
}

function matchesQuery(article: PublishedArticle, q: string): boolean {
    if (!q) return true;
    const needle = q.toLowerCase();
    const title  = articleTitle(article).toLowerCase();
    const except = (article.excerpt ?? '').toLowerCase();
    const cat    = (article.category ?? '').toLowerCase();
    const tags   = (article.tags ?? []).join(' ').toLowerCase();
    return title.includes(needle) || except.includes(needle) || cat.includes(needle) || tags.includes(needle);
}

function matchesCategory(article: PublishedArticle, cat: string): boolean {
    if (!cat) return true;
    return (article.category ?? '').toLowerCase() === cat.toLowerCase();
}

/** Search icon SVG */
function SearchIcon() {
    return (
        <svg className="news-search-wrap__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
        </svg>
    );
}

/**
 * NewsArticleGridSection — 2-column card grid for news articles.
 *
 * Includes:
 *  - Full-text search (title, excerpt, category, tags) — synced to ?q= URL param
 *  - Dynamic category filter pills derived from loaded articles — synced to ?cat= URL param
 *  - Result count display + clear-all reset
 *  - DB articles take priority; editorial blocks are fallback
 */
export default function NewsArticleGridSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const sub      = blocks.find(b => b.type === 'subheadline');
    const ctas     = blocks.filter(b => b.type === 'cta');
    const staticArticles = blocks.filter(b => b.type === 'news_article_card');

    const [searchParams, setSearchParams] = useSearchParams();
    const [query,    setQuery]    = useState(searchParams.get('q')  ?? '');
    const [activeCat, setActiveCat] = useState(searchParams.get('cat') ?? '');
    const [inputVal, setInputVal] = useState(query);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [dynamicArticles, setDynamicArticles] = useState<PublishedArticle[]>([]);
    const [dynLoading, setDynLoading]           = useState(true);

    // Fetch DB articles.
    useEffect(() => {
        setDynLoading(true);
        fetch('/api/articles?per_page=100', { headers: { Accept: 'application/json' } })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((json: { data: PublishedArticle[] }) => setDynamicArticles(json.data ?? []))
            .catch(() => setDynamicArticles([]))
            .finally(() => setDynLoading(false));
    }, []);

    // Sync search/cat to URL params.
    useEffect(() => {
        const params: Record<string, string> = {};
        if (query)     params.q   = query;
        if (activeCat) params.cat = activeCat;
        setSearchParams(params, { replace: true });
    }, [query, activeCat]);

    // Debounce typed input → query state.
    function handleInput(val: string) {
        setInputVal(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setQuery(val), 200);
    }

    function clearAll() {
        setInputVal('');
        setQuery('');
        setActiveCat('');
    }

    const showDynamic   = !dynLoading && dynamicArticles.length > 0;
    const showEditorial = !dynLoading && dynamicArticles.length === 0 && staticArticles.length > 0;
    const isFiltering   = query.trim() !== '' || activeCat !== '';

    // ── Build the articles array to filter against ──────────────────────────
    const sourceArticles: PublishedArticle[] = useMemo(() => {
        if (showDynamic) return dynamicArticles;
        if (showEditorial) {
            return staticArticles.map(b => {
                const t = getTextField(b, 'title') ?? '';
                return {
                    id:              b.id,
                    slug:            titleToSlug(t),
                    identity_title:  null,
                    title:           t,
                    published_at:    getTextField(b, 'date') ?? null,
                    updated_at:      '',
                    cover_image_url: getTextField(b, 'image_url') ?? null,
                    category:        getTextField(b, 'category') ?? null,
                    tags:            [],
                    excerpt:         getTextField(b, 'excerpt') ?? null,
                };
            });
        }
        return [];
    }, [showDynamic, showEditorial, dynamicArticles, staticArticles]);

    // ── Unique categories for pills ─────────────────────────────────────────
    const categories: string[] = useMemo(() => {
        const seen = new Set<string>();
        for (const a of sourceArticles) {
            if (a.category) seen.add(a.category);
        }
        return Array.from(seen).sort();
    }, [sourceArticles]);

    // ── Filtered articles ────────────────────────────────────────────────────
    const filtered: PublishedArticle[] = useMemo(() => {
        return sourceArticles.filter(a =>
            matchesQuery(a, query.trim()) && matchesCategory(a, activeCat)
        );
    }, [sourceArticles, query, activeCat]);

    const showEmpty    = !dynLoading && sourceArticles.length === 0 && !showEditorial;
    const showNoResult = !dynLoading && sourceArticles.length > 0 && filtered.length === 0 && isFiltering;
    const showGrid     = !dynLoading && filtered.length > 0;

    return (
        <div className="container">
            {(label || headline || sub) && (
                <SectionHeader label={label} headline={headline} richText={sub} align="left" />
            )}

            {dynLoading && (
                <div style={{ padding: '2rem 0', color: '#94A3B8', fontSize: 14 }}>
                    Loading articles…
                </div>
            )}

            {/* ── Search + Filter bar (shown once articles are loaded) ── */}
            {!dynLoading && sourceArticles.length > 0 && (
                <div className="news-filter-bar">
                    {/* Text search */}
                    <div className="news-search-wrap">
                        <SearchIcon />
                        <input
                            className="news-search-input"
                            type="search"
                            placeholder="Search articles…"
                            value={inputVal}
                            onChange={e => handleInput(e.target.value)}
                            aria-label="Search articles"
                        />
                        {inputVal && (
                            <button
                                className="news-search-clear"
                                onClick={() => handleInput('')}
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Category pills (only when 2+ categories exist) */}
                    {categories.length >= 2 && (
                        <div className="news-cat-pills" role="group" aria-label="Filter by category">
                            <button
                                className={`news-cat-pill${activeCat === '' ? ' news-cat-pill--active' : ''}`}
                                onClick={() => setActiveCat('')}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`news-cat-pill${activeCat === cat ? ' news-cat-pill--active' : ''}`}
                                    onClick={() => setActiveCat(prev => prev === cat ? '' : cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Result count row (shown when filtering) */}
                    {isFiltering && (
                        <div className="news-results-meta">
                            <span>
                                {filtered.length === 0
                                    ? 'No results'
                                    : `${filtered.length} article${filtered.length === 1 ? '' : 's'}`}
                                {query.trim() && <> for <strong>"{query.trim()}"</strong></>}
                                {activeCat && <> in <strong>{activeCat}</strong></>}
                            </span>
                            <button className="news-results-meta__clear" onClick={clearAll}>
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── No-results empty state ── */}
            {showNoResult && (
                <div className="news-no-results">
                    <div className="news-no-results__icon">🔍</div>
                    <p className="news-no-results__title">No articles found</p>
                    <p className="news-no-results__sub">
                        Try a different keyword or remove the category filter.
                    </p>
                    <button className="news-no-results__reset" onClick={clearAll}>
                        Clear filters
                    </button>
                </div>
            )}

            {/* ── Article grid ── */}
            {showGrid && (
                <motion.div
                    className="news-card-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((article, i) => {
                            const title  = articleTitle(article);
                            const slug   = article.slug || titleToSlug(title);
                            const date   = article.published_at ? fmtDate(article.published_at) : '';
                            const imgUrl = article.cover_image_url ?? slugImage(slug);
                            const cat    = article.category ?? 'News';

                            // Build route state for editorial cards (pass-through for detail page)
                            const cardState = !showDynamic
                                ? { title, imgUrl, excerpt: article.excerpt, date: article.published_at, category: cat }
                                : undefined;

                            return (
                                <motion.article
                                    key={article.id}
                                    className="news-card"
                                    variants={cardVariant}
                                    custom={i}
                                    layout
                                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                                >
                                    <Link
                                        to={`/newsroom/news/${slug}`}
                                        state={cardState}
                                        className="news-card__thumb-link"
                                        tabIndex={-1}
                                    >
                                        <div className="news-card__thumb">
                                            <img src={imgUrl} alt={title} loading="lazy" />
                                        </div>
                                    </Link>
                                    <div className="news-card__body">
                                        <span className="news-card__category">{cat}</span>
                                        <h3 className="news-card__title">
                                            <Link to={`/newsroom/news/${slug}`} state={cardState}>{title}</Link>
                                        </h3>
                                        {article.excerpt && (
                                            <p className="news-card__excerpt">{article.excerpt}</p>
                                        )}
                                        <div className="news-card__footer">
                                            {date && <span className="news-card__date">{date}</span>}
                                            <Link
                                                to={`/newsroom/news/${slug}`}
                                                state={cardState}
                                                className="news-card__read-more"
                                            >
                                                {L.readMore} →
                                            </Link>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {showEmpty && (
                <div style={{ padding: '2rem 0', color: '#94A3B8', fontSize: 14 }}>
                    No published articles yet.
                </div>
            )}

            {ctas.length > 0 && (
                <div className="section__cta-row news-list__cta-row">
                    {ctas.map(cta => {
                        const lbl  = getTextField(cta, 'label');
                        const dest = getTextField(cta, 'destination');
                        return (
                            <a key={cta.id} href={dest || '#'} className="btn btn--outline">{lbl}</a>
                        );
                    })}
                </div>
            )}

            {/* ── Newsletter sign-up banner ── */}
            {!dynLoading && <NewsletterBanner />}
        </div>
    );
}
