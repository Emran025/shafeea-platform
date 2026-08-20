import React from 'react';
import type { BlockPayload, RenderContext, FeatureItemFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }


export default function FeatureItemBlock({ block, context = 'light' }: Props) {
    const f    = block.fields as unknown as FeatureItemFields;
    const dark = context === 'dark';
    const description = f?.description || (f as any)?.text || '';

    return (
        <div className="feature-item">
            <div className="feature-item__icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6 11.5L13 4.5" stroke="#0F2741" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h4 className={`feature-item__title${dark ? ' feature-item__title--dark' : ''}`}>
                {f?.label}
            </h4>
            <p className={`feature-item__desc${dark ? ' feature-item__desc--dark' : ''}`}>
                {description}
            </p>
        </div>
    );
}
