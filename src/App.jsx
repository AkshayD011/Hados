import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import InteractiveBackground from './components/ui/InteractiveBackground';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <InteractiveBackground />
          <AuthProvider>
            <Toaster 
              position="top-center" 
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--card-bg, #ffffff)',
                  color: 'var(--text-primary, #000000)',
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: '0.75rem',
                },
              }} 
            />
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
