import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  Archive
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DashboardStats from '../components/dashboard/DashboardStats';
import ExpiryChart from '../components/dashboard/ExpiryChart';
import RecentProducts from '../components/dashboard/RecentProducts';

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard');
      return response.data;
    },
  });

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <div className="text-red-600">Failed to load dashboard.</div>;

  const stats = dashboardData || {};
  const chartData = dashboardData?.expiryStats || {};
  const recentProducts = dashboardData?.recentProducts || [];
  const categories = stats.categories || [];

  return (
    <>
      <Helmet>
        <title>Dashboard - ExpireTracker</title>
      </Helmet>

      <div className="space-y-10">
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-blue-800">Dashboard</h2>
        <DashboardStats stats={stats} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ExpiryChart data={chartData} />
          <RecentProducts products={recentProducts} />
        </div>
        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
            <Archive className="w-5 h-5 text-purple-500" /> Categories ({categories.length})
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map(cat => (
              <li key={cat.id} className="bg-purple-50 text-purple-800 rounded px-3 py-2 text-sm font-medium flex items-center gap-2">
                <span className="font-bold">{cat.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;