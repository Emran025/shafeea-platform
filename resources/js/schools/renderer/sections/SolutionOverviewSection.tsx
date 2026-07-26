import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function SolutionOverviewSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const richText = blocks.find(b => b.type === 'rich_text') || blocks.find(b => b.type === 'subheadline');
    const media    = blocks.find(b => b.type === 'media');
    const ctas     = blocks.filter(b => b.type === 'cta');

    return (
        <div className="container">
            <div className={`solution-overview__grid${media ? ' solution-overview__grid--with-media' : ''}`}>
                <div className="solution-overview__content">
                    <SectionHeader
                        label={label}
                        headline={headline}
                        richText={richText}
                        align={media ? 'left' : 'center'}
                    />
                    {ctas.length > 0 && (
                        <div className="solution-overview__ctas">
                            {ctas.map(cta => (
                                <BlockRenderer key={cta.id} block={cta} />
                            ))}
                        </div>
                    )}
                </div>
                {media && (
                    <div className="solution-overview__media">
                        <BlockRenderer block={media} />
                    </div>
                )}
            </div>
        </div>
    );
}
