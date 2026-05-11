import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Hash, Calendar, Map, Users, HelpCircle,
    Briefcase, Bookmark, LogOut, ChevronRight, ExternalLink, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Home',              icon: Home,       path: '/' },
        { name: 'Academic Calendar', icon: Calendar,   path: '/calendar' },
        { name: 'Campus Map',        icon: Map,        path: '/map' },
        { name: 'Clubs & NGOs',      icon: Users,      path: '/clubs' },
        { name: 'Lost and Found',    icon: HelpCircle, path: '/lost-found' },
        { name: 'Placementor',       icon: Briefcase,  path: '/placementor' },
        { name: 'Saved Posts',       icon: Bookmark,   path: '/saved' },
    ];

    const externalLinks = [
        { name: 'AUMS',       url: 'https://aumsblr.amrita.edu/cas/login?service=https%3A%2F%2Faumsblr.amrita.edu%2Faums%2FJsp%2FCore_Common%2Findex.jsp' },
        { name: 'My Amrita', url: 'https://my.amrita.edu/index/login' },
    ];

    const initials = user?.name
        ? (user.name.charAt(0).toUpperCase() + (user.name.charAt(1) || '').toLowerCase())
        : 'U';

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        zIndex: 998,
                        transition: 'opacity 0.25s ease',
                        backdropFilter: 'blur(2px)',
                    }}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className="glass"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isOpen ? 0 : '-320px',
                    zIndex: 999,
                    width: '296px',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid var(--border)',
                    background: 'var(--surface)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '6px 0 32px rgba(0,0,0,0.12)' : 'none',
                }}
            >
                {/* ── Drawer header ──────────────────────────────────── */}
                <div style={{
                    padding: '1.125rem 1.375rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                    minHeight: '60px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{
                            width: '28px', height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ color: 'white', fontWeight: '900', fontSize: '0.875rem' }}>H</span>
                        </div>
                        <h2 style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.02em',
                            margin: 0
                        }}>
                            Navigation
                        </h2>
                    </div>
                    <button
                        className="icon-btn"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Navigation items ───────────────────────────────── */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '0.625rem 0' }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={onClose}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.875rem',
                                    padding: '0.75rem 1.375rem',
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    backgroundColor: isActive ? 'var(--primary-alpha-10)' : 'transparent',
                                    fontWeight: isActive ? '700' : '500',
                                    fontSize: 'var(--text-base)',
                                    transition: 'background 0.18s, color 0.18s',
                                    textDecoration: 'none',
                                    borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                                    marginRight: '0.5rem',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                <item.icon size={19} style={{ flexShrink: 0 }} />
                                <span style={{ flex: 1, letterSpacing: '-0.005em' }}>{item.name}</span>
                                {isActive && <ChevronRight size={15} style={{ opacity: 0.6 }} />}
                            </Link>
                        );
                    })}

                    {/* External links section */}
                    <div style={{
                        padding: '1rem 1.375rem 0.5rem',
                        marginTop: '0.5rem',
                        borderTop: '1px solid var(--border)'
                    }}>
                        <span className="label-caps">External Links</span>
                    </div>

                    {externalLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.875rem',
                                padding: '0.75rem 1.375rem',
                                color: 'var(--text-secondary)',
                                transition: 'background 0.18s, color 0.18s',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: 'var(--text-base)',
                                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                                marginRight: '0.5rem',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.backgroundColor = 'var(--primary-alpha-10)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-secondary)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <ExternalLink size={18} style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{link.name}</span>
                        </a>
                    ))}
                </nav>

                {/* ── User footer ────────────────────────────────────── */}
                <div style={{
                    padding: '1.125rem 1.375rem',
                    borderTop: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-hover)'
                }}>
                    <Link
                        to="/profile"
                        onClick={onClose}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.875rem',
                            textDecoration: 'none',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {/* Avatar */}
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: 'var(--text-sm)',
                            flexShrink: 0,
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(155,34,66,0.25)'
                        }}>
                            {user?.avatar
                                ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : initials
                            }
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{
                                fontWeight: '700',
                                fontSize: 'var(--text-base)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'var(--text-primary)',
                                margin: 0,
                                letterSpacing: '-0.01em'
                            }}>
                                {user?.name || 'Guest'}
                            </p>
                            <p style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)',
                                margin: '0.1rem 0 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {user?.rollNo || 'Sign in to continue'}
                            </p>
                        </div>
                        <ChevronRight size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            color: 'var(--error)',
                            fontWeight: '600',
                            fontSize: 'var(--text-sm)',
                            padding: '0.5rem 0.5rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <LogOut size={17} style={{ flexShrink: 0 }} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
