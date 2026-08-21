import React from 'react';
import { motion }        from 'framer-motion';
import SectionHeader     from '../ui/SectionHeader';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

const cardVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

/**
 * CustomerStoryGridSection — grid of customer_story_card blocks.
 * Supports an optional headline/label header and staggered entry animation.
 */
export default function CustomerStoryGridSection({ blocks }: Props) {
    const label        = blocks.find(b => b.type === 'label');
    const headline     = blocks.find(b => b.type === 'headline');
    const subheadline  = blocks.find(b => b.type === 'subheadline');
    const storyCards   = blocks.filter(b => b.type === 'customer_story_card');
    const ctas         = blocks.filter(b => b.type === 'cta');

    const cols = storyCards.length >= 3 ? 3 : storyCards.length >= 2 ? 2 : 1;

    return (
        <div className="container">
            <div className="container">
                {(label || headline || subheadline) && (
                    <SectionHeader
                        label={label}
                        headline={headline}
                        richText={subheadline}
                        align="center"
                    />
                )}

                {storyCards.length > 0 && (
                    <motion.div
                        className={`story-grid story-grid--cols-${cols}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {storyCards.map((card, i) => (
                            <motion.div
                                key={card.id}
                                className="story-grid__item"
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
