import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext, PlatformRecommendationFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function PlatformRecommendationBlock({ block, context = 'light' }: Props) {
    const f           = block.fields as unknown as PlatformRecommendationFields;
    const { platform_name = '', description = '' } = f ?? {};
    const dark        = context === 'dark';

    return (
        <div className={`platform-recommendation${dark ? ' platform-recommendation--dark' : ''}`}>
            <h3 className="platform-recommendation__title">{platform_name}</h3>
            <p className="platform-recommendation__desc">{description}</p>
            {block.actions && block.actions.length > 0 && (
                <div className="platform-recommendation__actions">
                    <ActionRenderer actions={block.actions} variant={dark ? 'white' : 'primary'} />
                </div>
            )}
        </div>
    );
}
