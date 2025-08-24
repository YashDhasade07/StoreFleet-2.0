import { api } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class StoreService {
  // Get all stores
  async getAllStores(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.STORES.ALL, filters);
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

  // Search stores
  async searchStores(searchParams = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.STORES.SEARCH, searchParams);
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

  // Get store by ID
  async getStoreById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.STORES.BY_ID(id));
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

  // Store Owner: Get my store
  async getMyStore() {
    try {
      const response = await api.get(API_ENDPOINTS.STORES.MY_STORE);
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

  // Admin: Create store
  async createStore(storeData) {
    try {
      const response = await api.post(API_ENDPOINTS.STORES.CREATE, storeData);
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

  // Admin: Update store
  async updateStore(id, storeData) {
    try {
      const response = await api.put(API_ENDPOINTS.STORES.UPDATE(id), storeData);
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

  // Admin: Delete store
  async deleteStore(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.STORES.DELETE(id));
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

export default new StoreService();
