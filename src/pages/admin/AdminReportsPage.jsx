import React, { useState, useEffect, useCallback } from 'react';
import {
    Flag, CheckCircle, XCircle, Trash2, RefreshCcw,
    AlertCircle, Eye, Filter, Clock, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { deleteDocument } from '../../services/firebase/firestore';
import {
    REPORT_REASON_LABELS,
    REPORT_STATUS,
    REPORT_ACTION,
} from '../../services/api/moderation.api';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
    [REPORT_STATUS.PENDING]:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  label: 'Pending'   },
    [REPORT_STATUS.RESOLVED]:  { color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', label: 'Resolved'  },
    [REPORT_STATUS.DISMISSED]: { color: 'var(--text-tertiary)', bg: 'var(--surface-hover)', label: 'Dismissed' },
};

const relTime = (iso) => {
    if (!iso) return '—';
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d}d ago`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLES[status] ?? STATUS_STYLES[REPORT_STATUS.PENDING];
    return (
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: s.color, backgroundColor: s.bg, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
            {s.label}
        </span>
    );
};

const ReasonBadge = ({ reason }) => (
    <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-hover)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
        {REPORT_REASON_LABELS[reason] ?? reason}
    </span>
);

// ─── Detail Drawer ────────────────────────────────────────────────────────────

const ReportDrawer = ({ report, onClose, onResolve, onDismiss, onDeletePost, resolving }) => {
    if (!report) return null;
    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)', zIndex: 200 }} />
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(420px, 100vw)', zIndex: 201,
                backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
                animation: 'slideInRight 0.22s ease',
            }}>
                {/* Header */}
                <div style={{ padding: '1.125rem 1.375rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Flag size={16} color="var(--error)" />
                        <h2 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--text-primary)' }}>Report Details</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose} aria-label="Close drawer"><XCircle size={18} /></button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StatusBadge status={report.status} />
                        <ReasonBadge reason={report.reason} />
                    </div>

                    {/* Reported content */}
                    <div className="glass card-base" style={{ padding: '1rem' }}>
                        <p className="label-caps" style={{ margin: '0 0 0.375rem' }}>Reported Content</p>
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>{report.targetTitle || '—'}</p>
                        {report.targetContent && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{report.targetContent.slice(0, 300)}{report.targetContent.length > 300 ? '…' : ''}</p>}
                    </div>

                    {/* Reporter info */}
                    <div>
                        <p className="label-caps" style={{ margin: '0 0 0.5rem' }}>Reporter</p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 0.2rem' }}>{report.reporterEmail || '—'}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>Submitted {relTime(report.createdAt)}</p>
                    </div>

                    {/* Details */}
                    {report.details && (
                        <div>
                            <p className="label-caps" style={{ margin: '0 0 0.5rem' }}>Reporter Notes</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{report.details}</p>
                        </div>
                    )}

                    {/* Resolution info */}
                    {report.status !== REPORT_STATUS.PENDING && (
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                            <p className="label-caps" style={{ margin: '0 0 0.375rem' }}>Resolution</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 0.2rem' }}>
                                Action: <strong style={{ color: 'var(--text-primary)' }}>{report.action ?? REPORT_ACTION.NONE}</strong>
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>
                                Resolved {relTime(report.resolvedAt)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action footer */}
                {report.status === REPORT_STATUS.PENDING && (
                    <div style={{ padding: '1rem 1.375rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        <p className="label-caps" style={{ margin: '0 0 0.25rem' }}>Take Action</p>
                        <button
                            onClick={() => onDeletePost(report)}
                            disabled={resolving}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1.5px solid rgba(239,68,68,0.25)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: resolving ? 'not-allowed' : 'pointer', opacity: resolving ? 0.6 : 1, transition: 'all 0.18s' }}
                        >
                            <Trash2 size={14} /> Delete Post &amp; Resolve
                        </button>
                        <button
                            onClick={() => onResolve(report.id, REPORT_ACTION.WARNED)}
                            disabled={resolving}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1.5px solid rgba(245,158,11,0.25)', fontWeight: '700', fontSize: 'var(--text-sm)', cursor: resolving ? 'not-allowed' : 'pointer', opacity: resolving ? 0.6 : 1, transition: 'all 0.18s' }}
                        >
                            <ShieldCheck size={14} /> Warn &amp; Resolve
                        </button>
                        <button
                            onClick={() => onDismiss(report.id)}
                            disabled={resolving}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)', fontWeight: '600', fontSize: 'var(--text-sm)', cursor: resolving ? 'not-allowed' : 'pointer', opacity: resolving ? 0.6 : 1, transition: 'all 0.18s' }}
                        >
                            <XCircle size={14} /> Dismiss (No Action)
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── StatSummaryCard ──────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
const StatSummaryCard = ({ label, value, color, Icon, loading }) => (
    <div className="glass card-base" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon size={18} color={color} style={{ flexShrink: 0 }} />
        <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
                {loading ? '—' : value}
            </p>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminReportsPage = () => {
    const { user } = useAuth();
    const [reports,     setReports]     = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [statusFilter,setStatusFilter]= useState('all');
    const [typeFilter,  setTypeFilter]  = useState('all');
    const [selected,    setSelected]    = useState(null);
    const [resolving,   setResolving]   = useState(false);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.moderation.getReports(statusFilter === 'all' ? null : statusFilter);
            setReports(data);
        } catch (err) {
            console.error('Failed to load reports:', err);
            setError('Could not load reports. Check Firestore permissions.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        const load = async () => { await fetchReports(); };
        load();
    }, [fetchReports]);

    const handleResolve = async (reportId, action) => {
        setResolving(true);
        try {
            await api.moderation.resolveReport(reportId, { action, resolvedBy: user.uid });
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: REPORT_STATUS.RESOLVED, action, resolvedAt: new Date().toISOString() } : r));
            if (selected?.id === reportId) setSelected(prev => ({ ...prev, status: REPORT_STATUS.RESOLVED, action }));
            toast.success('Report resolved.');
        } catch {
            toast.error('Failed to resolve report.');
        } finally {
            setResolving(false);
        }
    };

    const handleDismiss = async (reportId) => {
        setResolving(true);
        try {
            await api.moderation.dismissReport(reportId, user.uid);
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: REPORT_STATUS.DISMISSED, resolvedAt: new Date().toISOString() } : r));
            if (selected?.id === reportId) setSelected(prev => ({ ...prev, status: REPORT_STATUS.DISMISSED }));
            toast.success('Report dismissed.');
        } catch {
            toast.error('Failed to dismiss report.');
        } finally {
            setResolving(false);
        }
    };

    const handleDeletePost = async (report) => {
        setResolving(true);
        try {
            // Delete the actual post
            await deleteDocument('posts', report.targetId);
            // Resolve the report with action: deleted
            await api.moderation.resolveReport(report.id, { action: REPORT_ACTION.DELETED, resolvedBy: user.uid });
            setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: REPORT_STATUS.RESOLVED, action: REPORT_ACTION.DELETED } : r));
            if (selected?.id === report.id) setSelected(prev => ({ ...prev, status: REPORT_STATUS.RESOLVED, action: REPORT_ACTION.DELETED }));
            toast.success('Post deleted and report resolved.');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete post.');
        } finally {
            setResolving(false);
        }
    };

    // Filtered list
    const filtered = reports.filter(r => {
        if (typeFilter !== 'all' && r.type !== typeFilter) return false;
        return true;
    });

    const pendingCount  = reports.filter(r => r.status === REPORT_STATUS.PENDING).length;

    return (
        <>
            <main style={{ padding: '1.75rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── Page header ───────────────────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--error), #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Flag size={17} color="white" />
                            </div>
                            <h1 className="page-title" style={{ margin: 0 }}>Content Reports</h1>
                            {pendingCount > 0 && (
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '800', backgroundColor: 'var(--error)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', minWidth: '20px', textAlign: 'center' }}>
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            Review and moderate reported content
                        </p>
                    </div>
                    <button onClick={fetchReports} disabled={loading} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', fontSize: 'var(--text-sm)' }}>
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>

                {/* ── Summary cards ─────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <StatSummaryCard label="Total"     value={reports.length}       color="var(--text-secondary)" Icon={Flag}         loading={loading} />
                    <StatSummaryCard label="Pending"   value={pendingCount}          color="#f59e0b"               Icon={Clock}        loading={loading} />
                    <StatSummaryCard label="Resolved"  value={reports.filter(r => r.status === REPORT_STATUS.RESOLVED).length}  color="var(--success)"       Icon={CheckCircle} loading={loading} />
                    <StatSummaryCard label="Dismissed" value={reports.filter(r => r.status === REPORT_STATUS.DISMISSED).length} color="var(--text-tertiary)"  Icon={XCircle}     loading={loading} />
                </div>

                {/* ── Filters ───────────────────────────────────────────── */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <Filter size={15} color="var(--text-tertiary)" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.5rem 0.875rem', fontWeight: '600', fontSize: 'var(--text-sm)' }}>
                        <option value="all">All Statuses</option>
                        <option value={REPORT_STATUS.PENDING}>Pending</option>
                        <option value={REPORT_STATUS.RESOLVED}>Resolved</option>
                        <option value={REPORT_STATUS.DISMISSED}>Dismissed</option>
                    </select>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '0.5rem 0.875rem', fontWeight: '600', fontSize: 'var(--text-sm)' }}>
                        <option value="all">All Types</option>
                        <option value="post">Posts</option>
                        <option value="comment">Comments</option>
                    </select>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
                        {filtered.length} {filtered.length === 1 ? 'report' : 'reports'}
                    </span>
                </div>

                {/* ── Error ─────────────────────────────────────────────── */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.25rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', color: 'var(--error)', fontSize: 'var(--text-sm)' }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                        <button onClick={fetchReports} style={{ marginLeft: 'auto', fontWeight: '600', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>Retry</button>
                    </div>
                )}

                {/* ── Table ─────────────────────────────────────────────── */}
                <div className="glass card-base" style={{ overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="animate-pulse" style={{ height: '60px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--border)' }} />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <CheckCircle size={26} color="var(--success)" />
                            </div>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.375rem' }}>
                                {statusFilter === 'all' ? 'No reports yet' : `No ${statusFilter} reports`}
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                                {statusFilter === REPORT_STATUS.PENDING ? 'Great! All reports have been handled.' : 'The community is behaving — no reports to show.'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                        {['Content', 'Reason', 'Reporter', 'Submitted', 'Status', ''].map(col => (
                                            <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.055em', whiteSpace: 'nowrap' }}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r, i) => (
                                        <tr
                                            key={r.id}
                                            style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s', backgroundColor: r.status === REPORT_STATUS.PENDING ? 'rgba(245,158,11,0.03)' : 'transparent', cursor: 'pointer' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = r.status === REPORT_STATUS.PENDING ? 'rgba(245,158,11,0.03)' : 'transparent'}
                                            onClick={() => setSelected(r)}
                                        >
                                            <td style={{ padding: '0.875rem 1rem', maxWidth: '220px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', backgroundColor: r.type === 'post' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Flag size={13} color={r.type === 'post' ? '#3b82f6' : '#8b5cf6'} />
                                                    </div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', margin: '0 0 0.1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.type}</p>
                                                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.targetTitle || '(no title)'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}><ReasonBadge reason={r.reason} /></td>
                                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reporterEmail || '—'}</td>
                                            <td style={{ padding: '0.875rem 1rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', fontSize: 'var(--text-xs)' }}>{relTime(r.createdAt)}</td>
                                            <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}><StatusBadge status={r.status} /></td>
                                            <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={e => { e.stopPropagation(); setSelected(r); }}
                                                    className="icon-btn"
                                                    aria-label="View report details"
                                                    style={{ width: '28px', height: '28px' }}
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    {!loading && !error && filtered.length > 0 && (
                        <div style={{ padding: '0.75rem 1.375rem', borderTop: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Flag size={12} /> {filtered.length} report{filtered.length !== 1 ? 's' : ''} · Click a row to review
                        </div>
                    )}
                </div>
            </main>

            {/* Detail drawer */}
            <ReportDrawer
                report={selected}
                onClose={() => setSelected(null)}
                onResolve={handleResolve}
                onDismiss={handleDismiss}
                onDeletePost={handleDeletePost}
                resolving={resolving}
            />
        </>
    );
};

export default AdminReportsPage;
