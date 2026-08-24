import { useState, useRef, useEffect }  from 'react';
import { Link, useLocation }            from 'react-router-dom';
import { motion, AnimatePresence }       from 'framer-motion';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import type { Navigation as EngineNavigation, NavEntry } from '../../types/engine';
import type { NavColumn, NavigationGroup }               from '../../types/engine/navigation';
import { useScrolled }                                   from '../../hooks/useScrolled';
import Logo                                              from './Logo';

interface Props { navigation: EngineNavigation; }

export default function NavigationBar({ navigation }: Props) {
    const [open, setOpen]          = useState(false);
    const [activeGroup, setActive] = useState<string | null>(null);
    const scrolled                 = useScrolled(20);
    const location                 = useLocation();
    const groups: NavigationGroup[]= navigation?.primary ?? [];
    const navRef                   = useRef<HTMLElement>(null);
    const closeTimer               = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('acc-theme');
            if (saved === 'light' || saved === 'dark') return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('acc-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    /* ── Hover open / close logic ──────────────────────────────── */
    const openGroup = (id: string) => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
        setActive(id);
    };

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setActive(null), 80);
    };

    const cancelClose = () => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    };

    /* ── Close on outside click (touch / keyboard users) ───────── */
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActive(null);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    useEffect(() => { setActive(null); setOpen(false); }, [location.pathname]);

    const activeGroupData = activeGroup
        ? groups.find(g => g.group_id === activeGroup) ?? null
        : null;

    /* ── Column count for the mega grid (max 4 per row) ─────────── */
    const colCount = activeGroupData
        ? Math.min(activeGroupData.columns.length, 4)
        : 4;

    return (
        <nav
            ref={navRef}
            className={`nav${scrolled ? ' nav--scrolled' : ''}`}
            onMouseLeave={scheduleClose}
        >
            <div className="nav__inner">
                <Link to="/" className="nav__logo">
                    <Logo />
                </Link>

                {/* Desktop primary nav */}
                <div className="nav__links">
                    {groups.map(group => (
                        <DesktopNavGroup
                            key={group.group_id}
                            group={group}
                            isActive={activeGroup === group.group_id}
                            currentPath={location.pathname}
                            onOpen={() => openGroup(group.group_id)}
                        />
                    ))}

                    <button
                        onClick={toggleTheme}
                        className="nav__theme-btn"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/contact" className="nav__cta">Get Started</Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="nav__mobile-btn"
                    onClick={() => setOpen(o => !o)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Full-width dropdown panel — hover-triggered */}
            <AnimatePresence>
                {activeGroupData && activeGroupData.columns.length > 0 && (
                    <motion.div
                        key={activeGroupData.group_id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="nav__dropdown nav__dropdown--mega"
                        onMouseEnter={cancelClose}
                    >
                        <div
                            className="nav__dropdown-inner"
                            style={{ '--nav-col-count': colCount } as React.CSSProperties}
                        >
                            {activeGroupData.columns.map((col: NavColumn) => (
                                <DropdownColumn
                                    key={col.column_id}
                                    col={col}
                                    currentPath={location.pathname}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="nav__mobile-panel"
                    >
                        <div className="nav__mobile-panel-inner">
                            {groups.map(group => (
                                <MobileNavGroup
                                    key={group.group_id}
                                    group={group}
                                    currentPath={location.pathname}
                                    onClose={() => setOpen(false)}
                                />
                            ))}

                            <Link to="/contact" className="nav__mobile-cta" onClick={() => setOpen(false)}>
                                Get Started
                            </Link>

                            <div className="nav__mobile-actions">
                                <span className="nav__mobile-actions-label">Switch Theme</span>
                                <button
                                    onClick={toggleTheme}
                                    className="nav__theme-btn"
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

// ─── Desktop: group trigger (hover-based) ─────────────────────────────────────

interface DesktopNavGroupProps {
    group:       NavigationGroup;
    isActive:    boolean;
    currentPath: string;
    onOpen:      () => void;
}

function DesktopNavGroup({ group, isActive, currentPath, onOpen }: DesktopNavGroupProps) {
    if (group.type === 'direct_link') {
        const entry = group.columns[0]?.entries[0];
        if (!entry) return null;
        const href   = resolveHref(entry);
        const active = currentPath === href;
        return (
            <Link
                to={href}
                className={`nav__link${active ? ' nav__link--active' : ''}`}
            >
                {group.label}
            </Link>
        );
    }

    return (
        <button
            className={`nav__link nav__link--trigger${isActive ? ' nav__link--active' : ''}`}
            onMouseEnter={onOpen}
            aria-expanded={isActive}
        >
            {group.label}
            <motion.span
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="nav__chevron"
            >
                <ChevronDown size={14} />
            </motion.span>
        </button>
    );
}

// ─── Desktop: dropdown column ─────────────────────────────────────────────────

interface DropdownColumnProps { col: NavColumn; currentPath: string; }

function DropdownColumn({ col, currentPath }: DropdownColumnProps) {
    return (
        <div className="nav__dropdown-col">
            {col.label && (
                <p className="nav__dropdown-col-label">{col.label}</p>
            )}
            {col.entries.map((entry: NavEntry, i) => {
                const href   = resolveHref(entry);
                const active = currentPath === href;
                return (
                    <Link
                        key={i}
                        to={href}
                        className={`nav__dropdown-entry${active ? ' nav__dropdown-entry--active' : ''}`}
                    >
                        <span className="nav__dropdown-entry-label">
                            {entry.label}
                            {entry.is_badge_highlighted && entry.badge_text && (
                                <span className="nav__badge">{entry.badge_text}</span>
                            )}
                        </span>
                    </Link>
                );
            })}
            {col.featured_block && (
                <div className="nav__dropdown-featured">
                    <p className="nav__dropdown-featured-headline">{col.featured_block.headline}</p>
                    {col.featured_block.description && (
                        <p className="nav__dropdown-featured-desc">{col.featured_block.description}</p>
                    )}
                    <Link
                        to={resolveActionHref(col.featured_block.cta)}
                        className="nav__dropdown-featured-cta"
                    >
                        {col.featured_block.cta.label} →
                    </Link>
                </div>
            )}
        </div>
    );
}

// ─── Mobile: group with accordion ────────────────────────────────────────────

interface MobileNavGroupProps {
    group:       NavigationGroup;
    currentPath: string;
    onClose:     () => void;
}

function MobileNavGroup({ group, currentPath, onClose }: MobileNavGroupProps) {
    const [expanded, setExpanded] = useState(false);

    if (group.type === 'direct_link') {
        const entry = group.columns[0]?.entries[0];
        if (!entry) return null;
        const href   = resolveHref(entry);
        const active = currentPath === href;
        return (
            <Link
                to={href}
                onClick={onClose}
                className={`nav__mobile-link${active ? ' nav__mobile-link--active' : ''}`}
            >
                {group.label}
            </Link>
        );
    }

    const hasMultipleColumns = group.columns.length > 1;

    return (
        <div className="nav__mobile-group">
            <button
                className={`nav__mobile-link nav__mobile-link--trigger${expanded ? ' nav__mobile-link--expanded' : ''}`}
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded}
            >
                <span>{group.label}</span>
                <motion.span
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} />
                </motion.span>
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="nav__mobile-sublinks">
                            {hasMultipleColumns
                                ? group.columns.map((col: NavColumn, ci) => (
                                    <div key={col.column_id ?? ci} className="nav__mobile-col">
                                        {col.label && (
                                            <p className="nav__mobile-col-label">{col.label}</p>
                                        )}
                                        {col.entries.map((entry: NavEntry, i) => {
                                            const href   = resolveHref(entry);
                                            const active = currentPath === href;
                                            return (
                                                <Link
                                                    key={i}
                                                    to={href}
                                                    onClick={onClose}
                                                    className={`nav__mobile-sublink${active ? ' nav__mobile-sublink--active' : ''}`}
                                                >
                                                    <span>{entry.label}</span>
                                                    {entry.is_badge_highlighted && entry.badge_text && (
                                                        <span className="nav__badge">{entry.badge_text}</span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ))
                                : group.columns[0]?.entries.map((entry: NavEntry, i) => {
                                    const href   = resolveHref(entry);
                                    const active = currentPath === href;
                                    return (
                                        <Link
                                            key={i}
                                            to={href}
                                            onClick={onClose}
                                            className={`nav__mobile-sublink${active ? ' nav__mobile-sublink--active' : ''}`}
                                        >
                                            <span>{entry.label}</span>
                                            {entry.is_badge_highlighted && entry.badge_text && (
                                                <span className="nav__badge">{entry.badge_text}</span>
                                            )}
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveHref(entry: NavEntry): string {
    if (entry.destination_type === 'external_url') return entry.destination_value;
    const slug = entry.destination_value;
    return slug === 'home' ? '/' : `/${slug}`;
}

function resolveActionHref(action: { destination: { type: string; value: string } }): string {
    if (action.destination.type === 'external_url') return action.destination.value;
    const slug = action.destination.value;
    return slug === 'home' ? '/' : `/${slug}`;
}
