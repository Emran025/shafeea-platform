import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './orchestration/ErrorBoundary';
import LoadingPage   from './state/LoadingPage';
import PageLoader    from './orchestration/PageLoader';

const AdminApp    = lazy(() => import('../admin/orchestration/AdminApp'));
const NewsDetail  = lazy(() => import('./pages/NewsDetailPage'));
const StoryDetail = lazy(() => import('./pages/StoryDetailPage'));

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
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
