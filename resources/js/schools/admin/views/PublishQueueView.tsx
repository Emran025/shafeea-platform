import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPages } from '../api/adminClient';
import Button from '../components/Button';
import type { AdminPage } from '../types';
import WorkflowBadge from '../components/WorkflowBadge';
import type { WorkflowStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { ADMIN_LANG } from '../lang/en';

const L = ADMIN_LANG.publishQueue;

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

export default function PublishQueueView() {
    const { actor, can } = useAuth();
    const navigate       = useNavigate();
    const [pages, setPages]     = useState<AdminPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState<'approved' | 'scheduled'>('approved');

    const canPublish = can('publish');

    useEffect(() => {
        fetchPages().then(r => setPages(r.data)).finally(() => setLoading(false));
    }, []);

    const approved  = pages.filter(p => p.status === 'approved');
    const scheduled = pages.filter(p => p.status === 'scheduled');
    const items     = tab === 'approved' ? approved : scheduled;

    return (
        <div>
            <div className="adm-page-header">
                <h1 className="adm-page-title">{L.title}</h1>
                <p className="adm-page-subtitle">{L.subtitle}</p>
            </div>

            {!canPublish && (
                <div className="adm-alert adm-alert--warning">
                    <img src="/icons/approvals.svg" alt="" className="adm-inline-icon" /> {L.restrictedMsg}
                </div>
            )}

            {/* Stats */}
            <div className="adm-stats-row" style={{ marginBottom: 24 }}>
                <div className="adm-stat-card">
                    <div className="adm-stat-card__value" style={{ color: '#10B981' }}>{approved.length}</div>
                    <div className="adm-stat-card__label">Approved</div>
                    <div className="adm-stat-card__sub">Ready to publish</div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-card__value" style={{ color: '#6366F1' }}>{scheduled.length}</div>
                    <div className="adm-stat-card__label">Scheduled</div>
                    <div className="adm-stat-card__sub">Publishing automatically</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="adm-tabs">
                <Button
                    className={`adm-tab${tab === 'approved' ? ' adm-tab--active' : ''}`}
                    onClick={() => setTab('approved')}
                >
                    {L.approvedTab}
                    {approved.length > 0 && (
                        <span className="adm-tab__count">{approved.length}</span>
                    )}
                </Button>
                <Button
                    className={`adm-tab${tab === 'scheduled' ? ' adm-tab--active' : ''}`}
                    onClick={() => setTab('scheduled')}
                >
                    {L.scheduledTab}
                    {scheduled.length > 0 && (
                        <span className="adm-tab__count">{scheduled.length}</span>
                    )}
                </Button>
            </div>

            <div className="adm-card">
                {loading ? (
                    <div className="adm-list-loading">{ADMIN_LANG.common.loading}</div>
                ) : items.length === 0 ? (
                    <div className="adm-list-empty">{L.noItems}</div>
                ) : items.map(page => (
                    <div key={page.id} className="adm-publish-row">
                        <div
                            className="adm-publish-row__meta"
                            onClick={() => navigate(`/admin/pages/${page.id}`)}
                        >
                            <div className="adm-publish-row__title">{pageTitle(page)}</div>
                            <div className="adm-publish-row__sub">
                                /{page.slug} · Updated {fmtDate(page.updated_at)}
                            </div>
                        </div>
                        <WorkflowBadge status={page.status as WorkflowStatus} size="sm" />
                        {canPublish && (
                            <div className="adm-publish-row__actions">
                                <Button variant="primary">
                                    {L.publishBtn}
                                </Button>
                                <Button variant="ghost">
                                    {L.rejectBtn}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
