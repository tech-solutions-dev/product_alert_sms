import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  DownloadCloud, 
  FileText, 
  TrendingUp, 
  RefreshCw,
  Calendar,
  ChevronUp,
  ChevronDown,
  Filter,
  Package
} from 'lucide-react';
import api from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

// Local date formatter with time
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate days until expiry
const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Status badge component with color coding
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'expiring soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'healthy':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Simple Card component
const Card = ({ title, value, color }) => (
  <div className={`rounded-lg shadow p-4 flex flex-col items-center bg-white border-t-4 ${color || 'border-blue-600'}`}>
    <div className="text-lg font-semibold text-gray-700 mb-1">{title}</div>
    <div className="text-2xl font-bold text-blue-600">{value}</div>
  </div>
);

// Simple Table component
const Table = ({ columns, data, loading, emptyMessage }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border rounded shadow">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col, idx) => (
            <th key={idx} className="px-3 py-2 text-left text-sm font-semibold text-gray-700">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={columns.length} className="text-center py-4">Loading...</td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={columns.length} className="text-center py-4">{emptyMessage}</td></tr>
        ) : (
          data.map((row, i) => (
            <tr key={i} className="border-b">
              {columns.map((col, j) => (
                <td key={j} className="px-3 py-2 text-sm text-gray-700">{
                  typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]
                }</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Reports = () => {
  const [overview, setOverview] = useState({
    totalProducts: 0,
    expiredProducts: 0,
    expiringSoon: 0,
    healthyProducts: 0,
    topCategories: [],
    topUsers: [],
    warnings: [],
    suggestions: [],
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('expiryDate'); // 'expiryDate', 'name', 'category'
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'expired', 'expiring', 'healthy'
  const [dismissedWarnings, setDismissedWarnings] = useState([]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Product Name', 'Category', 'Expiry Date','Year','Time', 'Status', 'Days Until Expiry', 'Last Updated By'],
      ...products.map(p => [
        p.name,
        p.category?.name,
        formatDate(p.expiryDate),
        p.status,
        getDaysUntilExpiry(p.expiryDate),
        p.lastReportedBy
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(API_ENDPOINTS.REPORTS);
      setOverview(res.data.overview || {});
      
      let filteredProducts = [...(res.data.products || [])];
      
      // Apply status filter
      if (filterStatus !== 'all') {
        filteredProducts = filteredProducts.filter(p => 
          p.status.toLowerCase() === filterStatus
        );
      }

      // Apply sorting
      filteredProducts.sort((a, b) => {
        let compareA = sortBy === 'expiryDate' ? new Date(a[sortBy]) : a[sortBy];
        let compareB = sortBy === 'expiryDate' ? new Date(b[sortBy]) : b[sortBy];
        
        if (sortBy === 'category') {
          compareA = a.category?.name || '';
          compareB = b.category?.name || '';
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortBy, sortOrder, filterStatus]);

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Inventory Reports - Product Expiry Tracker</title>
      </Helmet>

      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Health & Reports</h1>
            <p className="text-blue-100">Comprehensive overview of your inventory status and expiry tracking</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">Total Items: {overview.totalProducts || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">Last Updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <DownloadCloud className="w-4 h-4" />
              Export CSV
            </button>

          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Filter & Sort</h2>
              <p className="text-sm text-gray-500 mt-1">Customize your view</p>
            </div>
          </div>
          
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all transform hover:scale-[1.02]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-600 mb-2">Status Filter</label>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg border-2 border-blue-100 py-2.5 pl-4 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white hover:border-blue-200 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="expired">Expired Products</option>
                <option value="expiring soon">Expiring Soon</option>
                <option value="healthy">Healthy Products</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-600 mb-2">Sort Products By</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border-2 border-blue-100 py-2.5 pl-4 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white hover:border-blue-200 transition-all"
              >
                <option value="expiryDate">Expiry Date</option>
                <option value="name">Product Name</option>
                <option value="category">Category</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-600 mb-2">Sort Order</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border-2 border-blue-100 bg-white hover:border-blue-200 transition-all text-gray-700 group-hover:shadow-sm"
            >
              <span className="flex items-center gap-2">
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </span>
              <div className="transition-transform duration-200">
                {sortOrder === 'asc' ? 
                  <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                }
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-12 bg-white/80 rounded-2xl border border-gray-100 shadow-lg backdrop-blur-sm">
          <LoadingSpinner text="Analyzing inventory data..." />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 shadow-lg">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-1">Error Loading Reports</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Warnings & Alerts */}
          {overview.warnings && overview.warnings.length > 0 && (
            <div className="space-y-3">
              {overview.warnings
                .filter(w => !dismissedWarnings.includes(w.message))
                .map((w, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl shadow-lg flex items-start gap-4 backdrop-blur-sm ${
                    w.type === 'critical'
                      ? 'bg-red-50/90 border border-red-200'
                      : 'bg-yellow-50/90 border border-yellow-200'
                  }`}
                >
                  <AlertCircle className={`w-6 h-6 flex-shrink-0 ${
                    w.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold mb-1 ${
                        w.type === 'critical' ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        {w.type === 'critical' ? 'Critical Alert' : 'Warning'}
                      </h3>
                      <button
                        onClick={() => setDismissedWarnings(prev => [...prev, w.message])}
                        className={`p-1 rounded-full hover:bg-white/50 transition-colors ${
                          w.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <p className={
                      w.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                    }>
                      {w.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Total
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-blue-700">{overview.totalProducts || 0}</h3>
                <p className="text-sm text-blue-600">Total Products</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <span className="text-xs font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  Critical
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-red-700">{overview.expiredProducts || 0}</h3>
                <p className="text-sm text-red-600">Expired Products</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                  Warning
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-yellow-700">{overview.expiringSoon || 0}</h3>
                <p className="text-sm text-yellow-600">Expiring Soon</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-green-600" />
                <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Good
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-green-700">{overview.healthyProducts || 0}</h3>
                <p className="text-sm text-green-600">Healthy Products</p>
              </div>
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Categories at Risk</h2>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  Top {overview.topCategories?.length || 0}
                </span>
              </div>
              {overview.topCategories?.length > 0 ? (
                <div className="space-y-4">
                  {overview.topCategories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{
                              width: `${(cat.count / Math.max(...overview.topCategories.map(c => c.count))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <span className="text-gray-700 font-medium">{cat.name}</span>
                        <span className="text-sm font-bold text-purple-600">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No category data available</p>
                </div>
              )}
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Action Items</h2>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {overview.suggestions?.length || 0} Suggestions
                </span>
              </div>
              <div className="space-y-4">
                {overview.suggestions?.length > 0 ? (
                  overview.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-700">{suggestion}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No suggestions available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Products Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Package className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Detailed Inventory Status</h2>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  {products.length} Items
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Days Left
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-lg">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <p className="text-gray-500 text-sm">No products found matching the current filters</p>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{product.category?.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{formatDate(product.expiryDate)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={product.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">
                              {getDaysUntilExpiry(product.expiryDate)} days
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{product.lastReportedBy}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;