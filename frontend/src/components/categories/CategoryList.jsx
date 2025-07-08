import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryList = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.CATEGORIES);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
    },
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      await axios.put(API_ENDPOINTS.CATEGORY_BY_ID(id), { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setEditingId(null);
    },
  });

  if (isLoading) return <LoadingSpinner text="Loading categories..." />;
  if (error) return <div className="text-red-600">Failed to load categories.</div>;

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Category List</h3>
      <ul>
        {data?.length === 0 && (
          <li className="text-gray-500">No categories found.</li>
        )}
        {data?.map((cat) => (
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
                  onClick={() => updateMutation.mutate({ id: cat.id, name: editValue })}
                >Save</button>
                <button
                  className="bg-gray-300 px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >Cancel</button>
              </>
            ) : (
              <>
                <span className="flex-1">{cat.name}</span>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}
                >Edit</button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteMutation.mutate(cat.id)}
                >Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CategoryList;
