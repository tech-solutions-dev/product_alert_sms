import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, USER_ROLES } from '../../utils/constants';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const UserList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.USERS);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (user) => {
      await axios.delete(API_ENDPOINTS.USER_BY_ID(user.id));
    },
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleEdit = (user) => {
    // Implement edit modal logic or pass to parent
    alert('Edit user: ' + user.name);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      deleteMutation.mutate(user);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <div className="text-red-600">Failed to load users.</div>;

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">User List</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Name</th>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.length === 0 && (
            <tr><td colSpan={4} className="text-center py-4">No users found.</td></tr>
          )}
          {data?.users?.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(user)}
                >Edit</button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(user)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
