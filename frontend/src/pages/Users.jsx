import React from 'react';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import Modal from '../components/common/Modal';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccess = async () => {
    await fetchUsers();
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      setError('Failed to delete user.');
    }
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
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditingUser(null); }}>
        <div className="p-4 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
          <UserForm initialData={editingUser} onSuccess={handleSuccess} />
        </div>
      </Modal>
      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <UserList 
          users={users} 
          onEdit={handleEditUser} 
          onDelete={handleDeleteUser} 
          error={error}
        />
      )}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default Users;