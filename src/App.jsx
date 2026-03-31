import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';

import MapPage from './pages/MapPage';
import LostFoundPage from './pages/LostFoundPage';
import ClubsPage from './pages/ClubsPage';
import PlacementorPage from './pages/PlacementorPage';
import CalendarPage from './pages/CalendarPage';
import SavedPostsPage from './pages/SavedPostsPage';
import { ThemeProvider } from './context/ThemeContext';
import InteractiveBackground from './components/InteractiveBackground';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <InteractiveBackground />
        <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/map" element={
            <ProtectedRoute>
              <Layout>
                <MapPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/lost-found" element={
            <ProtectedRoute>
              <Layout>
                <LostFoundPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/clubs" element={
            <ProtectedRoute>
              <Layout>
                <ClubsPage />
              </Layout>
            </ProtectedRoute>
          } />



          <Route path="/placementor" element={
            <ProtectedRoute>
              <Layout>
                <PlacementorPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout>
                <CalendarPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/saved" element={
            <ProtectedRoute>
              <Layout>
                <SavedPostsPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
