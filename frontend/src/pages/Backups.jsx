
import React from 'react';
import BackupManager from '../components/backups/BackupManager';
import BackupList from '../components/backups/BackupList';
import { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_ENDPOINTS } from '../utils/constants';


const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBackups = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(API_ENDPOINTS.BACKUPS);
        setBackups(res.data || []);
      } catch (err) {
        console.error(err)
        setError('Failed to load backups.');
      } finally {
        setLoading(false);
      }
    };
    fetchBackups();
  }, []);

  if (loading) return <LoadingSpinner text="Loading backups..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white/80 shadow-2xl backdrop-blur-2xl p-10 border border-slate-100">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg mb-1">Database Backups</h2>
        <p className="text-base text-gray-500">Manage and restore your database backups</p>
      </div>
      <div className="space-y-8">
        <BackupManager onSuccess={() => {}} />
        <BackupList backups={backups} />
      </div>
    </div>
  );
};

export default Backups;
