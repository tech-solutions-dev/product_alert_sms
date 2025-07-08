import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const BackupList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['backups'],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.BACKUPS);
      return res.data;
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id) => {
      await axios.post(API_ENDPOINTS.RESTORE_BACKUP(id));
    },
    onSuccess: () => queryClient.invalidateQueries(['backups']),
  });

  if (isLoading) return <LoadingSpinner text="Loading backups..." />;
  if (error) return <div className="text-red-600">Failed to load backups.</div>;

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
          {data?.backups?.length === 0 && (
            <tr><td colSpan={3} className="text-center py-4">No backups found.</td></tr>
          )}
          {data?.backups?.map((backup) => (
            <tr key={backup.id} className="border-b">
              <td className="py-2">{backup.filename}</td>
              <td className="py-2">{new Date(backup.createdAt).toLocaleString()}</td>
              <td className="py-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => restoreMutation.mutate(backup.id)}
                  disabled={restoreMutation.isLoading}
                >
                  Restore
                </button>
                <a
                  href={backup.downloadUrl}
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
