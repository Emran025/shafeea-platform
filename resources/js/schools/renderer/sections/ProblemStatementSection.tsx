import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function ProblemStatementSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const richText    = blocks.find(b => b.type === 'rich_text');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const ctas        = blocks.filter(b => b.type === 'cta');
    const items       = blocks.filter(b => b.type === 'feature_item');

    return (
        <div className="container">
            <SectionHeader
                label={label}
                headline={headline}
                richText={richText || subheadline}
                align="center"
                context="light"
            />
            {items.length > 0 && (
                <div className="problem-statement__items">
                    {items.map(item => (
                        <div key={item.id} className="problem-statement__item">
                            <BlockRenderer block={item} context="light" />
                        </div>
                    ))}
                </div>
            )}
            {ctas.length > 0 && (
                <div className="problem-statement__ctas">
                    {ctas.map(cta => (
                        <BlockRenderer key={cta.id} block={cta} context="light" />
                    ))}
                </div>
            )}
        </div>
    );
}
