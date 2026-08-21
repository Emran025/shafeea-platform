import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'approve' | 'publish' | 'edit';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    loading?: boolean;
    loadingText?: ReactNode;
}

export default function Button({
    variant,
    size,
    icon,
    loading = false,
    loadingText,
    disabled,
    className = '',
    children,
    type = 'button',
    ...rest
}: ButtonProps) {
    // Determine CSS class names
    const classes = [];
    if (variant) {
        classes.push('adm-btn');
        classes.push(`adm-btn--${variant}`);
        if (size === 'sm') {
            classes.push('adm-btn--sm');
        }
    }
    if (className) {
        classes.push(className);
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={classes.join(' ')}
            {...rest}
        >
            {loading ? (
                <>
                    {loadingText || 'Saving…'}
                </>
            ) : (
                <>
                    {icon && <span className="adm-btn__icon">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}
