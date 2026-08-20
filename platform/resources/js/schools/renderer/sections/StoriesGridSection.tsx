import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';
import { getDemoStoryImage } from '../../admin/lang/demoMedia';
import { SITE_LANG } from '../lang/en';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

const L = SITE_LANG.stories;

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

const cardVariant = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

const listVariant = {
    hidden:  { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

/**
 * StoriesGridSection — 2-column card grid for featured stories + editorial list.
 *
 * Featured 2-col image cards: company name + outcome overlay.
 * "All stories" — compact editorial rows (date | title | thumbnail).
 * Both collapse to 1 column at ≤640 px.
 *
 * CSS: sections/newsroom-sections.css → .stories-card-grid, .stories-card, .stories-list
 */
export default function StoriesGridSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const sub      = blocks.find(b => b.type === 'subheadline');
    const stories  = blocks.filter(b => b.type === 'customer_story_card');
    const ctas     = blocks.filter(b => b.type === 'cta');

    const featured = stories.slice(0, 4);
    const list     = stories.slice(4);

    return (
        <div className="container">
            {(label || headline || sub) && (
                <SectionHeader label={label} headline={headline} richText={sub} align="left" />
            )}

            {/* ── Featured 2-column card grid ── */}
            {featured.length > 0 && (
                <motion.div
                    className="stories-card-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {featured.map((card, i) => {
                        const company = getTextField(card, 'company');
                        const outcome = getTextField(card, 'outcome');
                        const quote   = getTextField(card, 'quote');
                        const imgUrl  = getTextField(card, 'image_url') || getDemoStoryImage(i).url;
                        const url     = getTextField(card, 'url');
                        const slug    = url ? url.replace(/^\//, '') : `stories-${i}`;

                        return (
                            <motion.div
                                key={card.id}
                                className="stories-card"
                                variants={cardVariant}
                                custom={i}
                            >
                                {/* Background image */}
                                <div
                                    className="stories-card__bg"
                                    style={{ backgroundImage: `url(${imgUrl})` }}
                                />
                                <div className="stories-card__overlay" />

                                {/* Top badge */}
                                {company && (
                                    <span className="stories-card__company">{company}</span>
                                )}

                                {/* Bottom content */}
                                <div className="stories-card__body">
                                    <p className="stories-card__outcome">
                                        {outcome || quote}
                                    </p>
                                    <Link
                                        to={`/${slug}`}
                                        className="stories-card__cta"
                                        aria-label={`Read story: ${outcome || company}`}
                                    >
                                        {L.readStory} →
                                    </Link>
                                </div>

                                {/* Invisible overlay link for full-card click */}
                                <Link
                                    to={`/${slug}`}
                                    className="stories-card__full-link"
                                    aria-hidden="true"
                                    tabIndex={-1}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* ── All stories list ── */}
            {list.length > 0 && (
                <>
                    <h3 className="stories-list__heading">{L.allStories}</h3>
                    <motion.div
                        className="stories-list"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                    >
                        {list.map((card, i) => {
                            const company  = getTextField(card, 'company');
                            const outcome  = getTextField(card, 'outcome');
                            const quote    = getTextField(card, 'quote');
                            const date     = getTextField(card, 'author_title');
                            const category = getTextField(card, 'author_name');
                            const imgUrl   = getTextField(card, 'image_url') || getDemoStoryImage(i + 4).url;
                            const url      = getTextField(card, 'url');

                            return (
                                <motion.a
                                    key={card.id}
                                    href={url || '#'}
                                    className="stories-list__row"
                                    variants={listVariant}
                                    custom={i}
                                >
                                    <span className="stories-list__date">{date}</span>
                                    <span className="stories-list__body">
                                        {category && (
                                            <span className="stories-list__category">{category}</span>
                                        )}
                                        <span className="stories-list__title">
                                            {outcome || quote || company}
                                        </span>
                                    </span>
                                    <span className="stories-list__thumb">
                                        <img src={imgUrl} alt={company ?? ''} loading="lazy" />
                                    </span>
                                </motion.a>
                            );
                        })}
                    </motion.div>
                </>
            )}

            {ctas.length > 0 && (
                <div className="section__cta-row">
                    {ctas.map(cta => (
                        <a key={cta.id} href={getTextField(cta, 'destination') || '#'} className="btn btn--outline">
                            {getTextField(cta, 'label')}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
