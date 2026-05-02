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
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
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
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/user/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
};

// Payment Services
export const paymentService = {
  createVNPayPayment: (data) => api.post('/payments/vnpay/create', data),
  createMoMoPayment: (data) => api.post('/payments/momo/create', data),
  createCODPayment: (data) => api.post('/payments/cod/create', data),
  getPaymentDetails: (id) => api.get(`/payments/${id}`),
};

// Chat Services
export const chatService = {
  getChatSession: () => api.get('/chat/session'),
  sendMessage: (data) => api.post('/chat/send', data),
  getChatHistory: () => api.get('/chat/history'),
  closeChat: (chatId) => api.patch(`/chat/${chatId}/close`),
};

// User Services
export const userService = {
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
};

export default api;
