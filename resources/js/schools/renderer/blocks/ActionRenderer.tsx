import React from 'react';
import { Link } from 'react-router-dom';
import type { ActionPayload, Destination } from '../../types/engine';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'white' | 'white-ghost';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface RendererProps {
    actions?: ActionPayload[];
    variant?: ButtonVariant;
}
interface ButtonProps {
    action:   ActionPayload;
    variant?: ButtonVariant;
    size?:    ButtonSize;
}

export default function ActionRenderer({ actions = [], variant = 'primary' }: RendererProps) {
    if (!actions.length) return null;
    return (
        <div className="btn-group">
            {actions.map((action, i) => (
                <ActionButton key={i} action={action} variant={i === 0 ? variant : 'secondary'} />
            ))}
        </div>
    );
}

export function ActionButton({ action, variant = 'primary', size = 'md' }: ButtonProps) {
    const { label, destination, open_in_new_tab, is_broken_destination } = action;
    const href       = resolveHref(destination);
    const isExternal = destination?.type === 'external_url';
    const isAnchor   = destination?.type === 'anchor';

    const classes = [
        'btn',
        `btn--${variant}`,
        size !== 'md' ? `btn--${size}` : '',
    ].filter(Boolean).join(' ');

    if (is_broken_destination) {
        return <span className="btn btn--broken">{label}</span>;
    }
    if (isAnchor) {
        return <a href={href} className={classes}>{label}</a>;
    }
    if (isExternal || open_in_new_tab) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
                {label}<ExternalIcon />
            </a>
        );
    }
    return <Link to={href} className={classes}>{label}</Link>;
}

function ExternalIcon() {
    return (
        <svg className="action-external-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 2L2 10M10 2H5M10 2V7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function resolveHref(destination: Destination | undefined): string {
    if (!destination) return '#';
    if (destination.type === 'internal_page') return '/' + destination.value;
    if (destination.type === 'anchor')        return '#' + destination.value;
    return destination.value || '#';
}
