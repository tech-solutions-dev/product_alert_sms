
import React from 'react';

const RecentProducts = ({ products = [] }) => {
  return (
    <div className="rounded-2xl bg-white/80 shadow-xl backdrop-blur-lg p-6 border border-slate-100 min-h-[260px] flex flex-col">
      <h3 className="text-lg font-bold text-indigo-700 mb-4 tracking-wide">Recently Added Products</h3>
      <ul className="flex-1 divide-y divide-slate-200">
        {products.length === 0 && <li className="text-gray-400 text-center py-8">No recent products.</li>}
        {products.map((prod) => (
          <li key={prod.id} className="flex justify-between items-center py-3 px-1 hover:bg-indigo-50/60 rounded transition-colors">
            <span className="font-medium text-gray-800 truncate max-w-[60%]">{prod.name}</span>
            <span className="text-xs text-gray-500 font-mono">{new Date(prod.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentProducts;
