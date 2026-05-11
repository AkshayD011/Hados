import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLoadingSkeleton } from '../components/ui/Skeleton';
import { ROUTES } from '../constants/routes';

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import Layout from '../components/layout/Layout';
import MapPage from '../pages/MapPage';
import LostFoundPage from '../pages/LostFoundPage';
import ClubsPage from '../pages/ClubsPage';
import PlacementorPage from '../pages/PlacementorPage';
import CalendarPage from '../pages/CalendarPage';
import SavedPostsPage from '../pages/SavedPostsPage';

// Protected Layout Component (Handles auth and layout wrapper)
const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <AppLoadingSkeleton />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} />;
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      
      {/* Nested Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.MAP} element={<MapPage />} />
        <Route path={ROUTES.LOST_FOUND} element={<LostFoundPage />} />
        <Route path={ROUTES.CLUBS} element={<ClubsPage />} />
        <Route path={ROUTES.PLACEMENTOR} element={<PlacementorPage />} />
        <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
        <Route path={ROUTES.SAVED} element={<SavedPostsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
    </Routes>
  );
};

export default AppRoutes;
