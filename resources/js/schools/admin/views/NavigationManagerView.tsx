import React, { useEffect, useState } from 'react';
import { ADMIN_LANG } from '../lang/en';
import Button from '../components/Button';
import {
    fetchNavGroups,
    createNavGroup,
    updateNavGroup,
    deleteNavGroup,
    createNavColumn,
    updateNavColumn,
    deleteNavColumn,
    createNavEntry,
    updateNavEntry,
    deleteNavEntry,
} from '../api/adminClient';
import type { NavGroup, NavColumn, NavEntry } from '../api/adminClient';

const L = ADMIN_LANG.navigation;

type EditTarget =
    | { kind: 'group'; id: string }
    | { kind: 'column'; id: string }
    | { kind: 'entry'; id: string }
    | null;

type AddTarget =
    | { kind: 'group' }
    | { kind: 'column'; groupId: string }
    | { kind: 'entry'; columnId: string }
    | null;

interface GroupForm {
    label: string;
    group_id: string;
    type: 'mega_menu' | 'dropdown' | 'direct_link';
    position: number;
    is_active: boolean;
}

interface ColumnForm {
    label: string;
    position: number;
}

interface EntryForm {
    label: string;
    destination_type: 'internal_page' | 'external_url';
    destination_value: string;
    position: number;
    is_badge_highlighted: boolean;
    badge_text: string;
}

