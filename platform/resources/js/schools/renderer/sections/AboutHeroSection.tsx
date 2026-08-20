import React from 'react';
import { motion }       from 'framer-motion';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore, CtaFields } from '../../types/engine';
import { resolveHref }  from '../../utils/resolveHref';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * AboutHeroSection — two-column mission statement hero for About Us page.
 * Left: large mission headline + supporting paragraph + CTAs.
 * Right: optional background image or brand graphic.
 *
 * CSS: sections/newsroom-sections.css → .about-hero
 */
export default function AboutHeroSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const sub      = blocks.find(b => b.type === 'subheadline');
    const richText = blocks.find(b => b.type === 'rich_text');
    const media    = blocks.find(b => b.type === 'media');
    const ctas     = blocks.filter(b => b.type === 'cta');

    return (
        <section className="about-hero">
            <div className="about-hero__inner">
                {/* Left — text content */}
                <motion.div
                    className="about-hero__content"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    {label && (
                        <span className="about-hero__eyebrow">
                            {getTextField(label, 'text')}
                        </span>
                    )}
                    {headline && (
                        <h1 className="about-hero__headline">
                            {getTextField(headline, 'text')}
                        </h1>
                    )}
                    {sub && (
                        <p className="about-hero__sub">
                            {getTextField(sub, 'text')}
                        </p>
                    )}
                    {richText && (
                        <p className="about-hero__body">
                            {getTextField(richText, 'text')}
                        </p>
                    )}
                    {ctas.length > 0 && (
                        <motion.div
                            className="about-hero__ctas"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                        >
                            {ctas.map((cta, i) => {
                                const f = cta.fields as unknown as CtaFields;
                                return (
                                    <a
                                        key={cta.id}
                                        href={resolveHref(f?.destination)}
                                        className={`about-hero__cta${i === 0 ? ' about-hero__cta--primary' : ' about-hero__cta--secondary'}`}
                                    >
                                        {f?.label ?? ''}
                                    </a>
                                );
                            })}
                        </motion.div>
                    )}
                </motion.div>

                {/* Right — media / decorative graphic */}
                {media && (
                    <motion.div
                        className="about-hero__media"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="about-hero__media-frame">
                            {/* media block renders the image/video */}
                            <img
                                src={getTextField(media, 'url')}
                                alt={getTextField(media, 'alt')}
                                className="about-hero__media-img"
                                loading="eager"
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
