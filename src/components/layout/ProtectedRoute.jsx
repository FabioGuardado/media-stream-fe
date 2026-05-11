import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute({ children, requireAdmin = false, redirectTo = '/login' }) {
  const { currentUser, isAdmin } = useAuthStore();

  if (!currentUser) return <Navigate to={redirectTo} replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/" replace />;

  return children;
}
