import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext, IndustryCardFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function IndustryCardBlock({ block, context = 'light' }: Props) {
    const f           = block.fields as unknown as IndustryCardFields;
    const { industry_name = '', description = '', platforms = [] } = f ?? {};
    const dark        = context === 'dark';

    return (
        <div className={`industry-card${dark ? ' industry-card--dark' : ''}`}>
            <h3 className="industry-card__title">{industry_name}</h3>
            <p className="industry-card__desc">{description}</p>
            {platforms.length > 0 && (
                <div className="industry-card__platforms">
                    {platforms.map((plat, i) => (
                        <span key={i} className={`industry-card__platform-badge industry-card__platform-badge--${plat.toLowerCase()}`}>
                            {plat}
                        </span>
                    ))}
                </div>
            )}
            {block.actions && block.actions.length > 0 && (
                <div className="industry-card__actions">
                    <ActionRenderer actions={block.actions} variant={dark ? 'white' : 'secondary'} />
                </div>
            )}
        </div>
    );
}
