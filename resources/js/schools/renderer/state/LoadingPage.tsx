import React from 'react';

/**
 * LoadingPage — state/LoadingPage
 * Full-page loading spinner shown while a page contract is being fetched.
 * Canonical location is state/.
 */

export default function LoadingPage() {
    return (
        <div className="loading-page">
            <div className="loading-page__inner">
                <div className="loading-page__spinner" />
                <p className="loading-page__text">Loading</p>
            </div>
        </div>
    );
}
