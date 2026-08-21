/**
 * admin/lang/demoMedia.ts
 * Demo media image URLs for the editorial content engine.
 * Uses local /media/ files from public/media — seeded into the media DB table.
 *
 * Storage convention:
 *   - Demo images are served from /media/ (public/media/)
 *   - Production images are stored in /storage/media/{uuid}/filename
 *   - The Media model tracks path, url, mime_type, width, height
 */

export const DEMO_MEDIA = {

    // ── Platform logos ───────────────────────────────────────────────
    platforms: [
        { id: 'media-accore',     url: '/media/accore-platform.svg',     alt: 'accore platform' },
        { id: 'media-accommerce', url: '/media/accommerce-platform.svg',  alt: 'accommerce platform' },
        { id: 'media-qayd',       url: '/media/qayd-platform.svg',        alt: 'qayd platform' },
    ],

    // ── News article thumbnails ──────────────────────────────────────
    news: [
        { id: 'media-news-01', url: '/media/cover-page-1-1-1024x576.png',  alt: 'Enterprise technology overview' },
        { id: 'media-news-02', url: '/media/image-113-1024x597.png',        alt: 'Platform architecture' },
        { id: 'media-news-03', url: '/media/COCOON-PAVEL-DUROV-SECRET-KERNEL-GROWTH-confidential-computing-2026-3.png', alt: 'Confidential computing' },
        { id: 'media-news-04', url: '/media/France-Y-Model-Y-is-here.png',  alt: 'Product launch' },
        { id: 'media-news-05', url: '/media/maxresdefault.jpg',             alt: 'Feature story' },
        { id: 'media-news-06', url: '/media/invoice_envoicing-hub_01.png',  alt: 'Invoicing hub' },
        { id: 'media-news-07', url: '/media/01_Map.png',                    alt: 'Map overview' },
        { id: 'media-news-08', url: '/media/a22587226f6a2c840e045e23364f.jpg', alt: 'Editorial photo' },
    ],

    // ── Stories / customer success ───────────────────────────────────
    stories: [
        { id: 'media-story-01', url: '/media/cover-page-1-1-1024x576.png',  alt: 'Customer success story' },
        { id: 'media-story-02', url: '/media/image-113-1024x597.png',        alt: 'Enterprise transformation' },
        { id: 'media-story-03', url: '/media/COCOON-PAVEL-DUROV-SECRET-KERNEL-GROWTH-confidential-computing-2026-3.png', alt: 'Digital journey story' },
        { id: 'media-story-04', url: '/media/France-Y-Model-Y-is-here.png',  alt: 'Growth story' },
    ],

    // ── Leadership / team portraits ───────────────────────────────────
    leadership: [
        { id: 'media-person-01', url: '/media/a22587226f6a2c840e045e23364f.jpg', alt: 'CEO portrait' },
        { id: 'media-person-02', url: '/media/maxresdefault.jpg',                alt: 'CTO portrait' },
        { id: 'media-person-03', url: '/media/invoice_envoicing-hub_01.png',     alt: 'COO portrait' },
        { id: 'media-person-04', url: '/media/01_Map.png',                       alt: 'VP Engineering' },
    ],

    // ── Article detail hero images ────────────────────────────────────
    articleHero: [
        { id: 'media-hero-01', url: '/media/cover-page-1-1-1024x576.png',  alt: 'Article hero' },
        { id: 'media-hero-02', url: '/media/image-113-1024x597.png',        alt: 'Article hero' },
        { id: 'media-hero-03', url: '/media/COCOON-PAVEL-DUROV-SECRET-KERNEL-GROWTH-confidential-computing-2026-3.png', alt: 'Article hero' },
    ],

    // ── Fallback placeholder ──────────────────────────────────────────
    placeholder: '/media/cover-page-1-1-1024x576.png',
};

/**
 * Get a demo news image by index (wraps around if out of bounds).
 */
export function getDemoNewsImage(index: number) {
    return DEMO_MEDIA.news[index % DEMO_MEDIA.news.length];
}

/**
 * Get a demo leadership photo by index.
 */
export function getDemoLeadershipPhoto(index: number) {
    return DEMO_MEDIA.leadership[index % DEMO_MEDIA.leadership.length];
}

/**
 * Get a demo story image by index.
 */
export function getDemoStoryImage(index: number) {
    return DEMO_MEDIA.stories[index % DEMO_MEDIA.stories.length];
}
