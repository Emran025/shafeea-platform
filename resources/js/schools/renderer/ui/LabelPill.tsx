import React from 'react';

/**
 * LabelPill
 * Canonical label/badge pill component used across all sections.
 * Replaces the duplicated hero__label-pill and showcase__label-pill patterns.
 *
 * CSS: components/badges.css → .label-pill
 */

interface Props {
    text:       string;
    variant?:   'light' | 'dark';
    className?: string;
}

export default function LabelPill({ text, variant = 'light', className = '' }: Props) {
    const classes = [
        'label-pill',
        variant === 'dark' ? 'label-pill--dark' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <span className="label-pill__text">{text}</span>
        </div>
    );
}
