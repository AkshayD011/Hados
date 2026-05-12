import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, FileText, Users2, PackageSearch,
    ShieldCheck, TrendingUp, Clock, RefreshCcw,
    ChevronRight, UserPlus, PenSquare, AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCollection, createQueryConstraint } from '../../services/firebase/firestore';
import { getRoleLabel, getRoleColor, ROLES } from '../../utils/roles';
import { ROUTES } from '../../constants/routes';

// ─── helpers ──────────────────────────────────────────────────────────────────

const relativeTime = (isoString) => {
    if (!isoString) return 'Unknown';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins  = Math.floor(diff / 60000);
    const hrs   = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs  < 24) return `${hrs}h ago`;
    return `${days}d ago`;
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, sub, color, link, loading }) => {
    const Comp = icon;
    return (
        <div
            className="glass card-base card-hover"
            style={{ padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                    width: '44px', height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Comp size={20} color={color} />
                </div>
                {link && (
                    <Link to={link} style={{
                        display: 'flex', alignItems: 'center', gap: '0.2rem',
                        fontSize: 'var(--text-xs)', fontWeight: '600',
                        color: 'var(--text-tertiary)', textDecoration: 'none',
                        transition: 'color 0.18s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = color}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >
                        View <ChevronRight size={12} />
                    </Link>
                )}
            </div>

            <div>
                <p style={{
                    fontSize: 'var(--text-xs)', fontWeight: '700',
                    color: 'var(--text-tertiary)', textTransform: 'uppercase',
                    letterSpacing: '0.065em', margin: '0 0 0.25rem',
                }}>
                    {label}
                </p>
                <p style={{
                    fontSize: 'var(--text-3xl)', fontWeight: '800',
                    color: 'var(--text-primary)', letterSpacing: '-0.04em',
                    margin: 0, lineHeight: 1,
                }}>
                    {loading ? (
                        <span className="animate-pulse" style={{ display: 'inline-block', width: '3rem', height: '1.75rem', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-sm)' }} />
                    ) : value}
                </p>
                {sub && !loading && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.35rem 0 0' }}>
                        {sub}
                    </p>
                )}
            </div>
        </div>
    );
};

// ─── MiniBarChart — pure CSS, no library ─────────────────────────────────────

const MiniBarChart = ({ data, color }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
            {data.map((d, i) => (
                <div key={i} title={`${d.label}: ${d.value}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                        width: '100%',
                        height: `${Math.max((d.value / max) * 52, 4)}px`,
                        backgroundColor: color,
                        borderRadius: '3px 3px 0 0',
                        opacity: i === data.length - 1 ? 1 : 0.45 + (i / data.length) * 0.5,
                        transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        minHeight: '4px',
                    }} />
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {d.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

// ─── ActivityItem ─────────────────────────────────────────────────────────────

const ACTIVITY_ICONS = {
    user:      { icon: UserPlus,     color: 'var(--primary)' },
    post:      { icon: PenSquare,    color: '#3b82f6' },
    lost_found:{ icon: PackageSearch,color: '#f59e0b' },
};

const ActivityItem = ({ type, title, time, isLast }) => {
    const cfg = ACTIVITY_ICONS[type] ?? { icon: AlertCircle, color: 'var(--text-tertiary)' };
    const Ico = cfg.icon;
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            borderBottom: isLast ? 'none' : '1px solid var(--border)',
        }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: `${cfg.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '1px',
            }}>
                <Ico size={14} color={cfg.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: 'var(--text-sm)', fontWeight: '600',
                    color: 'var(--text-primary)', margin: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {title}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.15rem 0 0' }}>
                    {time}
                </p>
            </div>
        </div>
    );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, linkTo, linkLabel, icon, onRefresh, refreshing }) => {
    const Ico = icon;
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {Ico && <Ico size={16} color="var(--text-secondary)" />}
                <h2 className="section-title" style={{ margin: 0, fontSize: 'var(--text-base)' }}>{title}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                {onRefresh && (
                    <button className="icon-btn" onClick={onRefresh} disabled={refreshing} aria-label="Refresh" style={{ width: '28px', height: '28px' }}>
                        <RefreshCcw size={13} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                )}
                {linkTo && (
                    <Link to={linkTo} style={{
                        fontSize: 'var(--text-xs)', fontWeight: '700',
                        color: 'var(--primary)', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '0.2rem',
                    }}>
                        {linkLabel} <ChevronRight size={12} />
                    </Link>
                )}
            </div>
        </div>
    );
};

// ─── RoleBadge ───────────────────────────────────────────────────────────────

const RoleBadge = ({ role }) => (
    <span style={{
        fontSize: 'var(--text-xs)', fontWeight: '700',
        color: getRoleColor(role),
        backgroundColor: `${getRoleColor(role)}18`,
        padding: '0.18rem 0.5rem',
        borderRadius: 'var(--radius-full)',
    }}>
        {getRoleLabel(role)}
    </span>
);

// ─── Generate mock weekly sparkline data ──────────────────────────────────────

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const mockWeekly = (total) => {
    // Distribute total across 7 days deterministically (no randomness on re-render)
    const base = Math.max(Math.floor(total / 10), 1);
    return DAYS.map((label, i) => ({
        label,
        value: Math.max(Math.floor(base * (0.5 + Math.sin(i * 0.9 + 1) * 0.5)), 0),
    }));
};

// ─── Main page ───────────────────────────────────────────────────────────────

const AdminDashboardPage = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({ 
        users: 0, 
        posts: 0, 
        clubs: 0, 
        lostFound: 0,
        clubsBreakdown: { pending: 0, approved: 0, rejected: 0 }
    });
    const [userList,   setUserList]   = useState([]);
    const [activity,   setActivity]   = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);

        const [usersRes, postsRes, clubsRes, lostRes] = await Promise.allSettled([
            getCollection('users'),
            getCollection('posts', [createQueryConstraint.orderBy('timestamp', 'desc')]),
            getCollection('clubs'),
            getCollection('lost_found', [createQueryConstraint.orderBy('createdAt', 'desc')]),
        ]);

        const users    = usersRes.status    === 'fulfilled' ? usersRes.value    : [];
        const posts    = postsRes.status    === 'fulfilled' ? postsRes.value    : [];
        const clubs    = clubsRes.status    === 'fulfilled' ? clubsRes.value    : [];
        const lostFound= lostRes.status     === 'fulfilled' ? lostRes.value     : [];

        // Detect any partial failures
        const failures = [usersRes, postsRes, clubsRes, lostRes].filter(r => r.status === 'rejected');
        if (failures.length > 0) {
            setError('Some collections could not be loaded — check Firestore permissions.');
        }

        // Breakdown clubs by status
        const pendingClubs = clubs.filter(c => c.status === 'pending').length;
        const approvedClubs = clubs.filter(c => c.status === 'approved').length;
        const rejectedClubs = clubs.filter(c => c.status === 'rejected').length;

        setStats({
            users:    users.length,
            posts:    posts.length,
            clubs:    clubs.length,
            lostFound:lostFound.length,
            clubsBreakdown: { pending: pendingClubs, approved: approvedClubs, rejected: rejectedClubs }
        });
        setUserList(users);

        // Build recent activity from real data
        const recentActivity = [
            ...users.slice(0, 3).map(u => ({
                type: 'user',
                title: `${u.name || u.email || 'New user'} joined`,
                time: relativeTime(u.createdAt),
                sort: new Date(u.createdAt || 0).getTime(),
            })),
            ...posts.slice(0, 3).map(p => ({
                type: 'post',
                title: p.title || 'Untitled post',
                time: relativeTime(p.timestamp),
                sort: new Date(p.timestamp || 0).getTime(),
            })),
            ...lostFound.slice(0, 3).map(i => ({
                type: 'lost_found',
                title: i.title || 'Lost/found report',
                time: relativeTime(i.createdAt),
                sort: new Date(i.createdAt || 0).getTime(),
            })),
        ]
            .sort((a, b) => b.sort - a.sort)
            .slice(0, 8);

        setActivity(recentActivity);
        setLoading(false);
    }, []);

    useEffect(() => {
        const load = async () => { await fetchAll(); };
        load();
    }, [fetchAll]);

    // Derived user breakdown
    const admins   = userList.filter(u => u.role === ROLES.ADMIN).length;
    const verified = userList.filter(u => u.isIdVerified).length;
    const recentUsers = userList
        .filter(u => u.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <main style={{ padding: '1.75rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

            {/* ── Page header ───────────────────────────────────────── */}
            <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.3rem' }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <ShieldCheck size={17} color="white" />
                        </div>
                        <h1 className="page-title" style={{ margin: 0, fontSize: 'var(--text-2xl)' }}>Overview</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                        Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'Admin'}</strong>
                        &nbsp;·&nbsp;<RoleBadge role={user?.role} />
                    </p>
                </div>
                <button
                    onClick={fetchAll}
                    disabled={loading}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', fontSize: 'var(--text-sm)' }}
                >
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* ── Error banner ──────────────────────────────────────── */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.75rem 1rem', marginBottom: '1.25rem',
                    backgroundColor: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)', color: 'var(--error)',
                }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    {error}
                </div>
            )}

            {/* ── Stat cards ────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
            }}>
                <StatCard
                    icon={Users}        label="Total Users"       value={stats.users}
                    sub={`${admins} admin${admins !== 1 ? 's' : ''} · ${verified} ID-verified`}
                    color="var(--primary)"  link={ROUTES.ADMIN_USERS}   loading={loading}
                />
                <StatCard
                    icon={FileText}     label="Total Posts"       value={stats.posts}
                    sub="Campus feed"
                    color="#3b82f6"         link={ROUTES.ADMIN_POSTS}   loading={loading}
                />
                <StatCard
                    icon={Users2}       label="Clubs & NGOs"      value={stats.clubs}
                    sub={loading ? '...' : `${stats.clubsBreakdown?.pending || 0} p · ${stats.clubsBreakdown?.approved || 0} a · ${stats.clubsBreakdown?.rejected || 0} r`}
                    color="#8b5cf6"         link={ROUTES.ADMIN_CLUBS}   loading={loading}
                />
                <StatCard
                    icon={PackageSearch}label="Lost & Found"      value={stats.lostFound}
                    sub="Active item reports"
                    color="#f59e0b"         link={ROUTES.ADMIN_LOST_FOUND} loading={loading}
                />
            </div>

            {/* ── Charts + Recent users row ──────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

                {/* Weekly activity sparklines */}
                <div className="glass card-base" style={{ overflow: 'hidden' }}>
                    <SectionHeader title="Weekly Trend" icon={TrendingUp} />
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            { label: 'Posts',      data: mockWeekly(stats.posts),     color: '#3b82f6' },
                            { label: 'L&F Reports',data: mockWeekly(stats.lostFound), color: '#f59e0b' },
                        ].map(({ label, data, color }) => (
                            <div key={label}>
                                <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.055em', margin: '0 0 0.5rem' }}>
                                    {label}
                                </p>
                                <MiniBarChart data={data} color={color} />
                            </div>
                        ))}
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0, textAlign: 'center', fontStyle: 'italic' }}>
                            Indicative distribution based on totals
                        </p>
                    </div>
                </div>

                {/* User breakdown donut-like stat */}
                <div className="glass card-base" style={{ overflow: 'hidden' }}>
                    <SectionHeader title="User Breakdown" icon={Users} />
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Students',   value: userList.filter(u => !u.role || u.role === ROLES.STUDENT).length,   color: '#3b82f6' },
                            { label: 'Admins',     value: admins,                                                              color: 'var(--primary)' },
                            { label: 'Moderators', value: userList.filter(u => u.role === ROLES.MODERATOR).length,             color: '#8b5cf6' },
                            { label: 'Faculty',    value: userList.filter(u => u.role === ROLES.FACULTY).length,               color: '#10b981' },
                        ].map(({ label, value, color }) => {
                            const pct = stats.users > 0 ? Math.round((value / stats.users) * 100) : 0;
                            return (
                                <div key={label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
                                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)' }}>{loading ? '—' : `${value} (${pct}%)`}</span>
                                    </div>
                                    <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: loading ? '0%' : `${pct}%`,
                                            backgroundColor: color,
                                            borderRadius: '3px',
                                            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Activity + New users row ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

                {/* Recent activity feed */}
                <div className="glass card-base" style={{ overflow: 'hidden' }}>
                    <SectionHeader title="Recent Activity" icon={Clock} onRefresh={fetchAll} refreshing={loading} />
                    {loading ? (
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse" style={{ height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--border)' }} />
                            ))}
                        </div>
                    ) : activity.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No recent activity found.
                        </div>
                    ) : (
                        activity.map((item, i) => (
                            <ActivityItem
                                key={i}
                                type={item.type}
                                title={item.title}
                                time={item.time}
                                isLast={i === activity.length - 1}
                            />
                        ))
                    )}
                </div>

                {/* Newest users */}
                <div className="glass card-base" style={{ overflow: 'hidden' }}>
                    <SectionHeader title="New Members" icon={UserPlus} linkTo={ROUTES.ADMIN_USERS} linkLabel="All users" />
                    {loading ? (
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse" style={{ height: '52px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--border)' }} />
                            ))}
                        </div>
                    ) : recentUsers.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                            No user records found.
                        </div>
                    ) : (
                        recentUsers.map((u, i) => (
                            <div
                                key={u.id}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.75rem 1.25rem',
                                    borderBottom: i < recentUsers.length - 1 ? '1px solid var(--border)' : 'none',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {/* Mini avatar */}
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: '800', flexShrink: 0, overflow: 'hidden',
                                }}>
                                    {u.avatar
                                        ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : (u.name ? u.name.charAt(0).toUpperCase() : '?')
                                    }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontSize: 'var(--text-sm)', fontWeight: '600',
                                        color: 'var(--text-primary)', margin: 0,
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {u.name || u.email || '—'}
                                    </p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.1rem 0 0' }}>
                                        {relativeTime(u.createdAt)}
                                    </p>
                                </div>
                                <RoleBadge role={u.role || ROLES.STUDENT} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardPage;
