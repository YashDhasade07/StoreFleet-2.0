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
import StoresPage from './pages/StoresPage/StoresPage.jsx';
import UsersPage from './pages/UsersPage/UsersPage.jsx';
import RatingsPage from './pages/RatingsPage/RatingsPage.jsx';
import MyRatingsPage from './pages/MyRatingsPage/MyRatingsPage.jsx';


// Constants
import { USER_ROLES } from './utils/constants.js';

import './index.css';
import MyStorePage from './pages/MyStorePage/MyStorePage.jsx';
import StoreDetailsPage from './pages/StoreDetailsPage/StoreDetailsPage.jsx';
function App() {
  const { user, loading } = useAuth();

  console.log('App render - user:', user);
  console.log('App render - loading:', loading);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-gray-50)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--color-gray-200)',
            borderTop: '4px solid var(--color-primary-blue)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '14px' }}>
            Loading StoreFleet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* If no user, show login */}
        {!user && (
          <Route path="*" element={<AuthContainer />} />
        )}

        {/* If user exists, show app with layout */}
        {user && (
          <>
            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* ALL PROTECTED ROUTES INSIDE LAYOUT */}
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

              {/* ADMIN ROUTES */}
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/stores"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER,USER_ROLES.SYSTEM_ADMIN]}>
                    <StoresPage />
                  </ProtectedRoute>
                }
              />

              {/* RATING ROUTES - NOW INSIDE LAYOUT! */}
              <Route
                path="admin/ratings"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER,USER_ROLES.SYSTEM_ADMIN]}>
                    <RatingsPage />
                  </ProtectedRoute>
                }
              />

              {/* STORE OWNER ROUTES */}
              <Route
                path="my-store"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER]}>
                    <div>My Store Dashboard Coming Soon</div>
                  </ProtectedRoute>
                }
              />

              {/* NORMAL USER ROUTES */}
              <Route
                path="stores"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER, USER_ROLES.NORMAL_USER, USER_ROLES.SYSTEM_ADMIN]}>
                    <StoresPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="my-ratings"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.NORMAL_USER]}>
                    <MyRatingsPage />
                  </ProtectedRoute>
                }
              />

              {/* PROFILE ROUTE - All users */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN, USER_ROLES.STORE_OWNER, USER_ROLES.NORMAL_USER]}>
                    <div>Profile Page Coming Soon</div>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Store Owner Routes */}
            <Route
              path="stores"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER, USER_ROLES.SYSTEM_ADMIN]}>
                  <StoresPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="stores/:id"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER, USER_ROLES.SYSTEM_ADMIN, USER_ROLES.NORMAL_USER]}>
                  <StoreDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="my-store"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.STORE_OWNER]}>
                  <MyStorePage />
                </ProtectedRoute>
              }
            />

          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
