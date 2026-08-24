import React from 'react';
import SectionShell  from '../ui/SectionShell';
import SectionHeader from '../ui/SectionHeader';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props {
    section: SectionPayload;
    blocks:  BlockPayload[];
    page:    PageCore;
}

export default function EcosystemDiagramSection({ blocks }: Props) {
    const label       = blocks.find(b => b.type === 'label');
    const headline    = blocks.find(b => b.type === 'headline');
    const subheadline = blocks.find(b => b.type === 'subheadline');
    const media       = blocks.find(b => b.type === 'media');
    const richText    = blocks.find(b => b.type === 'rich_text');
    const items       = blocks.filter(b => b.type === 'feature_item');

    return (
        <SectionShell background="surface" className="section--ecosystem-diagram">
            <SectionHeader
                label={label}
                headline={headline}
                richText={subheadline}
                align="center"
            />
            <div className="ecosystem-diagram__grid">
                <div className="ecosystem-diagram__media-wrap">
                    {media ? (
                        <BlockRenderer block={media} />
                    ) : (
                        <div className="ecosystem-diagram__fallback">
                            <svg viewBox="0 0 400 300" className="ecosystem-diagram__svg">
                                <defs>
                                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                <circle cx="200" cy="150" r="100" fill="url(#glow)" />
                                <path d="M 200 60 L 120 200 L 280 200 Z" fill="none" className="ecosystem-diagram__line-base" />
                                <path d="M 200 60 Q 200 150 120 200" fill="none" className="ecosystem-diagram__line-accore" />
                                <path d="M 120 200 Q 200 150 280 200" fill="none" className="ecosystem-diagram__line-accommerce" />
                                <path d="M 280 200 Q 200 150 200 60" fill="none" className="ecosystem-diagram__line-qayd" />
                                <g className="ecosystem-diagram__node" transform="translate(200, 60)">
                                    <circle r="36" />
                                    <text y="5" textAnchor="middle">ACCORE</text>
                                </g>
                                <g className="ecosystem-diagram__node" transform="translate(120, 200)">
                                    <circle r="36" />
                                    <text y="5" textAnchor="middle">ACCOMMERCE</text>
                                </g>
                                <g className="ecosystem-diagram__node" transform="translate(280, 200)">
                                    <circle r="36" />
                                    <text y="5" textAnchor="middle">QAYD</text>
                                </g>
                            </svg>
                        </div>
                    )}
                </div>
                <div className="ecosystem-diagram__content">
                    {items.length > 0 ? (
                        <div className="ecosystem-diagram__items">
                            {items.map(item => (
                                <BlockRenderer key={item.id} block={item} context="light" />
                            ))}
                        </div>
                    ) : richText ? (
                        <BlockRenderer block={richText} />
                    ) : null}
                </div>
            </div>
        </SectionShell>
    );
}
