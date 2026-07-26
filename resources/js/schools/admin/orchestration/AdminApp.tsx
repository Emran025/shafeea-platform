import React from 'react';
import { Routes, Route, Navigate, useMatch } from 'react-router-dom';
import { AuthProvider }    from '../context/AuthContext';
import AdminLayout         from '../layout/AdminLayout';
import DashboardView       from '../views/DashboardView';
import PagesView           from '../views/PagesView';
import PageDetailView      from '../views/PageDetailView';
import ArticlesView        from '../views/ArticlesView';
import ArticleEditorView   from '../views/ArticleEditorView';
import LoginView           from '../views/LoginView';
import PermissionsView     from '../views/PermissionsView';
import PublishQueueView    from '../views/PublishQueueView';
import UsersView           from '../views/UsersView';
import KeywordsView        from '../views/KeywordsView';
import TopicsView              from '../views/TopicsView';
import NavigationManagerView   from '../views/NavigationManagerView';
import '../../../css/admin.css';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../api/adminClient';

function AdminRoutes() {
    const { isReady, actor } = useAuth();
    const loggedIn  = Boolean(getToken()) && Boolean(actor.id);
    const isEditor  = useMatch('/admin/articles/:id/edit');

    if (!isReady) {
        return <div className="adm-list-loading" style={{ padding: 32 }}>Loading session…</div>;
    }

    if (!loggedIn) {
        return <LoginView onLogin={() => window.location.reload()} />;
    }

    if (isEditor) {
        return (
            <Routes>
                <Route path="articles/:id/edit" element={<ArticleEditorView />} />
            </Routes>
        );
    }

    return (
        <AdminLayout>
            <Routes>
                <Route index element={<DashboardView />} />
                <Route path="pages" element={<PagesView />} />
                <Route path="pages/:id" element={<PageDetailView />} />
                <Route path="articles" element={<ArticlesView />} />
                <Route path="publish" element={<PublishQueueView />} />
                <Route path="permissions" element={<PermissionsView />} />
                <Route path="users" element={<UsersView />} />
                <Route path="keywords" element={<KeywordsView />} />
                <Route path="topics" element={<TopicsView />} />
                <Route path="navigation" element={<NavigationManagerView />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
}

export default function AdminApp() {
    return (
        <AuthProvider>
            <AdminRoutes />
        </AuthProvider>
    );
}
