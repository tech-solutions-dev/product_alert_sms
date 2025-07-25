import { useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

import { AlertCircle, RefreshCw } from 'lucide-react';
import ProductFilters from '../components/products/ProductFilters';
import { useProductFilters } from '../context/ProductFilterContext';
import ProductList from '../components/products/ProductList';

const Products = () => {
  const { filters, setFilters, categories, loading, error, fetchCategories } = useProductFilters();

  const handleRefresh = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <LoadingSpinner text="Loading product data..." />
    </div>
  );

  if (error) return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white/80 p-8 shadow-sm border border-slate-100">
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Failed to load data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ProductFilters 
        filters={filters} 
        setFilters={setFilters} 
        categories={categories}
        onRefresh={handleRefresh}
      />
      <ProductList filters={filters} />
    </>
  );
};

export default Products;