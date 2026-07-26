import React from 'react';
import NavigationBar from '../chrome/NavigationBar';
import { Link } from 'react-router-dom';
import type { Navigation } from '../../types/engine';

/**
 * ErrorPage — state/ErrorPage
 * Renders a full-page error state for network failures, 404s, and engine errors.
 * Canonical location is state/.
 */

interface Props {
    type:        string;
    message?:    string;
    navigation?: Navigation;
}

const ERROR_META: Record<string, { code: string; title: string; body: string }> = {
    PAGE_NOT_FOUND:   { code: '404', title: 'Page Not Found',       body: 'The page you requested could not be found.' },
    NETWORK_ERROR:    { code: '—',   title: 'Connection Error',      body: 'Unable to reach the content engine.' },
    CONTRACT_MISMATCH:{ code: '—',   title: 'Version Mismatch',      body: 'The renderer contract version is incompatible.' },
    SCOPE_VIOLATION:  { code: '—',   title: 'Scope Violation',       body: 'This content is out of scope for this site.' },
};

export default function ErrorPage({ type, message, navigation }: Props) {
    const meta  = ERROR_META[type] ?? { code: '!', title: 'Unexpected Error', body: 'An unexpected error occurred.' };
    const hasNav = !!navigation;

    return (
        <div className="error-page">
            {hasNav && navigation && <NavigationBar navigation={navigation} />}
            <div className={`error-page__stage${hasNav ? '' : ' error-page__stage--full'}`}>
                <div className="error-page__content">
                    <div className="error-page__code">{meta.code}</div>
                    <h1 className="error-page__title">{meta.title}</h1>
                    <p className="error-page__body">{message ?? meta.body}</p>
                    <Link to="/" className="error-page__btn">Return Home</Link>
                </div>
            </div>
        </div>
    );
}
