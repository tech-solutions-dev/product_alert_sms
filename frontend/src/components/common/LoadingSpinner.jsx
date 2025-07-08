

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-12 w-12',
    xl: 'h-20 w-20'
  };

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="relative bg-white/80 rounded-3xl shadow-2xl backdrop-blur-2xl px-10 py-12 flex flex-col items-center border border-slate-100">
        {/* Animated gradient ring */}
        <span className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400 opacity-30 blur-2xl animate-pulse z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className={`${sizeClasses[size]} text-indigo-600 animate-spin drop-shadow-lg`} />
          <p className="mt-6 text-lg text-gray-700 font-semibold tracking-wide text-center drop-shadow-sm">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;