import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AdminPage, WorkflowStatus } from '../types';
import { fetchPages, createPage, workflowSubmit, workflowApprove, workflowPublish } from '../api/adminClient';
import WorkflowBadge from '../components/WorkflowBadge';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Icon } from '../components/Icon';

const STATUS_FILTERS = [
    { value: '',          label: 'All'       },
    { value: 'draft',     label: 'Draft'     },
    { value: 'in_review', label: 'In Review' },
    { value: 'approved',  label: 'Approved'  },
    { value: 'published', label: 'Published' },
    { value: 'archived',  label: 'Archived'  },
];

function articleTitle(page: AdminPage): string {
    if (!page.identity_title) return page.slug;
    const t = page.identity_title;
    return t['en'] ?? Object.values(t)[0] ?? page.slug;
}

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

const STATUS_ACCENT: Record<string, string> = {
    total:     '#0F2741',
    published: '#3B82F6',
    draft:     '#94A3B8',
    inReview:  '#F59E0B',
    approved:  '#10B981',
};

export default function ArticlesView() {
    const navigate   = useNavigate();
    const { actor, can } = useAuth();

    // Always load ALL articles; filter display client-side so counts are always accurate.
    const [allArticles, setAllArticles] = useState<AdminPage[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState<string | null>(null);
    const [filter,   setFilter]   = useState('');
    const [search,   setSearch]   = useState('');
    const [creating, setCreating] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        fetchPages({ type: 'newsroom.article', per_page: '200' })
            .then(r => setAllArticles(r.data))
            .catch(e => setError(e instanceof Error ? e.message : 'Failed to load articles'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const counts = STATUS_FILTERS.slice(1).reduce<Record<string, number>>((acc, f) => {
        acc[f.value] = allArticles.filter(p => p.status === f.value).length;
        return acc;
    }, {});

    const stats = [
        { key: 'total',     label: 'Total Articles', val: allArticles.length          },
        { key: 'published', label: 'Published',       val: counts['published'] ?? 0 },
        { key: 'inReview',  label: 'In Review',       val: counts['in_review'] ?? 0 },
        { key: 'draft',     label: 'Drafts',          val: counts['draft'] ?? 0     },
        { key: 'approved',  label: 'Approved',        val: counts['approved'] ?? 0  },
    ];

    const displayed = allArticles.filter(p => {
        const statusOk = !filter || p.status === filter;
        if (!statusOk) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return articleTitle(p).toLowerCase().includes(q) || p.slug.includes(q);
    });

    const handleNewArticle = async () => {
        setCreating(true);
        try {
            const slug = `article-${Date.now()}`;
            const page = await createPage({
                slug,
                type: 'newsroom.article',
                site_scope: (window as any).__SCHOOL_DATA__?.code || document.getElementById('app')?.dataset.schoolCode || 'accsystem',
                identity_title: { en: 'Untitled Article' },
            });
            navigate(`/admin/articles/${page.id}/edit`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to create article');
            setCreating(false);
        }
    };

    const canWrite   = can('edit_content');
    const canSubmit  = can('submit_content');
    const canApprove = can('approve_content');
    const canPublish = can('publish_content');

    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleWorkflowAction = async (
        articleId: string,
        action: 'submit' | 'approve' | 'publish',
    ) => {
        setActionLoading(`${articleId}-${action}`);
        try {
            if (action === 'submit')  await workflowSubmit('page',  articleId);
            if (action === 'approve') await workflowApprove('page', articleId);
            if (action === 'publish') await workflowPublish('page', articleId);
            load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div>
            <div className="adm-page-header adm-page-header--flex">
                <div>
                    <h1 className="adm-page-title">Articles</h1>
                    <p className="adm-page-subtitle">Write, manage and publish editorial content.</p>
                </div>
                {canWrite && (
                    <Button
                        variant="primary"
                        onClick={handleNewArticle}
                        loading={creating}
                        loadingText="Creating…"
                    >
                        <Icon name='web_studio' />
                        New Article
                    </Button>
                )}
            </div>

            {error && <div className="adm-alert adm-alert--error">{error}</div>}

            {/* Stats */}
            <div className="adm-stats-row">
                {stats.map(s => (
                    <div key={s.key} className="adm-stat-card">
                        <div className="adm-stat-card__value" style={{ color: STATUS_ACCENT[s.key] }}>
                            {s.val}
                        </div>
                        <div className="adm-stat-card__label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="adm-filter-bar">
                {STATUS_FILTERS.map(f => (
                    <Button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`adm-filter-btn adm-filter-btn--${filter === f.value ? 'on' : 'off'}`}
                    >
                        {f.label}
                        {f.value && (counts[f.value] ?? 0) > 0 && (
                            <span className="adm-filter-btn__count">{counts[f.value]}</span>
                        )}
                    </Button>
                ))}
            </div>

            {/* Search */}
            <div className="adm-search">
                <input
                    className="adm-search__input"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search articles…"
                />
            </div>

            {loading && <div className="adm-load-state">Loading articles…</div>}

            {!loading && !error && (
                <>
                    {displayed.length === 0 ? (
                        <div className="adm-articles-empty">
                            <div className="adm-articles-empty__icon">
                                <Icon name="website_blog"/>
                            </div>
                            <div className="adm-articles-empty__title">
                                {search || filter ? 'No articles match your filter.' : 'No articles yet.'}
                            </div>
                            {!search && !filter && canWrite && (
                                <Button
                                    variant="primary"
                                    onClick={handleNewArticle}
                                    loading={creating}
                                    loadingText="Creating…"
                                >
                                    Write your first article
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="adm-article-list">
                            {displayed.map(article => (
                                <div key={article.id} className="adm-article-card">
                                    <div className="adm-article-card__body">
                                        <div className="adm-article-card__title">
                                            {articleTitle(article)}
                                        </div>
                                        <div className="adm-article-card__meta">
                                            <span>/{article.slug}</span>
                                            <span className="adm-article-card__dot">·</span>
                                            <span>Updated {fmtDate(article.updated_at)}</span>
                                            {article.published_at && (
                                                <>
                                                    <span className="adm-article-card__dot">·</span>
                                                    <span>Published {fmtDate(article.published_at)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="adm-article-card__right">
                                        <WorkflowBadge status={article.status as WorkflowStatus} size="sm" />
                                        <div className="adm-article-card__actions">
                                            {canSubmit && article.status === 'draft' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    loading={actionLoading === `${article.id}-submit`}
                                                    loadingText="…"
                                                    onClick={() => handleWorkflowAction(article.id, 'submit')}
                                                >
                                                    Submit
                                                </Button>
                                            )}
                                            {canApprove && article.status === 'in_review' && (
                                                <Button
                                                    variant="approve"
                                                    size="sm"
                                                    loading={actionLoading === `${article.id}-approve`}
                                                    loadingText="…"
                                                    onClick={() => handleWorkflowAction(article.id, 'approve')}
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {canPublish && article.status === 'approved' && (
                                                <Button
                                                    variant="publish"
                                                    size="sm"
                                                    loading={actionLoading === `${article.id}-publish`}
                                                    loadingText="…"
                                                    onClick={() => handleWorkflowAction(article.id, 'publish')}
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                            {canWrite && (
                                                <Button
                                                    variant="edit"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {article.status === 'published' && (
                                                <a
                                                    href={`/newsroom/news/${article.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="adm-btn adm-btn--sm adm-btn--ghost"
                                                >
                                                    View ↗
                                                </a>
                                            )}
                                            <Button
                                                className="adm-open-btn adm-btn--sm"
                                                onClick={() => navigate(`/admin/pages/${article.id}`)}
                                            >
                                                Manage
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="adm-table__footer">
                        Showing {displayed.length} of {allArticles.length} article{allArticles.length !== 1 ? 's' : ''}
                    </p>
                </>
            )}
        </div>
    );
}
