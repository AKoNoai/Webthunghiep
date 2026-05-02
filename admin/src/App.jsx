import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '@/styles/index.css';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import useAdminAuthStore from './context/adminAuthStore';

function App() {
  const { isAuthenticated, getCurrentUser, logout } = useAdminAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser().catch((error) => {
        console.error('Failed to get current user:', error);
        logout();
      });
    }
  }, [isAuthenticated, getCurrentUser, logout]);

  const basename = import.meta.env.PROD ? '/admin' : '/';

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
