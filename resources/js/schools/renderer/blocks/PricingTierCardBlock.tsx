import React from 'react';
import ActionRenderer from './ActionRenderer';
import type { BlockPayload, RenderContext, PricingTierCardFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function PricingTierCardBlock({ block, context = 'light' }: Props) {
    const f = block.fields as unknown as PricingTierCardFields;
    const {
        tier_name = '',
        price = '',
        price_descriptor = '',
        features = [],
        is_featured = false
    } = f ?? {};

    const dark = is_featured || context === 'dark';

    return (
        <div className={`pricing-tier-card${is_featured ? ' pricing-tier-card--featured' : ''}${dark ? ' pricing-tier-card--dark' : ''}`}>
            {is_featured && (
                <span className="pricing-tier-card__popular-badge">
                    Most Popular
                </span>
            )}
            <h3 className="pricing-tier-card__title">{tier_name}</h3>
            <div className="pricing-tier-card__price-wrap">
                <span className="pricing-tier-card__price">{price}</span>
                {price_descriptor && (
                    <span className="pricing-tier-card__price-descriptor">{price_descriptor}</span>
                )}
            </div>
            <ul className="pricing-tier-card__features">
                {features.map((feature, i) => (
                    <li key={i} className="pricing-tier-card__feature-item">
                        <svg className="pricing-tier-card__feature-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>
            {block.actions && block.actions.length > 0 && (
                <div className="pricing-tier-card__actions">
                    <ActionRenderer actions={block.actions} variant={dark ? 'white' : 'primary'} />
                </div>
            )}
        </div>
    );
}
