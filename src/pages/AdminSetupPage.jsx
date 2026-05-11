import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import { ROUTES } from '../constants/routes';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminSetupPage = () => {
    const { user, updateUserRole, isAuthenticated } = useAuth();
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBootstrap = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please sign in first.');
            return;
        }

        // Compare against the environment variable
        // Note: In Vite, VITE_ variables are bundled. This is intended for initial setup.
        const masterSecret = import.meta.env.VITE_ADMIN_SETUP_KEY;

        if (!masterSecret) {
            toast.error('Admin Setup Key is not configured in environment variables.');
            return;
        }

        if (secret !== masterSecret) {
            toast.error('Invalid Setup Key.');
            return;
        }

        setLoading(true);
        try {
            await updateUserRole(user.uid, ROLES.ADMIN);
            toast.success('System Bootstrapped: You are now an Admin!');
            setTimeout(() => navigate(ROUTES.ADMIN_DASHBOARD), 1500);
        } catch (err) {
            console.error(err);
            toast.error('Failed to promote user. Check Firestore permissions.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === ROLES.ADMIN) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={32} color="var(--success)" />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Already Admin</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You already have administrative privileges.</p>
                <button className="btn-primary" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="flex-center" style={{ minHeight: '70vh', padding: '1rem' }}>
            <div className="glass card-base" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <ShieldAlert size={28} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Admin Bootstrap</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Enter the master setup key to grant yourself <br/> initial administrative access.
                    </p>
                </div>

                <form onSubmit={handleBootstrap}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                            Setup Key
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input
                                type="password"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                placeholder="••••••••••••••••"
                                style={{ width: '100%', paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.75rem', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: '700' }}>Tip:</span> This key is defined as <code>VITE_ADMIN_SETUP_KEY</code> in your <code>.env</code> file.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !secret}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={18} /> Promote to Admin</>}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate(ROUTES.HOME)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', margin: '0 auto' }}
                    >
                        Cancel and return home <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSetupPage;
