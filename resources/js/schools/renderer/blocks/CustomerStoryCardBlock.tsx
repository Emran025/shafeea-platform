import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext, CustomerStoryCardFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function CustomerStoryCardBlock({ block }: Props) {
    const f = block.fields as unknown as CustomerStoryCardFields;
    const { company_name = '', headline = '', metric_value = '', metric_descriptor = '' } = f ?? {};
    const media = block.media;

    return (
        <div className="customer-story-card">
            {media?.variants?.[0]?.url && (
                <div className="customer-story-card__logo-wrap">
                    <img src={media.variants[0].url} alt={company_name} className="customer-story-card__logo" />
                </div>
            )}
            <h4 className="customer-story-card__headline">{headline}</h4>
            <div className="customer-story-card__metric">
                <span className="customer-story-card__metric-val">{metric_value}</span>
                <span className="customer-story-card__metric-desc">{metric_descriptor}</span>
            </div>
            {block.actions && block.actions.length > 0 && (
                <div className="customer-story-card__actions">
                    <ActionRenderer actions={block.actions} variant="secondary" />
                </div>
            )}
        </div>
    );
}
