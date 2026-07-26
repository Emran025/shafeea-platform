import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_LANG } from '../lang/en';
import { createTopic, deleteTopic, fetchTopicsData, updateTopic } from '../api/adminClient';
import Button from '../components/Button';

const L = ADMIN_LANG.topics;

interface Topic {
    id:       string;
    name:     string;
    desc:     string;
    users:    string[];
    articles: number;
    color:    string;
}

const TOPIC_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6'];

export default function TopicsView() {
    const { can } = useAuth();
    const [topics, setTopics]   = useState<Topic[]>([]);
    const [allUsers, setAllUsers] = useState<{ name: string; email: string; role: string }[]>([]);
    const [editId, setEditId]   = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm]       = useState<Partial<Topic>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchTopicsData()
            .then((res) => { setTopics(res.topics); setAllUsers(res.users); })
            .catch((e) => setError((e as Error).message));
    }, []);


    const canManage = can('manage_topics') || can('manage_pages');

    const startAdd = () => {
        setEditId(null);
        setForm({ name: '', desc: '', users: [], articles: 0, color: TOPIC_COLORS[topics.length % TOPIC_COLORS.length] });
        setShowAdd(true);
    };

    const startEdit = (t: Topic) => { setEditId(t.id); setForm({ ...t }); setShowAdd(false); };
    const cancel    = () => { setEditId(null); setShowAdd(false); setForm({}); };

    const save = () => {
        const payload = {
            name: form.name ?? '',
            desc: form.desc ?? '',
            color: form.color ?? TOPIC_COLORS[0],
            users: form.users ?? [],
        };
        setSaving(true);
        setError('');
        const op = showAdd ? createTopic(payload) : updateTopic(editId as string, payload);
        op.then(() => fetchTopicsData().then((res) => { setTopics(res.topics); setAllUsers(res.users); }))
            .then(() => cancel())
            .catch((e) => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const remove = (id: string) => {
        setSaving(true);
        deleteTopic(id)
            .then(() => fetchTopicsData().then((res) => { setTopics(res.topics); setAllUsers(res.users); }))
            .catch((e) => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const toggleUser = (email: string) => {
        const cur = form.users ?? [];
        setForm(f => ({ ...f, users: cur.includes(email) ? cur.filter(x => x !== email) : [...cur, email] }));
    };

    const TopicForm = () => (
        <div className="adm-topic-form">
            <div className="adm-user-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.nameLabel}</label>
                    <input className="adm-input" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="adm-field">
                    <label className="adm-field__label">Colour</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {TOPIC_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setForm(f => ({ ...f, color: c }))}
                                style={{
                                    width: 24, height: 24, borderRadius: '50%', background: c, border: form.color === c ? '2px solid #0F2741' : '2px solid transparent',
                                    cursor: 'pointer', padding: 0,
                                }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="adm-field">
                <label className="adm-field__label">{L.descLabel}</label>
                <textarea className="adm-input adm-input--textarea" rows={2} value={form.desc ?? ''} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
            </div>
            <div className="adm-field">
                <label className="adm-field__label">{L.assignLabel}</label>
                <div className="adm-user-assign-list">
                    {allUsers.map(u => {
                        const sel = (form.users ?? []).includes(u.email);
                        return (
                            <button
                                key={u.email}
                                onClick={() => toggleUser(u.email)}
                                className={`adm-assign-row${sel ? ' adm-assign-row--active' : ''}`}
                            >
                                <span className="adm-assign-row__avatar">{u.name[0]}</span>
                                <span className="adm-assign-row__info">
                                    <span>{u.name}</span>
                                    <span className="adm-assign-row__role">{u.role}</span>
                                </span>
                                {sel && <span className="adm-assign-row__check">✓</span>}
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
                    <Button variant="primary" onClick={startAdd}>{L.addTopic}</Button>
                )}
            </div>

            {showAdd && (
                <div className="adm-card" style={{ marginBottom: 24, padding: 24 }}>
                    <div className="adm-card__title" style={{ marginBottom: 16 }}>New Topic</div>
                    <TopicForm />
                </div>
            )}

            <div className="adm-topic-grid">
                {error && <div className="adm-alert adm-alert--warning">{error}</div>}
                {topics.length === 0 ? (
                    <div className="adm-list-empty">{L.noTopics}</div>
                ) : topics.map(t => {
                    if (editId === t.id) {
                        return (
                            <div key={t.id} className="adm-topic-card adm-topic-card--editing">
                                <TopicForm />
                            </div>
                        );
                    }
                    const assignedUsers = allUsers.filter(u => t.users.includes(u.email));
                    return (
                        <div key={t.id} className="adm-topic-card" style={{ borderTopColor: t.color }}>
                            <div className="adm-topic-card__header">
                                <span className="adm-topic-card__dot" style={{ background: t.color }} />
                                <span className="adm-topic-card__name">{t.name}</span>
                                <span className="adm-topic-card__count">{t.articles} articles</span>
                            </div>
                            <p className="adm-topic-card__desc">{t.desc}</p>
                            <div className="adm-topic-card__users">
                                {assignedUsers.length === 0 ? (
                                    <span className="adm-topic-card__no-users">{L.unassigned}</span>
                                ) : assignedUsers.map(u => (
                                    <span key={u.email} className="adm-topic-card__user">
                                        <span className="adm-topic-card__user-av">{u.name[0]}</span>
                                        {u.name.split(' ')[0]}
                                    </span>
                                ))}
                            </div>
                            {canManage && (
                                <div className="adm-topic-card__actions">
                                    <Button variant="ghost" onClick={() => startEdit(t)}>{L.editBtn}</Button>
                                    <Button variant="danger" onClick={() => remove(t.id)}>{L.deleteBtn}</Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
