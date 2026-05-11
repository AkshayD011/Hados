/**
 * RoleGuard — wraps any UI or route to conditionally render based on role.
 *
 * Three usage patterns:
 *
 * 1. Minimum role required (most common):
 *    <RoleGuard minRole="admin">
 *        <AdminPanel />
 *    </RoleGuard>
 *
 * 2. Exact role required:
 *    <RoleGuard role="faculty">
 *        <FacultyTools />
 *    </RoleGuard>
 *
 * 3. Authentication only (any role):
 *    <RoleGuard requireAuth>
 *        <ProtectedPage />
 *    </RoleGuard>
 *
 * 4. Route-level guard — redirect on failure:
 *    <RoleGuard minRole="admin" redirect="/dashboard">
 *        <AdminPage />
 *    </RoleGuard>
 *
 * Props:
 *   children      — content to show when access is granted
 *   minRole       — minimum privilege level required (uses hasMinRole)
 *   role          — exact role required (uses hasRole)
 *   requireAuth   — require any authenticated user (default: true when role/minRole set)
 *   fallback      — custom JSX to show on access denied (default: null = render nothing)
 *   redirect      — route path to navigate to on denial (overrides fallback)
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import useRole from '../../hooks/useRole';
import { ROLES } from '../../utils/roles';

const RoleGuard = ({
    children,
    minRole = null,
    role = null,
    requireAuth = true,
    fallback = null,
    redirect = null,
}) => {
    const {
        isAuthenticated,
        hasMinRole,
        hasRole,
    } = useRole();

    // Check authentication first
    const authed = isAuthenticated;
    if ((requireAuth || minRole || role) && !authed) {
        if (redirect) return <Navigate to={redirect} replace />;
        return fallback;
    }

    // Check exact role
    if (role && !hasRole(role)) {
        if (redirect) return <Navigate to={redirect} replace />;
        return fallback;
    }

    // Check minimum privilege level
    if (minRole && !hasMinRole(minRole)) {
        if (redirect) return <Navigate to={redirect} replace />;
        return fallback;
    }

    return children;
};

/**
 * AdminOnly — convenience wrapper that requires the admin role.
 * Renders nothing by default when access is denied.
 *
 * Usage: <AdminOnly><button>Delete Post</button></AdminOnly>
 */
export const AdminOnly = ({ children, fallback = null }) => (
    <RoleGuard minRole={ROLES.ADMIN} fallback={fallback}>
        {children}
    </RoleGuard>
);

/**
 * ModeratorOnly — requires moderator or above.
 */
export const ModeratorOnly = ({ children, fallback = null }) => (
    <RoleGuard minRole={ROLES.MODERATOR} fallback={fallback}>
        {children}
    </RoleGuard>
);

/**
 * AuthOnly — requires any authenticated user.
 */
export const AuthOnly = ({ children, redirect = '/login', fallback = null }) => (
    <RoleGuard requireAuth redirect={redirect} fallback={fallback}>
        {children}
    </RoleGuard>
);

export default RoleGuard;
