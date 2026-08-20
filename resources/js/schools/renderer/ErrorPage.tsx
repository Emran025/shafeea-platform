import React from 'react';
import type { Navigation } from '../types/engine';
import NavigationBar from './chrome/NavigationBar';

type ErrorType = 'PAGE_NOT_FOUND' | 'PAGE_ARCHIVED' | 'PAGE_RESTRICTED' | 'CONTRACT_MISMATCH' | 'NETWORK_ERROR' | string;

interface Props {
    type?:       ErrorType;
    message?:    string;
    navigation?: Navigation;
}

const MESSAGES: Record<string, { code: string; title: string; body: string }> = {
    PAGE_NOT_FOUND:    { code: '404', title: 'Page Not Found',    body: 'The page you requested does not exist or has been moved.' },
    PAGE_ARCHIVED:     { code: '410', title: 'Page Archived',     body: 'This content has been archived and is no longer available.' },
    PAGE_RESTRICTED:   { code: '403', title: 'Access Restricted', body: 'You do not have permission to view this page.' },
    CONTRACT_MISMATCH: { code: '406', title: 'Contract Mismatch', body: 'The renderer contract is incompatible with the engine version.' },
    NETWORK_ERROR:     { code: '---', title: 'Connection Error',  body: 'Unable to reach the content engine. Please try again.' },
};

export default function ErrorPage({ type = 'PAGE_NOT_FOUND', message, navigation }: Props) {
    const info = MESSAGES[type] ?? MESSAGES['PAGE_NOT_FOUND'];

    return (
        <div className="error-page">
            {navigation && <NavigationBar navigation={navigation} />}
            <div className={`error-page__stage${navigation ? '' : ' error-page__stage--full'}`}>
                <div className="error-page__content">
                    <div className="error-page__code">{info.code}</div>
                    <h1 className="error-page__title">{info.title}</h1>
                    <p className="error-page__body">{message ?? info.body}</p>
                    <a href="/" className="error-page__btn">Return Home</a>
                </div>
            </div>
        </div>
    );
}
