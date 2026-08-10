import React from 'react';
import { motion }        from 'framer-motion';
import SectionHeader     from '../ui/SectionHeader';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';
import BlockRenderer from '../blocks/BlockRenderer';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

const cardVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

/**
 * BlogPostGridSection — grid of blog_post_card blocks.
 * Supports optional label/headline header, featured first card (full-width),
 * and trailing CTA row.
 */
export default function BlogPostGridSection({ blocks }: Props) {
    const label      = blocks.find(b => b.type === 'label');
    const headline   = blocks.find(b => b.type === 'headline');
    const subhead    = blocks.find(b => b.type === 'subheadline');
    const postCards  = blocks.filter(b => b.type === 'blog_post_card');
    const ctas       = blocks.filter(b => b.type === 'cta');

    const [featured, ...rest] = postCards;
    if (postCards.length === 0) return null;
    const cols = rest.length >= 3 ? 3 : rest.length >= 2 ? 2 : 1;

    return (
        <div className="container">
            <div className="container">
                {(label || headline || subhead) && (
                    <SectionHeader
                        label={label}
                        headline={headline}
                        richText={subhead}
                        align="center"
                    />
                )}

                {featured && (
                    <motion.div
                        className="blog-grid__featured"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <BlockRenderer block={featured} />
                    </motion.div>
                )}

                {rest.length > 0 && (
                    <motion.div
                        className={`blog-grid blog-grid--cols-${cols}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {rest.map((card, i) => (
                            <motion.div
                                key={card.id}
                                className="blog-grid__item"
                                variants={cardVariants}
                                custom={i}
                            >
                                <BlockRenderer block={card} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {ctas.length > 0 && (
                    <div className="section__cta-row">
                        {ctas.map(cta => <BlockRenderer key={cta.id} block={cta} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
