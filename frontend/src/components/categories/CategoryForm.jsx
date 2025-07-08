import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Category name must be at least 2 characters').required('Name is required'),
});

const CategoryForm = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post(API_ENDPOINTS.CATEGORIES, data);
    },
    onSuccess: () => {
      toast.success('Category added successfully!');
      queryClient.invalidateQueries(['categories']);
      reset();
    },
    onError: (error) => {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to add category');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-4 mb-4" autoComplete="off">
      <div>
        <label className="block mb-1 font-medium" htmlFor="category-name">Category Name</label>
        <input
          id="category-name"
          type="text"
          {...register('name')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          autoComplete="off"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={mutation.isLoading || isSubmitting}
      >
        {mutation.isLoading || isSubmitting ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  );
};

export default CategoryForm;
