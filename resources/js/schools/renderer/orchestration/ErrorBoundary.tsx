import React from 'react';

/**
 * ErrorBoundary — orchestration/ErrorBoundary
 * React class component error boundary for the renderer.
 * Canonical location is orchestration/.
 */

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ACCSYSTEM Renderer] Unhandled render error:', error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="error-boundary">
                <div className="error-boundary__inner">
                    <div className="error-boundary__brand">ACCSYSTEM</div>
                    <h1 className="error-boundary__title">Renderer Error</h1>
                    <p className="error-boundary__body">
                        {this.state.error?.message ?? 'An unexpected error occurred in the renderer.'}
                    </p>
                    <a href="/" className="error-boundary__btn">Reload</a>
                </div>
            </div>
        );
    }
}
