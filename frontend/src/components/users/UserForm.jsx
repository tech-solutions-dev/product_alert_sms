


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_ENDPOINTS, USER_ROLES } from '../../utils/constants';
import api from '../../services/api';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  role: yup.string().oneOf([USER_ROLES.ADMIN, USER_ROLES.USER]).required('Role is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').when('isNew', {
    is: true,
    then: yup.string().required('Password is required'),
    otherwise: yup.string()
  }),
  categoryIds: yup.array().of(yup.number()).min(1, 'Select at least one category'),
});

const UserForm = ({ initialData = null, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const isNew = !initialData;

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      role: initialData.role,
      categoryIds: initialData.categories ? initialData.categories.map(c => c.id) : [],
      password: '',
      isNew: false
    } : {
      name: '',
      email: '',
      role: USER_ROLES.USER,
      categoryIds: [],
      password: '',
      isNew: true
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.CATEGORIES);
        setCategories(res.data || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        categoryIds: data.categoryIds,
      };
      if (isNew) payload.password = data.password;
      if (initialData) {
        await axios.put(API_ENDPOINTS.USER_BY_ID(initialData.id), payload);
      } else {
        await axios.post(API_ENDPOINTS.USERS, payload);
      }
      reset();
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      {isNew && (
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register('password')}
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
      )}
      <div>
        <label className="block mb-1 font-medium">Categories</label>
        <select
          {...register('categoryIds')}
          multiple
          className="border rounded px-3 py-2 min-w-[180px]"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryIds && <p className="text-red-500 text-sm mt-1">{errors.categoryIds.message}</p>}
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
