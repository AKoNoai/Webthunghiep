import { create } from 'zustand';
import { authService } from '../services/api';

const useAdminAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      
      // Only allow admin users
      if (response.data.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      localStorage.setItem('adminToken', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  getCurrentUser: async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data.role !== 'admin') {
        throw new Error('Admin access required');
      }
      set({ user: response.data });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message });
      throw error;
    }
  },
}));

export default useAdminAuthStore;
