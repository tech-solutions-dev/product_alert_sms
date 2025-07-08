import api from './api';

export const userService = {
  getAll: async () => {
    // GET /api/users
    const res = await api.get('/api/users');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  },
};
