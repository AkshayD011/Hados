import React from 'react';
import { Users2, Clock } from 'lucide-react';

const AdminClubsPage = () => (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users2 size={18} color="white" />
            </div>
            <div>
                <h1 className="page-title" style={{ margin: 0 }}>Clubs Management</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Approve and manage campus clubs & NGOs</p>
            </div>
        </div>
        <div className="glass card-base" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={28} color="#8b5cf6" />
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Coming Soon</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                The Clubs admin panel is under development.<br />It will allow approving, editing, and archiving club listings.
            </p>
        </div>
    </main>
);

export default AdminClubsPage;
