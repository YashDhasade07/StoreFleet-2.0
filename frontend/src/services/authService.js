import { api } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      console.log('AuthService login called with:', credentials);
      
      // Make the API call
      const apiResponse = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('AuthService API response:', apiResponse);
      
      // Check if login was successful
      if (apiResponse.success && apiResponse.data) {
        // Store token and user data
        localStorage.setItem('authToken', apiResponse.data.token);
        localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
        
        console.log('Login successful - token and user stored');
        
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message || 'Login successful'
        };
      }
      
      // Login failed
      return {
        success: false,
        message: apiResponse.message || 'Login failed'
      };
    } catch (error) {
      console.error('AuthService login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const apiResponse = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (apiResponse.success && apiResponse.data) {
        // Store token and user data
        localStorage.setItem('authToken', apiResponse.data.token);
        localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
        
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message || 'Registration successful'
        };
      }
      
      return {
        success: false,
        message: apiResponse.message || 'Registration failed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const apiResponse = await api.get(API_ENDPOINTS.AUTH.ME);
      
      if (apiResponse.success && apiResponse.data) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
        
        return {
          success: true,
          data: apiResponse.data.user
        };
      }
      
      return {
        success: false,
        message: apiResponse.message || 'Failed to get user data'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get user data'
      };
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored user data
  getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Check user role
  hasRole(role) {
    const user = this.getUser();
    return user?.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('system_admin');
  }

  // Check if user is store owner
  isStoreOwner() {
    return this.hasRole('store_owner');
  }

  // Check if user is normal user
  isNormalUser() {
    return this.hasRole('normal_user');
  }
}

// Export singleton instance
export default new AuthService();
