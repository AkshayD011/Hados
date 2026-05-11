import React, { useState, useEffect } from 'react';
import { Users, ChevronRight, Activity, RefreshCw, Plus, X, Send, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { clubsApi, CLUB_TYPES } from '../services/api/clubs.api';
import { ClubSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

// ─── Submit Club Modal ────────────────────────────────────────────────────────
const SubmitClubModal = ({ isOpen, onClose, user }) => {
    const [form, setForm]       = useState({ name: '', description: '', type: 'Technical', contactEmail: '' });
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone]       = useState(false);

    const reset = () => { setForm({ name: '', description: '', type: 'Technical', contactEmail: '' }); setSubmitting(false); setDone(false); };
    const handleClose = () => { reset(); onClose(); };
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.description.trim()) { toast.error('Name and description are required.'); return; }
        setSubmitting(true);
        try {
            await clubsApi.submitClub({ ...form, submittedBy: user.uid, submitterEmail: user.email });
            setDone(true);
        } catch { toast.error('Failed to submit. Please try again.'); }
        finally { setSubmitting(false); }
    };

    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="glass card-base" style={{ width: '100%', maxWidth: '480px', overflow: 'hidden', animation: 'slideInRight 0.22s ease' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.375rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={16} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--text-primary)' }}>Submit a Club</h2>
                    </div>
                    <button className="icon-btn" onClick={handleClose} aria-label="Close"><X size={18} /></button>
                </div>

                {done ? (
                    <div style={{ padding: '2.5rem 1.375rem', textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Clock size={28} color="#f59e0b" />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Submitted for Review</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                            Your club submission is pending admin approval. You'll see it listed once approved.
                        </p>
                        <button className="btn-primary" onClick={handleClose} style={{ width: '100%' }}>Done</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ padding: '1.25rem 1.375rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Club name <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Coding Club" maxLength={80} style={{ width: '100%' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Description <span style={{ color: 'var(--error)' }}>*</span></label>
                                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="What is this club about?" rows={3} maxLength={500} style={{ width: '100%', resize: 'vertical' }} required />
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.2rem 0 0', textAlign: 'right' }}>{form.description.length}/500</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Type</label>
                                    <select value={form.type} onChange={e => set('type', e.target.value)} style={{ width: '100%' }}>
                                        {CLUB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Contact email</label>
                                    <input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="club@example.com" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div style={{ padding: '0.625rem 0.75rem', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                ⏳ Submissions are reviewed by admins before becoming publicly visible.
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', padding: '0.875rem 1.375rem', borderTop: '1px solid var(--border)' }}>
                            <button type="button" className="btn-secondary" onClick={handleClose} disabled={submitting}>Cancel</button>
                            <button type="submit" disabled={submitting || !form.name.trim() || !form.description.trim()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {submitting ? 'Submitting…' : <><Send size={14} /> Submit Club</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const ClubsPage = () => {
    const { user } = useAuth();
    const [clubs,       setClubs]       = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [showSubmit,  setShowSubmit]  = useState(false);

    const fetchClubs = async () => {
        setLoading(true);
        try { setClubs(await api.clubs.getClubs()); }
        catch (e) { console.error('Failed to fetch clubs', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchClubs(); }, []);

    const handleJoin = async (e, clubId) => {
        e.stopPropagation();
        try {
            const result = await api.clubs.joinClub(clubId);
            if (result.success) setClubs(prev => prev.map(c => c.id === clubId ? { ...c, memberCount: result.newCount } : c));
        } catch { console.error('Failed to join club'); }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Clubs &amp; NGOs</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Discover and join student bodies on campus.</p>
                </div>
                {user && (
                    <button onClick={() => setShowSubmit(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: 'var(--text-sm)' }}>
                        <Plus size={15} /> Submit Club
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <ClubSkeleton key={i} />)}
                </div>
            ) : clubs.length === 0 ? (
                <div className="glass card-base">
                    <EmptyState
                        icon={Users}
                        title="No clubs yet"
                        message="No approved clubs found. Check back soon or submit your own!"
                        action={{ label: 'Refresh', icon: RefreshCw, onClick: fetchClubs }}
                    />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {clubs.map(club => (
                        <div key={club.id} className="glass card-base animate-fade-in" style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '1rem', backgroundColor: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                                    <Activity size={24} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <CheckCircle size={12} color="var(--success)" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: 'var(--background)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                                        {club.type}
                                    </span>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{club.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {club.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <Users size={16} /> <span>{club.memberCount} Members</span>
                                </div>
                                <button
                                    onClick={e => handleJoin(e, club.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 0.88}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 1}
                                >
                                    Join <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <SubmitClubModal isOpen={showSubmit} onClose={() => setShowSubmit(false)} user={user} />
        </div>
    );
};

export default ClubsPage;
