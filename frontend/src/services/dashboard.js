import api from './api';

export const dashboardService = {
  getOverview: async () => {
    // GET /api/dashboard
    const res = await api.get('/api/dashboard');
    // Expected response: { summary: {...}, expiryStatus: {...}, recentProducts: [...] }
    return res.data;
  },
};
