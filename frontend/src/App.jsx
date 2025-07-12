import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AddProductPage from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Backups from './pages/Backups';
import Profile from './pages/Profile';
import ProductLayout from './components/products/ProductLayout';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductLayout />}>
            <Route index element={<Products />} />
            <Route path="add" element={<AddProductPage />} />
          </Route>
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="backups" element={<Backups />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;