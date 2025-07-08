import React from 'react';
import { PRODUCT_STATUS } from '../../utils/constants';

const ProductFilters = ({ filters, setFilters, categories = [] }) => {
  return (
    <form className="flex gap-4 mb-4 flex-wrap">
      <input
        type="text"
        placeholder="Search by name..."
        value={filters.name || ''}
        onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
        className="border rounded px-3 py-2"
      />
      <select
        value={filters.categoryId || ''}
        onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))}
        className="border rounded px-3 py-2"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select
        value={filters.status || ''}
        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        className="border rounded px-3 py-2"
      >
        <option value="">All Statuses</option>
        <option value={PRODUCT_STATUS.FRESH}>Fresh</option>
        <option value={PRODUCT_STATUS.EXPIRING_SOON}>Expiring Soon</option>
        <option value={PRODUCT_STATUS.EXPIRED}>Expired</option>
      </select>
    </form>
  );
};

export default ProductFilters;
