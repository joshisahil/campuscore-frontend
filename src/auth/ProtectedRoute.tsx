import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { roleCanAccess } from './session';
export function ProtectedRoute() {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  const area = location.pathname.split('/')[1];
  if (!roleCanAccess(session.role, area)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
