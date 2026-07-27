import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Spinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/types/auth';

// 'admin' এবং 'student' যোগ করা হয়েছে যাতে ডেভেলপমেন্টের সময় রিডাইরেক্ট না হয়
const ADMIN_ROLES: UserRole[] = [
  'super_admin',
  'content_manager',
  'admin',
  'student',
];

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
