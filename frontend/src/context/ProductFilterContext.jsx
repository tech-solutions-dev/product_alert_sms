import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ProductFilterContext = createContext();

export const useProductFilters = () => useContext(ProductFilterContext);

export const ProductFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoriesRes = await api.get('/api/categories');
      setCategories(categoriesRes.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ProductFilterContext.Provider value={{ filters, setFilters, categories, loading, error, fetchCategories }}>
      {children}
    </ProductFilterContext.Provider>
  );
};
