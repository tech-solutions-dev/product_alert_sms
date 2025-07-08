import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductList = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.PRODUCTS, { params: filters });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (product) => {
      await axios.delete(API_ENDPOINTS.PRODUCT_BY_ID(product.id));
    },
    onSuccess: () => queryClient.invalidateQueries(['products']),
  });

  const handleEdit = (product) => {
    // Implement edit modal logic or pass to parent
    alert('Edit product: ' + product.name);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Delete product "${product.name}"?`)) {
      deleteMutation.mutate(product);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading products..." />;
  if (error) return <div className="text-red-600">Failed to load products.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.length === 0 && <div className="text-gray-500">No products found.</div>}
      {data?.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ProductList;
