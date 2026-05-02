import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // In production (Vercel), use backend Vercel URL
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://webthunghiepbackend.vercel.app/api';
  }
  // In development, use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    if (status === 401 && !requestUrl.includes('/auth/login')) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// User Services
export const userService = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  changeUserStatus: (id, data) => api.patch(`/users/${id}/status`, data),
};

// Product Services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Order Services
export const orderService = {
  getAllOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
};

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getRecentUsers: () => api.get('/dashboard/recent-users'),
};

export default api;
