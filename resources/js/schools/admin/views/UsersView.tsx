import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AuthorRole } from '../types';
import { ADMIN_LANG } from '../lang/en';
import { createAdminUser, deleteAdminUser, fetchAdminUsers, updateAdminUser } from '../api/adminClient';
import Button from '../components/Button';

const L = ADMIN_LANG.users;

interface User {
    id:      string;
    name:    string;
    email:   string;
    role:    AuthorRole;
    topics:  string[];
    active:  boolean;
}

const ROLE_OPTIONS: { value: AuthorRole; label: string; color: string }[] = [
    { value: 'platform.admin',     label: 'Platform Admin',     color: '#C9A227' },

    { value: 'content.publisher',  label: 'Publisher',          color: '#3B82F6' },
    { value: 'content.editor',     label: 'Editor',             color: '#10B981' },
    { value: 'content.author',     label: 'Author',             color: '#94A3B8' },
    { value: 'content.supervisor', label: 'Content Supervisor', color: '#8E24AA' },

    { value: 'ops.manager',        label: 'Operations Manager', color: '#FF9800' },

    { value: 'inquiry.email',      label: 'Email Responder',    color: '#007BFF' },
    { value: 'inquiry.faq',        label: 'FAQ Specialist',     color: '#00ACC1' },
    { value: 'inquiry.support',    label: 'Support Agent',      color: '#43A047' },
    { value: 'inquiry.manager',    label: 'Inquiry Manager',    color: '#EF6C00' },
];

const DEMO_TOPICS = ['Fintech', 'Enterprise', 'Cloud', 'Mobile', 'AI & ML', 'Commerce', 'Partnerships'];

const ROLE_COLOR: Record<AuthorRole, string> = {
    'platform.admin':      '#C9A227',
    'content.publisher':   '#3B82F6',
    'content.editor':      '#10B981',
    'content.author':      '#94A3B8',
    'ops.manager':         '#FF9800',
    'inquiry.email':       '#007BFF',
    'inquiry.faq':         '#00ACC1',
    'inquiry.support':     '#43A047',
    'inquiry.manager':     '#EF6C00',
    'content.supervisor':  '#8E24AA',
};

export default function UsersView() {
    const { can } = useAuth();
    const [users, setUsers]     = useState<User[]>([]);
    const [editId, setEditId]   = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm]       = useState<Partial<User>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchAdminUsers().then(setUsers).catch((e) => setError((e as Error).message));
    }, []);


    const canManage = can('manage_pages');

    const startEdit = (u: User) => { setEditId(u.id); setForm({ ...u }); setShowAdd(false); };
    const startAdd  = () => { setEditId(null); setForm({ name: '', email: '', role: 'content.author', topics: [], active: true }); setShowAdd(true); };
    const cancel    = () => { setEditId(null); setShowAdd(false); setForm({}); };

    const save = () => {
        const payload = {
            name: form.name ?? '',
            email: form.email ?? '',
            role: (form.role ?? 'content.author') as AuthorRole,
            active: form.active ?? true,
            topics: form.topics ?? [],
        };

        setSaving(true);
        setError('');
        const op = showAdd
            ? createAdminUser(payload)
            : updateAdminUser(editId as string, payload);

        op.then(() => fetchAdminUsers().then(setUsers))
            .then(() => cancel())
            .catch((e) => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const remove = (id: string) => {
        setSaving(true);
        deleteAdminUser(id)
            .then(() => fetchAdminUsers().then(setUsers))
            .catch((e) => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const toggleTopic = (t: string) => {
        const cur = form.topics ?? [];
        setForm(f => ({ ...f, topics: cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t] }));
    };

    const EditForm = () => (
        <div className="adm-user-form">
            <div className="adm-user-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.nameLabel}</label>
                    <input className="adm-input" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="adm-field">
                    <label className="adm-field__label">{L.emailLabel}</label>
                    <input className="adm-input" type="email" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
            </div>
            <div className="adm-field">
                <label className="adm-field__label">{L.roleLabel}</label>
                <div className="adm-role-pills">
                    {ROLE_OPTIONS.map(r => (
                        <button
                            key={r.value}
                            onClick={() => setForm(f => ({ ...f, role: r.value }))}
                            className={`adm-role-pill${form.role === r.value ? ' adm-role-pill--active' : ''}`}
                            style={form.role === r.value ? { borderColor: r.color, background: r.color + '18', color: r.color } : undefined}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="adm-field">
                <label className="adm-field__label">{L.topicsLabel}</label>
                <div className="adm-topic-chips">
                    {DEMO_TOPICS.map(t => {
                        const sel = (form.topics ?? []).includes(t);
                        return (
                            <button
                                key={t}
                                onClick={() => toggleTopic(t)}
                                className={`adm-topic-chip${sel ? ' adm-topic-chip--active' : ''}`}
                            >
                                {t}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="adm-user-form__actions">
                <Button variant="primary" disabled={saving} onClick={save}>{L.saveBtn}</Button>
                <Button variant="ghost" onClick={cancel}>{L.cancelBtn}</Button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="adm-page-header">
                <div>
                    <h1 className="adm-page-title">{L.title}</h1>
                    <p className="adm-page-subtitle">{L.subtitle}</p>
                </div>
                {canManage && (
                    <Button variant="primary" onClick={startAdd}>{L.addUser}</Button>
                )}
            </div>

            {showAdd && (
                <div className="adm-card" style={{ marginBottom: 24, padding: 24 }}>
                    <div className="adm-card__title" style={{ marginBottom: 16 }}>Add New User</div>
                    <EditForm />
                </div>
            )}

            <div className="adm-card">
                {error && <div className="adm-alert adm-alert--warning">{error}</div>}
                {users.length === 0 ? (
                    <div className="adm-list-empty">{L.noUsers}</div>
                ) : users.map(u => {
                    const color = ROLE_COLOR[u.role];
                    const roleName = ROLE_OPTIONS.find(r => r.value === u.role)?.label ?? u.role;
                    if (editId === u.id) {
                        return (
                            <div key={u.id} className="adm-user-row adm-user-row--editing">
                                <EditForm />
                            </div>
                        );
                    }
                    return (
                        <div key={u.id} className="adm-user-row">
                            <div className="adm-user-row__avatar" style={{ background: color }}>{u.name[0]}</div>
                            <div className="adm-user-row__info">
                                <div className="adm-user-row__name">{u.name}</div>
                                <div className="adm-user-row__email">{u.email}</div>
                                {u.topics.length > 0 && (
                                    <div className="adm-user-row__topics">
                                        {u.topics.map(t => (
                                            <span key={t} className="adm-topic-chip adm-topic-chip--sm">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="adm-role-badge" style={{ background: color + '18', color }}>
                                {roleName}
                            </span>
                            {canManage && (
                                <div className="adm-user-row__actions">
                                    <Button variant="ghost" size="sm" onClick={() => startEdit(u)}>{L.editBtn}</Button>
                                    {u.role !== 'platform.admin' && (
                                        <Button variant="danger" size="sm" onClick={() => remove(u.id)}>{L.removeBtn}</Button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
