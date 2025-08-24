import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';
import { USER_ROLES } from '../utils/constants.js';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getUser();
        const token = authService.getToken();

        if (storedUser && token) {
          // Verify token is still valid by fetching current user
          const result = await authService.getCurrentUser();
          if (result.success) {
            setUser(result.data);
          } else {
            // Token is invalid, clear storage
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      console.log('AuthContext login result:', result); // Debug log
      
      if (result.success) {
        console.log('Setting user:', result.data.user); // Debug log
        setUser(result.data.user);
        return { success: true, message: result.message };
      } else {
        console.log('Login failed:', result.message); // Debug log
        setUser(null);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('AuthContext login error:', error); // Debug log
      setUser(null);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.data.user);
        return { success: true, message: result.message };
      } else {
        setUser(null);
        return { success: false, message: result.message };
      }
    } catch (error) {
      setUser(null);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.clear();
    }
  };

  // Update user data
  const updateUser = (newUserData) => {
    setUser(newUserData);
    // Update localStorage as well
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUser(result.data);
        return result.data;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
    return null;
  };

  // Role checking functions
  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return hasRole(USER_ROLES.SYSTEM_ADMIN);
  };

  const isStoreOwner = () => {
    return hasRole(USER_ROLES.STORE_OWNER);
  };

  const isNormalUser = () => {
    return hasRole(USER_ROLES.NORMAL_USER);
  };

  const isLoggedIn = () => {
    return !!user;
  };

  // Context value
  const contextValue = {
    // State
    user,
    loading,
    initialized,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    
    // Utility functions
    hasRole,
    isAdmin,
    isStoreOwner,
    isNormalUser,
    isLoggedIn
  };

  // Don't render children until auth is initialized
  if (!initialized) {
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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
