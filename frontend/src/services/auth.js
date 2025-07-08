import api from './api';

export const authService = {
  login: async (email, password) => {
    return await api.post('/api/auth/login', { email, password });
  },

  register: async (userData) => {
    return await api.post('/api/auth/register', userData);
  },

  getProfile: async () => {
    return await api.get('/api/auth/profile');
  },

  updateProfile: async (userData) => {
    return await api.put('/api/auth/profile', userData);
  }
};