import React from 'react';
import { useState, useEffect } from 'react';
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
import { Link } from 'react-router';
import ExpiryChart from '../components/dashboard/ExpiryChart';
import RecentProducts from '../components/dashboard/RecentProducts';
import { useAuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/dashboard');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <div className="text-red-600">Failed to load dashboard.</div>;

  const stats = dashboardData || {};
  const chartData = dashboardData?.expiryStats || {};
  const recentProducts = user && user.role !== 'admin' && user.categoryIds
    ? (dashboardData?.recentProducts || []).filter(p => user.categoryIds.includes(p.categoryId))
    : dashboardData?.recentProducts || [];
  const categories = user && user.role !== 'admin' && user.categoryIds
    ? (stats.categories || []).filter(cat => user.categoryIds.includes(cat.id))
    : stats.categories || [];
  const users = stats.users || [];

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
        {user && user.role === 'admin' && users.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-700 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" /> Users ({users.length})
              <Link to="/users" className="ml-auto text-sm text-orange-600 underline">Manage Users</Link>
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {users.slice(0, 10).map(u => (
                <li key={u.id} className="bg-orange-50 text-orange-800 rounded px-3 py-2 text-sm font-medium flex items-center gap-2">
                  <span className="font-bold">{u.name}</span>
                  <span className="text-xs text-gray-500">({u.role})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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