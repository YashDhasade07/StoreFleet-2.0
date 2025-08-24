// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    TIMEOUT: 10000,
    HEADERS: {
      'Content-Type': 'application/json',
    }
  };
  
  // User Roles
  export const USER_ROLES = {
    SYSTEM_ADMIN: 'system_admin',
    NORMAL_USER: 'normal_user',
    STORE_OWNER: 'store_owner'
  };
  
  // API Endpoints
  export const API_ENDPOINTS = {
    // Auth
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me'
    },
    
    // Users
    USERS: {
      PROFILE: '/users/profile',
      PASSWORD: '/users/password',
      ALL: '/users',
      BY_ID: (id) => `/users/${id}`,
      CREATE: '/users',
      UPDATE: (id) => `/users/${id}`,
      DELETE: (id) => `/users/${id}`
    },
    
    // Stores
    STORES: {
      ALL: '/stores',
      SEARCH: '/stores/search',
      BY_ID: (id) => `/stores/${id}`,
      MY_STORE: '/stores/my/store',
      CREATE: '/stores',
      UPDATE: (id) => `/stores/${id}`,
      DELETE: (id) => `/stores/${id}`
    },
    
    // Ratings
    RATINGS: {
      SUBMIT: '/ratings',
      UPDATE: (id) => `/ratings/${id}`,
      DELETE: (id) => `/ratings/${id}`,
      MY_RATINGS: '/ratings/my',
      STORE_RATINGS: (storeId) => `/ratings/store/${storeId}`,
      ALL: '/ratings'
    },
    
    // Admin
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      STORES: '/admin/stores',
      RATINGS: '/admin/ratings'
    }
  };
  
  // Status Colors (Gmail-inspired)
  export const STATUS_COLORS = {
    SUCCESS: 'green',
    ERROR: 'red',
    WARNING: 'yellow',
    INFO: 'primary',
    NEUTRAL: 'gray'
  };
  
  // Rating Colors
  export const RATING_COLORS = {
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'primary',
    5: 'green'
  };
  