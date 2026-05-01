import { Navigate } from 'react-router-dom';
import useAdminAuthStore from '@/context/adminAuthStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
