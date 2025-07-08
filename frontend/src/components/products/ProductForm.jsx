import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  categoryId: yup.string().required('Category is required'),
  expiryDate: yup.date().required('Expiry date is required'),
});

const ProductForm = ({ initialData = null, onSuccess }) => {
  const queryClient = useQueryClient();
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await axios.get(API_ENDPOINTS.CATEGORIES)).data,
  });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { name: '', categoryId: '', expiryDate: '' },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (initialData) {
        await axios.put(API_ENDPOINTS.PRODUCT_BY_ID(initialData.id), data);
      } else {
        await axios.post(API_ENDPOINTS.PRODUCTS, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      reset();
      onSuccess && onSuccess();
    },
  });

  const onSubmit = (data) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-4">
      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          {...register('name')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          {...register('categoryId')}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {catData?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Expiry Date</label>
        <input
          type="date"
          {...register('expiryDate')}
          className="border rounded px-3 py-2"
        />
        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Add Product')}
      </button>
    </form>
  );
};

export default ProductForm;
