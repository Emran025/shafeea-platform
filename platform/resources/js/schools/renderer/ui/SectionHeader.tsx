import React from 'react';
import type { BlockPayload, RenderContext } from '../../types/engine';
import BlockRenderer from '../blocks/BlockRenderer';

/**
 * SectionHeader
 * Renders a section's label + headline + body text in the canonical header layout.
 * Replaces the repeated inline header patterns across all section components.
 *
 * CSS: layout.css → .section-header, .section-header--center
 *      components/badges.css → .label-pill
 *      components/buttons.css → .block-headline, .block-subheadline
 */

import LabelPill from './LabelPill';
import { getTextField } from '../../utils/blockFields';

interface Props {
    label?:    BlockPayload;
    headline?: BlockPayload;
    richText?: BlockPayload;
    align?:    'left' | 'center';
    context?:  RenderContext;
}

export default function SectionHeader({
    label,
    headline,
    richText,
    align   = 'center',
    context = 'light',
}: Props) {
    if (!label && !headline && !richText) return null;

    return (
        <div className={`section-header${align === 'center' ? ' section-header--center' : ''}`}>
            {label && (
                <LabelPill
                    text={getTextField(label, 'text')}
                    variant={context === 'dark' ? 'dark' : 'light'}
                />
            )}
            {headline && (
                <h2 className={`block-headline${context === 'dark' ? ' block-headline--dark' : ''}`}>
                    {getTextField(headline, 'text')}
                </h2>
            )}
            {richText && (
                <BlockRenderer block={richText} context={context} />
            )}
        </div>
    );
}
