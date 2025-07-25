import api from './api';

export const backupService = {
  getAll: async () => {
    const res = await api.get('/api/backups');
    return res.data;
  },
  create: async () => {
    const res = await api.post('/api/backups/create');
    return res.data;
  },
  restore: async (backupId) => {
    // POST /api/backups/restore/:backupId
    const res = await api.post(`/api/backups/restore/${backupId}`);
    return res.data;
  },
};
