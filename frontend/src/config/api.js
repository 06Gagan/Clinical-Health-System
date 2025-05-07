import axiosInstance from '../utils/axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const API_ENDPOINTS = {
  baseURL: API_BASE_URL,
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  // CRC endpoints
  crc: {
    list: '/crc',
    create: '/crc',
    update: (id) => `/crc/${id}`,
    delete: (id) => `/crc/${id}`,
  },
  // PI endpoints
  pi: {
    list: '/pi',
    create: '/pi',
    update: (id) => `/pi/${id}`,
    delete: (id) => `/pi/${id}`,
  },
  // Admin endpoints
  admin: {
    users: '/admin/users',
    stats: '/admin/stats',
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    throw error; // Error is already handled by axios interceptor
  }
};

export default API_ENDPOINTS; 