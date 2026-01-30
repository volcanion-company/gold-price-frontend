import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/api/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { name: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      set({ user, token: tokens.accessToken, isAuthenticated: true });

      // Redirect to intended page
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      set({ user, token: tokens.accessToken, isAuthenticated: true });

      window.location.href = '/';
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/';
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({
        user: response.data.data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      // Token might be expired, try to refresh
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await api.post('/auth/refresh', { refreshToken });
            const newAccessToken = refreshResponse.data.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Retry getting user
            const retryResponse = await api.get('/auth/me');
            set({
              user: retryResponse.data.data,
              token: newAccessToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          } catch (refreshError) {
            // Refresh failed, clear everything
          }
        }
      }
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      const updatedUser = response.data.data;
      set({ user: updatedUser });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  },
}));
