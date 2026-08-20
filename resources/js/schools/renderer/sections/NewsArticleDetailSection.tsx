import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getDemoNewsImage, getDemoLeadershipPhoto } from '../../admin/lang/demoMedia';
import { SITE_LANG } from '../lang/en';
import TipTapContent from '../components/TipTapContent';

const L = SITE_LANG.news;

/* ── Types ─────────────────────────────────────────────── */
interface ArticleData {
    title:       string;
    subtitle:    string;
    category:    string;
    date:        string;
    readTime:    string;
    heroUrl:     string;
    lead:        string;
    authorName:  string;
    authorTitle: string;
    authorPhoto: string;
    keywords:    string[];
    body:        string | null;
    sections:    ArticleSec[];
    related:     RelatedItem[];
}

interface ArticleSec {
    type:     'heading' | 'paragraph' | 'quote' | 'image' | 'callout';
    content:  string;
    caption?: string;
    author?:  string;
    imageUrl?: string;
}

interface RelatedItem { title: string; category: string; date: string; slug: string; }

/* ── Fetch real article content ─────────────────────────── */
interface ArticleAuthor {
    id:   string;
    name: string;
    role: string;
}

async function fetchArticleContent(slug: string): Promise<{
    title:          string | null;
    body:           string | null;
    excerpt:        string | null;
    publishedAt:    string | null;
    coverImageUrl:  string | null;
    category:       string | null;
    date:           string | null;
    author:         ArticleAuthor | null;
    tags:           string[];
}> {
    // 1. Try the public endpoint first — works for published articles AND editorial blocks.
    const pubRes = await fetch(
        `/api/articles/${encodeURIComponent(slug)}`,
        { headers: { Accept: 'application/json' } },
    );
    if (pubRes.ok) {
        const json = await pubRes.json() as {
            title?:           string | null;
            body?:            string | null;
            excerpt?:         string | null;
            published_at?:    string | null;
            cover_image_url?: string | null;
            category?:        string | null;
            date?:            string | null;
            author?:          ArticleAuthor | null;
            tags?:            string[] | null;
        };
        return {
            title:         json.title           ?? null,
            body:          json.body            ?? null,
            excerpt:       json.excerpt         ?? null,
            publishedAt:   json.published_at    ?? null,
            coverImageUrl: json.cover_image_url ?? null,
            category:      json.category        ?? null,
            date:          json.date            ?? null,
            author:        json.author          ?? null,
            tags:          json.tags            ?? [],
        };
    }

    // 2. Fall back to admin API — used by admins previewing drafts / in-review articles.
    const token = localStorage.getItem('acc_admin_token');
    if (!token) throw new Error('Article not found');

    const authHeader = { Authorization: `Bearer ${token}` };

    const pagesRes = await fetch(
        `/api/admin/pages?type=newsroom.article&slug=${encodeURIComponent(slug)}&per_page=1`,
        { headers: { Accept: 'application/json', ...authHeader } },
    );
    if (!pagesRes.ok) throw new Error('Page not found');

    const pagesJson = await pagesRes.json() as {
        data: Array<{
            id: string;
            identity_title?: Record<string, string>;
            published_at?: string;
            meta_og_image?: { url?: string } | null;
        }>
    };
    const pageRow = pagesJson.data[0];
    if (!pageRow) throw new Error('Article page not found');

    const secsRes = await fetch(
        `/api/admin/sections?page_id=${pageRow.id}&per_page=10`,
        { headers: { Accept: 'application/json', ...authHeader } },
    );
    if (!secsRes.ok) throw new Error('Sections not found');

    const secsJson = await secsRes.json() as {
        data: Array<{
            type: string;
            blocks?: Array<{ type: string; content: unknown }>;
        }>
    };

    let body:    string | null = null;
    let excerpt: string | null = null;

    for (const sec of secsJson.data) {
        if (sec.type === 'prose_body' || sec.type === 'rich_text') {
            const block = sec.blocks?.find(b => b.type === 'rich_text');
            if (block) {
                const content   = block.content as Record<string, unknown> | null;
                const enContent = ((content?.en as Record<string, unknown>)?.fields) as
                    Record<string, string> | undefined;
                body    = enContent?.body ?? null;
                excerpt = enContent?.excerpt ?? null;
                break;
            }
        }
    }

    const title        = pageRow.identity_title?.en ?? null;
    const publishedAt  = pageRow.published_at ?? null;
    const ogImage      = pageRow.meta_og_image;
    const coverImageUrl = (ogImage && typeof ogImage === 'object' && 'url' in ogImage)
        ? (ogImage.url ?? null)
        : null;

    return { title, body, excerpt, publishedAt, coverImageUrl, category: null, date: null, author: null, tags: [] };
}

