import api from './api';

export const backupService = {
  getAll: async () => {
    // GET /api/backups
    const res = await api.get('/api/backups');
    return res.data;
  },
  create: async () => {
    // POST /api/backups/create
    const res = await api.post('/api/backups/create');
    return res.data;
  },
  restore: async (backupId) => {
    // POST /api/backups/restore/:backupId
    const res = await api.post(`/api/backups/restore/${backupId}`);
    return res.data;
  },
};
