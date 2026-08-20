import React from 'react';
import type { BlockPayload, RenderContext, CtaFields } from '../../types/engine';
import { ActionButton } from '../blocks/ActionRenderer';

/**
 * CtaRow
 * Renders a horizontal group of CTA blocks using ActionButton.
 * Handles primary/secondary variant assignment automatically.
 *
 * CSS: components/buttons.css → .btn-group, .btn
 */

type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
    blocks:   BlockPayload[];
    justify?: 'left' | 'center';
    context?: RenderContext;
    size?:    ButtonSize;
}

/** Maps context + position to the correct button variant */
function resolveVariant(index: number, context: RenderContext) {
    if (index === 0) return 'primary' as const;
    return context === 'dark' ? 'white-ghost' as const : 'secondary' as const;
}

export default function CtaRow({
    blocks,
    justify = 'left',
    context = 'light',
    size    = 'md',
}: Props) {
    if (!blocks.length) return null;

    return (
        <div className={`btn-group${justify === 'center' ? ' btn-group--center' : ''}`}>
            {blocks.map((block, i) => {
                const f = block.fields as CtaFields;
                return (
                    <ActionButton
                        key={block.id}
                        action={{
                            type:                  'cta',
                            label:                 f?.label ?? '',
                            destination:           f?.destination,
                            open_in_new_tab:       f?.open_in_new_tab ?? false,
                            is_broken_destination: false,
                            position:              i + 1,
                        }}
                        variant={resolveVariant(i, context)}
                        size={size}
                    />
                );
            })}
        </div>
    );
}
