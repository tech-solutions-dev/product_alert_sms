import React from 'react';

const CategoryList = ({ categories }) => (
  <div className="dashboard-categories">
    <h2>Categories</h2>
    <ul>
      {categories.map(cat => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  </div>
);

export default CategoryList;
