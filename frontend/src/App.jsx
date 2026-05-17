import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageSuppliers from './pages/admin/ManageSuppliers';
import ManageProducts from './pages/admin/ManageProducts';
import ManageUsers from './pages/admin/ManageUsers';
import InventoryTransactions from './pages/admin/InventoryTransactions';

import StaffDashboard from './pages/staff/StaffDashboard';
import SearchProducts from './pages/staff/SearchProducts';
import UpdateInventory from './pages/staff/UpdateInventory';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="suppliers" element={<ManageSuppliers />} />
          <Route path="inventory" element={<InventoryTransactions />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="products" element={<SearchProducts />} />
          <Route path="inventory" element={<UpdateInventory />} />
        </Route>

        {/* Redirect root based on user role or to login */}
        <Route path="/" element={<Navigate to={user ? `/${user.role.toLowerCase()}` : '/login'} />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
