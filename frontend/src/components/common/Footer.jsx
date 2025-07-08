import React from 'react';

const Footer = () => (
  <footer className="w-full py-4 px-6 bg-white/80 border-t border-slate-100 text-center text-gray-500 text-sm shadow-inner">
    &copy; {new Date().getFullYear()} ExpireTracker &mdash; Product Expiry Alert Management
  </footer>
);

export default Footer;
