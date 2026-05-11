import React, { useState, useEffect, useCallback } from 'react';
import {
    Activity, RefreshCcw, AlertCircle, Filter,
    User, Flag, Users2, ShieldCheck,
} from 'lucide-react';
import { activityLogApi, ACTION_LABEL, ACTION_TYPE, CATEGORY } from '../../services/api/activityLog.api';

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CFG = {
    [CATEGORY.USER]:       { label: 'User',       color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   Icon: User },
    [CATEGORY.MODERATION]: { label: 'Moderation', color: 'var(--error)', bg: 'rgba(239,68,68,0.08)', Icon: Flag },
    [CATEGORY.CLUB]:       { label: 'Club',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   Icon: Users2 },
    other:                 { label: 'Other',      color: 'var(--text-tertiary)', bg: 'var(--surface-hover)', Icon: ShieldCheck },
};

const ACTION_COLOR = {
    [ACTION_TYPE.ROLE_CHANGED]:     '#3b82f6',
    [ACTION_TYPE.USER_SUSPENDED]:   '#f59e0b',
    [ACTION_TYPE.USER_UNSUSPENDED]: 'var(--success)',
    [ACTION_TYPE.POST_DELETED]:     'var(--error)',
    [ACTION_TYPE.REPORT_RESOLVED]:  'var(--success)',
    [ACTION_TYPE.REPORT_DISMISSED]: 'var(--text-tertiary)',
    [ACTION_TYPE.CLUB_APPROVED]:    'var(--success)',
    [ACTION_TYPE.CLUB_REJECTED]:    'var(--error)',
    [ACTION_TYPE.CLUB_DELETED]:     'var(--error)',
};

const relTime = (iso) => {
    if (!iso) return '—';
    const s = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (s < 60)  return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    const d = Math.floor(s / 86400);
    return d === 1 ? 'Yesterday' : `${d}d ago`;
};

const formatTs = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── Log Row ──────────────────────────────────────────────────────────────────
const LogRow = ({ log, isLast }) => {
    const cat = CATEGORY_CFG[log.category] ?? CATEGORY_CFG.other;
    const CatIcon = cat.Icon;
    const actionColor = ACTION_COLOR[log.action] ?? 'var(--text-secondary)';

    return (
        <tr style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            {/* Timestamp */}
            <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{relTime(log.timestamp)}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.1rem 0 0' }}>{formatTs(log.timestamp)}</p>
            </td>

            {/* Category */}
            <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CatIcon size={13} color={cat.color} />
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: cat.color }}>{cat.label}</span>
                </div>
            </td>

            {/* Action */}
            <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: actionColor, backgroundColor: `${actionColor}18`, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
                    {ACTION_LABEL[log.action] ?? log.action}
                </span>
            </td>

            {/* Target */}
            <td style={{ padding: '0.875rem 1rem', maxWidth: '200px' }}>
                {log.targetLabel ? (
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.targetLabel}</p>
                ) : <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span>}
                {log.targetType && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.1rem 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{log.targetType}</p>}
            </td>

            {/* Admin */}
            <td style={{ padding: '0.875rem 1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{log.adminEmail ?? '—'}</span>
            </td>

            {/* Meta (collapsed) */}
            <td style={{ padding: '0.875rem 1rem' }}>
                {log.meta && Object.keys(log.meta).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {Object.entries(log.meta).slice(0, 2).map(([k, v]) => (
                            <span key={k} style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-tertiary)', backgroundColor: 'var(--surface-hover)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
                                {k}: {String(v).slice(0, 16)}
                            </span>
                        ))}
                    </div>
                )}
            </td>
        </tr>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminActivityPage = () => {
    const [logs,     setLogs]     = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [catFilter,setCatFilter]= useState('all');

    const fetchLogs = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const data = await activityLogApi.getLogs({ category: catFilter === 'all' ? null : catFilter, limit: 150 });
            setLogs(data);
        } catch (err) {
            console.error('Failed to load logs:', err);
            setError('Could not load activity logs. Check Firestore permissions.');
        } finally { setLoading(false); }
    }, [catFilter]);

    useEffect(() => { const run = async () => { await fetchLogs(); }; run(); }, [fetchLogs]);

    const counts = {
        [CATEGORY.USER]:       logs.filter(l => l.category === CATEGORY.USER).length,
        [CATEGORY.MODERATION]: logs.filter(l => l.category === CATEGORY.MODERATION).length,
        [CATEGORY.CLUB]:       logs.filter(l => l.category === CATEGORY.CLUB).length,
    };

    const CATS = [
        { key: 'all',              label: 'All',        count: logs.length },
        { key: CATEGORY.USER,       label: 'User',       count: counts[CATEGORY.USER] },
        { key: CATEGORY.MODERATION, label: 'Moderation', count: counts[CATEGORY.MODERATION] },
        { key: CATEGORY.CLUB,       label: 'Clubs',      count: counts[CATEGORY.CLUB] },
    ];

    return (
        <main style={{ padding: '1.75rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={17} color="white" />
                        </div>
                        <h1 className="page-title" style={{ margin: 0 }}>Activity Log</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                        Full audit trail of admin actions — {logs.length} entr{logs.length === 1 ? 'y' : 'ies'} loaded
                    </p>
                </div>
                <button onClick={fetchLogs} disabled={loading} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', fontSize: 'var(--text-sm)' }}>
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <Filter size={14} color="var(--text-tertiary)" />
                {CATS.map(({ key, label, count }) => (
                    <button key={key} onClick={() => setCatFilter(key)} style={{ padding: '0.425rem 0.875rem', borderRadius: 'var(--radius-full)', border: `1.5px solid ${catFilter === key ? 'var(--primary)' : 'var(--border)'}`, backgroundColor: catFilter === key ? 'var(--primary-alpha-10)' : 'transparent', color: catFilter === key ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: '700', fontSize: 'var(--text-xs)', cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {label}
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: catFilter === key ? 'var(--primary)' : 'var(--border)', color: catFilter === key ? 'white' : 'var(--text-tertiary)', padding: '0 0.35rem', borderRadius: 'var(--radius-full)', minWidth: '16px', textAlign: 'center' }}>{count}</span>
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.25rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--error)', fontSize: 'var(--text-sm)' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                    <button onClick={fetchLogs} style={{ marginLeft: 'auto', fontWeight: '600', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Retry</button>
                </div>
            )}

            {/* Table */}
            <div className="glass card-base" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="animate-pulse" style={{ height: '56px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--border)' }} />)}
                    </div>
                ) : logs.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Activity size={26} color="#0ea5e9" />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.375rem' }}>No activity yet</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                            Admin actions (role changes, approvals, moderation) will appear here.
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                    {['Timestamp', 'Category', 'Action', 'Target', 'Admin', 'Details'].map(col => (
                                        <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.055em', whiteSpace: 'nowrap' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, i) => (
                                    <LogRow key={log.id ?? i} log={log} isLast={i === logs.length - 1} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && !error && logs.length > 0 && (
                    <div style={{ padding: '0.75rem 1.375rem', borderTop: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Activity size={12} /> Showing newest {logs.length} entries · Logs are append-only and stored in Firestore
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminActivityPage;
