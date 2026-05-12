import React, { useState, useEffect, useCallback } from 'react';
import { 
    PackageSearch, CheckCircle, XCircle, Trash2, 
    RefreshCcw, Eye, Filter, Clock, AlertCircle, 
    Search, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { lostFoundApi, LF_STATUS } from '../../services/api/lostFound.api';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import { activityLogApi, ACTION_TYPE } from '../../services/api/activityLog.api';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    [LF_STATUS.PENDING]:  { label: 'Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: Clock },
    [LF_STATUS.APPROVED]: { label: 'Approved', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
    [LF_STATUS.REJECTED]: { label: 'Rejected', color: 'var(--error)',   bg: 'rgba(239,68,68,0.1)',  icon: XCircle },
};

// ─── Components ───────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CFG[status] || STATUS_CFG[LF_STATUS.PENDING];
    const Icon = cfg.icon;
    return (
        <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: 'var(--text-xs)', fontWeight: '700', 
            color: cfg.color, backgroundColor: cfg.bg, 
            padding: '0.2rem 0.625rem', borderRadius: 'var(--radius-full)' 
        }}>
            <Icon size={12} /> {cfg.label}
        </span>
    );
};

const AdminLostFoundPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState(LF_STATUS.PENDING);
    const [search, setSearch] = useState('');
    const [acting, setActing] = useState(null); // stores itemId being processed

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await lostFoundApi.getItemsByStatus(statusFilter);
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setError('Could not load reports. Check Firestore permissions.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleAction = async (itemId, newStatus, actionLabel) => {
        setActing(itemId);
        try {
            await lostFoundApi.updateItemStatus(itemId, newStatus);
            setItems(prev => prev.filter(item => item.id !== itemId));
            toast.success(`Report ${actionLabel}.`);
            
            // Log activity
            const item = items.find(i => i.id === itemId);
            activityLogApi.log(
                { uid: user.uid, email: user.email },
                newStatus === LF_STATUS.APPROVED ? ACTION_TYPE.CLUB_APPROVED : ACTION_TYPE.CLUB_REJECTED, // Using club actions as proxy if specific LF ones missing
                { id: itemId, type: 'lost_found', label: item?.title || itemId },
                { previousStatus: item?.status, newStatus }
            );
        } catch (err) {
            toast.error(`Failed to ${actionLabel.toLowerCase()}.`);
        } finally {
            setActing(null);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Permanently delete this report? This cannot be undone.')) return;
        setActing(itemId);
        try {
            await lostFoundApi.deleteItem(itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
            toast.success('Report deleted.');
        } catch (err) {
            toast.error('Failed to delete report.');
        } finally {
            setActing(null);
        }
    };

    const filtered = items.filter(i => 
        !search || 
        i.title?.toLowerCase().includes(search.toLowerCase()) ||
        i.description?.toLowerCase().includes(search.toLowerCase()) ||
        i.userEmail?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* ── Page Header ────────────────────────────────────────── */}
            <div style={{ marginBottom: '2rem' }}>
                <Link 
                    to={ROUTES.ADMIN_DASHBOARD} 
                    style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
                        fontSize: 'var(--text-sm)', fontWeight: '600', 
                        color: 'var(--text-secondary)', marginBottom: '0.875rem', 
                        textDecoration: 'none', transition: 'color 0.18s' 
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <ChevronLeft size={15} /> Back to Dashboard
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PackageSearch size={20} color="white" />
                    </div>
                    <div>
                        <h1 className="page-title" style={{ margin: 0 }}>Lost & Found Moderation</h1>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Review and approve reported items for the public feed</p>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* Tabs */}
                <div style={{ display: 'flex', backgroundColor: 'var(--surface-hover)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    {[
                        { id: LF_STATUS.PENDING,  label: 'Pending',  icon: Clock },
                        { id: LF_STATUS.APPROVED, label: 'Approved', icon: CheckCircle },
                        { id: LF_STATUS.REJECTED, label: 'Rejected', icon: XCircle },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.45rem 1rem', borderRadius: 'var(--radius-sm)',
                                fontSize: 'var(--text-sm)', fontWeight: '700',
                                backgroundColor: statusFilter === tab.id ? 'var(--surface)' : 'transparent',
                                color: statusFilter === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                border: 'none', boxShadow: statusFilter === tab.id ? 'var(--shadow-sm)' : 'none',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input 
                            type="search" 
                            placeholder="Search title, description, email..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', paddingLeft: '2.25rem' }}
                        />
                    </div>
                    <button onClick={fetchItems} disabled={loading} className="btn-secondary" style={{ padding: '0.55rem 0.875rem' }}>
                        <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Content ────────────────────────────────────────────── */}
            <div className="glass card-base" style={{ minHeight: '400px' }}>
                {error ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--error)' }}>
                        <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
                        <p>{error}</p>
                        <button onClick={fetchItems} className="btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
                    </div>
                ) : loading ? (
                    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse" style={{ height: '240px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-md)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <PackageSearch size={28} color="var(--text-tertiary)" />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>No reports found</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>There are no items in the {statusFilter} queue.</p>
                    </div>
                ) : (
                    <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                        {filtered.map(item => (
                            <div key={item.id} className="card-hover" style={{ 
                                backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--border)', overflow: 'hidden',
                                display: 'flex', flexDirection: 'column'
                            }}>
                                {/* Image / Placeholder */}
                                <div style={{ height: '180px', backgroundColor: 'var(--surface-hover)', position: 'relative' }}>
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                                            <PackageSearch size={40} opacity={0.3} />
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                                        <span style={{ 
                                            fontSize: 'var(--text-xs)', fontWeight: '800', color: 'white', 
                                            backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', 
                                            borderRadius: 'var(--radius-sm)', textTransform: 'uppercase'
                                        }}>
                                            {item.type || 'Lost'}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div style={{ padding: '1.125rem', flex: 1 }}>
                                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>{item.title}</h3>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                                        {item.description}
                                    </p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            <Eye size={12} /> Reported by {item.userEmail || 'Unknown'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '0.625rem', marginTop: 'auto' }}>
                                        {statusFilter === LF_STATUS.PENDING && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(item.id, LF_STATUS.APPROVED, 'Approved')}
                                                    disabled={acting === item.id}
                                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success)', color: 'white', border: 'none', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(item.id, LF_STATUS.REJECTED, 'Rejected')}
                                                    disabled={acting === item.id}
                                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--error)', color: 'white', border: 'none', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </>
                                        )}
                                        {statusFilter === LF_STATUS.APPROVED && (
                                            <button 
                                                onClick={() => handleAction(item.id, LF_STATUS.REJECTED, 'Rejected')}
                                                disabled={acting === item.id}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1.5px solid rgba(239,68,68,0.2)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                                            >
                                                <XCircle size={14} /> Move to Rejected
                                            </button>
                                        )}
                                        {statusFilter === LF_STATUS.REJECTED && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(item.id, LF_STATUS.APPROVED, 'Approved')}
                                                    disabled={acting === item.id}
                                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1.5px solid rgba(16,185,129,0.2)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                                                >
                                                    <CheckCircle size={14} /> Restore
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={acting === item.id}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: 'none', cursor: 'pointer' }}
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminLostFoundPage;
