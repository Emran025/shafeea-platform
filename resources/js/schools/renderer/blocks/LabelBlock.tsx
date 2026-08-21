import React from 'react';
import type { BlockPayload, RenderContext, LabelFields } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function LabelBlock({ block }: Props) {
    const f    = block.fields as LabelFields;
    const text = f?.text ?? '';

    return <span className="block-label">{text}</span>;
}
