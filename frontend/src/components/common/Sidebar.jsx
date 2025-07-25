import React from 'react';
import { X } from 'lucide-react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Package, Tags, FileText, Users, Database, LogOut } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuthContext();
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={22} className="text-indigo-600" /> },
    { name: 'Products', href: '/products', icon: <Package size={22} className="text-blue-600" /> },
    { name: 'Reports', href: '/reports', icon: <FileText size={22} className="text-green-600" /> },
  ];
  if (user && user.role === 'admin') {
    navItems.splice(2, 0, { name: 'Categories', href: '/categories', icon: <Tags size={22} className="text-purple-600" /> });
    navItems.push({ name: 'Backups', href: '/backups', icon: <Database size={22} className="text-pink-600" /> });
    navItems.push({ name: 'Users', href: '/users', icon: <Users size={22} className="text-orange-600" /> });
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 bg-white/80 shadow-2xl backdrop-blur-2xl border-r border-slate-100 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}
        role="navigation"
        aria-label="Sidebar"
      >
        <button
          className="absolute top-4 right-4 z-40 md:hidden bg-white/80 rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <X size={22} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-100">
          <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-lg">ExpireTracker</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 mt-6 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-50/80 hover:text-indigo-700'}`
              }
              onClick={toggleSidebar}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 py-6 border-t border-slate-100 flex items-center gap-3">
          <div className="flex-1 truncate">
          <div
            className="font-semibold text-gray-700 md:max-w-full"
            title={user?.name}
          >
            {user?.name}
          </div>
          <div
            className="text-xs text-gray-400 truncate md:max-w-full"
            title={user?.email}
          >
            {user?.email}
          </div>
          </div>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;