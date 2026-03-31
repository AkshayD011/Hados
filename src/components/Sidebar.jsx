import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Hash, Calendar, Map, Users, HelpCircle,
    Briefcase, Bookmark, LogOut, ChevronRight, ExternalLink, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Academic Calendar', icon: Calendar, path: '/calendar' },
        { name: 'Campus Map', icon: Map, path: '/map' },
        { name: 'Clubs & NGOs', icon: Users, path: '/clubs' },
        { name: 'Lost and Found', icon: HelpCircle, path: '/lost-found' },
        { name: 'Placementor', icon: Briefcase, path: '/placementor' },
        { name: 'Saved Posts', icon: Bookmark, path: '/saved' },
    ];

    const externalLinks = [
        { name: 'AUMS', url: 'https://aumsblr.amrita.edu/cas/login?service=https%3A%2F%2Faumsblr.amrita.edu%2Faums%2FJsp%2FCore_Common%2Findex.jsp' },
        { name: 'My Amrita', url: 'https://my.amrita.edu/index/login'}
    ];

    return (
        <>
            {/* Backdrop overlay */}
            {isOpen && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 998,
                        transition: 'opacity 0.3s ease'
                    }}
                    onClick={onClose}
                />
            )}
            
            <aside
                className="glass"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isOpen ? 0 : '-320px',
                    zIndex: 999,
                    width: '300px',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid var(--border)',
                    background: 'var(--surface)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.15)' : 'none'
                }}
            >
                {/* Drawer Header */}
                <div style={{ padding: '1.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Navigation</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1.75rem',
                                color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-secondary)',
                                backgroundColor: location.pathname === item.path ? 'rgba(26, 35, 126, 0.05)' : 'transparent',
                                fontWeight: location.pathname === item.path ? '600' : '500',
                                transition: 'all 0.2s',
                                textDecoration: 'none',
                                borderRight: location.pathname === item.path ? '3px solid var(--primary)' : '3px solid transparent'
                            }}
                        >
                            <item.icon size={20} />
                            <span style={{ flex: 1 }}>{item.name}</span>
                            {location.pathname === item.path && <ChevronRight size={16} />}
                        </Link>
                    ))}

                    <div style={{ padding: '1.5rem 1.75rem 0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>External Links</span>
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
                                gap: '1rem',
                                padding: '0.75rem 1.75rem',
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <ExternalLink size={20} />
                            <span style={{ flex: 1 }}>{link.name}</span>
                        </a>
                    ))}
                </nav>

                {/* User Summary */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                    <Link to="/profile" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            overflow: 'hidden'
                        }}>
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.name ? (user.name.charAt(0).toUpperCase() + user.name.charAt(1).toLowerCase()) : 'U'
                            )}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', margin: 0 }}>{user?.name || 'Guest'}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{user?.rollNo || 'Sign in'}</p>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '0.5rem',
                            color: 'var(--error)',
                            fontWeight: '600',
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
