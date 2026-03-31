import React, { useState, useEffect } from 'react';
import { Bell, X, Sun, Moon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
        <header className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                    onClick={onMenuClick}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary)' }}
                >
                    <Menu size={24} />
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.025em', margin: 0 }}>Hados</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                <button 
                    style={{ background: 'none', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    onClick={toggleTheme}
                    className="hover-bg"
                >
                    {theme === 'dark' ? <Sun size={20} color="var(--text-secondary)" /> : <Moon size={20} color="var(--text-secondary)" />}
                </button>

                <button 
                    style={{ background: 'none', padding: '0.5rem', position: 'relative', border: 'none', cursor: 'pointer' }}
                    onClick={() => setShowNotifs(!showNotifs)}
                >
                    <Bell size={20} color="var(--text-secondary)" />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute', top: '4px', right: '4px',
                            backgroundColor: 'var(--error)', width: '8px', height: '8px', borderRadius: '50%'
                        }}></span>
                    )}
                </button>

                {showNotifs && (
                    <div className="glass card-base animate-fade-in" style={{
                        position: 'absolute', top: '100%', right: '0', width: '300px',
                        padding: '1rem', marginTop: '0.5rem', zIndex: 101, display: 'flex', flexDirection: 'column', gap: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Notifications</h3>
                            <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        {notifications.length === 0 ? (
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No new notifications.</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: n.unread ? 1 : 0.6 }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: n.unread ? '600' : '400', margin: 0 }}>{n.text}</p>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <Link to="/profile" style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    marginLeft: '0.5rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    overflow: 'hidden'
                }}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        user?.name ? (user.name.charAt(0).toUpperCase() + user.name.charAt(1).toUpperCase()) : 'U'
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;
