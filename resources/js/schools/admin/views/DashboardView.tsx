import React, { useEffect, useState } from 'react';
import type { AdminPage } from '../types';
import { fetchPages } from '../api/adminClient';
import WorkflowBadge from '../components/WorkflowBadge';
import type { WorkflowStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function pageTitle(page: AdminPage): string {
  if (!page.identity_title) return page.slug;
  const t = page.identity_title;
  return t['en'] ?? Object.values(t)[0] ?? page.slug;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const STAT_ACCENT: Record<string, string> = {
  totalPages:    '#0F2741',
  totalArticles: '#6366F1',
  published:     '#3B82F6',
  inReview:      '#F59E0B',
  draft:         '#94A3B8',
  approved:      '#10B981',
};

export default function DashboardView() {
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [allItems,  setAllItems]  = useState<AdminPage[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    fetchPages({ per_page: '200' }).then(r => setAllItems(r.data)).finally(() => setLoading(false));
  }, []);

  const pages    = allItems.filter(p => p.type !== 'newsroom.article');
  const articles = allItems.filter(p => p.type === 'newsroom.article');

  const counts = {
    totalPages:    pages.length,
    totalArticles: articles.length,
    draft:         pages.filter(p => p.status === 'draft').length,
    inReview:      pages.filter(p => p.status === 'in_review').length,
    published:     pages.filter(p => p.status === 'published').length,
    approved:      pages.filter(p => p.status === 'approved').length,
  };

  const needsAction = allItems
    .filter(p => p.status === 'in_review' || p.status === 'approved')
    .slice(0, 5);

  const recent = [...allItems]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const PAGE_STATS: { key: keyof typeof counts; label: string; sub: string }[] = [
    { key: 'totalPages',    label: 'Total Pages',    sub: 'Structural content pages'   },
    { key: 'totalArticles', label: 'Articles',       sub: 'Editorial newsroom content' },
    { key: 'published',     label: 'Published',      sub: 'Live on the site'           },
    { key: 'inReview',      label: 'In Review',      sub: 'Awaiting approval'          },
    { key: 'draft',         label: 'Drafts',         sub: 'Work in progress'           },
  ];

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Welcome, {actor.name.split(' ')[0]}</h1>
        <p className="adm-page-subtitle">{window.__SCHOOL_DATA__?.name || "منصة شفيع"} — Authoring Dashboard</p>
      </div>

      <div className="adm-stats-row">
        {PAGE_STATS.map(s => (
          <div key={s.key} className="adm-stat-card">
            <div className="adm-stat-card__value" style={{ color: STAT_ACCENT[s.key] }}>
              {counts[s.key]}
            </div>
            <div className="adm-stat-card__label">{s.label}</div>
            <div className="adm-stat-card__sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="adm-panel-grid">

        <div className="adm-card">
          <div className="adm-card__header">
            <span className="adm-card__title">Needs Action</span>
            <span className="adm-badge-count">
              {needsAction.length} item{needsAction.length !== 1 ? 's' : ''}
            </span>
          </div>
          {loading ? (
            <div className="adm-list-loading">Loading…</div>
          ) : needsAction.length === 0 ? (
            <div className="adm-list-empty">No items requiring action.</div>
          ) : needsAction.map(item => (
            <div
              key={item.id}
              className="adm-list-row"
              onClick={() => navigate(
                item.type === 'newsroom.article'
                  ? `/admin/articles/${item.id}/edit`
                  : `/admin/pages/${item.id}`
              )}
            >
              <div className="adm-list-row__meta">
                <div className="adm-list-row__title">{pageTitle(item)}</div>
                <div className="adm-list-row__sub">
                  {item.type === 'newsroom.article' ? '📰 Article' : `/${item.slug}`}
                </div>
              </div>
              <WorkflowBadge status={item.status as WorkflowStatus} size="sm" />
            </div>
          ))}
        </div>

        <div className="adm-card">
          <div className="adm-card__header">
            <span className="adm-card__title">Recently Updated</span>
            <Button
              className="adm-view-all-btn"
              onClick={() => navigate('/admin/pages')}
            >
              View all →
            </Button>
          </div>
          {loading ? (
            <div className="adm-list-loading">Loading…</div>
          ) : recent.map(item => (
            <div
              key={item.id}
              className="adm-list-row"
              onClick={() => navigate(
                item.type === 'newsroom.article'
                  ? `/admin/articles/${item.id}/edit`
                  : `/admin/pages/${item.id}`
              )}
            >
              <div className="adm-list-row__meta">
                <div className="adm-list-row__title">{pageTitle(item)}</div>
                <div className="adm-list-row__sub">
                  {item.type === 'newsroom.article' ? '📰 Article · ' : ''}{fmtDate(item.updated_at)}
                </div>
              </div>
              <WorkflowBadge status={item.status as WorkflowStatus} size="sm" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
