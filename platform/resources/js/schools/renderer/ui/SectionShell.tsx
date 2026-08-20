import React from 'react';

/**
 * SectionShell
 * Provides a centred container for section content.
 *
 * Background and padding are handled by SectionRenderer's outer wrapper
 * (`section section--{bg}`), so this component must NOT add its own
 * `section` or `section--*` classes — doing so creates double padding.
 *
 * The `className` prop is still accepted for section-specific BEM modifiers
 * that should not carry padding (e.g. `section--capability-grid` used as a
 * pure namespace). The `background` and `size` props are no-ops now that
 * SectionRenderer owns background assignment; they are kept in the API to
 * avoid breaking call sites.
 */

type Background = 'white' | 'surface' | 'navy' | 'navy-grad' | 'transparent';
type Size       = 'sm' | 'md' | 'lg';

interface Props {
    background?: Background;
    size?:       Size;
    className?:  string;
    noContainer?: boolean;
    children:    React.ReactNode;
}

export default function SectionShell({
    className   = '',
    noContainer = false,
    children,
}: Props) {
    if (noContainer) {
        return <>{children}</>;
    }

    return (
        <div className={['container', className].filter(Boolean).join(' ')}>
            {children}
        </div>
    );
}
