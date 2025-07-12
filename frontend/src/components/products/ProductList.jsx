import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../services/api';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductModal from './ProductModal';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductList = ({ filters = {} }) => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.PRODUCTS, { params: filters });
      setProducts(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSuccess = async () => {
    await fetchProducts(filters);
    handleModalClose();
    toast.success(selectedProduct ? 'Product updated!' : 'Product added!');
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Delete product "${product.name}"?`)) {
      setDeletingId(product.id);
      try {
        await api.delete(API_ENDPOINTS.PRODUCT_BY_ID(product.id));
        setProducts(prev => prev.filter(p => p.id !== product.id));
        toast.success('Product deleted successfully');
      } catch {
        setError('Failed to delete product.');
        toast.error('Failed to delete product');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <LoadingSpinner text="Loading products..." />
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center py-12 bg-white/80 rounded-2xl border border-slate-100">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <div className="text-red-500 font-medium mb-4">{error}</div>
    </div>
  );


  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
      </div>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white/80 rounded-2xl border border-slate-100 text-center">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deletingId === product.id}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ProductModal
          open={modalOpen}
          product={selectedProduct}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default ProductList;