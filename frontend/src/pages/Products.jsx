
import React, { useState } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductFilters from '../components/products/ProductFilters';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Products = () => {
  const [filters, setFilters] = useState({});
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
  });
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  if (isLoading) return <LoadingSpinner text="Loading products..." />;
  if (error) return <div className="text-red-600">Failed to load products.</div>;

  return (
      <div className="w-full max-w-3xl mx-auto rounded-3xl bg-white/80 shadow-2xl backdrop-blur-2xl p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg mb-1">Products</h2>
          <p className="text-base text-gray-500">Manage your products and inventory</p>
        </div>
        <div className="space-y-8">
          <ProductFilters filters={filters} setFilters={setFilters} categories={categories || []} />
          <ProductForm categories={categories || []} onSuccess={() => {}} />
          <ProductList products={products || []} />
        </div>
      </div>
  );
};

export default Products;
