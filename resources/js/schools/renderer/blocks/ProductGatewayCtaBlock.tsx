import React from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

interface GatewayFields {
    supporting_text?:   string;
    is_available?:      boolean;
    destination_url?:   string;
    cta_label?:         string;
    unavailable_label?: string;
}

export default function ProductGatewayCtaBlock({ block, context = 'light' }: Props) {
    const f    = block.fields as GatewayFields;
    const dark = context === 'dark';

    return (
        <div className="gateway-cta">
            {f?.supporting_text && (
                <p className={`gateway-cta__support-text${dark ? ' gateway-cta__support-text--dark' : ''}`}>
                    {f.supporting_text}
                </p>
            )}
            {f?.is_available && f?.destination_url ? (
                <a
                    href={f.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gateway-cta__btn"
                >
                    {f.cta_label || 'Visit Platform'}
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M10 2L2 10M10 2H5M10 2V7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
            ) : (
                <span className={`gateway-cta__unavailable${dark ? ' gateway-cta__unavailable--dark' : ''}`}>
                    {f?.unavailable_label || 'Coming Soon'}
                </span>
            )}
        </div>
    );
}
