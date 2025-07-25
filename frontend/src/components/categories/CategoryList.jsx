import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuthContext } from '../../context/AuthContext';
import ConfirmDialog from '../common/ConfirmDialog';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, categoryId: null });
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get(API_ENDPOINTS.CATEGORIES);
        setCategories(res.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDeleteClick = (id) => {
    setConfirmDialog({
      open: true,
      categoryId: id
    });
  };

  const handleDelete = async () => {
    const id = confirmDialog.categoryId;
    setDeletingId(id);
    try {
      await api.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setError(null);
      toast.success('Category deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
      toast.error(err.message || 'Failed to delete category.');
    } finally {
      setDeletingId(null);
      setConfirmDialog({ open: false, categoryId: null });
    }
  };

  const handleUpdate = async (id, name) => {
    setUpdatingId(id);
    try {
      await api.put(API_ENDPOINTS.CATEGORY_BY_ID(id), { name });
      setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, name } : cat));
      setEditingId(null);
      setError(null);
      toast.success('Category updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update category.');
      toast.error(err.message || 'Failed to update category.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCategories = user && user.role !== 'admin' && user.categoryIds
    ? categories.filter(cat => user.categoryIds.includes(cat.id))
    : categories;

  if (loading) return <LoadingSpinner text="Loading categories..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Category List</h3>
      <ul>
        {filteredCategories.length === 0 && (
          <li className="text-gray-500">No categories found.</li>
        )}
        {filteredCategories.map((cat) => (
          <li key={cat.id} className="flex items-center gap-2 py-2 border-b last:border-b-0">
            {editingId === cat.id ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => handleUpdate(cat.id, editValue)}
                  disabled={updatingId === cat.id}
                >{updatingId === cat.id ? 'Saving...' : 'Save'}</button>
                <button
                  className="bg-gray-300 px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >Cancel</button>
              </>
            ) : (
              <>
                <span className="flex-1">{cat.name}</span>
                {user && user.role === 'admin' && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}
                    >Edit</button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteClick(cat.id)}
                      disabled={deletingId === cat.id}
                    >{deletingId === cat.id ? 'Deleting...' : 'Delete'}</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Category"
        message="Are you sure you want to delete this category? All products in this category will also be deleted."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ open: false, categoryId: null })}
      />
    </>
  );
};

export default CategoryList;
