import React from 'react';
import type { BlockPayload, RenderContext, HeadlineFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function HeadlineBlock({ block, context = 'light' }: Props) {
    const f        = block.fields as HeadlineFields;
    const text     = f?.text ?? '';
    const featured = block.config?.is_featured;
    const dark     = context === 'dark';

    const classes = [
        'block-headline',
        featured ? 'block-headline--featured' : '',
        dark     ? 'block-headline--dark'     : '',
    ].filter(Boolean).join(' ');

    return <h2 className={classes}>{text}</h2>;
}
