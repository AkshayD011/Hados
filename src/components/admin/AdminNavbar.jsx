/**
 * AdminNavbar — top navigation bar for the admin area.
 *
 * Features:
 *   - Mobile menu toggle (hamburger)
 *   - Breadcrumb trail (auto-generated from current route)
 *   - Theme toggle (Sun/Moon)
 *   - Admin badge on the user avatar
 *   - Link back to main app
 */
import React from 'react';
import { Menu, Sun, Moon, ChevronRight, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../constants/routes';

// ─── Breadcrumb config — maps path segments to readable names ─────────────────
const SEGMENT_LABELS = {
    admin:       'Admin',
    dashboard:   'Dashboard',
    users:       'Users',
    posts:       'Posts',
    clubs:       'Clubs',
    'lost-found':'Lost & Found',
    reports:     'Reports',
};

const buildBreadcrumbs = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((seg, i) => ({
        label: SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
        path:  '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
    }));
};

// ─── Component ────────────────────────────────────────────────────────────────

const AdminNavbar = ({ onMenuClick }) => {
    const { user }            = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location            = useLocation();

    const crumbs = buildBreadcrumbs(location.pathname);

    return (
        <header
            className="glass admin-navbar"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.25rem',
                borderBottom: '1px solid var(--border)',
                gap: '1rem',
            }}
        >
            {/* ── Left: menu toggle + breadcrumb ─────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                {/* Mobile hamburger — hidden on desktop via CSS */}
                <button
                    className="icon-btn admin-menu-toggle"
                    onClick={onMenuClick}
                    aria-label="Toggle admin menu"
                >
                    <Menu size={20} />
                </button>

                {/* Breadcrumb */}
                <nav aria-label="Admin breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', overflow: 'hidden' }}>
                    {crumbs.map((crumb, i) => (
                        <React.Fragment key={crumb.path}>
                            {i > 0 && (
                                <ChevronRight
                                    size={13}
                                    style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
                                />
                            )}
                            {crumb.isLast ? (
                                <span style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    letterSpacing: '-0.01em',
                                }}>
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    to={crumb.path}
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: '500',
                                        color: 'var(--text-tertiary)',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        transition: 'color 0.18s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* ── Right: actions ─────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {/* Back to main app */}
                <Link
                    to={ROUTES.HOME}
                    title="Back to main app"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.4rem 0.625rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)', fontWeight: '600',
                        color: 'var(--text-secondary)', textDecoration: 'none',
                        transition: 'all 0.18s',
                        border: '1.5px solid var(--border)',
                    }}
                    className="admin-app-link hide-sm"
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                    <ExternalLink size={12} /> App
                </Link>

                {/* Theme toggle */}
                <button
                    className="icon-btn"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Admin avatar */}
                <Link
                    to={ROUTES.PROFILE}
                    aria-label="Go to profile"
                    style={{
                        position: 'relative',
                        width: '34px', height: '34px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: 'var(--text-xs)',
                        letterSpacing: '0.025em',
                        marginLeft: '0.25rem',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(155,34,66,0.25)',
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        textDecoration: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(155,34,66,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(155,34,66,0.25)'; }}
                >
                    {user?.avatar
                        ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (user?.name ? user.name.charAt(0).toUpperCase() : 'A')
                    }
                </Link>
            </div>
        </header>
    );
};

export default AdminNavbar;
