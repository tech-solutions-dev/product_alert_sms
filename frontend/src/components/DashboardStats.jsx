import React from 'react';

const DashboardStats = ({ totalProducts, totalCategories, addedThisMonth, freshProducts, expiringSoon, expired }) => (
  <div className="dashboard-stats">
    <div>Total Products: {totalProducts}</div>
    <div>Total Categories: {totalCategories}</div>
    <div>Added This Month: {addedThisMonth}</div>
    <div>Fresh Products: {freshProducts}</div>
    <div>Expiring Soon: {expiringSoon}</div>
    <div>Expired: {expired}</div>
  </div>
);

export default DashboardStats;
