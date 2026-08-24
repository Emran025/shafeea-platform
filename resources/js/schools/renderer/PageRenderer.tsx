import React, { useEffect } from 'react';
// import NavigationBar   from './chrome/NavigationBar';
import NewsroomBar     from './chrome/NewsroomBar';
import SectionRenderer from './SectionRenderer';
import PageFooter      from './chrome/PageFooter';
import type { PageContract, SectionPayload, Navigation as EngineNavigation } from '../types/engine';
import NavigationBar from './chrome/NavigationBar';

interface Props {
    contract: PageContract;
}

/**
 * Section types that always use a dark (navy) background regardless of
 * theme mode or position in the page.  Every other section alternates
 * between 'white' and 'surface' to create clear visual separation.
 */
const ALWAYS_DARK = new Set([
    'hero',
    'cta_band',
    'problem_statement',
    'news_hero',
    'stories_hero',
    'about_hero',
]);

export type SectionBackground = 'white' | 'surface' | 'dark';

function assignBackgrounds(sections: SectionPayload[]): SectionBackground[] {
    let lightIdx = 0;
    return sections.map(s => {
        if (ALWAYS_DARK.has(s.type)) return 'dark';
        return (lightIdx++ % 2 === 0) ? 'white' : 'surface';
    });
}

export default function PageRenderer({ contract }: Props) {
    const { payload } = contract;
    const { page, navigation, sections = [], meta } = payload;
    const engineNavigation = navigation as unknown as EngineNavigation;

    useEffect(() => {
        if (meta?.seo_title)       document.title = meta.seo_title;
        if (meta?.seo_description) setMeta('description', meta.seo_description);
        if (meta?.og_title)        setMeta('og:title', meta.og_title, true);
        if (meta?.og_description)  setMeta('og:description', meta.og_description, true);
        if (meta?.canonical_url) {
            let link = document.querySelector<HTMLLinkElement>('link[rel=canonical]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                document.head.appendChild(link);
            }
            link.href = meta.canonical_url;
        }
    }, [meta]);

    const warnings    = payload.warnings ?? [];
    const backgrounds = assignBackgrounds(sections);

    const isNewsroom = (page?.type ?? '').startsWith('newsroom.');

    return (
        <div className="page-wrapper">
            <NavigationBar navigation={engineNavigation} />
            {isNewsroom && <NewsroomBar />}

            {warnings.length > 0 && (
                <div className="page-warning-banner">
                    <strong className="page-warning-banner__title">
                        Admin Preview — {warnings.length} warning{warnings.length > 1 ? 's' : ''}
                    </strong>
                    {warnings.map((w, i) => (
                        <span key={i} className="page-warning-banner__item">
                            [{w.severity?.toUpperCase()}] {w.code}: {w.message}
                        </span>
                    ))}
                </div>
            )}

            <main className="page-main">
                {sections.length === 0 ? (
                    <EmptyPage />
                ) : (
                    sections.map((section, idx) => (
                        <SectionRenderer
                            key={section.id}
                            section={section}
                            page={page}
                            background={backgrounds[idx]}
                        />
                    ))
                )}
            </main>

            <PageFooter navigation={engineNavigation} />
        </div>
    );
}

function EmptyPage() {
    return (
        <div className="page-empty">
            <p className="page-empty__text">
                No content available for this page.
            </p>
        </div>
    );
}

function setMeta(name: string, content: string | null, isProperty = false) {
    if (!content) return;
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}
