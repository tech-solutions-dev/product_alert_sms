import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BackupList = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restoringId, setRestoringId] = useState(null);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.BACKUPS);
      setBackups(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err)
      setError('Failed to load backups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await api.post(API_ENDPOINTS.RESTORE_BACKUP(id));
      await fetchBackups();
    } catch (err) {
      console.error(err)
      setError('Failed to restore backup.');
    } finally {
      setRestoringId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading backups..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Backup History</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">File</th>
            <th className="py-2 text-left">Created At</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {backups.length === 0 && (
            <tr><td colSpan={3} className="text-center py-4">No backups found.</td></tr>
          )}
          {backups.map((backup) => (
            <tr key={backup.id} className="border-b">
              <td className="py-2">{backup.filePath}</td>
              <td className="py-2">{new Date(backup.createdAt).toLocaleString()}</td>
              <td className="py-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleRestore(backup.id)}
                  disabled={restoringId === backup.id}
                >
                  {restoringId === backup.id ? 'Restoring...' : 'Restore'}
                </button>
                <a
                  href={`${API_BASE_URL}/backups/${backup.downloadUrl}`}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  download
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackupList;
