import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, FileText, AlertCircle, RefreshCcw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCollection } from '../../services/firebase/firestore';
import { getRoleLabel, getRoleColor, ROLES } from '../../utils/roles';
import { ROUTES } from '../../constants/routes';

const StatCard = ({ icon, label, value, color, loading }) => {
    const Comp = icon;
    return (
        <div className="glass card-base" style={{
            padding: '1.375rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <div style={{
                width: '48px', height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
            }}>
                <Comp size={22} color={color} />
            </div>
            <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                    {label}
                </p>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0 0', letterSpacing: '-0.03em' }}>
                    {loading ? '—' : value}
                </p>
            </div>
        </div>
    );
};

// ─── Role badge ──────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => (
    <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: '700',
        color: getRoleColor(role),
        backgroundColor: `${getRoleColor(role)}18`,
        padding: '0.2rem 0.55rem',
        borderRadius: 'var(--radius-full)',
        letterSpacing: '0.01em',
        textTransform: 'capitalize'
    }}>
        {getRoleLabel(role)}
    </span>
);

// ─── Main page ───────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError(null);
        try {
            const data = await getCollection('users');
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Could not load user list. Check Firestore permissions.');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Derived stats
    const totalUsers    = users.length;
    const adminCount    = users.filter(u => u.role === ROLES.ADMIN).length;
    const studentCount  = users.filter(u => !u.role || u.role === ROLES.STUDENT).length;
    const verifiedCount = users.filter(u => u.isIdVerified).length;

    return (
        <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>

            {/* ── Page header ───────────────────────────────────────── */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ShieldCheck size={18} color="white" />
                    </div>
                    <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                    Signed in as <strong style={{ color: 'var(--primary)' }}>{user?.name || user?.email}</strong>
                    &nbsp;·&nbsp;
                    <RoleBadge role={user?.role} />
                </p>
            </div>

            {/* ── Stat cards ────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <StatCard icon={Users}      label="Total Users"     value={totalUsers}    color="var(--primary)"      loading={loadingUsers} />
                <StatCard icon={ShieldCheck} label="Admins"         value={adminCount}    color="#8b5cf6"             loading={loadingUsers} />
                <StatCard icon={FileText}    label="Students"       value={studentCount}  color="#3b82f6"             loading={loadingUsers} />
                <StatCard icon={AlertCircle} label="ID Verified"    value={verifiedCount} color="var(--success)"      loading={loadingUsers} />
            </div>

            {/* ── User table ────────────────────────────────────────── */}
            <div className="glass card-base" style={{ overflow: 'hidden' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.125rem 1.375rem',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <h2 className="section-title" style={{ margin: 0 }}>All Users</h2>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            className="icon-btn"
                            onClick={fetchUsers}
                            disabled={loadingUsers}
                            aria-label="Refresh user list"
                        >
                            <RefreshCcw size={16} className={loadingUsers ? 'animate-spin' : ''} />
                        </button>
                        <Link
                            to={ROUTES.ADMIN_USERS}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                fontSize: 'var(--text-sm)', fontWeight: '600',
                                color: 'var(--primary)', textDecoration: 'none'
                            }}
                        >
                            Manage Users <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>

                {error ? (
                    <div style={{ padding: '2rem 1.375rem', textAlign: 'center', color: 'var(--error)' }}>
                        <AlertCircle size={24} style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{error}</p>
                    </div>
                ) : loadingUsers ? (
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse" style={{
                                height: '52px', borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--border)'
                            }} />
                        ))}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                    {['Name', 'Roll No', 'Dept', 'Role', 'ID Verified'].map(col => (
                                        <th key={col} style={{
                                            padding: '0.75rem 1.125rem',
                                            textAlign: 'left',
                                            fontWeight: '700',
                                            color: 'var(--text-tertiary)',
                                            fontSize: 'var(--text-xs)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u, i) => (
                                        <tr
                                            key={u.id}
                                            style={{
                                                borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                                                transition: 'background 0.15s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '0.875rem 1.125rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                                {u.name || '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>
                                                {u.rollNo || '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem', color: 'var(--text-secondary)' }}>
                                                {u.dept || '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem' }}>
                                                <RoleBadge role={u.role || ROLES.STUDENT} />
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem' }}>
                                                <span style={{
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: '700',
                                                    color: u.isIdVerified ? 'var(--success)' : 'var(--text-tertiary)',
                                                    backgroundColor: u.isIdVerified ? 'rgba(16,185,129,0.1)' : 'var(--surface-hover)',
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: 'var(--radius-full)'
                                                }}>
                                                    {u.isIdVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminDashboardPage;
