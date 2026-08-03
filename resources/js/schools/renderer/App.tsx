import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './orchestration/ErrorBoundary';
import LoadingPage   from './state/LoadingPage';
import PageLoader    from './orchestration/PageLoader';

const AdminApp    = lazy(() => import('../admin/orchestration/AdminApp'));
const NewsDetail  = lazy(() => import('./pages/NewsDetailPage'));
const StoryDetail = lazy(() => import('./pages/StoryDetailPage'));

/**
 * Derive the router basename from the school code injected by the Blade shell.
 * The SPA is mounted at /school/{code}, so we set that as the basename so that
 * React Router strips it from all pathnames — e.g. /school/shafeea → /.
 * Falls back to '' (root) if no school code is present (e.g. dev / SSR).
 */
function getBasename(): string {
    const schoolCode =
        (window as any).__SCHOOL_DATA__?.code ||
        document.getElementById('app')?.dataset.schoolCode ||
        '';
    return schoolCode ? `/school/${schoolCode}` : '';
}

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter basename={getBasename()}>
                <Routes>
                    <Route
                        path="/admin/*"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <AdminApp />
                            </Suspense>
                        }
                    />
                    {/* Newsroom article detail route */}
                    <Route
                        path="/newsroom/news/:slug"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <NewsDetail />
                            </Suspense>
                        }
                    />
                    {/* Legacy /news/:slug redirect — kept for backward compat */}
                    <Route
                        path="/news/:slug"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <NewsDetail />
                            </Suspense>
                        }
                    />
                    {/* Story detail route */}
                    <Route
                        path="/newsroom/stories/:slug"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <StoryDetail />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/stories/:slug"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <StoryDetail />
                            </Suspense>
                        }
                    />
                    <Route path="*" element={<PageLoader />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
