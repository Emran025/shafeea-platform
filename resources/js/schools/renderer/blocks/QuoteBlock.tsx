import React from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

interface QuoteBlockFields {
    text:               string;
    attribution_name?:  string;
    attribution_title?: string;
    attribution_org?:   string;
}

export default function QuoteBlock({ block, context = 'light' }: Props) {
    const f    = block.fields as QuoteBlockFields;
    const dark = context === 'dark';
    const { text, attribution_name, attribution_title, attribution_org } = f ?? {};

    return (
        <figure className="quote">
            <blockquote className="quote__blockquote">
                <p className={`quote__text${dark ? ' quote__text--dark' : ''}`}>
                    &ldquo;{text}&rdquo;
                </p>
            </blockquote>
            {attribution_name && (
                <figcaption className="quote__attribution">
                    <span className={`quote__attribution-name${dark ? ' quote__attribution-name--dark' : ''}`}>
                        {attribution_name}
                    </span>
                    {(attribution_title || attribution_org) && (
                        <span className={`quote__attribution-meta${dark ? ' quote__attribution-meta--dark' : ''}`}>
                            {[attribution_title, attribution_org].filter(Boolean).join(', ')}
                        </span>
                    )}
                </figcaption>
            )}
        </figure>
    );
}
