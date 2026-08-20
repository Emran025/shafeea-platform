import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getDemoStoryImage, getDemoLeadershipPhoto } from '../../admin/lang/demoMedia';
import { SITE_LANG } from '../lang/en';
import TipTapContent from '../components/TipTapContent';

const L = SITE_LANG.stories;

/* ── Types ─────────────────────────────────────────────── */
interface StoryData {
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
    sections:    StorySec[];
    related:     RelatedItem[];
}

interface StorySec {
    type:      'heading' | 'paragraph' | 'quote' | 'image' | 'callout';
    content:   string;
    caption?:  string;
    author?:   string;
    imageUrl?: string;
}

interface RelatedItem { title: string; category: string; date: string; slug: string; }

/* ── Fetch story content ─────────────────────────────────── */
async function fetchStoryContent(slug: string): Promise<{
    title:          string | null;
    body:           string | null;
    excerpt:        string | null;
    publishedAt:    string | null;
    coverImageUrl:  string | null;
    category:       string | null;
}> {
    // 1. Try public articles endpoint — works for published story pages.
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
        };
        return {
            title:         json.title           ?? null,
            body:          json.body            ?? null,
            excerpt:       json.excerpt         ?? null,
            publishedAt:   json.published_at    ?? null,
            coverImageUrl: json.cover_image_url ?? null,
            category:      json.category        ?? null,
        };
    }

    // 2. Admin API fallback — for admins previewing draft stories.
    const token = localStorage.getItem('acc_admin_token');
    if (!token) throw new Error('Story not found');

    const authHeader = { Authorization: `Bearer ${token}` };

    // Try newsroom.story type first, then customer_story as fallback type name.
    for (const type of ['newsroom.story', 'customer_story', 'newsroom.article']) {
        const pagesRes = await fetch(
            `/api/admin/pages?type=${type}&slug=${encodeURIComponent(slug)}&per_page=1`,
            { headers: { Accept: 'application/json', ...authHeader } },
        );
        if (!pagesRes.ok) continue;

        const pagesJson = await pagesRes.json() as {
            data: Array<{
                id: string;
                identity_title?: Record<string, string>;
                published_at?: string;
                meta_og_image?: { url?: string } | null;
            }>
        };
        const pageRow = pagesJson.data[0];
        if (!pageRow) continue;

        const secsRes = await fetch(
            `/api/admin/sections?page_id=${pageRow.id}&per_page=10`,
            { headers: { Accept: 'application/json', ...authHeader } },
        );

        let body:    string | null = null;
        let excerpt: string | null = null;

        if (secsRes.ok) {
            const secsJson = await secsRes.json() as {
                data: Array<{
                    type: string;
                    blocks?: Array<{ type: string; content: unknown }>;
                }>
            };

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
        }

        const title         = pageRow.identity_title?.en ?? null;
        const publishedAt   = pageRow.published_at ?? null;
        const ogImage       = pageRow.meta_og_image;
        const coverImageUrl = (ogImage && typeof ogImage === 'object' && 'url' in ogImage)
            ? (ogImage.url ?? null)
            : null;

        return { title, body, excerpt, publishedAt, coverImageUrl, category: null };
    }

    throw new Error('Story not found');
}

/* ── Deterministic slug → demo image ──────────────────── */
function slugDemoImage(slug: string): string {
    const idx = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 4;
    return getDemoStoryImage(idx).url;
}

interface CardState {
    title?:    string | null;
    imgUrl?:   string | null;
    excerpt?:  string | null;
    date?:     string | null;
    category?: string | null;
}

