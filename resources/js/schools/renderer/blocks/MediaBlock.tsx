import React from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function MediaBlock({ block }: Props) {
    const { media } = block;
    if (!media) return null;

    if (!media.type || media.type === 'image' || media.type.startsWith('image')) {
        const variant = media.variants?.find(v => (v as unknown as Record<string, unknown>)['label'] === 'original') ?? media.variants?.[0];
        const src = variant?.url;
        if (!src) return null;

        return (
            <figure className="media-figure">
                <img
                    src={src}
                    alt={media.is_decorative ? '' : media.alt_text}
                    aria-hidden={media.is_decorative || undefined}
                    width={variant?.width}
                    height={variant?.height}
                    loading="lazy"
                    className="media-figure__img"
                />
                {media.caption && (
                    <figcaption className="media-figure__caption">
                        {media.caption}
                    </figcaption>
                )}
            </figure>
        );
    }

    if (media.type?.startsWith('video')) {
        const variant = media.variants?.[0];
        return (
            <video
                src={variant?.url}
                controls
                className="media-figure__video"
                aria-label={media.alt_text}
            />
        );
    }

    return null;
}
