import api from './api';

export const categoryService = {
  getAll: async () => {
    // GET /api/categories
    const res = await api.get('/api/categories');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/categories/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/categories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/categories/${id}`);
    return res.data;
  },
};
