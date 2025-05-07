import axios from 'axios';
import API_ENDPOINTS from '../config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_ENDPOINTS.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post(API_ENDPOINTS.auth.login, credentials),
  register: (userData) => api.post(API_ENDPOINTS.auth.register, userData),
  logout: () => api.post(API_ENDPOINTS.auth.logout),
};

// CRC services
export const crcService = {
  list: () => api.get(API_ENDPOINTS.crc.list),
  create: (data) => api.post(API_ENDPOINTS.crc.create, data),
  update: (id, data) => api.put(API_ENDPOINTS.crc.update(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.crc.delete(id)),
};

// PI services
export const piService = {
  list: () => api.get(API_ENDPOINTS.pi.list),
  create: (data) => api.post(API_ENDPOINTS.pi.create, data),
  update: (id, data) => api.put(API_ENDPOINTS.pi.update(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.pi.delete(id)),
};

// Admin services
export const adminService = {
  getUsers: () => api.get(API_ENDPOINTS.admin.users),
  getStats: () => api.get(API_ENDPOINTS.admin.stats),
};

export default api; 