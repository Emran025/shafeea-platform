import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function CtaBandSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const ctas        = blocks.filter(b => b.type === 'cta');

    return (
        <div className="cta-band">
            <div className="cta-band__inner">
                {label && <BlockRenderer block={label} context="dark" />}
                {headline && (
                    <h2 className="cta-band__headline">
                        {String((headline.fields as Record<string, unknown>)?.text ?? '')}
                    </h2>
                )}
                {subheadline && (
                    <p className="cta-band__sub">
                        {String((subheadline.fields as Record<string, unknown>)?.text ?? '')}
                    </p>
                )}
                {ctas.length > 0 && (
                    <div className="cta-band__actions">
                        {ctas.map(b => <BlockRenderer key={b.id} block={b} context="dark" />)}
                    </div>
                )}
            </div>
        </div>
    );
}
