import React from 'react';
import { motion }       from 'framer-motion';
import { getTextField } from '../../utils/blockFields';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

/**
 * MissionStatementSection — About page two-column layout:
 *   Left: Large typographic mission statement (headline) with gold accent border.
 *   Right: Supporting paragraphs + values list (feature_item blocks).
 *
 * CSS: sections/newsroom-sections.css → .mission
 */
export default function MissionStatementSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const sub      = blocks.find(b => b.type === 'subheadline');
    const body     = blocks.find(b => b.type === 'rich_text');
    const values   = blocks.filter(b => b.type === 'feature_item');

    return (
        <div className="container">
            <div className="mission__grid">
                {/* Left — large quote headline */}
                <motion.div
                    className="mission__quote-col"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65 }}
                >
                    {label && (
                        <span className="mission__eyebrow">
                            {getTextField(label, 'text')}
                        </span>
                    )}
                    {headline && (
                        <blockquote className="mission__quote">
                            {getTextField(headline, 'text')}
                        </blockquote>
                    )}
                    {sub && (
                        <p className="mission__sub">
                            {getTextField(sub, 'text')}
                        </p>
                    )}
                </motion.div>

                {/* Right — body + values */}
                <motion.div
                    className="mission__body-col"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                >
                    {body && (
                        <p className="mission__body">
                            {getTextField(body, 'text')}
                        </p>
                    )}
                    {values.length > 0 && (
                        <ul className="mission__values">
                            {values.map(val => (
                                <li key={val.id} className="mission__value">
                                    <span className="mission__value-dot" aria-hidden="true" />
                                    <div className="mission__value-text">
                                        <strong className="mission__value-label">
                                            {getTextField(val, 'label')}
                                        </strong>
                                        {getTextField(val, 'description') && (
                                            <p className="mission__value-desc">
                                                {getTextField(val, 'description')}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
