import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

/**
 * Props:
 *   children     — página a renderizar
 *   requireAdmin — si true, solo admins pueden acceder
 *   redirectTo   — dónde redirigir si no está autenticado
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/login',
}) {
  const { currentUser, isAdmin } = useAuthStore()

  if (!currentUser) return <Navigate to={redirectTo} replace />
  if (requireAdmin && !isAdmin()) return <Navigate to="/" replace />

  return children
}
