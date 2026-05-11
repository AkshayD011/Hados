import React, { useState, useEffect } from 'react';
import { Bell, X, Sun, Moon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../common/EmptyState';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifs = async () => {
            const data = await api.notifications.getAll();
            setNotifications(data);
        };
        fetchNotifs();
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header
            className="glass"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '0.625rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                overflow: 'visible',
                minHeight: '60px'
            }}
        >
            {/* ── Brand ───────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                <button
                    onClick={onMenuClick}
                    className="icon-btn"
                    aria-label="Open navigation menu"
                    style={{ color: 'var(--primary)', flexShrink: 0 }}
                >
                    <Menu size={22} />
                </button>
                <h1
                    className="header-title"
                    style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        letterSpacing: '-0.03em',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1
                    }}
                >
                    Hados
                </h1>
            </div>

            {/* ── Actions ─────────────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                position: 'relative',
                flexShrink: 0
            }}>
                {/* Theme toggle */}
                <button
                    className="icon-btn"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark'
                        ? <Sun size={19} />
                        : <Moon size={19} />}
                </button>

                {/* Notifications */}
                <button
                    className="icon-btn"
                    onClick={() => setShowNotifs(!showNotifs)}
                    aria-label="Notifications"
                    style={{ position: 'relative' }}
                >
                    <Bell size={19} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            backgroundColor: 'var(--error)',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            border: '1.5px solid var(--surface)',
                            display: 'block'
                        }} />
                    )}
                </button>

                {/* Notification dropdown */}
                {showNotifs && (
                    <div
                        className="glass card-base animate-fade-in notif-dropdown"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            width: '308px',
                            padding: '0',
                            zIndex: 101,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Dropdown header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.875rem 1rem',
                            borderBottom: '1px solid var(--border)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h3 style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: '700',
                                    margin: 0,
                                    letterSpacing: '-0.01em'
                                }}>
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <span style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: '700',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        padding: '0.1rem 0.45rem',
                                        borderRadius: 'var(--radius-full)'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                className="icon-btn"
                                onClick={() => setShowNotifs(false)}
                                aria-label="Close notifications"
                                style={{ width: '28px', height: '28px' }}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Notification list */}
                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <EmptyState
                                    icon={Bell}
                                    title="All caught up!"
                                    message="No new notifications right now."
                                    compact
                                />
                            ) : (
                                notifications.map((n, i) => (
                                    <div
                                        key={n.id}
                                        style={{
                                            padding: '0.875rem 1rem',
                                            borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                                            opacity: n.unread ? 1 : 0.6,
                                            backgroundColor: n.unread ? 'var(--primary-alpha-10)' : 'transparent',
                                            transition: 'background 0.15s',
                                        }}
                                    >
                                        <p style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-primary)',
                                            fontWeight: n.unread ? '600' : '400',
                                            margin: '0 0 0.2rem',
                                            lineHeight: '1.4'
                                        }}>
                                            {n.text}
                                        </p>
                                        <span style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--text-tertiary)',
                                            letterSpacing: '0.01em'
                                        }}>
                                            {n.time}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Avatar / profile link */}
                <Link
                    to="/profile"
                    aria-label="Go to profile"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-xs)',
                        fontWeight: '800',
                        letterSpacing: '0.025em',
                        marginLeft: '0.375rem',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(155,34,66,0.28)',
                        transition: 'box-shadow 0.18s, transform 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(155,34,66,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(155,34,66,0.28)'; }}
                >
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        user?.name
                            ? (user.name.charAt(0).toUpperCase() + (user.name.charAt(1) || '').toUpperCase())
                            : 'U'
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;
