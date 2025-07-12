import React from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Plus, Package } from 'lucide-react';

const ProductLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="rounded-3xl bg-white/80 shadow-2xl backdrop-blur-2xl p-8 sm:p-10 border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100/50 text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Product Catalog
              </h1>
              <p className="text-gray-500">Manage your product inventory</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/products/add')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-600 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProductLayout;
