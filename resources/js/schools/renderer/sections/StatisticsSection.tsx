import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';
import type { SectionPayload, BlockPayload, PageCore } from '../../types/engine';

interface Props { section: SectionPayload; blocks: BlockPayload[]; page: PageCore; }

export default function StatisticsSection({ blocks }: Props) {
    const label    = blocks.find(b => b.type === 'label');
    const headline = blocks.find(b => b.type === 'headline');
    const stats    = blocks.filter(b => b.type === 'stat_item');
    const cols     = Math.min(stats.length, 4) || 1;

    return (
        <div className="container">
                {(label || headline) && (
                    <div className="section-header section-header--center">
                        {label && <BlockRenderer block={label} context="dark" />}
                        {headline && (
                            <h2 className="statistics__headline">
                                {String((headline.fields as Record<string, unknown>)?.text ?? '')}
                            </h2>
                        )}
                    </div>
                )}
                <div className={`grid-auto-${cols}`}>
                    {stats.map((b, i) => (
                        <div
                            key={b.id}
                            className={i > 0 ? 'statistics__cell--bordered' : undefined}
                        >
                            <BlockRenderer block={b} context="dark" />
                        </div>
                    ))}
                </div>
        </div>
    );
}
