import React from 'react';
import { FileText, Clock } from 'lucide-react';

const AdminPostsPage = () => (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="white" />
            </div>
            <div>
                <h1 className="page-title" style={{ margin: 0 }}>Posts Management</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Review and moderate campus posts</p>
            </div>
        </div>
        <div className="glass card-base" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={28} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Coming Soon</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                The Posts moderation panel is under development.<br />It will allow reviewing, pinning, and removing posts.
            </p>
        </div>
    </main>
);

export default AdminPostsPage;
