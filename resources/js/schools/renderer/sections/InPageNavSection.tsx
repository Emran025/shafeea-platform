import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * InPageNavSection — sticky jump-navigation for long platform pages.
 * Renders nav_link blocks as anchor-tab buttons. Highlights the active
 * section as the user scrolls using IntersectionObserver.
 */
export default function InPageNavSection({ blocks, page }: Props) {
    let navBlocks = blocks;
    const tabsBlock = blocks.find(b => (b as any).key === 'tabs');
    if (tabsBlock && Array.isArray((tabsBlock as any).items)) {
        navBlocks = (tabsBlock as any).items;
    }
    const navLinks = navBlocks.filter(b => b.type === 'nav_link' || b.type === 'label');
    const anchorIds   = page.anchor_ids ?? [];
    const [active, setActive] = useState<string>(anchorIds[0] ?? '');
    const ticking = useRef(false);

    // Build links from blocks; fall back to page.anchor_ids
    const links: { label: string; anchor: string }[] = navLinks.length > 0
        ? navLinks.map(b => {
            const f = b.fields as Record<string, any> | undefined;
            let labelStr = '';
            if (typeof f?.label === 'string') {
                labelStr = f.label;
            } else if (f?.label && typeof f.label === 'object') {
                labelStr = f.label.en || f.label.ar || Object.values(f.label)[0] || '';
            } else if (typeof f?.text === 'string') {
                labelStr = f.text;
            } else if (f?.text && typeof f.text === 'object') {
                labelStr = f.text.en || f.text.ar || Object.values(f.text)[0] || '';
            }

            const anchorStr = f?.anchor_id ?? f?.anchor ?? f?.destination?.value ?? '';
            return {
                label:  String(labelStr),
                anchor: String(anchorStr),
            };
        }).filter(l => l.label && l.anchor)
        : anchorIds.map(id => ({
            label:  id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            anchor: id,
        }));

    useEffect(() => {
        if (links.length === 0) return;

        function onScroll() {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const sections = links
                    .map(l => document.getElementById(l.anchor))
                    .filter(Boolean) as HTMLElement[];

                const scrollY = window.scrollY + 120;
                let current = links[0]?.anchor ?? '';
                for (const el of sections) {
                    if (el.offsetTop <= scrollY) current = el.id;
                }
                setActive(current);
                ticking.current = false;
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [links]);

    if (links.length === 0) return null;

    function scrollTo(anchor: string) {
        const el = document.getElementById(anchor);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 110;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    return (
        <div className="in-page-nav">
            <div className="in-page-nav__inner">
                <nav className="in-page-nav__links" aria-label="Page sections">
                    {links.map(link => {
                        const isActive = active === link.anchor;
                        return (
                            <button
                                key={link.anchor}
                                className={`in-page-nav__link${isActive ? ' in-page-nav__link--active' : ''}`}
                                onClick={() => scrollTo(link.anchor)}
                                aria-current={isActive ? 'location' : undefined}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="in-page-nav-indicator"
                                        className="in-page-nav__indicator"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
