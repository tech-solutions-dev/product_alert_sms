import React from 'react';
import { PRODUCT_STATUS } from '../../utils/constants';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  // Get ordinal suffix
  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinal(day)} ${month}, ${year}`;
};

const statusColors = {
  [PRODUCT_STATUS.FRESH]: 'bg-green-100 text-green-700',
  [PRODUCT_STATUS.EXPIRING_SOON]: 'bg-yellow-100 text-yellow-700',
  [PRODUCT_STATUS.EXPIRED]: 'bg-red-100 text-red-700',
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  console.log(!!onEdit, !!onDelete);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">{product.name}</h4>
        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[product.status]}`}>{product.status}</span>
      </div>
      <div className="text-sm text-gray-600">Category: {product.Category?.name || 'N/A'}</div>
      <div className="text-sm text-gray-600">Expiry: {formatDate(product.expiryDate)}</div>
      <div className="flex gap-2 mt-2">
        {onEdit && (
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => onEdit(product)}>Edit</button>
        )}
        {onDelete && (
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onDelete(product)}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