function slugify(s: string): string {
    return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function NavigationManagerView() {
    const [groups, setGroups]         = useState<NavGroup[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [saving, setSaving]         = useState(false);
    const [expanded, setExpanded]     = useState<Record<string, boolean>>({});
    const [editTarget, setEditTarget] = useState<EditTarget>(null);
    const [addTarget, setAddTarget]   = useState<AddTarget>(null);

    const [groupForm, setGroupForm]   = useState<GroupForm>({ label: '', group_id: '', type: 'dropdown', position: 1, is_active: true });
    const [columnForm, setColumnForm] = useState<ColumnForm>({ label: '', position: 1 });
    const [entryForm, setEntryForm]   = useState<EntryForm>({ label: '', destination_type: 'internal_page', destination_value: '', position: 1, is_badge_highlighted: false, badge_text: '' });

    const load = () => {
        setLoading(true);
        fetchNavGroups()
            .then(res => setGroups(res.groups))
            .catch(e => setError((e as Error).message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const toggleGroup = (id: string) =>
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const cancelAll = () => { setEditTarget(null); setAddTarget(null); setError(''); };

    const startAddGroup = () => {
        cancelAll();
        const nextPos = groups.length + 1;
        setGroupForm({ label: '', group_id: '', type: 'dropdown', position: nextPos, is_active: true } as GroupForm);
        setAddTarget({ kind: 'group' });
    };

    const startEditGroup = (g: NavGroup) => {
        cancelAll();
        setGroupForm({ label: g.label, group_id: g.group_id, type: g.type, position: g.position, is_active: g.is_active });
        setEditTarget({ kind: 'group', id: g.id });
    };

    const startAddColumn = (groupId: string) => {
        cancelAll();
        const g = groups.find(x => x.id === groupId);
        const nextPos = (g?.columns.length ?? 0) + 1;
        setColumnForm({ label: '', position: nextPos });
        setAddTarget({ kind: 'column', groupId });
        setExpanded(prev => ({ ...prev, [groupId]: true }));
    };

    const startEditColumn = (col: NavColumn) => {
        cancelAll();
        setColumnForm({ label: col.label, position: col.position });
        setEditTarget({ kind: 'column', id: col.id });
    };

    const startAddEntry = (columnId: string) => {
        cancelAll();
        const col = groups.flatMap(g => g.columns).find(c => c.id === columnId);
        const nextPos = (col?.entries.length ?? 0) + 1;
        setEntryForm({ label: '', destination_type: 'internal_page', destination_value: '', position: nextPos, is_badge_highlighted: false, badge_text: '' });
        setAddTarget({ kind: 'entry', columnId });
    };

    const startEditEntry = (e: NavEntry) => {
        cancelAll();
        setEntryForm({
            label: e.label,
            destination_type: e.destination_type,
            destination_value: e.destination_value,
            position: e.position,
            is_badge_highlighted: e.is_badge_highlighted,
            badge_text: e.badge_text ?? '',
        });
        setEditTarget({ kind: 'entry', id: e.id });
    };

    const saveGroup = () => {
        setSaving(true);
        setError('');
        const op = editTarget?.kind === 'group'
            ? updateNavGroup(editTarget.id, { label: groupForm.label, type: groupForm.type, position: groupForm.position, is_active: groupForm.is_active })
            : createNavGroup({ ...groupForm });
        op.then(() => { cancelAll(); load(); })
            .catch(e => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const saveColumn = (groupId: string) => {
        setSaving(true);
        setError('');
        const op = editTarget?.kind === 'column'
            ? updateNavColumn(editTarget.id, { label: columnForm.label, position: columnForm.position })
            : createNavColumn({ navigation_group_id: groupId, label: columnForm.label, position: columnForm.position });
        op.then(() => { cancelAll(); load(); })
            .catch(e => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const saveEntry = (columnId: string) => {
        setSaving(true);
        setError('');
        const payload = {
            label: entryForm.label,
            destination_type: entryForm.destination_type,
            destination_value: entryForm.destination_value,
            position: entryForm.position,
            is_badge_highlighted: entryForm.is_badge_highlighted,
            badge_text: entryForm.badge_text || null,
        };
        const op = editTarget?.kind === 'entry'
            ? updateNavEntry(editTarget.id, payload)
            : createNavEntry({ navigation_column_id: columnId, ...payload });
        op.then(() => { cancelAll(); load(); })
            .catch(e => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const removeGroup = (id: string) => {
        if (!window.confirm(L.confirmDelete)) return;
        setSaving(true);
        deleteNavGroup(id)
            .then(() => load())
            .catch(e => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const removeColumn = (id: string) => {
        if (!window.confirm(L.confirmDelete)) return;
        setSaving(true);
        deleteNavColumn(id)
            .then(() => load())
            .catch(e => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const removeEntry = (id: string) => {
        if (!window.confirm(L.confirmDelete)) return;
        setSaving(true);
        deleteNavEntry(id)
            .then(() => load())
            .catch(e => setError((e as Error).message))
            .finally(() => setSaving(false));
    };

    const isEditingGroup  = (id: string) => editTarget?.kind === 'group'  && editTarget.id === id;
    const isEditingColumn = (id: string) => editTarget?.kind === 'column' && editTarget.id === id;
    const isEditingEntry  = (id: string) => editTarget?.kind === 'entry'  && editTarget.id === id;
    const isAddingColumn  = (gid: string) => addTarget?.kind === 'column' && addTarget.groupId === gid;
    const isAddingEntry   = (cid: string) => addTarget?.kind === 'entry'  && addTarget.columnId === cid;

    const GroupFormPanel = ({ onSave }: { onSave: () => void }) => (
        <div className="adm-nav-form">
            <div className="adm-nav-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.groupLabel}</label>
                    <input
                        className="adm-input"
                        value={groupForm.label}
                        onChange={e => {
                            const label = e.target.value;
                            setGroupForm(f => ({
                                ...f,
                                label,
                                group_id: addTarget?.kind === 'group' ? slugify(label) : f.group_id,
                            }));
                        }}
                    />
                </div>
                <div className="adm-field">
                    <label className="adm-field__label">{L.groupId}</label>
                    <input
                        className="adm-input"
                        value={groupForm.group_id}
                        disabled={editTarget?.kind === 'group'}
                        onChange={e => setGroupForm(f => ({ ...f, group_id: e.target.value }))}
                    />
                </div>
            </div>
            <div className="adm-nav-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.groupType}</label>
                    <select
                        className="adm-input"
                        value={groupForm.type}
                        onChange={e => setGroupForm(f => ({ ...f, type: e.target.value as 'mega_menu' | 'dropdown' | 'direct_link' }))}
                    >
                        <option value="dropdown">{L.dropdown}</option>
                        <option value="mega_menu">Mega Menu</option>
                        <option value="direct_link">{L.link}</option>
                    </select>
                </div>
                <div className="adm-field">
                    <label className="adm-field__label">{L.groupPosition}</label>
                    <input
                        className="adm-input"
                        type="number"
                        min={0}
                        value={groupForm.position}
                        onChange={e => setGroupForm(f => ({ ...f, position: Number(e.target.value) }))}
                    />
                </div>
                <div className="adm-field" style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                    <label className="adm-field__label" style={{ marginBottom: 0 }}>{L.groupActive}</label>
                    <input
                        type="checkbox"
                        checked={groupForm.is_active}
                        onChange={e => setGroupForm(f => ({ ...f, is_active: e.target.checked }))}
                        style={{ width: 18, height: 18 }}
                    />
                </div>
            </div>
            <div className="adm-user-form__actions">
                <Button variant="primary" loading={saving} onClick={onSave}>{L.saveBtn}</Button>
                <Button variant="ghost" onClick={cancelAll}>{L.cancelBtn}</Button>
            </div>
        </div>
    );

    const ColumnFormPanel = ({ groupId }: { groupId: string }) => (
        <div className="adm-nav-form adm-nav-form--nested">
            <div className="adm-nav-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.columnLabel}</label>
                    <input
                        className="adm-input"
                        value={columnForm.label}
                        onChange={e => setColumnForm(f => ({ ...f, label: e.target.value }))}
                    />
                </div>
                <div className="adm-field" style={{ maxWidth: 100 }}>
                    <label className="adm-field__label">{L.columnPosition}</label>
                    <input
                        className="adm-input"
                        type="number"
                        min={0}
                        value={columnForm.position}
                        onChange={e => setColumnForm(f => ({ ...f, position: Number(e.target.value) }))}
                    />
                </div>
            </div>
            <div className="adm-user-form__actions">
                <Button variant="primary" loading={saving} onClick={() => saveColumn(groupId)}>{L.saveBtn}</Button>
                <Button variant="ghost" onClick={cancelAll}>{L.cancelBtn}</Button>
            </div>
        </div>
    );

    const EntryFormPanel = ({ columnId }: { columnId: string }) => (
        <div className="adm-nav-form adm-nav-form--nested adm-nav-form--entry">
            <div className="adm-nav-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.entryLabel}</label>
                    <input
                        className="adm-input"
                        value={entryForm.label}
                        onChange={e => setEntryForm(f => ({ ...f, label: e.target.value }))}
                    />
                </div>
                <div className="adm-field" style={{ maxWidth: 80 }}>
                    <label className="adm-field__label">{L.entryPosition}</label>
                    <input
                        className="adm-input"
                        type="number"
                        min={0}
                        value={entryForm.position}
                        onChange={e => setEntryForm(f => ({ ...f, position: Number(e.target.value) }))}
                    />
                </div>
            </div>
            <div className="adm-nav-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.entryDestType}</label>
                    <select
                        className="adm-input"
                        value={entryForm.destination_type}
                        onChange={e => setEntryForm(f => ({ ...f, destination_type: e.target.value as 'internal_page' | 'external_url' }))}
                    >
                        <option value="internal_page">{L.internalPage}</option>
                        <option value="external_url">{L.externalUrl}</option>
                    </select>
                </div>
                <div className="adm-field" style={{ flex: 2 }}>
                    <label className="adm-field__label">{L.entryDest}</label>
                    <input
                        className="adm-input"
                        placeholder={entryForm.destination_type === 'internal_page' ? 'e.g. platforms/accore' : 'https://…'}
                        value={entryForm.destination_value}
                        onChange={e => setEntryForm(f => ({ ...f, destination_value: e.target.value }))}
                    />
                </div>
            </div>
            <div className="adm-nav-form__row">
                <div className="adm-field">
                    <label className="adm-field__label">{L.entryBadge}</label>
                    <input
                        className="adm-input"
                        value={entryForm.badge_text}
                        onChange={e => setEntryForm(f => ({ ...f, badge_text: e.target.value }))}
                        placeholder="Optional"
                    />
                </div>
                <div className="adm-field" style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                    <label className="adm-field__label" style={{ marginBottom: 0 }}>{L.entryBadgeHl}</label>
                    <input
                        type="checkbox"
                        checked={entryForm.is_badge_highlighted}
                        onChange={e => setEntryForm(f => ({ ...f, is_badge_highlighted: e.target.checked }))}
                        style={{ width: 18, height: 18 }}
                    />
                </div>
            </div>
            <div className="adm-user-form__actions">
                <Button variant="primary" loading={saving} onClick={() => saveEntry(columnId)}>{L.saveBtn}</Button>
                <Button variant="ghost" onClick={cancelAll}>{L.cancelBtn}</Button>
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
                <Button variant="primary" onClick={startAddGroup}>{L.addGroup}</Button>
            </div>

            {error && <div className="adm-alert adm-alert--warning" style={{ margin: '0 0 16px' }}>{error}</div>}

            {addTarget?.kind === 'group' && (
                <div className="adm-card" style={{ marginBottom: 24, padding: 24 }}>
                    <div className="adm-card__title" style={{ marginBottom: 16 }}>New Navigation Group</div>
                    <GroupFormPanel onSave={saveGroup} />
                </div>
            )}

            {loading ? (
                <div className="adm-list-loading">Loading…</div>
            ) : groups.length === 0 ? (
                <div className="adm-list-empty">{L.noGroups}</div>
            ) : (
                <div className="adm-nav-groups">
                    {groups.map(group => (
                        <div key={group.id} className="adm-nav-group">
                            {isEditingGroup(group.id) ? (
                                <div className="adm-nav-group__header adm-nav-group__header--editing">
                                    <GroupFormPanel onSave={saveGroup} />
                                </div>
                            ) : (
                                <div className="adm-nav-group__header" onClick={() => toggleGroup(group.id)}>
                                    <div className="adm-nav-group__info">
                                        <span className="adm-nav-group__toggle">{expanded[group.id] ? '▾' : '▸'}</span>
                                        <span className="adm-nav-group__label">{group.label}</span>
                                        <span className="adm-nav-group__meta">
                                            <span className="adm-badge adm-badge--neutral">{group.group_id}</span>
                                            <span className="adm-badge adm-badge--neutral">{group.type}</span>
                                            <span className="adm-badge adm-badge--neutral">pos {group.position}</span>
                                            <span className={`adm-badge ${group.is_active ? 'adm-badge--success' : 'adm-badge--muted'}`}>
                                                {group.is_active ? L.active : L.inactive}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="adm-nav-group__actions" onClick={e => e.stopPropagation()}>
                                        <Button variant="ghost" size="sm" onClick={() => startEditGroup(group)}>{L.editBtn}</Button>
                                        <Button variant="ghost" size="sm" onClick={() => startAddColumn(group.id)}>{L.addColumn}</Button>
                                        <Button variant="danger" size="sm" onClick={() => removeGroup(group.id)}>{L.deleteBtn}</Button>
                                    </div>
                                </div>
                            )}

                            {expanded[group.id] && !isEditingGroup(group.id) && (
                                <div className="adm-nav-group__body">
                                    {isAddingColumn(group.id) && (
                                        <div className="adm-nav-column adm-nav-column--form">
                                            <div className="adm-nav-column__title">New Column</div>
                                            <ColumnFormPanel groupId={group.id} />
                                        </div>
                                    )}

                                    {group.columns.length === 0 && !isAddingColumn(group.id) ? (
                                        <div className="adm-list-empty adm-list-empty--sm">{L.noColumns}</div>
                                    ) : (
                                        <div className="adm-nav-columns">
                                            {group.columns.map(col => (
                                                <div key={col.id} className="adm-nav-column">
                                                    {isEditingColumn(col.id) ? (
                                                        <ColumnFormPanel groupId={group.id} />
                                                    ) : (
                                                        <div className="adm-nav-column__header">
                                                            <div className="adm-nav-column__label">
                                                                {col.label}
                                                                <span className="adm-badge adm-badge--neutral" style={{ marginLeft: 8 }}>pos {col.position}</span>
                                                            </div>
                                                            <div className="adm-nav-column__actions">
                                                                <Button variant="ghost" size="sm" onClick={() => startEditColumn(col)}>{L.editBtn}</Button>
                                                                <Button variant="ghost" size="sm" onClick={() => startAddEntry(col.id)}>{L.addEntry}</Button>
                                                                <Button variant="danger" size="sm" onClick={() => removeColumn(col.id)}>{L.deleteBtn}</Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isAddingEntry(col.id) && (
                                                        <div style={{ marginTop: 8 }}>
                                                            <div className="adm-nav-entry__form-title">New Entry</div>
                                                            <EntryFormPanel columnId={col.id} />
                                                        </div>
                                                    )}

                                                    <div className="adm-nav-entries">
                                                        {col.entries.length === 0 && !isAddingEntry(col.id) && (
                                                            <div className="adm-list-empty adm-list-empty--xs">{L.noEntries}</div>
                                                        )}
                                                        {col.entries.map(entry => (
                                                            <div key={entry.id} className="adm-nav-entry">
                                                                {isEditingEntry(entry.id) ? (
                                                                    <EntryFormPanel columnId={col.id} />
                                                                ) : (
                                                                    <>
                                                                        <div className="adm-nav-entry__info">
                                                                            <span className="adm-nav-entry__label">{entry.label}</span>
                                                                            <span className="adm-badge adm-badge--neutral">pos {entry.position}</span>
                                                                            <span className="adm-badge adm-badge--neutral">{entry.destination_type === 'internal_page' ? '📄' : '🔗'} {entry.destination_value}</span>
                                                                            {entry.badge_text && (
                                                                                <span className={`adm-badge ${entry.is_badge_highlighted ? 'adm-badge--success' : 'adm-badge--neutral'}`}>
                                                                                    {entry.badge_text}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="adm-nav-entry__actions">
                                                                            <Button variant="ghost" size="sm" onClick={() => startEditEntry(entry)}>{L.editBtn}</Button>
                                                                            <Button variant="danger" size="sm" onClick={() => removeEntry(entry.id)}>{L.deleteBtn}</Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
