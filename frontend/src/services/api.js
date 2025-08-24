import axios from 'axios';
import { API_CONFIG } from '../utils/constants.js';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common responses
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    // Handle common error scenarios
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Handle 401 - Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 - Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access denied:', errorMessage);
    }
    
    // Return structured error
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
  }
);

// API helper functions
export const api = {
  // GET request
  get: (url, params = {}) => {
    return apiClient.get(url, { params });
  },
  
  // POST request
  post: (url, data = {}) => {
    return apiClient.post(url, data);
  },
  
  // PUT request
  put: (url, data = {}) => {
    return apiClient.put(url, data);
  },
  
  // DELETE request
  delete: (url) => {
    return apiClient.delete(url);
  }
};

export default api;
