import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AuthorRole } from '../types/index';
import { ADMIN_LANG } from '../lang/en';
import Button from '../components/Button';

const L = ADMIN_LANG.nav;

interface NavItem {
    to:      string;
    label:   string;
    icon:    string;
    exact?:  boolean;
    section: 'main' | 'content' | 'publish' | 'manage';
    roles?:  AuthorRole[];
}

const NAV_ITEMS: NavItem[] = [
    { to: '/admin',              label: L.dashboard,    icon: '/schools/icons/spreadsheet_dashboard.svg', exact: true, section: 'main'    },
    { to: '/admin/navigation',   label: L.navigation,   icon: '/schools/icons/website.svg',                            section: 'content',
      roles: ['platform.admin'] },
    { to: '/admin/pages',        label: L.pages,        icon: '/schools/icons/website.svg',                            section: 'content'  },
    { to: '/admin/articles',     label: L.articles,     icon: '/schools/icons/website_blog.svg',                       section: 'publish'  },
    { to: '/admin/publish',      label: L.publishQueue, icon: '/schools/icons/mass_mailing.svg',                       section: 'publish',
      roles: ['platform.admin', 'content.publisher'] },
    { to: '/admin/permissions',  label: L.permissions,  icon: '/schools/icons/approvals.svg',                          section: 'manage',
      roles: ['platform.admin'] },
    { to: '/admin/users',        label: L.users,        icon: '/schools/icons/contacts.svg',                           section: 'manage',
      roles: ['platform.admin'] },
    { to: '/admin/keywords',     label: L.keywords,     icon: '/schools/icons/utm.svg',                                section: 'publish',
      roles: ['platform.admin', 'content.publisher'] },
    { to: '/admin/topics',       label: L.topics,       icon: '/schools/icons/library.svg',                            section: 'publish',
      roles: ['platform.admin', 'content.publisher'] },
];

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

const SECTION_LABELS: Record<string, string> = {
    main:    '',
    content: 'Content',
    publish: 'Publishing',
    manage:  'Manage',
};

interface Props { children: React.ReactNode; }

export default function AdminLayout({ children }: Props) {
    const { actor, logout } = useAuth();
    const navigate           = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const visibleItems = NAV_ITEMS.filter(item =>
        !item.roles || item.roles.includes(actor.role) || (actor.roles && actor.roles.some(r => item.roles!.includes(r)))
    );

    const mainItems    = visibleItems.filter(i => i.section === 'main');
    const contentItems = visibleItems.filter(i => i.section === 'content');
    const publishItems = visibleItems.filter(i => i.section === 'publish');
    const manageItems  = visibleItems.filter(i => i.section === 'manage');

    const sidebarClass = [
        'adm-sidebar',
        mobileOpen ? 'adm-sidebar--mobile-open' : '',
    ].filter(Boolean).join(' ');

    const renderNavLink = (item: NavItem) => (
        <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
                `adm-sidebar__link${isActive ? ' adm-sidebar__link--active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
        >
            <span className="adm-sidebar__link-icon">
                <img src={item.icon} alt="" className="adm-nav-icon" />
            </span>
            <span className="adm-sidebar__link-label">{item.label}</span>
        </NavLink>
    );

    const renderSection = (label: string, items: NavItem[]) => {
        if (items.length === 0) return null;
        return (
            <>
                {label && (
                    <div className="adm-sidebar__section-divider">
                        <span>{label}</span>
                    </div>
                )}
                {items.map(renderNavLink)}
            </>
        );
    };

    return (
        <div className="adm-layout">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="adm-sidebar-overlay" onClick={() => setMobileOpen(false)} />
            )}

            <aside className={sidebarClass}>
                {/* Logo */}
                <div className="adm-sidebar__logo">
                    <div className="adm-sidebar__logo-name">{L.brand}</div>
                    <div className="adm-sidebar__logo-sub">{L.brandSub}</div>
                </div>

                {/* Nav */}
                <nav className="adm-sidebar__nav">
                    {renderSection('', mainItems)}
                    {renderSection(SECTION_LABELS.content, contentItems)}
                    {renderSection(SECTION_LABELS.publish, publishItems)}
                    {renderSection(SECTION_LABELS.manage, manageItems)}
                </nav>

                {/* Actor info */}
                <div className="adm-sidebar__section">
                    <div className="adm-sidebar__section-label">Signed in as</div>
                    <div className="adm-actor">
                        <div className="adm-actor__avatar" style={{ background: ROLE_COLORS[actor.role] }}>
                            {actor.name.charAt(0)}
                        </div>
                        <div className="adm-actor__info">
                            <div className="adm-actor__name">{actor.name}</div>
                            <div className="adm-actor__email">{actor.email}</div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        style={{ marginTop: 12, width: '100%' }}
                        onClick={async () => {
                            await logout();
                            navigate('/admin', { replace: true });
                            window.location.reload();
                        }}
                    >
                        Sign out
                    </Button>
                </div>

                {/* Bottom */}
                <div className="adm-sidebar-bottom">
                    <Button className="adm-back-btn" onClick={() => navigate('/')}>
                        {L.backToSite}
                    </Button>
                </div>
            </aside>

            <main className="adm-main">
                <div className="adm-topbar">
                    <Button
                        className="adm-topbar__hamburger"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </Button>
                    <div className="adm-sidebar__logo-name adm-topbar__brand">
                        {L.brand}
                    </div>
                    <div className="adm-topbar__spacer" />
                    <span
                        className="adm-topbar__role-chip"
                        style={{ borderLeft: `3px solid ${ROLE_COLORS[actor.role]}` }}
                    >
                        {actor.role}
                    </span>
                    <div className="adm-topbar__actor">
                        <div
                            className="adm-topbar__avatar"
                            style={{ background: ROLE_COLORS[actor.role] }}
                        >
                            {actor.name[0]}
                        </div>
                    </div>
                </div>
                <div className="adm-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
