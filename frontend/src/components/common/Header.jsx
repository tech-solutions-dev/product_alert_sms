
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';


const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 shadow-lg border-b border-slate-100 backdrop-blur-2xl mb-6 fixed top-0 left-0 right-0 z-100">
      <button className="md:hidden mr-2" onClick={toggleSidebar}>
        <Menu size={28} className="text-indigo-600" />
      </button>
      <div className="flex-1 flex items-center gap-3">
        <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg">ExpireTracker</span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <User size={20} className="text-white" />
          <span className="hidden md:inline">{user?.name}</span>
          <ChevronDown size={18} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20">
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all"
              onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
            >
              <User size={18} /> Profile
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;