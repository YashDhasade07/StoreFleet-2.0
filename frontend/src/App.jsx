import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';

// Layout
import Layout from './components/layout/Layout/Layout.jsx';

// Auth Components
import AuthContainer from './components/auth/AuthContainer/AuthContainer.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute.jsx';

// Pages
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage.jsx';

// Constants
import { USER_ROLES } from './utils/constants.js';

import './index.css';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/" element={<Layout />}>
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard - All authenticated users */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.STORE_OWNER, USER_ROLES.NORMAL_USER]}>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="admin/*" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN]}>
                <div>Admin Routes Coming Soon</div>
              </ProtectedRoute>
            } 
          />

          {/* Store Owner Routes */}
          <Route 
            path="my-store" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER]}>
                <div>My Store Dashboard Coming Soon</div>
              </ProtectedRoute>
            } 
          />

          {/* Normal User Routes */}
          <Route 
            path="stores" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.NORMAL_USER]}>
                <div>Browse Stores Coming Soon</div>
              </ProtectedRoute>
            } 
          />

          {/* Profile Route - All users */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.STORE_OWNER, USER_ROLES.NORMAL_USER]}>
                <div>Profile Page Coming Soon</div>
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
