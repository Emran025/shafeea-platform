import React from 'react';
import type { BlockPayload, RenderContext, VideoEmbedFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function VideoEmbedBlock({ block }: Props) {
    const f = block.fields as unknown as VideoEmbedFields;
    const { video_url = '', caption = null } = f ?? {};
    const media = block.media;

    return (
        <div className="video-embed">
            <div className="video-embed__wrapper">
                {video_url ? (
                    <iframe
                        src={video_url}
                        title={caption || "Video player"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="video-embed__iframe"
                    />
                ) : media?.variants?.[0]?.url ? (
                    <video
                        src={media.variants[0].url}
                        controls
                        className="video-embed__video"
                    />
                ) : null}
            </div>
            {caption && <p className="video-embed__caption">{caption}</p>}
        </div>
    );
}
