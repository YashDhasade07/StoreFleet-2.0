import { api } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class UserService {
  // Get user profile
  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update password
  async updatePassword(passwordData) {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.PASSWORD, passwordData);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Get all users
  async getAllUsers(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.ALL, filters);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Get user by ID
  async getUserById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.BY_ID(id));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Create user
  async createUser(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData);
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Update user
  async updateUser(id, userData) {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Delete user
  async deleteUser(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.USERS.DELETE(id));
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new UserService();