/* ── Main component ─────────────────────────────────────── */
export default function StoryDetailSection() {
    const { slug }  = useParams<{ slug: string }>();
    const location  = useLocation();
    const cardState = (location.state ?? {}) as CardState;

    const [storyBody,     setStoryBody]     = useState<string | null>(null);
    const [storyTitle,    setStoryTitle]    = useState<string | null>(null);
    const [storyDate,     setStoryDate]     = useState<string | null>(null);
    const [storyHeroUrl,  setStoryHeroUrl]  = useState<string | null>(null);
    const [storyCategory, setStoryCategory] = useState<string | null>(null);
    const [storyExcerpt,  setStoryExcerpt]  = useState<string | null>(null);
    const [loading,       setLoading]       = useState(true);
    const [relatedStories, setRelatedStories] = useState<any[]>([]);

    useEffect(() => {
        setStoryTitle(null);
        setStoryBody(null);
        setStoryDate(null);
        setStoryHeroUrl(null);
        setStoryCategory(null);
        setStoryExcerpt(null);
        setLoading(true);
        setRelatedStories([]);

        if (!slug) { setLoading(false); return; }

        fetchStoryContent(slug)
            .then(({ title, body, publishedAt, coverImageUrl, category, excerpt }) => {
                if (title)         setStoryTitle(title);
                if (body)          setStoryBody(body);
                if (publishedAt)   setStoryDate(publishedAt);
                if (coverImageUrl) setStoryHeroUrl(coverImageUrl);
                if (category)      setStoryCategory(category);
                if (excerpt)       setStoryExcerpt(excerpt);
            })
            .catch(() => { /* fall back to card state / demo data */ })
            .finally(() => setLoading(false));

        // Fetch related stories (other published articles/stories)
        fetch('/api/articles?per_page=50', { headers: { Accept: 'application/json' } })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((json: any) => {
                const list     = json.data ?? [];
                const filtered = list.filter((item: any) => item.slug !== slug).slice(0, 3);
                setRelatedStories(filtered);
            })
            .catch(() => {});
    }, [slug]);

    // Resolve display values: API data → card state → demo fallback
    const demo     = buildDemoStory(slug ?? 'story');
    const title    = storyTitle    ?? cardState.title    ?? demo.title;
    const category = storyCategory ?? cardState.category ?? demo.category;
    const heroUrl  = storyHeroUrl
        ?? (cardState.imgUrl && cardState.imgUrl.trim() ? cardState.imgUrl : null)
        ?? slugDemoImage(slug ?? 'story');
    const subtitle = storyExcerpt ?? cardState.excerpt ?? demo.subtitle;

    let date: string;
    if (storyDate) {
        date = new Date(storyDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } else if (cardState.date) {
        date = cardState.date;
    } else {
        date = demo.date;
    }

    const hasReal = storyBody !== null && storyBody.length > 10;

    useEffect(() => {
        document.title = `${title} · ACCSYSTEM Stories`;
    }, [title]);

    // Map related items for display
    const processedRelated = relatedStories.map((r: any) => {
        let rTitle = '';
        if (typeof r.title === 'string') {
            rTitle = r.title;
        } else if (r.identity_title) {
            rTitle = r.identity_title.en ?? Object.values(r.identity_title)[0] ?? '';
        }
        if (!rTitle) rTitle = r.slug ?? 'Untitled Story';

        let rDate = '';
        if (r.date) {
            rDate = r.date;
        } else if (r.published_at) {
            rDate = new Date(r.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        return {
            title:           rTitle,
            category:        r.category ?? 'Story',
            date:            rDate,
            slug:            r.slug,
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
                <Link to="/stories" className="article-detail__back">{L.backToStories}</Link>
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
                        <img
                            src={demo.authorPhoto}
                            alt={demo.authorName}
                            className="article-detail__author-photo"
                            loading="lazy"
                        />
                        <div>
                            <span className="article-detail__author-name">{L.by} {demo.authorName}</span>
                            <span className="article-detail__author-title">{demo.authorTitle}</span>
                        </div>
                    </div>
                    <div className="article-detail__meta-right">
                        <span className="article-detail__date">{L.publishedOn}: {date}</span>
                        <span className="article-detail__read-time">{demo.readTime} {L.minuteRead}</span>
                        <button className="article-detail__share-btn">↗ {L.shareStory}</button>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="article-detail__body">
                <p className="article-detail__lead">{demo.lead}</p>

                {loading && (
                    <div className="article-detail__loading">{L.loading}</div>
                )}

                {!loading && hasReal ? (
                    <TipTapContent html={storyBody!} className="article-detail__tiptap" />
                ) : (
                    !loading && demo.sections.map((sec, i) => (
                        <StorySection key={i} section={sec} index={i} />
                    ))
                )}

                {demo.keywords.length > 0 && (
                    <div className="article-detail__keywords">
                        <span className="article-detail__keywords-label">{L.keywords}:</span>
                        {demo.keywords.map(kw => (
                            <a key={kw} href={`/stories?q=${kw}`} className="article-detail__keyword">#{kw}</a>
                        ))}
                    </div>
                )}
            </div>

            {/* Related stories */}
            <div className="article-detail__related">
                <div className="article-detail__related-inner">
                    <h2 className="article-detail__related-heading">{L.relatedStories}</h2>
                    <div className="news-card-grid news-card-grid--related">
                        {processedRelated.length > 0 ? (
                            processedRelated.map((r, i) => (
                                <RelatedCard key={i} item={r} index={i + 1} />
                            ))
                        ) : (
                            demo.related.map((r, i) => (
                                <RelatedCard key={i} item={r} index={i + 1} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Fallback demo section renderer ────────────────────── */
function StorySection({ section, index }: { section: StorySec; index: number }) {
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
        const img = section.imageUrl ?? getDemoStoryImage(index + 1).url;
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
    const img       = item.cover_image_url ?? slugDemoImage(item.slug);
    const cardState = {
        title:    item.title,
        imgUrl:   img,
        excerpt:  null,
        date:     item.date,
        category: item.category,
    };
    return (
        <article className="news-card news-card--sm">
            <Link to={`/stories/${item.slug}`} state={cardState} className="news-card__thumb-link" tabIndex={-1}>
                <div className="news-card__thumb">
                    <img src={img} alt={item.title} loading="lazy" />
                </div>
            </Link>
            <div className="news-card__body">
                <span className="news-card__category">{item.category}</span>
                <h3 className="news-card__title">
                    <Link to={`/stories/${item.slug}`} state={cardState}>{item.title}</Link>
                </h3>
                <div className="news-card__footer">
                    <span className="news-card__date">{item.date}</span>
                    <Link to={`/stories/${item.slug}`} state={cardState} className="news-card__read-more">Read →</Link>
                </div>
            </div>
        </article>
    );
}

/* ── Demo data builder ──────────────────────────────────── */
function buildDemoStory(slug: string): StoryData {
    const idx     = Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 4;
    const heroImg = getDemoStoryImage(idx).url;

    return {
        title:       'How ACCSYSTEM Transformed Enterprise Content Operations at Scale',
        subtitle:    'A deep dive into how a global enterprise reduced time-to-publish by 60% and unified content delivery across three product platforms.',
        category:    'Customer Story',
        date:        '15 June 2026',
        readTime:    '5',
        heroUrl:     heroImg,
        lead:        "When a leading enterprise organisation sought to modernise its content operations, they turned to ACCSYSTEM's integrated platform. What followed was a 12-month transformation that changed how 200+ editorial staff collaborate, publish, and measure impact.",
        authorName:  'Editorial Team',
        authorTitle: 'ACCSYSTEM Content Studio',
        authorPhoto: getDemoLeadershipPhoto(1).url,
        keywords:    ['enterprise', 'content', 'transformation', 'editorial', 'efficiency'],
        body:        null,
        sections: [
            { type: 'heading'   as const, content: 'The Challenge: Fragmented Content Workflows' },
            { type: 'paragraph' as const, content: 'Before adopting ACCSYSTEM, the organisation managed content across seven separate systems — each with its own approval workflow, publishing cadence, and analytics stack. Editorial teams spent an average of 4.2 hours per article navigating system handoffs.' },
            { type: 'quote'     as const, content: 'We were spending more time managing tools than creating content. ACCSYSTEM gave us back our editorial focus.', author: 'Head of Digital, Enterprise Client' },
            { type: 'image'     as const, content: '', caption: 'The unified editorial dashboard replaced seven legacy systems.' },
            { type: 'heading'   as const, content: 'The Solution: A Unified Content Engine' },
            { type: 'paragraph' as const, content: "ACCSYSTEM's content engine — built on structured JSON contracts — provided a single source of truth. Editorial staff could now draft, review, schedule, and publish from one interface, with role-based permissions ensuring appropriate access at every stage." },
            { type: 'callout'   as const, content: 'Result: 60% reduction in time-to-publish, 40% improvement in content consistency scores, and full audit traceability across all 200+ editorial contributors.' },
            { type: 'paragraph' as const, content: 'The phased rollout began with the news vertical before expanding to stories, product updates, and regulatory disclosures — all served through the same rendering contract.' },
        ],
        related: [
            { title: 'accommerce Merchant Adoption Doubles in Q1 2026',          category: 'Commerce', date: '10 Jun 2026', slug: 'accommerce-merchant-adoption-q1' },
            { title: 'qayd Achieves ISO 27001 Certification',                     category: 'Security', date: '2 Jun 2026',  slug: 'qayd-iso-27001'                  },
            { title: 'ACCSYSTEM Editorial Platform Wins Industry Recognition 2026', category: 'Awards',  date: '25 May 2026', slug: 'editorial-platform-award-2026'   },
        ],
    };
}
