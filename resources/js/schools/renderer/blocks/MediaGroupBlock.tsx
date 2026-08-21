import React from 'react';
import type { BlockPayload, RenderContext, MediaPayload } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function MediaGroupBlock({ block }: Props) {
    const { media } = block;
    if (!media) return null;

    const items: MediaPayload[] = Array.isArray(media) ? media as MediaPayload[] : [media];

    return (
        <div className="media-group">
            {items.map((m, i) => {
                const variant = m.variants?.[0];
                if (!variant?.url) return null;
                return (
                    <img
                        key={i}
                        src={variant.url}
                        alt={m.is_decorative ? '' : m.alt_text}
                        aria-hidden={m.is_decorative || undefined}
                        loading="lazy"
                        className="media-group__img"
                    />
                );
            })}
        </div>
    );
}
