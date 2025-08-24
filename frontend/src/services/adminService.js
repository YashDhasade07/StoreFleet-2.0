import { api } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class AdminService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
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

  // Get all users (admin view)
  async getAllUsersAdmin(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS, filters);
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

  // Get all stores (admin view)
  async getAllStoresAdmin(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.STORES, filters);
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

  // Get all ratings (admin view)
  async getAllRatingsAdmin(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.RATINGS, filters);
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
}

export default new AdminService();
