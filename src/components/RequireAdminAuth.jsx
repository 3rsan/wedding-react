import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function RequireAdminAuth({ children, roles }) {
  const { user, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) return <div>Yükleniyor...</div>;

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
