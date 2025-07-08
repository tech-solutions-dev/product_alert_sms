import React from 'react';

const RecentProductsTable = ({ recentProducts }) => (
  <div className="dashboard-recent-products">
    <h2>Recent Products</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Expiry Date</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {recentProducts.map(prod => (
          <tr key={prod.id}>
            <td>{prod.name}</td>
            <td>{prod.Category ? prod.Category.name : 'N/A'}</td>
            <td>{new Date(prod.expiryDate).toLocaleDateString()}</td>
            <td>{new Date(prod.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentProductsTable;
