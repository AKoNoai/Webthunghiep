import { create } from 'zustand';
import { authService } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  register: async (fullName, email, phone, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({
        fullName,
        email,
        phone,
        password,
        confirmPassword,
      });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  getCurrentUser: async () => {
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message });
      throw error;
    }
  },
}));

export default useAuthStore;
