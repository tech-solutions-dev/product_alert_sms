import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';

const BackupManager = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      await axios.post(API_ENDPOINTS.CREATE_BACKUP);
    },
    onSuccess: () => queryClient.invalidateQueries(['backups']),
  });

  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => mutate()}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Backup...' : 'Create New Backup'}
      </button>
      {isSuccess && <span className="text-green-600">Backup created!</span>}
      {isError && <span className="text-red-600">Failed to create backup.</span>}
    </div>
  );
};

export default BackupManager;
