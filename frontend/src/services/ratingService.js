import { api } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class RatingService {
  // Submit rating
  async submitRating(ratingData) {
    try {
      const response = await api.post(API_ENDPOINTS.RATINGS.SUBMIT, ratingData);
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

  // Update rating
  async updateRating(id, ratingData) {
    try {
      const response = await api.put(API_ENDPOINTS.RATINGS.UPDATE(id), ratingData);
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

  // Delete rating
  async deleteRating(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.RATINGS.DELETE(id));
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

  // Get my ratings
  async getMyRatings(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.RATINGS.MY_RATINGS, filters);
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

  // Get store ratings
  async getStoreRatings(storeId, filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.RATINGS.STORE_RATINGS(storeId), filters);
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

  // Admin: Get all ratings
  async getAllRatings(filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.RATINGS.ALL, filters);
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

export default new RatingService();
