import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_ENDPOINTS, USER_ROLES } from '../../utils/constants';
import api from '../../services/api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  role: yup.string().oneOf([USER_ROLES.ADMIN, USER_ROLES.USER]).required('Role is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').when('isNew', {
    is: true,
    then: (schema) => schema.required('Password is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  categoryIds: yup.array().of(yup.number()).min(1, 'Select at least one category'),
  isNew: yup.boolean().required()
});

const CategoryMultiSelect = ({ options = [], value = [], onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filtered = options.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) &&
    !value.includes(cat.id)
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const [highlight, setHighlight] = useState(0);
  useEffect(() => {
    if (!open) setHighlight(0);
  }, [open, search]);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      setHighlight((h) => (h + 1) % filtered.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlight((h) => (h - 1 + filtered.length) % filtered.length);
      e.preventDefault();
    } else if (e.key === 'Enter' && filtered[highlight]) {
      onChange([...value, filtered[highlight].id]);
      setSearch('');
      setHighlight(0);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Backspace' && search === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="relative min-w-[220px]">
      <div
        className={`flex flex-wrap items-center gap-1 px-2 py-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value.length === 0 && (
          <span className="text-gray-400 select-none">Select categories...</span>
        )}
        {value.map(id => {
          const cat = options.find(c => c.id === id);
          if (!cat) return null;
          return (
            <span key={id} className="flex items-center bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1">
              {cat.name}
              <button
                type="button"
                className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                onClick={e => { e.stopPropagation(); onChange(value.filter(v => v !== id)); }}
                aria-label={`Remove ${cat.name}`}
              >
                &times;
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[60px] border-none outline-none bg-transparent text-sm"
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search categories"
        />
      </div>
      {open && (
        <ul
          ref={dropdownRef}
          className="absolute z-20 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg"
          role="listbox"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-gray-400 select-none">No categories found</li>
          )}
          {filtered.map((cat, idx) => (
            <li
              key={cat.id}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50 ${highlight === idx ? 'bg-blue-100' : ''}`}
              onClick={() => {
                onChange([...value, cat.id]);
                setSearch('');
                setHighlight(0);
              }}
              onMouseEnter={() => setHighlight(idx)}
              role="option"
              aria-selected={false}
            >
              <input
                type="checkbox"
                checked={value.includes(cat.id)}
                readOnly
                className="mr-2 accent-blue-600"
              />
              {cat.name}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const UserForm = ({ initialData = null, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);

  const isNew = !initialData;

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      role: USER_ROLES.USER,
      password: '',
      isNew: true,
      categoryIds: []
    }
  });

  useEffect(() => {
    setValue('categoryIds', categoryIds);
  }, [categoryIds, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.CATEGORIES);
        setCategories(res.data || []);
      } catch (err) {
        toast.error('Failed to load categories');
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        password: '000000', // Set dummy password for validation
        isNew: false,
        categoryIds: initialData.categories?.map(c => c.id) || []
      });
      setCategoryIds(initialData.categories?.map(c => c.id) || []);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        categoryIds: data.categoryIds
      };

      // Only include password if it's a new user or if password field has value (and not the dummy)
      if (isNew) {
        payload.password = data.password;
      } else if (data.password && data.password !== '000000') {
        payload.password = data.password;
      }

      if (initialData) {
        await api.put(`${API_ENDPOINTS.USER_BY_ID(initialData.id)}`, payload);
        toast.success('User updated successfully!');
      } else {
        await api.post(API_ENDPOINTS.USERS, payload);
        toast.success('User added successfully!');
      }

      reset();
      setCategoryIds([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save user';
      toast.error(errorMsg);
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
      {isNew ? (
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register('password')}
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
      ) : (
        // Hidden password field with dummy value for validation
        <input type="hidden" {...register('password')} value="000000" />
      )}
      <div>
        <label className="block mb-1 font-medium">Categories</label>
        <CategoryMultiSelect
          options={categories}
          value={categoryIds}
          onChange={setCategoryIds}
          error={errors.categoryIds?.message}
        />
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