/* ── Deterministic slug → demo image (matches grid card selection) ── */
function slugDemoImage(slug: string): string {
    const idx = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 8;
    return getDemoNewsImage(idx).url;
}

interface CardState {
    title?:    string | null;
    imgUrl?:   string | null;
    excerpt?:  string | null;
    date?:     string | null;
    category?: string | null;
}

/* ── Main component ─────────────────────────────────────── */
export default function NewsArticleDetailSection() {
    const { slug }    = useParams<{ slug: string }>();
    const location    = useLocation();
    // State passed from the grid card (for editorial/static cards without a DB row).
    const cardState   = (location.state ?? {}) as CardState;

    const [articleBody,     setArticleBody]     = useState<string | null>(null);
    const [articleTitle,    setArticleTitle]    = useState<string | null>(null);
    const [articleDate,     setArticleDate]     = useState<string | null>(null);
    const [articleHeroUrl,  setArticleHeroUrl]  = useState<string | null>(null);
    const [articleCategory, setArticleCategory] = useState<string | null>(null);
    const [articleExcerpt,  setArticleExcerpt]  = useState<string | null>(null);
    const [articleAuthor,   setArticleAuthor]   = useState<ArticleAuthor | null>(null);
    const [articleTags,     setArticleTags]     = useState<string[]>([]);
    const [loading,         setLoading]         = useState(true);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

    useEffect(() => {
        setArticleTitle(null);
        setArticleBody(null);
        setArticleDate(null);
        setArticleHeroUrl(null);
        setArticleCategory(null);
        setArticleExcerpt(null);
        setArticleAuthor(null);
        setArticleTags([]);
        setLoading(true);
        setRelatedArticles([]);

        if (!slug) { setLoading(false); return; }
        fetchArticleContent(slug)
            .then(({ title, body, publishedAt, coverImageUrl, category, date, excerpt, author, tags }) => {
                if (title)         setArticleTitle(title);
                if (body)          setArticleBody(body);
                if (publishedAt)   setArticleDate(publishedAt);
                if (coverImageUrl) setArticleHeroUrl(coverImageUrl);
                if (category)      setArticleCategory(category);
                if (date)          setArticleExcerpt(date);
                if (excerpt)       setArticleExcerpt(excerpt);
                if (author)        setArticleAuthor(author);
                if (tags && tags.length > 0) setArticleTags(tags);
            })
            .catch(() => { /* silently fall back to card state / demo data */ })
            .finally(() => setLoading(false));

        // Fetch related articles from API
        fetch('/api/articles?per_page=50', {
            headers: { Accept: 'application/json' },
        })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((json: any) => {
                const list = json.data ?? [];
                // Filter out the current article to avoid showing it in its own related section
                const filtered = list.filter((item: any) => item.slug !== slug).slice(0, 3);
                setRelatedArticles(filtered);
            })
            .catch(() => {});
    }, [slug]);

    // Resolve display values in priority order:
    // 1. Real data fetched from API (published page OR editorial block lookup)
    // 2. Card state passed via React Router (set when navigating from the grid)
    // 3. Demo fallback
    const demo      = buildDemoArticle(slug ?? 'article');
    const title     = articleTitle    ?? cardState.title    ?? demo.title;
    const category  = articleCategory ?? cardState.category ?? demo.category;
    const heroUrl   = articleHeroUrl
        ?? (cardState.imgUrl && cardState.imgUrl.trim() ? cardState.imgUrl : null)
        ?? slugDemoImage(slug ?? 'article');
    const subtitle  = articleExcerpt ?? cardState.excerpt ?? demo.subtitle;

    // Date: prefer ISO publishedAt → format it; else prefer editorial date string; else demo.
    let date: string;
    if (articleDate) {
        date = new Date(articleDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } else if (cardState.date) {
        date = cardState.date;
    } else {
        date = demo.date;
    }

    const hasReal   = articleBody !== null && articleBody.length > 10;

    useEffect(() => {
        document.title = `${title} · ACCSYSTEM Newsroom`;
    }, [title]);

    // Process relatedArticles list to match RelatedItem structure
    const processedRelated = relatedArticles.map((r: any) => {
        // Resolve title
        let rTitle = '';
        if (typeof r.title === 'string') {
            rTitle = r.title;
        } else if (r.identity_title) {
            rTitle = r.identity_title.en ?? Object.values(r.identity_title)[0] ?? '';
        }
        if (!rTitle) rTitle = r.slug ?? 'Untitled Article';

        // Resolve date
        let rDate = '';
        if (r.date) {
            rDate = r.date;
        } else if (r.published_at) {
            rDate = new Date(r.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        return {
            title: rTitle,
            category: r.category ?? 'News',
            date: rDate,
            slug: r.slug,
            cover_image_url: r.cover_image_url ?? null,
        };
    });

    return (
        <motion.div
            className="article-detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Back link */}
            <div className="article-detail__back-wrap">
                <Link to="/newsroom/news" className="article-detail__back">{L.backToNews}</Link>
            </div>

            {/* Hero */}
            <div className="article-detail__hero">
                <img src={heroUrl} alt={title} className="article-detail__hero-img" loading="eager" />
                <div className="article-detail__hero-overlay" />
                <div className="article-detail__hero-content">
                    <span className="article-detail__category">{category}</span>
                    <h1 className="article-detail__title">{title}</h1>
                    <p className="article-detail__subtitle">{subtitle}</p>
                </div>
            </div>

            {/* Meta bar */}
            <div className="article-detail__meta-bar">
                <div className="article-detail__meta-bar-inner">
                    <div className="article-detail__author">
                        <div className="article-detail__author-avatar" aria-hidden="true">
                            {(articleAuthor?.name ?? demo.authorName).charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="article-detail__author-name">
                                {L.by} {articleAuthor?.name ?? demo.authorName}
                            </span>
                            <span className="article-detail__author-title">
                                {articleAuthor?.role ?? demo.authorTitle}
                            </span>
                        </div>
                    </div>
                    <div className="article-detail__meta-right">
                        <span className="article-detail__date">{L.publishedOn}: {date}</span>
                        <span className="article-detail__read-time">{demo.readTime} {L.minuteRead}</span>
                        <button
                            className="article-detail__share-btn"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title, url: window.location.href }).catch(() => {});
                                } else {
                                    navigator.clipboard.writeText(window.location.href).catch(() => {});
                                }
                            }}
                        >
                            ↗ {L.shareArticle}
                        </button>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="article-detail__body">
                {!hasReal && !loading && (
                    <p className="article-detail__lead">{subtitle || demo.lead}</p>
                )}

                {loading && (
                    <div className="article-detail__loading">Loading article content…</div>
                )}

                {!loading && hasReal ? (
                    <TipTapContent html={articleBody!} className="article-detail__tiptap" />
                ) : (
                    !loading && demo.sections.map((sec, i) => (
                        <ArticleSection key={i} section={sec} index={i} />
                    ))
                )}

                {(articleTags.length > 0 || demo.keywords.length > 0) && (
                    <div className="article-detail__keywords">
                        <span className="article-detail__keywords-label">Keywords:</span>
                        {(articleTags.length > 0 ? articleTags : demo.keywords).map(kw => (
                            <a key={kw} href={`/newsroom/news?q=${kw}`} className="article-detail__keyword">#{kw}</a>
                        ))}
                    </div>
                )}
            </div>

            {/* Related articles */}
            <div className="article-detail__related">
                <div className="article-detail__related-inner">
                    <h2 className="article-detail__related-heading">{L.relatedNews}</h2>
                    <div className="news-card-grid news-card-grid--related">
                        {processedRelated.length > 0 ? (
                            processedRelated.map((r, i) => (
                                <RelatedCard key={i} item={r} index={i + 2} />
                            ))
                        ) : (
                            demo.related.map((r, i) => (
                                <RelatedCard key={i} item={r} index={i + 2} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Fallback demo section renderer ────────────────────── */
function ArticleSection({ section, index }: { section: ArticleSec; index: number }) {
    if (section.type === 'heading')
        return <h2 className="article-detail__h2">{section.content}</h2>;
    if (section.type === 'paragraph')
        return <p className="article-detail__p">{section.content}</p>;
    if (section.type === 'quote')
        return (
            <blockquote className="article-detail__quote">
                <p className="article-detail__quote-text">"{section.content}"</p>
                {section.author && <cite className="article-detail__quote-cite">— {section.author}</cite>}
            </blockquote>
        );
    if (section.type === 'image') {
        const img = section.imageUrl ?? getDemoNewsImage(index + 1).url;
        return (
            <figure className="article-detail__figure">
                <img src={img} alt={section.caption ?? ''} className="article-detail__figure-img" loading="lazy" />
                {section.caption && <figcaption className="article-detail__caption">{section.caption}</figcaption>}
            </figure>
        );
    }
    if (section.type === 'callout')
        return (
            <div className="article-detail__callout">
                <span className="article-detail__callout-icon">💡</span>
                <p>{section.content}</p>
            </div>
        );
    return null;
}

/* ── Related card ───────────────────────────────────────── */
function RelatedCard({ item, index }: { item: RelatedItem & { cover_image_url?: string | null }; index: number }) {
    const img = item.cover_image_url ?? slugDemoImage(item.slug) ?? getDemoNewsImage(index).url;
    const cardState = {
        title: item.title,
        imgUrl: img,
        excerpt: null,
        date: item.date,
        category: item.category
    };
    return (
        <article className="news-card news-card--sm">
            <Link to={`/newsroom/news/${item.slug}`} state={cardState} className="news-card__thumb-link" tabIndex={-1}>
                <div className="news-card__thumb">
                    <img src={img} alt={item.title} loading="lazy" />
                </div>
            </Link>
            <div className="news-card__body">
                <span className="news-card__category">{item.category}</span>
                <h3 className="news-card__title">
                    <Link to={`/newsroom/news/${item.slug}`} state={cardState}>{item.title}</Link>
                </h3>
                <div className="news-card__footer">
                    <span className="news-card__date">{item.date}</span>
                    <Link to={`/newsroom/news/${item.slug}`} state={cardState} className="news-card__read-more">Read →</Link>
                </div>
            </div>
        </article>
    );
}

/* ── Demo data builder ──────────────────────────────────── */
function buildDemoArticle(slug: string) {
    const idx     = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 8;
    const heroImg = getDemoNewsImage(idx).url;

    return {
        title:       'ACCSYSTEM Advances Enterprise Technology Ecosystem with New Platform Integration',
        subtitle:    'The latest release of accore brings seamless multi-platform orchestration across enterprise, consumer, and individual markets.',
        category:    'Platform News',
        date:        '17 June 2026',
        readTime:    '6',
        heroUrl:     heroImg,
        lead:        "ACCSYSTEM has announced a significant expansion of its integrated platform ecosystem, introducing new cross-platform capabilities that connect accore, accommerce, and qayd in a unified operational framework.",
        authorName:  'Pat Publisher',
        authorTitle: 'Head of Editorial, ACCSYSTEM',
        authorPhoto: getDemoLeadershipPhoto(0).url,
        keywords:    ['enterprise', 'platform', 'accore', 'integration', 'cloud'],
        sections: [
            { type: 'heading'   as const, content: 'A New Chapter for Enterprise Integration' },
            { type: 'paragraph' as const, content: 'The integration framework introduces a standardised rendering contract that enables seamless content delivery across all three platform verticals.' },
            { type: 'quote'     as const, content: 'This is the most significant architectural milestone we have reached since the initial platform launch.', author: 'System Admin, CTO' },
            { type: 'image'     as const, content: '', caption: 'The new integration dashboard provides real-time visibility.' },
            { type: 'heading'   as const, content: 'Technical Architecture and Scalability' },
            { type: 'paragraph' as const, content: 'At the core of this advancement is the Content Engine — a Laravel-based backend that composes structured JSON contracts consumed by platform-specific rendering layers.' },
            { type: 'callout'   as const, content: 'Platform Admins can now manage permissions, topics, and keywords directly from the editorial dashboard.' },
            { type: 'paragraph' as const, content: 'The scheduling and versioning system ensures that published content maintains a clear lineage, with every edit tracked through an append-only audit trail.' },
        ],
        related: [
            { title: 'accommerce Platform Reaches 10,000 Active Merchants', category: 'Commerce', date: '12 Jun 2026', slug: 'accommerce-10k-merchants' },
            { title: 'qayd Mobile App Launches New AI-Powered Features',    category: 'Mobile',   date: '5 Jun 2026',  slug: 'qayd-ai-features'        },
            { title: 'ACCSYSTEM Expands Cloud Infrastructure in MENA Region', category: 'Cloud', date: '28 May 2026', slug: 'cloud-mena-expansion'    },
        ],
    };
}
