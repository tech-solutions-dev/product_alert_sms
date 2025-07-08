import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, USER_ROLES } from '../../utils/constants';
import axios from 'axios';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  role: yup.string().oneOf([USER_ROLES.ADMIN, USER_ROLES.USER]).required('Role is required'),
});

const UserForm = ({ initialData = null, onSuccess }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { name: '', email: '', role: USER_ROLES.USER },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (initialData) {
        await axios.put(API_ENDPOINTS.USER_BY_ID(initialData.id), data);
      } else {
        await axios.post(API_ENDPOINTS.USERS, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      reset();
      onSuccess && onSuccess();
    },
  });

  const onSubmit = (data) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          {...register('name')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          {...register('email')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Role</label>
        <select {...register('role')} className="border rounded px-3 py-2">
          <option value={USER_ROLES.USER}>User</option>
          <option value={USER_ROLES.ADMIN}>Admin</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Add User')}
      </button>
    </form>
  );
};

export default UserForm;
