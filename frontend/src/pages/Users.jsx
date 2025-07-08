
import React from 'react';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/users';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Users = () => {
  const { user } = useAuth();
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
  if (user?.role !== USER_ROLES.ADMIN) {
    return <div className="text-red-600">Access denied. Admins only.</div>;
  }
  if (isLoading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <div className="text-red-600">Failed to load users.</div>;
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-2">
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white/80 shadow-2xl backdrop-blur-2xl p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg mb-1">User Management</h2>
          <p className="text-base text-gray-500">Manage application users and permissions</p>
        </div>
        <div className="space-y-8">
          <UserForm onSuccess={() => {}} />
          <UserList users={users || []} />
        </div>
      </div>
    </div>
  );
};

export default Users;
