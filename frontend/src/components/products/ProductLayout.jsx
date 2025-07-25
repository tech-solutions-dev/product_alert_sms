import React, { useState } from 'react';
import { ProductFilterProvider, useProductFilters } from '../../context/ProductFilterContext';
import { Outlet, useNavigate } from 'react-router';
import { Plus, Package, Download, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductLayoutContent = () => {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const { filters } = useProductFilters();
  const { user } = useAuthContext();

  const handleDownloadReport = async () => {
    const toastId = toast.loading('Generating report...', {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    });
    
    try {
      setDownloading(true);
      const response = await api.post('/api/reports/products', filters, {
        responseType: 'blob',
      });

      if (response.headers['content-type'] === 'application/pdf') {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products-report.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully!', { id: toastId });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

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
          <div className="flex gap-2">
          {user && user.role === 'admin' && (
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-blue-500 text-white rounded-lg hover:from-green-700 hover:to-blue-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              Download Report
            </button>)}
            {user && user.role === 'admin' && (
              <button
                onClick={() => navigate('/products/add')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-600 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

const ProductLayout = () => (
  <ProductFilterProvider>
    <ProductLayoutContent />
  </ProductFilterProvider>
);

export default ProductLayout;
