import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Bell } from 'lucide-react';
import Logo from './Logo';
import { SITE_LANG } from '../lang/en';

const L = SITE_LANG.newsroomBar;

const NEWSROOM_LINKS_DEFAULT: { label: string; href: string }[] = [
    { label: L.overview, href: '/newsroom/overview' },
    { label: L.news,     href: '/newsroom/news'     },
    { label: L.stories,  href: '/newsroom/stories'  },
    { label: L.about,    href: '/newsroom/about'    },
] as const;

/**
 * NewsroomBar — redesigned secondary navigation bar for newsroom pages.
 * Features:
 *   • Sticky positioning below primary nav
 *   • Expandable search field (slides open/closed)
 *   • Active link indicator with animated underline
 *   • Subscribe CTA chip
 *   • Mobile: collapses to scrollable pill strip with search icon
 *
 * CSS: components/newsroom-bar.css
 */
export default function NewsroomBar() {
    const { pathname }            = useLocation();
    const [searchOpen, setSearch] = useState(false);
    const [query, setQuery]       = useState('');
    const [links, setLinks] = useState<{ label: string; href: string }[]>(NEWSROOM_LINKS_DEFAULT);
    const searchRef               = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchOpen) searchRef.current?.focus();
    }, [searchOpen]);

    useEffect(() => {
        fetch('/api/newsroom-links')
            .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load newsroom links')))
            .then((rows: { label: string; href: string }[]) => {
                if (rows.length > 0) setLinks(rows);
            })
            .catch(() => {});
    }, []);

    const closeSearch = () => { setSearch(false); setQuery(''); };

    const handleSearchKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') closeSearch();
        if (e.key === 'Enter' && query.trim()) {
            // Navigate to search (stub)
            window.location.href = `/news?q=${encodeURIComponent(query.trim())}`;
        }
    };

    return (
        <div className="newsroom-bar">
            <div className="newsroom-bar__inner">

                {/* Brand */}
                <Link to="/" className="newsroom-bar__brand" aria-label="Newsroom home">
                    <span className="newsroom-bar__brand-logo">
                        <Logo showText={false} />
                    </span>
                    <span className="newsroom-bar__brand-label">{L.brand}</span>
                </Link>

                {/* Navigation pills */}
                <nav className="newsroom-bar__nav" aria-label="Newsroom navigation">
                    {links.map(({ label, href }) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                to={href}
                                className={`newsroom-bar__pill${isActive ? ' newsroom-bar__pill--active' : ''}`}
                            >
                                {label}
                                {isActive && (
                                    <motion.span
                                        className="newsroom-bar__pill-dot"
                                        layoutId="newsroom-active-dot"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side actions */}
                <div className="newsroom-bar__actions">
                    {/* Expandable search */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                className="newsroom-bar__search-wrap"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 220, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                                <Search size={14} className="newsroom-bar__search-icon" />
                                <input
                                    ref={searchRef}
                                    className="newsroom-bar__search-input"
                                    placeholder={L.searchPlaceholder}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={handleSearchKey}
                                    aria-label="Search news"
                                />
                                <button
                                    className="newsroom-bar__search-close"
                                    onClick={closeSearch}
                                    aria-label="Close search"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search toggle */}
                    {!searchOpen && (
                        <button
                            className="newsroom-bar__icon-btn"
                            onClick={() => setSearch(true)}
                            aria-label="Search"
                            title={L.search}
                        >
                            <Search size={16} />
                        </button>
                    )}

                    {/* Subscribe CTA */}
                    <a href="/subscribe" className="newsroom-bar__subscribe-btn">
                        <Bell size={13} />
                        <span>{L.subscribe}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
