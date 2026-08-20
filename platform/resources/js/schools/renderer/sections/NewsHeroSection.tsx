import React, { useState } from 'react';
import { motion }       from 'framer-motion';
import SectionHeader    from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * NewsHeroSection — top-of-page hero for the News index.
 * Renders a left-aligned heading + intro, with a horizontal category
 * filter strip below (client-side; filters passed via prop if wired up).
 *
 * CSS: sections/newsroom-sections.css → .news-hero
 */
export default function NewsHeroSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const sub      = blocks.find(b => b.type === 'subheadline');
    const cats     = blocks.filter(b => b.type === 'news_category');

    const allLabel = 'All';
    const [active, setActive] = useState(allLabel);

    const catLabels = ([allLabel, ...cats.map(c => getTextField(c, 'label')).filter(Boolean)]);

    return (
        <section className="news-hero">
            <div className="news-hero__inner">
                <motion.div
                    className="news-hero__text"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <SectionHeader label={label} headline={headline} richText={sub} align="left" context="dark" />
                </motion.div>

                {catLabels.length > 1 && (
                    <motion.div
                        className="news-hero__cats"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        role="tablist"
                        aria-label="Filter news by category"
                    >
                        {catLabels.map(cat => (
                            <button
                                key={cat}
                                role="tab"
                                aria-selected={active === cat}
                                className={`news-hero__cat-btn${active === cat ? ' news-hero__cat-btn--active' : ''}`}
                                onClick={() => setActive(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
