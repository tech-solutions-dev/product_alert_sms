import api from './api';

export const reportService = {
  getAll: async () => {
    // GET /api/reports
    const res = await api.get('/api/reports');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/api/reports/${id}`);
    return res.data;
  },
  generate: async (type) => {
    // POST /api/reports/generate
    const res = await api.post('/api/reports/generate', { type });
    return res.data;
  },
};
