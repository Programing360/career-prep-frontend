import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, type AuthContextType } from './AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCredentials,
  setUser,
  logout as logoutAction,
  hydrateFromStorage,
} from '@/store/slices/authSlice';
import { ROUTES } from '@/constants/routes';
import { getCurrentUser, loginUser, logoutUser } from '@/services';
import { clearTokens } from '@/lib/axios';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const validatedRef = useRef(false);

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || validatedRef.current) return;
    validatedRef.current = true;
    let cancelled = false;

    getCurrentUser()
      .then((freshUser) => {
        if (!cancelled) {
          dispatch(setUser(freshUser));
        }
      })
      .catch(() => {
        // 401/refresh failures are already handled by the axios interceptor.
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser({ email, password });
      dispatch(
        setCredentials({ user: result.user, token: result.accessToken })
      );
    },
    [dispatch]
  );

  const clearSession = useCallback(
    (path: string) => {
      logoutUser().catch(() => {});
      dispatch(logoutAction());
      clearTokens();
      navigate(path);
    },
    [dispatch, navigate]
  );

  const logout = useCallback(() => {
    clearSession(ROUTES.HOME);
  }, [clearSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession(ROUTES.LOGIN);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearSession]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
