import React from 'react';
import { PRODUCT_STATUS } from '../../utils/constants';
import { Filter, Search, RefreshCw } from 'lucide-react';

const ProductFilters = ({ filters, setFilters, categories = [], onRefresh }) => {
  const handleReset = () => {
    setFilters({});
    onRefresh();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">Filter Products</h3>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.name || ''}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <select
            value={filters.categoryId || ''}
            onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))}
            className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            value={filters.status || ''}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value={PRODUCT_STATUS.FRESH}>Fresh</option>
            <option value={PRODUCT_STATUS.EXPIRING_SOON}>Expiring Soon</option>
            <option value={PRODUCT_STATUS.EXPIRED}>Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
