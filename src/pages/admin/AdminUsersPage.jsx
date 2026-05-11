import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldCheck, RefreshCcw, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCollection } from '../../services/firebase/firestore';
import { ROLES, getRoleLabel, getRoleColor } from '../../utils/roles';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import { activityLogApi, ACTION_TYPE } from '../../services/api/activityLog.api';

// ─── Inline role selector ─────────────────────────────────────────────────────
const RoleSelector = ({ userId, currentRole, onUpdate, selfUid }) => {
    const [saving, setSaving] = useState(false);
    const isSelf = userId === selfUid;

    const handleChange = async (e) => {
        const newRole = e.target.value;
        if (newRole === currentRole) return;
        setSaving(true);
        try {
            await onUpdate(userId, newRole);
            toast.success(`Role updated to "${getRoleLabel(newRole)}".`);
        } catch {
            toast.error('Failed to update role. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
                value={currentRole || ROLES.STUDENT}
                onChange={handleChange}
                disabled={saving || isSelf}
                title={isSelf ? "You can't change your own role" : undefined}
                style={{
                    padding: '0.35rem 0.625rem',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: getRoleColor(currentRole || ROLES.STUDENT),
                    cursor: isSelf ? 'not-allowed' : 'pointer',
                    opacity: isSelf ? 0.5 : 1,
                }}
            >
                {Object.values(ROLES).map(r => (
                    <option key={r} value={r}>{getRoleLabel(r)}</option>
                ))}
            </select>
            {saving && (
                <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    border: '2px solid var(--border)',
                    borderTopColor: 'var(--primary)',
                    animation: 'spin 0.65s linear infinite',
                    flexShrink: 0
                }} />
            )}
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminUsersPage = () => {
    const { user: currentUser, updateUserRole } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCollection('users');
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Could not load users. Check Firestore permissions.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleUpdate = async (uid, newRole) => {
        const prevUser = users.find(u => u.id === uid);
        await updateUserRole(uid, newRole);
        setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
        // Activity log (fire-and-forget)
        activityLogApi.log(
            { uid: currentUser?.uid, email: currentUser?.email },
            ACTION_TYPE.ROLE_CHANGED,
            { id: uid, type: 'user', label: prevUser?.name || prevUser?.email || uid },
            { previousRole: prevUser?.role ?? 'student', newRole },
        );
    };

    // Filtered user list
    const filtered = users.filter(u => {
        const matchesSearch =
            !search ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole =
            roleFilter === 'all' || (u.role || ROLES.STUDENT) === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>

            {/* ── Page header ───────────────────────────────────────── */}
            <div style={{ marginBottom: '1.75rem' }}>
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
                <h1 className="page-title" style={{ margin: 0 }}>User Management</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: '0.375rem 0 0' }}>
                    {loading ? 'Loading…' : `${users.length} registered users`}
                </p>
            </div>

            {/* ── Toolbar ───────────────────────────────────────────── */}
            <div style={{
                display: 'flex', gap: '0.75rem', marginBottom: '1.25rem',
                flexWrap: 'wrap', alignItems: 'center'
            }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '360px' }}>
                    <Search size={15} style={{
                        position: 'absolute', left: '0.75rem',
                        top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--text-tertiary)', pointerEvents: 'none'
                    }} />
                    <input
                        type="search"
                        placeholder="Search name, roll no, email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            paddingLeft: '2.25rem',
                            paddingRight: '0.875rem',
                            paddingTop: '0.55rem',
                            paddingBottom: '0.55rem',
                        }}
                    />
                </div>

                {/* Role filter */}
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{ padding: '0.55rem 0.875rem', fontWeight: '600' }}
                >
                    <option value="all">All Roles</option>
                    {Object.values(ROLES).map(r => (
                        <option key={r} value={r}>{getRoleLabel(r)}</option>
                    ))}
                </select>

                {/* Refresh */}
                <button
                    className="icon-btn"
                    onClick={fetchUsers}
                    disabled={loading}
                    aria-label="Refresh"
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* ── Table ─────────────────────────────────────────────── */}
            <div className="glass card-base" style={{ overflow: 'hidden' }}>
                {error ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--error)' }}>
                        <AlertCircle size={28} style={{ marginBottom: '0.625rem' }} />
                        <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{error}</p>
                    </div>
                ) : loading ? (
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3, 4, 5].map(i => (
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
                                    {['Name', 'Roll No', 'Dept / Year', 'Email', 'Role', 'ID Status'].map(col => (
                                        <th key={col} style={{
                                            padding: '0.75rem 1.125rem',
                                            textAlign: 'left', whiteSpace: 'nowrap',
                                            fontSize: 'var(--text-xs)', fontWeight: '700',
                                            color: 'var(--text-tertiary)',
                                            textTransform: 'uppercase', letterSpacing: '0.055em'
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                            No users match your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((u, i) => (
                                        <tr
                                            key={u.id}
                                            style={{
                                                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                                                transition: 'background 0.15s',
                                                backgroundColor: u.id === currentUser?.uid ? 'var(--primary-alpha-10)' : 'transparent'
                                            }}
                                            onMouseEnter={e => {
                                                if (u.id !== currentUser?.uid) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.backgroundColor = u.id === currentUser?.uid ? 'var(--primary-alpha-10)' : 'transparent';
                                            }}
                                        >
                                            <td style={{ padding: '0.875rem 1.125rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {/* Mini avatar */}
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                                        color: 'white', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800',
                                                        flexShrink: 0, overflow: 'hidden'
                                                    }}>
                                                        {u.avatar
                                                            ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            : (u.name ? u.name.charAt(0).toUpperCase() : '?')
                                                        }
                                                    </div>
                                                    <span style={{ color: 'var(--text-primary)' }}>
                                                        {u.name || '—'}
                                                        {u.id === currentUser?.uid && (
                                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', marginLeft: '0.35rem', fontWeight: '600' }}>(you)</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                                                {u.rollNo || '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                {u.dept || '—'}{u.year ? ` · ${u.year}` : ''}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {u.email || '—'}
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem' }}>
                                                <RoleSelector
                                                    userId={u.id}
                                                    currentRole={u.role || ROLES.STUDENT}
                                                    onUpdate={handleRoleUpdate}
                                                    selfUid={currentUser?.uid}
                                                />
                                            </td>
                                            <td style={{ padding: '0.875rem 1.125rem' }}>
                                                <span style={{
                                                    fontSize: 'var(--text-xs)', fontWeight: '700',
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

                {/* Result count footer */}
                {!loading && !error && filtered.length > 0 && (
                    <div style={{
                        padding: '0.75rem 1.375rem',
                        borderTop: '1px solid var(--border)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}>
                        <ShieldCheck size={13} />
                        Showing {filtered.length} of {users.length} users
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminUsersPage;
