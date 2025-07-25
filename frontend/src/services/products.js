import api from './api';

export const productService = {
  getAll: async (filters = {}) => {
    const res = await api.get('/api/products', { params: filters });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/api/products', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/products/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  },
};
