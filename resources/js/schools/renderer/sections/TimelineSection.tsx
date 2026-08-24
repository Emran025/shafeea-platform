import React from 'react';
import { motion }       from 'framer-motion';
import SectionHeader    from '../ui/SectionHeader';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * TimelineSection — vertical company milestone timeline.
 * Desktop: alternating left/right per event.
 * Mobile: stacked single-column with connecting line.
 *
 * Blocks: label, headline (optional header), timeline_event (multiple)
 *   timeline_event fields: year, title, description
 *
 * CSS: sections/newsroom-sections.css → .timeline
 */
export default function TimelineSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const sub      = blocks.find(b => b.type === 'subheadline');
    const events   = blocks.filter(b => b.type === 'timeline_event');

    return (
        <div className="container">
            {(label || headline || sub) && (
                <SectionHeader label={label} headline={headline} richText={sub} align="center" />
            )}

            {events.length > 0 && (
                <div className="timeline">
                    <div className="timeline__track" aria-hidden="true" />

                    {events.map((evt, i) => {
                        const year  = getTextField(evt, 'year');
                        const title = getTextField(evt, 'title');
                        const desc  = getTextField(evt, 'description');
                        const side  = i % 2 === 0 ? 'left' : 'right';

                        return (
                            <motion.div
                                key={evt.id}
                                className={`timeline__item timeline__item--${side}`}
                                initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.55, delay: i * 0.07 }}
                            >
                                <div className="timeline__dot" aria-hidden="true" />
                                <div className="timeline__card">
                                    {year && (
                                        <span className="timeline__year">{year}</span>
                                    )}
                                    {title && (
                                        <h3 className="timeline__title">{title}</h3>
                                    )}
                                    {desc && (
                                        <p className="timeline__desc">{desc}</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
