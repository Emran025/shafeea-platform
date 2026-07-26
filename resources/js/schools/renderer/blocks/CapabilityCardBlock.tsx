import React from 'react';
import type { BlockPayload, RenderContext, CapabilityCardFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function CapabilityCardBlock({ block, context = 'light' }: Props) {
    const f           = block.fields as unknown as CapabilityCardFields;
    const { label = '', description = '' } = f ?? {};
    const media       = block.media;
    const dark        = context === 'dark';

    return (
        <div className={`capability-card${dark ? ' capability-card--dark' : ''}`}>
            {media && (
                <div className="capability-card__icon-wrap">
                    {media.variants?.[0]?.url ? (
                        <img
                            src={media.variants[0].url}
                            alt={media.alt_text}
                            className="capability-card__icon-img"
                        />
                    ) : (
                        <div className="capability-card__icon-placeholder" />
                    )}
                </div>
            )}
            <h3 className="capability-card__title">{label}</h3>
            <p className="capability-card__desc">{description}</p>
        </div>
    );
}
