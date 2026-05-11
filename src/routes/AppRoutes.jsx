import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLoadingSkeleton } from '../components/ui/Skeleton';
import { ROUTES } from '../constants/routes';

// ── Page imports ──────────────────────────────────────────────────────────────
import LoginPage             from '../pages/LoginPage';
import HomePage              from '../pages/HomePage';
import ProfilePage           from '../pages/ProfilePage';
import MapPage               from '../pages/MapPage';
import LostFoundPage         from '../pages/LostFoundPage';
import ClubsPage             from '../pages/ClubsPage';
import PlacementorPage       from '../pages/PlacementorPage';
import CalendarPage          from '../pages/CalendarPage';
import SavedPostsPage        from '../pages/SavedPostsPage';
import NotFoundPage          from '../pages/NotFoundPage';

// ── Admin page imports ────────────────────────────────────────────────────────
import AdminDashboardPage    from '../pages/admin/AdminDashboardPage';
import AdminUsersPage        from '../pages/admin/AdminUsersPage';
import AdminPostsPage        from '../pages/admin/AdminPostsPage';
import AdminClubsPage        from '../pages/admin/AdminClubsPage';
import AdminLostFoundPage    from '../pages/admin/AdminLostFoundPage';
import AdminReportsPage      from '../pages/admin/AdminReportsPage';

// ── Layout & guards ───────────────────────────────────────────────────────────
import Layout     from '../components/layout/Layout';
import AdminRoute from '../components/auth/AdminRoute';

// ─────────────────────────────────────────────────────────────────────────────
// ProtectedLayout — requires any authenticated user; renders Layout + Outlet.
// ─────────────────────────────────────────────────────────────────────────────
const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <AppLoadingSkeleton />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AppRoutes — full route tree
//
//  /login                  → LoginPage           (public)
//  /                       → ProtectedLayout     (authenticated)
//    /                     → HomePage
//    /profile              → ProfilePage
//    /map                  → MapPage
//    /lost-found           → LostFoundPage
//    /clubs                → ClubsPage
//    /placementor          → PlacementorPage
//    /calendar             → CalendarPage
//    /saved                → SavedPostsPage
//  /admin                  → AdminRoute          (authenticated + role === "admin")
//    /admin                → redirect → /admin/dashboard
//    /admin/dashboard      → AdminDashboardPage
//    /admin/users          → AdminUsersPage
//    /admin/posts          → AdminPostsPage
//    /admin/clubs          → AdminClubsPage
//    /admin/lost-found     → AdminLostFoundPage
//    /admin/reports        → AdminReportsPage
//  *                       → NotFoundPage        (404)
// ─────────────────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────────── */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* ── Protected (any authenticated user) ─────────────────────── */}
      <Route element={<ProtectedLayout />}>
        <Route path={ROUTES.HOME}        element={<HomePage />} />
        <Route path={ROUTES.PROFILE}     element={<ProfilePage />} />
        <Route path={ROUTES.MAP}         element={<MapPage />} />
        <Route path={ROUTES.LOST_FOUND}  element={<LostFoundPage />} />
        <Route path={ROUTES.CLUBS}       element={<ClubsPage />} />
        <Route path={ROUTES.PLACEMENTOR} element={<PlacementorPage />} />
        <Route path={ROUTES.CALENDAR}    element={<CalendarPage />} />
        <Route path={ROUTES.SAVED}       element={<SavedPostsPage />} />
      </Route>

      {/* ── Admin only (authenticated + role === "admin") ───────────── */}
      <Route element={<AdminRoute />}>
        <Route path={ROUTES.ADMIN}            element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        <Route path={ROUTES.ADMIN_DASHBOARD}  element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN_USERS}      element={<AdminUsersPage />} />
        <Route path={ROUTES.ADMIN_POSTS}      element={<AdminPostsPage />} />
        <Route path={ROUTES.ADMIN_CLUBS}      element={<AdminClubsPage />} />
        <Route path={ROUTES.ADMIN_LOST_FOUND} element={<AdminLostFoundPage />} />
        <Route path={ROUTES.ADMIN_REPORTS}    element={<AdminReportsPage />} />
      </Route>

      {/* ── 404 ────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
