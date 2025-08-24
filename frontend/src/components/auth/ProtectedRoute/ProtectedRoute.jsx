import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';

const ProtectedRoute = ({ children, allowedRoles = [], redirectPath = "/login" }) => {
  const { user, loading, isLoggedIn } = useAuth();
  const location = useLocation();

  // Add debug logs
  console.log('ProtectedRoute Debug:');
  console.log('- User:', user);
  console.log('- User role:', user?.role);
  console.log('- Allowed roles:', allowedRoles);
  console.log('- Is logged in:', isLoggedIn());
  console.log('- Loading:', loading);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isLoggedIn() || !user) {
    console.log('User not authenticated, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(user.role);
    console.log('Permission check:', hasPermission);
    
    if (!hasPermission) {
      console.log('Access denied. User role:', user.role, 'Required:', allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('Access granted for role:', user.role);
  return children;
};

export default ProtectedRoute;
