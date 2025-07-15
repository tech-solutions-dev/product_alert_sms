import React, { useState } from 'react';

const UserList = ({ users, onEdit, onDelete, error }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (user) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      setDeletingId(user.id);
      try {
        await onDelete(user.id);
      } catch {
        // Error is handled by parent component
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">User List</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Name</th>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Role</th>
            <th className="py-2 text-left">Categories</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2 capitalize">{user.role.toLowerCase()}</td>
                <td className="py-2">
                  {user.categories?.length > 0 ? (
                    <ul className="flex flex-wrap gap-1">
                      {user.categories.map(cat => (
                        <li 
                          key={cat.id} 
                          className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium"
                        >
                          {cat.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="py-2 flex justify-end gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDelete(user)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;