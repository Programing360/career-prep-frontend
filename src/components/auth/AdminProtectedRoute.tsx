import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Spinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/types/auth';

const ADMIN_ROLES: UserRole[] = ['admin', 'moderator'];

interface AdminProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function AdminProtectedRoute({
  allowedRoles = ADMIN_ROLES,
}: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={32} className="text-primary-500" />
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
