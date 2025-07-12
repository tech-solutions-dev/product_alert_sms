import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../services/api';

const BackupManager = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateBackup = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await api.post(API_ENDPOINTS.CREATE_BACKUP);
      setSuccess(true);
    } catch (err) {
      console.error(err)
      setError('Failed to create backup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCreateBackup}
        disabled={loading}
      >
        {loading ? 'Creating Backup...' : 'Create New Backup'}
      </button>
      {success && <span className="text-green-600">Backup created!</span>}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
};

export default BackupManager;
