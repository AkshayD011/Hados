/**
 * AdminSidebar — left navigation panel for the admin area.
 *
 * Desktop: fixed 240px sidebar, always visible.
 * Mobile:  off-canvas drawer with backdrop, toggled via isOpen prop.
 *
 * Props:
 *   isOpen  {boolean}  — controls mobile drawer visibility
 *   onClose {function} — called when backdrop or close button is clicked
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    Users2,
    PackageSearch,
    Flag,
    X,
    ShieldCheck,
    ChevronRight,
    Home,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { getRoleLabel } from '../../utils/roles';

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_GROUPS = [
    {
        label: 'Overview',
        items: [
            { name: 'Dashboard',   icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
        ],
    },
    {
        label: 'Content',
        items: [
            { name: 'Users',       icon: Users,           path: ROUTES.ADMIN_USERS },
            { name: 'Posts',       icon: FileText,        path: ROUTES.ADMIN_POSTS },
            { name: 'Clubs',       icon: Users2,          path: ROUTES.ADMIN_CLUBS },
            { name: 'Lost & Found',icon: PackageSearch,   path: ROUTES.ADMIN_LOST_FOUND },
        ],
    },
    {
        label: 'Moderation',
        items: [
            { name: 'Reports',     icon: Flag,            path: ROUTES.ADMIN_REPORTS },
        ],
    },
];

const SIDEBAR_WIDTH = 240;

// ─── NavItem ─────────────────────────────────────────────────────────────────

const NavItem = ({ item, isActive, onClick }) => {
    const Ico = item.icon;
    return (
        <Link
            to={item.path}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1rem',
                margin: '0 0.5rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-alpha-10)' : 'transparent',
                fontWeight: isActive ? '700' : '500',
                fontSize: 'var(--text-sm)',
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s',
                letterSpacing: '-0.005em',
            }}
            onMouseEnter={e => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }
            }}
            onMouseLeave={e => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }
            }}
        >
            {/* Icon container */}
            <div style={{
                width: '30px', height: '30px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--primary-alpha-15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.18s',
            }}>
                <Ico size={16} />
            </div>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
            </span>
            {isActive && <ChevronRight size={13} style={{ opacity: 0.5, flexShrink: 0 }} />}
        </Link>
    );
};

// ─── Sidebar content (shared between desktop and mobile) ─────────────────────

const SidebarContent = ({ onNavClick }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* ── Brand ──────────────────────────────────────────────── */}
            <div style={{
                padding: '1.125rem 1.375rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                minHeight: '60px',
            }}>
                <div style={{
                    width: '30px', height: '30px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <ShieldCheck size={16} color="white" />
                </div>
                <div>
                    <p style={{ fontWeight: '800', fontSize: 'var(--text-base)', color: 'var(--primary)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
                        Hados Admin
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0, letterSpacing: '0.02em' }}>
                        Control Panel
                    </p>
                </div>
            </div>

            {/* ── Navigation ─────────────────────────────────────────── */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
                {NAV_GROUPS.map(group => (
                    <div key={group.label} style={{ marginBottom: '0.25rem' }}>
                        <p className="label-caps" style={{ padding: '0.5rem 1.5rem 0.375rem', margin: 0 }}>
                            {group.label}
                        </p>
                        {group.items.map(item => (
                            <NavItem
                                key={item.path}
                                item={item}
                                isActive={location.pathname === item.path}
                                onClick={onNavClick}
                            />
                        ))}
                    </div>
                ))}

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.75rem 1rem' }} />

                {/* Back to app */}
                <Link
                    to={ROUTES.HOME}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.625rem 1rem', margin: '0 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-sm)', fontWeight: '500',
                        textDecoration: 'none', transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    <div style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Home size={16} />
                    </div>
                    Back to App
                </Link>
            </nav>

            {/* ── User footer ────────────────────────────────────────── */}
            <div style={{
                padding: '0.875rem 1rem',
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--surface-hover)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: 'var(--text-xs)', flexShrink: 0, overflow: 'hidden',
                    }}>
                        {user?.avatar
                            ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (user?.name ? user.name.charAt(0).toUpperCase() : 'A')
                        }
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ fontWeight: '700', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'Admin'}
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>
                            {getRoleLabel(user?.role)}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.4rem 0.5rem', borderRadius: 'var(--radius-sm)',
                        color: 'var(--error)', fontWeight: '600', fontSize: 'var(--text-xs)',
                        background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <LogOut size={14} /> Sign Out
                </button>
            </div>
        </div>
    );
};

// ─── Main export ─────────────────────────────────────────────────────────────

const AdminSidebar = ({ isOpen, onClose }) => (
    <>
        {/* ── Mobile backdrop ──────────────────────────────────────── */}
        {isOpen && (
            <div
                aria-hidden="true"
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.48)',
                    zIndex: 198,
                    backdropFilter: 'blur(2px)',
                    transition: 'opacity 0.25s',
                    display: 'none',
                }}
                className="admin-mobile-backdrop"
            />
        )}

        {/* ── Sidebar panel ─────────────────────────────────────────── */}
        <aside
            className="admin-sidebar"
            style={{
                width: `${SIDEBAR_WIDTH}px`,
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 199,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                // Default: visible on desktop, hidden on mobile (via CSS class)
            }}
        >
            {/* Mobile close button — only visible on small screens */}
            <button
                onClick={onClose}
                className="admin-sidebar-close icon-btn"
                aria-label="Close menu"
                style={{
                    position: 'absolute', top: '0.875rem', right: '0.875rem',
                    zIndex: 1, display: 'none', // shown via CSS on mobile
                }}
            >
                <X size={18} />
            </button>

            <SidebarContent onNavClick={onClose} />
        </aside>
    </>
);

export { SIDEBAR_WIDTH };
export default AdminSidebar;
