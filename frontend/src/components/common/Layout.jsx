


import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router';
import Footer from './Footer';


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#c7d2fe] font-inter">
      {/* Decorative blurred circle - moved behind sidebar */}
      <div className="pointer-events-none fixed top-[-10%] right-[-15%] w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300 relative">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main content area - removed max-w-7xl if you want full-width modals */}
        <main className="flex-1 px-2 py-6 md:px-10 md:py-12 w-full">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;