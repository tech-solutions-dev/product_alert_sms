

import React from 'react';
import { Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const statCards = [
  {
    label: 'Total Products',
    key: 'totalProducts',
    icon: <Package className="text-blue-500" size={28} />,
    gradient: 'from-blue-400/30 to-blue-100/60',
    ring: 'ring-blue-200',
    text: 'text-blue-700',
  },
  {
    label: 'Fresh',
    key: 'freshProducts',
    icon: <CheckCircle className="text-green-500" size={28} />,
    gradient: 'from-green-400/30 to-green-100/60',
    ring: 'ring-green-200',
    text: 'text-green-700',
  },
  {
    label: 'Expiring Soon',
    key: 'expiringSoon',
    icon: <AlertTriangle className="text-yellow-500" size={28} />,
    gradient: 'from-yellow-400/30 to-yellow-100/60',
    ring: 'ring-yellow-200',
    text: 'text-yellow-700',
  },
  {
    label: 'Expired',
    key: 'expired',
    icon: <XCircle className="text-red-500" size={28} />,
    gradient: 'from-red-400/30 to-red-100/60',
    ring: 'ring-red-200',
    text: 'text-red-700',
  },
];

const DashboardStats = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {statCards.map(card => (
        <div
          key={card.key}
          className={`group flex flex-col items-center justify-center bg-gradient-to-br ${card.gradient} rounded-3xl shadow-xl p-7 border border-slate-100 backdrop-blur-md ring-2 ${card.ring} hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer relative overflow-hidden`}
        >
          <div className="mb-2 z-10">{card.icon}</div>
          <span className={`text-3xl font-extrabold ${card.text} z-10`}>{stats[card.key] ?? 0}</span>
          <span className="text-gray-600 mt-1 text-sm font-medium tracking-wide z-10">{card.label}</span>
          <span className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-tr from-blue-300 via-indigo-200 to-purple-200 opacity-20 blur-2xl z-0" />
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
