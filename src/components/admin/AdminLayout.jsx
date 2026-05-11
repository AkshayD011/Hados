/**
 * AdminLayout — the master layout wrapper for all /admin/* pages.
 *
 * Structure:
 *   ┌──────────────────────────────────────────┐
 *   │  AdminSidebar (fixed 240px)              │
 *   │  ┌────────────────────────────────────┐  │
 *   │  │  AdminNavbar (sticky top)          │  │
 *   │  ├────────────────────────────────────┤  │
 *   │  │  <children> (scrollable content)   │  │
 *   │  └────────────────────────────────────┘  │
 *   └──────────────────────────────────────────┘
 *
 * Mobile (≤ 768px): Sidebar becomes an off-canvas drawer.
 * The main content occupies the full width on mobile.
 *
 * Usage:
 *   import AdminLayout from '../components/admin/AdminLayout';
 *   <AdminLayout><YourAdminPage /></AdminLayout>
 */
import React, { useState, useEffect } from 'react';
import AdminSidebar, { SIDEBAR_WIDTH } from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 768);

    // Sync desktop/mobile flag on resize; close mobile drawer when switching to desktop
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 769px)');
        const handler = (e) => {
            setIsDesktop(e.matches);
            if (e.matches) setSidebarOpen(false);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            {/* ── Sidebar ────────────────────────────────────────────── */}
            {/*
              Desktop: always rendered, transform: none
              Mobile:  rendered, slides in/out via CSS class + transform
            */}
            <div
                style={{
                    transform: (!isDesktop && !sidebarOpen) ? `translateX(-${SIDEBAR_WIDTH}px)` : 'translateX(0)',
                    transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <AdminSidebar
                    isOpen={sidebarOpen || isDesktop}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {/* Mobile backdrop */}
            {!isDesktop && sidebarOpen && (
                <div
                    aria-hidden="true"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.48)',
                        zIndex: 197,
                        backdropFilter: 'blur(2px)',
                    }}
                />
            )}

            {/* ── Main content area ──────────────────────────────────── */}
            <div
                style={{
                    marginLeft: isDesktop ? `${SIDEBAR_WIDTH}px` : 0,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Sticky top navbar */}
                <AdminNavbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

                {/* Page content */}
                <main
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        // Subtle dot-grid background — matches the app's interactive-bg-wrapper
                        backgroundImage:
                            'radial-gradient(circle at 0% 15%, var(--glow-1) 0%, transparent 55%),' +
                            'radial-gradient(circle at 100% 85%, var(--glow-2) 0%, transparent 55%)',
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
