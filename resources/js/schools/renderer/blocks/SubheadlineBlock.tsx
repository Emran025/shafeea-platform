import React from 'react';
import type { BlockPayload, RenderContext, SubheadlineFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function SubheadlineBlock({ block, context = 'light' }: Props) {
    const f    = block.fields as SubheadlineFields;
    const text = f?.text ?? '';
    const dark = context === 'dark';

    return (
        <p className={`block-subheadline${dark ? ' block-subheadline--dark' : ''}`}>
            {text}
        </p>
    );
}
