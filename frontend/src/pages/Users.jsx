
import React from 'react';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';



const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data || []);
      setError(null);
    } catch {
      setError('Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handles add, edit, delete
  const handleSuccess = async () => {
    await fetchUsers();
    setShowForm(false);
  };

  if (user?.role !== USER_ROLES.ADMIN) {
    return <div className="text-red-600">Access denied. Admins only.</div>;
  }
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Manage Users</h2>
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>
      {showForm && (
        <UserForm onSuccess={handleSuccess} />
      )}
      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <UserList users={users} setUsers={setUsers} setError={setError} onSuccess={handleSuccess} />
      )}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default Users;
