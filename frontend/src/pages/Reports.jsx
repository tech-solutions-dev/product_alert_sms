
import React from 'react';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportList from '../components/reports/ReportList';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reports';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Reports = () => {
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getAll,
  });

  if (isLoading) return <LoadingSpinner text="Loading reports..." />;
  if (error) return <div className="text-red-600">Failed to load reports.</div>;

  return (
      <div className="w-full mx-auto rounded-3xl bg-white/80 shadow-2xl backdrop-blur-2xl p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg mb-1">Reports</h2>
          <p className="text-base text-gray-500">Generate and view product expiry reports</p>
        </div>
        <div className="space-y-8 w-full">
          <div className="rounded-2xl bg-white/90 shadow-lg p-6 border border-slate-100 backdrop-blur-md">
            <ReportGenerator onSuccess={() => {}} />
          </div>
          <div className="rounded-2xl bg-white/90 shadow-lg p-6 border border-slate-100 backdrop-blur-md">
            <ReportList reports={reports || []} />
          </div>
        </div>
      </div>
  );
};

export default Reports;
