
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpiryChart = ({ data = [] }) => {
  const chartData = {
    labels: ['Fresh', 'Expiring Soon', 'Expired'],
    datasets: [
      {
        label: 'Products',
        data: [
          data.fresh || 0,
          data.expiringSoon || 0,
          data.expired || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#e0e7ef',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          font: { weight: 'bold' },
        },
        grid: {
          color: '#e0e7ef',
        },
      },
      x: {
        ticks: {
          color: '#64748b',
          font: { weight: 'bold' },
        },
        grid: {
          color: '#f1f5f9',
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-white/80 shadow-xl backdrop-blur-lg p-6 border border-slate-100 min-h-[320px] flex flex-col">
      <h3 className="text-lg font-bold text-indigo-700 mb-4">Product Status Overview</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpiryChart;