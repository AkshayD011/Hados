import React from 'react';
import { Flag, Clock } from 'lucide-react';

const AdminReportsPage = () => (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--error), #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flag size={18} color="white" />
            </div>
            <div>
                <h1 className="page-title" style={{ margin: 0 }}>Reports</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Review and act on user-submitted reports</p>
            </div>
        </div>
        <div className="glass card-base" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={28} color="var(--error)" />
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Coming Soon</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                The Reports panel is under development.<br />It will allow triaging user-flagged content and taking moderation actions.
            </p>
        </div>
    </main>
);

export default AdminReportsPage;
