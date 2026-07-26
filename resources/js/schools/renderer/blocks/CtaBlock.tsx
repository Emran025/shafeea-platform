import React from 'react';
import { ActionButton } from './ActionRenderer';
import type { BlockPayload, RenderContext, CtaFields, Destination } from '../../types/engine';

interface Props { block: BlockPayload; context?: RenderContext; }

export default function CtaBlock({ block, context = 'light' }: Props) {
    const f = block.fields as CtaFields;
    const { label, destination, intent = 'primary', open_in_new_tab } = f ?? {};

    const variantMap: Record<string, string> = {
        primary:   context === 'dark' ? 'white'       : 'primary',
        secondary: context === 'dark' ? 'white-ghost' : 'secondary',
        tertiary:  context === 'dark' ? 'white-ghost' : 'secondary',
    };

    const action = {
        type:                  'cta',
        label:                 label ?? '',
        destination:           destination as Destination,
        open_in_new_tab:       open_in_new_tab ?? false,
        is_broken_destination: false,
        position:              block.position,
    };

    return <ActionButton action={action} variant={variantMap[intent] as 'primary' | 'secondary' | 'ghost' | 'white' | 'white-ghost' ?? 'primary'} />;
}
