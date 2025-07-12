
import React, { useEffect, useState } from 'react';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data || []);
        setError(null);
      } catch (err) {
        console.error(err)
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <LoadingSpinner text="Loading categories..." />;
  if (error) return <div className="text-red-600">Failed to load categories.</div>;

  return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white/80 shadow-2xl backdrop-blur-2xl p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg mb-1">Categories</h2>
          <p className="text-base text-gray-500">Manage your product categories</p>
        </div>
        <div className="space-y-8 w-full">
          <div className="rounded-2xl bg-white/90 shadow-lg p-6 border border-slate-100 backdrop-blur-md">
            <CategoryForm onSuccess={() => {}} />
          </div>
          <div className="rounded-2xl bg-white/90 shadow-lg p-6 border border-slate-100 backdrop-blur-md">
            <CategoryList categories={categories} />
          </div>
        </div>
      </div>
  );
};

export default Categories;
