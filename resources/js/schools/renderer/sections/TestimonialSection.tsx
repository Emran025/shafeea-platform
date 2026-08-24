import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function TestimonialSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const quotes   = blocks.filter(b => b.type === 'quote');
    const cols     = Math.min(quotes.length, 2) || 1;

    return (
        <div className="container">
            {(label || headline) && (
                <div className="section-header">
                    {label    && <BlockRenderer block={label} />}
                    {headline && <BlockRenderer block={headline} />}
                </div>
            )}
            <div className={`grid-auto-${cols}`}>
                {quotes.map(b => (
                    <div key={b.id} className="testimonial__card">
                        <BlockRenderer block={b} />
                    </div>
                ))}
            </div>
        </div>
    );
}
