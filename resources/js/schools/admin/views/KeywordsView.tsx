import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_LANG } from '../lang/en';
import Button from '../components/Button';

const L = ADMIN_LANG.keywords;

interface Keyword {
    id:       string;
    label:    string;
    articles: number;
    created:  string;
}

const INITIAL_KEYWORDS: Keyword[] = [
    { id: 'kw1',  label: 'fintech',        articles: 12, created: '2026-05-01' },
    { id: 'kw2',  label: 'enterprise',     articles: 8,  created: '2026-05-02' },
    { id: 'kw3',  label: 'cloud',          articles: 15, created: '2026-05-03' },
    { id: 'kw4',  label: 'mobile',         articles: 6,  created: '2026-05-10' },
    { id: 'kw5',  label: 'ai',             articles: 20, created: '2026-05-11' },
    { id: 'kw6',  label: 'commerce',       articles: 9,  created: '2026-05-15' },
    { id: 'kw7',  label: 'partnerships',   articles: 4,  created: '2026-05-20' },
    { id: 'kw8',  label: 'accore',         articles: 7,  created: '2026-05-22' },
    { id: 'kw9',  label: 'accommerce',     articles: 5,  created: '2026-05-25' },
    { id: 'kw10', label: 'qayd',           articles: 3,  created: '2026-06-01' },
    { id: 'kw11', label: 'infrastructure', articles: 11, created: '2026-06-05' },
    { id: 'kw12', label: 'data',           articles: 14, created: '2026-06-10' },
];

export default function KeywordsView() {
    const { can } = useAuth();
    const [keywords, setKeywords]   = useState<Keyword[]>(INITIAL_KEYWORDS);
    const [newLabel, setNewLabel]   = useState('');
    const [search, setSearch]       = useState('');
    const [error, setError]         = useState('');

    const canManage = can('manage_pages');

    const addKeyword = () => {
        const trimmed = newLabel.trim().toLowerCase();
        if (!trimmed) { setError('Keyword cannot be empty.'); return; }
        if (keywords.some(k => k.label === trimmed)) { setError('Keyword already exists.'); return; }
        setKeywords(prev => [...prev, {
            id:       'kw' + Date.now(),
            label:    trimmed,
            articles: 0,
            created:  new Date().toISOString().slice(0, 10),
        }]);
        setNewLabel('');
        setError('');
    };

    const remove = (id: string) => setKeywords(prev => prev.filter(k => k.id !== id));

    const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') addKeyword(); };

    const filtered = keywords.filter(k => k.label.includes(search.toLowerCase()));

    return (
        <div>
            <div className="adm-page-header">
                <h1 className="adm-page-title">{L.title}</h1>
                <p className="adm-page-subtitle">{L.subtitle}</p>
            </div>

            {/* Add keyword */}
            {canManage && (
                <div className="adm-card adm-kw-add-card">
                    <div className="adm-kw-add-row">
                        <input
                            className="adm-input adm-kw-input"
                            placeholder={L.inputPlaceholder}
                            value={newLabel}
                            onChange={e => { setNewLabel(e.target.value); setError(''); }}
                            onKeyDown={handleKey}
                        />
                        <Button variant="primary" onClick={addKeyword}>{L.addBtn}</Button>
                    </div>
                    {error && <p className="adm-kw-error">{error}</p>}
                </div>
            )}

            {/* Stats */}
            <div className="adm-stats-row" style={{ marginBottom: 24 }}>
                <div className="adm-stat-card">
                    <div className="adm-stat-card__value" style={{ color: '#0F2741' }}>{keywords.length}</div>
                    <div className="adm-stat-card__label">Total Keywords</div>
                    <div className="adm-stat-card__sub">Defined in the system</div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-card__value" style={{ color: '#3B82F6' }}>
                        {keywords.reduce((sum, k) => sum + k.articles, 0)}
                    </div>
                    <div className="adm-stat-card__label">Tagged Articles</div>
                    <div className="adm-stat-card__sub">Across all keywords</div>
                </div>
            </div>

            {/* Search + keyword cloud */}
            <div className="adm-card">
                <div className="adm-card__header">
                    <span className="adm-card__title">All Keywords</span>
                    <input
                        className="adm-input adm-input--sm"
                        placeholder="Filter…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 180 }}
                    />
                </div>

                <div className="adm-kw-cloud">
                    {filtered.length === 0 ? (
                        <div className="adm-list-empty">{ADMIN_LANG.common.noResults}</div>
                    ) : filtered.sort((a, b) => b.articles - a.articles).map(kw => (
                        <div key={kw.id} className="adm-kw-tag">
                            <span className="adm-kw-tag__label">#{kw.label}</span>
                            <span className="adm-kw-tag__count">{kw.articles}</span>
                            {canManage && (
                                <button
                                    className="adm-kw-tag__del"
                                    onClick={() => remove(kw.id)}
                                    title={L.deleteBtn}
                                >×</button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Table view */}
                <table className="adm-perm-table" style={{ marginTop: 24 }}>
                    <thead>
                        <tr>
                            <th className="adm-perm-table__th adm-perm-table__th--perm">{L.colKeyword}</th>
                            <th className="adm-perm-table__th">{L.colArticles}</th>
                            <th className="adm-perm-table__th">{L.colCreated}</th>
                            {canManage && <th className="adm-perm-table__th">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(kw => (
                            <tr key={kw.id} className="adm-perm-table__row">
                                <td className="adm-perm-table__td adm-perm-table__td--label">#{kw.label}</td>
                                <td className="adm-perm-table__td">{kw.articles}</td>
                                <td className="adm-perm-table__td">{kw.created}</td>
                                {canManage && (
                                    <td className="adm-perm-table__td">
                                        <Button variant="danger" onClick={() => remove(kw.id)}>
                                            {L.deleteBtn}
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
