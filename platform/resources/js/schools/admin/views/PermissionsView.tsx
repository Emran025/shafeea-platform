import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_LANG } from '../lang/en';
import type { AuthorRole } from '../types';
import { fetchPermissionsMatrix, updateRolePermissions } from '../api/adminClient';
import Button from '../components/Button';
import { Icon } from '../components/Icon';

const L = ADMIN_LANG.permissions;

type Permission =
    | 'edit_content'
    | 'submit_for_review'
    | 'request_changes'
    | 'approve'
    | 'publish'
    | 'unpublish'
    | 'manage_pages'
    | 'manage_sections'
    | 'manage_permissions'
    | 'manage_users'
    | 'manage_keywords'
    | 'manage_topics';

const ROLE_ORDER: AuthorRole[] = ['platform.admin', 'content.publisher', 'content.editor', 'content.author'];

const ROLE_COLORS: Record<AuthorRole, string> = {
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

const ROLE_ICONS: Record<AuthorRole, string> = {
    'platform.admin':    '/schools/icons/base.svg',
    'content.publisher': '/schools/icons/mass_mailing.svg',
    'content.editor':    '/schools/icons/web_studio.svg',
    'content.author':    '/schools/icons/documents.svg',
    'ops.manager':       '/schools/icons/settings.svg',
    'inquiry.email':     '/schools/icons/mail.svg',
    'content.supervisor':  '/schools/icons/fact_check.svg',
    'inquiry.faq':         '/schools/icons/help.svg',
    'inquiry.support':     '/schools/icons/support_agent.svg',
    'inquiry.manager':     '/schools/icons/manage_accounts.svg',
};

const PERM_GROUPS: { label: string; perms: Permission[] }[] = [
    {
        label: 'Content Authoring',
        perms: ['edit_content', 'submit_for_review'],
    },
    {
        label: 'Editorial Review',
        perms: ['request_changes', 'approve'],
    },
    {
        label: 'Publishing',
        perms: ['publish', 'unpublish'],
    },
    {
        label: 'Administration',
        perms: ['manage_pages', 'manage_sections', 'manage_permissions', 'manage_users', 'manage_keywords', 'manage_topics'],
    },
];

export default function PermissionsView() {
    const { can } = useAuth();
    const [rolePermissions, setRolePermissions] = useState<Record<AuthorRole, Permission[]>>({
        'platform.admin':       [],
        'content.publisher':    [],
        'content.editor':       [],
        'content.author':       [],
        'ops.manager':          [],
        'inquiry.email':        [],
        'inquiry.faq':          [],
        'inquiry.support':      [],
        'inquiry.manager':      [],
        'content.supervisor':   [],
    });
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [saving, setSaving] = useState<AuthorRole | null>(null);
    const [saved,  setSaved]  = useState<AuthorRole | null>(null);
    const [error,  setError]  = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<AuthorRole>('platform.admin');

    useEffect(() => {
        fetchPermissionsMatrix().then((res) => {
            setRolePermissions(res.role_permissions as Record<AuthorRole, Permission[]>);
            setAllPermissions(res.all_permissions as Permission[]);
        });
    }, []);

    const canManage = can('manage_permissions');

    const togglePerm = (role: AuthorRole, perm: Permission) => {
        if (!canManage || role === 'platform.admin') return;
        setRolePermissions(prev => {
            const cur = prev[role] ?? [];
            const next = cur.includes(perm) ? cur.filter(p => p !== perm) : [...cur, perm];
            return { ...prev, [role]: next };
        });
    };

    const saveRole = async (role: AuthorRole) => {
        setSaving(role);
        setError(null);
        try {
            await updateRolePermissions(role, rolePermissions[role]);
            setSaved(role);
            setTimeout(() => setSaved(null), 2500);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(null);
        }
    };

    const selectedPerms = rolePermissions[selectedRole] ?? [];

    return (
        <div>
            <div className="adm-page-header">
                <h1 className="adm-page-title">{L.title}</h1>
                <p className="adm-page-subtitle">{L.subtitle}</p>
            </div>

            {!canManage && (
                <div className="adm-alert adm-alert--warning">
                    <Icon name="approvals"/> Only Platform Admins can modify role permissions.
                </div>
            )}
            {error && (
                <div className="adm-alert adm-alert--error">{error}</div>
            )}

            {/* Role summary cards */}
            <div className="adm-perm-cards">
                {ROLE_ORDER.map(role => {
                    const info  = L.roles[role];
                    const perms = rolePermissions[role] ?? [];
                    const color = ROLE_COLORS[role];
                    return (
                        <div
                            key={role}
                            className={`adm-perm-card${selectedRole === role ? ' adm-perm-card--selected' : ''}`}
                            style={{ borderTopColor: color }}
                            onClick={() => setSelectedRole(role)}
                        >
                            <div className="adm-perm-card__header">
                                <span className="adm-perm-card__dot" style={{ background: color }} />
                                <span className="adm-perm-card__icon">
                                    <img src={ROLE_ICONS[role]} alt="" className="adm-role-icon" />
                                </span>
                                <span className="adm-perm-card__name" style={{ color }}>{info.name}</span>
                                {selectedRole === role && (
                                    <span className="adm-perm-card__selected-badge">Editing</span>
                                )}
                            </div>
                            <p className="adm-perm-card__desc">{info.desc}</p>
                            <div className="adm-perm-card__count">
                                {perms.length} permission{perms.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Interactive editor for selected role */}
            <div className="adm-card" style={{ marginBottom: 32 }}>
                <div className="adm-card__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="adm-perm-card__icon">
                            <img src={ROLE_ICONS[selectedRole]} alt="" className="adm-role-icon adm-role-icon--lg" />
                        </span>
                        <span className="adm-card__title">
                            {L.roles[selectedRole].name} — Permission Editor
                        </span>
                        {saved === selectedRole && (
                            <span className="ae-save-ok">✓ Saved</span>
                        )}
                    </div>
                    {canManage && selectedRole !== 'platform.admin' && (
                        <Button
                            variant="primary"
                            size="sm"
                            loading={saving === selectedRole}
                            loadingText="Saving…"
                            onClick={() => saveRole(selectedRole)}
                        >
                            Save Changes
                        </Button>
                    )}
                </div>

                {selectedRole === 'platform.admin' && (
                    <div className="adm-perm-admin-notice">
                        <span><Icon name="base"/></span>
                        <span>Platform Admin has all permissions and they cannot be modified.</span>
                    </div>
                )}

                <div className="adm-perm-groups">
                    {PERM_GROUPS.map(group => (
                        <div key={group.label} className="adm-perm-group">
                            <div className="adm-perm-group__label">{group.label}</div>
                            <div className="adm-perm-group__items">
                                {group.perms.filter(p => allPermissions.includes(p)).map(perm => {
                                    const granted = selectedPerms.includes(perm);
                                    const isAdmin = selectedRole === 'platform.admin';
                                    return (
                                        <div
                                            key={perm}
                                            className={`adm-perm-toggle${granted ? ' adm-perm-toggle--on' : ''}${!canManage || isAdmin ? ' adm-perm-toggle--readonly' : ''}`}
                                            onClick={() => togglePerm(selectedRole, perm)}
                                            title={!canManage ? 'No permission to edit' : isAdmin ? 'Admin always has this permission' : undefined}
                                        >
                                            <div className={`adm-perm-toggle__switch${granted ? ' adm-perm-toggle__switch--on' : ''}`}>
                                                <div className="adm-perm-toggle__thumb" />
                                            </div>
                                            <div className="adm-perm-toggle__info">
                                                <span className="adm-perm-toggle__name">
                                                    {L.permLabels[perm] ?? perm}
                                                </span>
                                            </div>
                                            <span className={`adm-perm-toggle__status${granted ? ' adm-perm-toggle__status--on' : ''}`}>
                                                {granted ? 'Allowed' : 'Denied'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Matrix table */}
            <div className="adm-card" style={{ overflowX: 'auto' }}>
                <div className="adm-card__header">
                    <span className="adm-card__title">Full Permissions Matrix</span>
                </div>
                <table className="adm-perm-table">
                    <thead>
                        <tr>
                            <th className="adm-perm-table__th adm-perm-table__th--perm">Permission</th>
                            {ROLE_ORDER.map(role => (
                                <th key={role} className="adm-perm-table__th">
                                    <span className="adm-perm-table__role-dot" style={{ background: ROLE_COLORS[role] }} />
                                    {L.roles[role].name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allPermissions.map(perm => (
                            <tr key={perm} className="adm-perm-table__row">
                                <td className="adm-perm-table__td adm-perm-table__td--label">
                                    {L.permLabels[perm as Permission] ?? perm}
                                </td>
                                {ROLE_ORDER.map(role => {
                                    const granted = (rolePermissions[role] ?? []).includes(perm as Permission);
                                    return (
                                        <td key={role} className="adm-perm-table__td">
                                            {granted
                                                ? <span className="adm-perm-tick adm-perm-tick--yes">✓</span>
                                                : <span className="adm-perm-tick adm-perm-tick--no">—</span>
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
