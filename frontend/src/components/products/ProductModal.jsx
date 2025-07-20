import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../services/api';
import { X, Loader2 } from 'lucide-react';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  categoryId: yup.string().required('Category is required'),
  expiryDate: yup.date().required('Expiry date is required'),
  barcode: yup.string().required('Barcode is required'),
});

const ProductModal = ({ open, onClose, product, onSuccess }) => {
  const [catData, setCatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');

  const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: product || { name: '', categoryId: '', expiryDate: '', barcode: '' },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.CATEGORIES);
        setCatData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      const formattedProduct = {
        ...product,
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().slice(0, 10) : '',
        categoryId: product.categoryId || '',
        barcode: product.barcode || '',
      };
      reset(formattedProduct);
      setScannedBarcode(product.barcode || '');
    } else {
      reset({ name: '', categoryId: '', expiryDate: '', barcode: '' });
      setScannedBarcode('');
    }
  }, [product, reset]);

  // Form submission (edit only)
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.put(API_ENDPOINTS.PRODUCT_BY_ID(product.id), data);
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual barcode input
  const handleManualBarcodeChange = (e) => {
    const value = e.target.value;
    setScannedBarcode(value);
    setValue('barcode', value, { shouldValidate: true });
  };

  if (!open) return null;

  return (
    <>
      {/* Main Modal (Edit Only) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Product</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                {...register('categoryId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {catData?.map(cat => (
                  <option key={cat.id} value={cat.id} selected={cat.id === product.categoryId}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>

            {/* Expiry Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                {...register('expiryDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>}
            </div>

            {/* Barcode Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <input
                type="text"
                {...register('barcode')}
                value={scannedBarcode}
                onChange={handleManualBarcodeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter barcode"
                disabled
              />
              {errors.barcode && <p className="mt-1 text-sm text-red-600">{errors.barcode.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update Product'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductModal;