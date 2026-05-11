/**
 * AdminRoute — layout-level guard for all /admin/* routes.
 *
 * Protection layers (applied in order):
 *   1. Auth loading  → renders AppLoadingSkeleton (no flash)
 *   2. Not logged in → redirects to /login, preserving the attempted URL
 *                      so the user is sent back after login.
 *   3. Logged in, not admin → redirects to / with a descriptive state
 *                             message (no raw error, no broken page).
 *   4. Admin user   → renders Layout + <Outlet /> (child admin pages)
 *
 * Usage in AppRoutes:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
 *     <Route path="/admin/users"     element={<AdminUsersPage />} />
 *   </Route>
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppLoadingSkeleton } from '../ui/Skeleton';
import AdminLayout from '../admin/AdminLayout';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../utils/roles';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // ── 1. Still resolving auth state ────────────────────────────────────────
    if (loading) return <AppLoadingSkeleton />;

    // ── 2. Not logged in ─────────────────────────────────────────────────────
    // Preserve the attempted path so LoginPage can redirect back after success.
    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    // ── 3. Logged in but not admin ───────────────────────────────────────────
    // Redirect to home with a state flag — HomePage / a toast can pick this up.
    if (user?.role !== ROLES.ADMIN) {
        return (
            <Navigate
                to={ROUTES.HOME}
                replace
                state={{ unauthorizedAdmin: true }}
            />
        );
    }

    // ── 4. Authenticated admin ───────────────────────────────────────────────
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
};

export default AdminRoute;
