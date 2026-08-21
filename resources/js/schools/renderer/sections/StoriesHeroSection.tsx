import React from 'react';
import { motion }       from 'framer-motion';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * StoriesHeroSection — top-of-page section for the Stories index.
 * Left column: "Stories" heading + subtitle.
 * Right column: featured story card (image background, title overlay).
 *
 * CSS: sections/newsroom-sections.css → .stories-hero
 */
export default function StoriesHeroSection({ blocks }: Props) {
    const headline     = blocks.find(b => b.type === 'headline');
    const sub          = blocks.find(b => b.type === 'subheadline');
    const featuredCard = blocks.find(b => b.type === 'customer_story_card');

    const company  = featuredCard ? getTextField(featuredCard, 'company') : '';
    const outcome  = featuredCard ? getTextField(featuredCard, 'outcome') : '';
    const quote    = featuredCard ? getTextField(featuredCard, 'quote') : '';
    const imgUrl   = featuredCard ? getTextField(featuredCard, 'image_url') : '';
    const url      = featuredCard ? getTextField(featuredCard, 'url') : '#';
    const logoUrl  = featuredCard ? getTextField(featuredCard, 'logo_url') : '';

    return (
            <div className="stories-hero__inner">
                {/* Left — heading + subtitle */}
                <motion.div
                    className="stories-hero__lead"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {headline && (
                        <h1 className="stories-hero__headline">
                            {getTextField(headline, 'text')}
                        </h1>
                    )}
                    {sub && (
                        <p className="stories-hero__sub">
                            {getTextField(sub, 'text')}
                        </p>
                    )}
                </motion.div>

                {/* Right — featured story card */}
                {featuredCard && (
                    <motion.a
                        href={url}
                        className="stories-hero__featured"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}
                        aria-label={`Read story: ${outcome}`}
                    >
                        <span className="stories-hero__featured-overlay" />
                        {logoUrl && (
                            <span className="stories-hero__featured-logo">
                                <img src={logoUrl} alt={company} />
                            </span>
                        )}
                        <span className="stories-hero__featured-body">
                            {company && <span className="stories-hero__featured-company">{company}</span>}
                            <span className="stories-hero__featured-outcome">{outcome || quote}</span>
                        </span>
                        <span className="stories-hero__read-icon" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M6 10h8M11 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </motion.a>
                )}
            </div>
    );
}
