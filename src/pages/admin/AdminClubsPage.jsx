import React, { useState, useEffect, useCallback } from 'react';
import { Users2, CheckCircle, XCircle, Clock, RefreshCcw, Eye, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clubsApi, CLUB_STATUS } from '../../services/api/clubs.api';
import toast from 'react-hot-toast';
import { activityLogApi, ACTION_TYPE } from '../../services/api/activityLog.api';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
    [CLUB_STATUS.PENDING]:  { label: 'Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: Clock },
    [CLUB_STATUS.APPROVED]: { label: 'Approved', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
    [CLUB_STATUS.REJECTED]: { label: 'Rejected', color: 'var(--error)',   bg: 'rgba(239,68,68,0.1)',  icon: XCircle },
};

const relTime = (iso) => {
    if (!iso) return '—';
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today'; if (d === 1) return 'Yesterday'; return `${d}d ago`;
};

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG[CLUB_STATUS.PENDING];
    return (
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: cfg.color, backgroundColor: cfg.bg, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
            {cfg.label}
        </span>
    );
};

// ─── Detail Drawer ────────────────────────────────────────────────────────────
const ClubDrawer = ({ club, onClose, onApprove, onReject, onDelete, acting }) => {
    const [rejectNote, setRejectNote] = useState('');
    const [showReject, setShowReject] = useState(false);

    if (!club) return null;
    const isPending = club.status === CLUB_STATUS.PENDING;

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', zIndex: 200 }} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px,100vw)', zIndex: 201, backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.18)', animation: 'slideInRight 0.2s ease' }}>
                {/* Header */}
                <div style={{ padding: '1.125rem 1.375rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users2 size={16} color="#8b5cf6" />
                        <h2 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--text-primary)' }}>Club Details</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose} aria-label="Close"><XCircle size={18} /></button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StatusBadge status={club.status} />
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-tertiary)', backgroundColor: 'var(--surface-hover)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)' }}>{club.type}</span>
                    </div>

                    <div className="glass card-base" style={{ padding: '1rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: 'var(--text-lg)', fontWeight: '800', color: 'var(--text-primary)' }}>{club.name}</h3>
                        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{club.description}</p>
                    </div>

                    <div>
                        <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>Submitted by</p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 0.15rem' }}>{club.submitterEmail || '—'}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0 0 0.5rem' }}>Contact: {club.contactEmail || '—'}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>Submitted {relTime(club.createdAt)}</p>
                    </div>

                    {club.status === CLUB_STATUS.REJECTED && club.rejectionNote && (
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.375rem' }}>Rejection Note</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{club.rejectionNote}</p>
                        </div>
                    )}

                    {showReject && (
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Rejection reason <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>(optional)</span></label>
                            <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={3} placeholder="Explain why the club was rejected…" style={{ width: '100%', resize: 'vertical', fontSize: 'var(--text-sm)' }} />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ padding: '1rem 1.375rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {isPending && !showReject && (
                        <>
                            <button onClick={() => onApprove(club.id)} disabled={acting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1.5px solid rgba(16,185,129,0.25)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.6 : 1 }}>
                                <CheckCircle size={14} /> Approve Club
                            </button>
                            <button onClick={() => setShowReject(true)} disabled={acting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1.5px solid rgba(239,68,68,0.2)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                                <XCircle size={14} /> Reject Club
                            </button>
                        </>
                    )}
                    {isPending && showReject && (
                        <>
                            <button onClick={() => { onReject(club.id, rejectNote); setShowReject(false); }} disabled={acting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1.5px solid rgba(239,68,68,0.2)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.6 : 1 }}>
                                <XCircle size={14} /> Confirm Rejection
                            </button>
                            <button onClick={() => setShowReject(false)} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontWeight: '600', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </>
                    )}
                    <button onClick={() => onDelete(club.id)} disabled={acting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--text-tertiary)', border: '1px solid var(--border)', fontWeight: '600', fontSize: 'var(--text-xs)', cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.6 : 1 }}>
                        <Trash2 size={12} /> Delete permanently
                    </button>
                </div>
            </div>
        </>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminClubsPage = () => {
    const { user } = useAuth();
    const [clubs,    setClubs]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [tab,      setTab]      = useState(CLUB_STATUS.PENDING);
    const [selected, setSelected] = useState(null);
    const [acting,   setActing]   = useState(false);

    const fetchClubs = useCallback(async () => {
        setLoading(true); setError(null);
        try { setClubs(await clubsApi.getClubsByStatus()); }
        catch { setError('Could not load clubs. Check Firestore permissions.'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { const run = async () => { await fetchClubs(); }; run(); }, [fetchClubs]);

    const handleApprove = async (clubId) => {
        setActing(true);
        try {
            await clubsApi.approveClub(clubId, user.uid);
            setClubs(prev => prev.map(c => c.id === clubId ? { ...c, status: CLUB_STATUS.APPROVED, reviewedAt: new Date().toISOString() } : c));
            if (selected?.id === clubId) setSelected(p => ({ ...p, status: CLUB_STATUS.APPROVED }));
            toast.success('Club approved and now publicly visible.');
            const club = clubs.find(c => c.id === clubId);
            activityLogApi.log(
                { uid: user.uid, email: user.email },
                ACTION_TYPE.CLUB_APPROVED,
                { id: clubId, type: 'club', label: club?.name ?? clubId },
            );
        } catch { toast.error('Failed to approve club.'); }
        finally { setActing(false); }
    };

    const handleReject = async (clubId, note) => {
        setActing(true);
        try {
            await clubsApi.rejectClub(clubId, user.uid, note);
            setClubs(prev => prev.map(c => c.id === clubId ? { ...c, status: CLUB_STATUS.REJECTED, rejectionNote: note } : c));
            if (selected?.id === clubId) setSelected(p => ({ ...p, status: CLUB_STATUS.REJECTED, rejectionNote: note }));
            toast.success('Club rejected.');
            const club = clubs.find(c => c.id === clubId);
            activityLogApi.log(
                { uid: user.uid, email: user.email },
                ACTION_TYPE.CLUB_REJECTED,
                { id: clubId, type: 'club', label: club?.name ?? clubId },
                { rejectionNote: note || null },
            );
        } catch { toast.error('Failed to reject club.'); }
        finally { setActing(false); }
    };

    const handleDelete = async (clubId) => {
        if (!window.confirm('Permanently delete this club? This cannot be undone.')) return;
        setActing(true);
        try {
            const club = clubs.find(c => c.id === clubId);
            await clubsApi.deleteClub(clubId);
            setClubs(prev => prev.filter(c => c.id !== clubId));
            setSelected(null);
            toast.success('Club deleted.');
            activityLogApi.log(
                { uid: user.uid, email: user.email },
                ACTION_TYPE.CLUB_DELETED,
                { id: clubId, type: 'club', label: club?.name ?? clubId },
            );
        } catch { toast.error('Failed to delete club.'); }
        finally { setActing(false); }
    };

    const handlePurgeRejected = async () => {
        const rejected = clubs.filter(c => c.status === CLUB_STATUS.REJECTED);
        if (rejected.length === 0) {
            toast.error('No rejected clubs to clean up.');
            return;
        }
        if (!window.confirm(`Permanently delete all ${rejected.length} rejected clubs?`)) return;
        
        setActing(true);
        try {
            for (const club of rejected) {
                await clubsApi.deleteClub(club.id);
            }
            setClubs(prev => prev.filter(c => c.status !== CLUB_STATUS.REJECTED));
            toast.success(`Cleaned up ${rejected.length} clubs.`);
        } catch {
            toast.error('Failed to complete cleanup.');
        } finally {
            setActing(false);
        }
    };

    const byTab = clubs.filter(c => c.status === tab);
    const counts = {
        [CLUB_STATUS.PENDING]:  clubs.filter(c => c.status === CLUB_STATUS.PENDING).length,
        [CLUB_STATUS.APPROVED]: clubs.filter(c => c.status === CLUB_STATUS.APPROVED).length,
        [CLUB_STATUS.REJECTED]: clubs.filter(c => c.status === CLUB_STATUS.REJECTED).length,
    };

    const TABS = [
        { key: CLUB_STATUS.PENDING,  label: 'Pending',  color: '#f59e0b' },
        { key: CLUB_STATUS.APPROVED, label: 'Approved', color: 'var(--success)' },
        { key: CLUB_STATUS.REJECTED, label: 'Rejected', color: 'var(--error)' },
    ];

    return (
        <>
            <main style={{ padding: '1.75rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users2 size={17} color="white" />
                            </div>
                            <h1 className="page-title" style={{ margin: 0 }}>Clubs Management</h1>
                            {counts[CLUB_STATUS.PENDING] > 0 && (
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '800', backgroundColor: '#f59e0b', color: 'white', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                                    {counts[CLUB_STATUS.PENDING]} pending
                                </span>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>Approve and manage campus club submissions</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <button onClick={handlePurgeRejected} disabled={loading || acting} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', fontSize: 'var(--text-sm)', color: 'var(--error)' }}>
                            <Trash2 size={14} /> Clean Up
                        </button>
                        <button onClick={fetchClubs} disabled={loading} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', fontSize: 'var(--text-sm)' }}>
                            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.25rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--error)', fontSize: 'var(--text-sm)' }}>
                        <AlertCircle size={16} /> {error}
                        <button onClick={fetchClubs} style={{ marginLeft: 'auto', fontWeight: '600', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Retry</button>
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', padding: '0.25rem', width: 'fit-content' }}>
                    {TABS.map(({ key, label, color }) => (
                        <button key={key} onClick={() => setTab(key)} style={{ padding: '0.5rem 1.125rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: 'var(--text-sm)', transition: 'all 0.18s', backgroundColor: tab === key ? 'var(--surface)' : 'transparent', color: tab === key ? color : 'var(--text-tertiary)', boxShadow: tab === key ? 'var(--card-shadow)' : 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            {label}
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '800', backgroundColor: tab === key ? color : 'var(--border)', color: tab === key ? 'white' : 'var(--text-tertiary)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', minWidth: '18px', textAlign: 'center', transition: 'all 0.18s' }}>
                                {counts[key]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="glass card-base" style={{ overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[1, 2, 3].map(i => <div key={i} className="animate-pulse" style={{ height: '64px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--border)' }} />)}
                        </div>
                    ) : byTab.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Users2 size={26} color="#8b5cf6" />
                            </div>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.375rem' }}>No {tab} clubs</h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                                {tab === CLUB_STATUS.PENDING ? 'No submissions awaiting review.' : `No clubs with "${tab}" status.`}
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                        {['Club', 'Type', 'Contact', 'Submitted', 'Status', ''].map(col => (
                                            <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.055em', whiteSpace: 'nowrap' }}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {byTab.map((club, i) => (
                                        <tr key={club.id} onClick={() => setSelected(club)} style={{ borderBottom: i < byTab.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Users2 size={14} color="white" />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{club.name}</p>
                                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.1rem 0 0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{club.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{club.type || '—'}</td>
                                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{club.submitterEmail || '—'}</td>
                                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>{relTime(club.createdAt)}</td>
                                            <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}><StatusBadge status={club.status} /></td>
                                            <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                                                <button onClick={e => { e.stopPropagation(); setSelected(club); }} className="icon-btn" style={{ width: '28px', height: '28px' }} aria-label="Review club"><Eye size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!loading && !error && byTab.length > 0 && (
                        <div style={{ padding: '0.75rem 1.375rem', borderTop: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            {byTab.length} {tab} club{byTab.length !== 1 ? 's' : ''} · Click a row to review
                        </div>
                    )}
                </div>
            </main>

            <ClubDrawer club={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} onDelete={handleDelete} acting={acting} />
        </>
    );
};

export default AdminClubsPage;
