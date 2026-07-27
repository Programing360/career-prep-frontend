import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, type AuthContextType } from './AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCredentials,
  logout as logoutAction,
  hydrateFromStorage,
} from '@/store/slices/authSlice';
import { ROUTES } from '@/constants/routes';
import type { User, StudentProgress } from '@/types';

const MOCK_USER: User = {
  id: 'usr_001',
  name: 'MD Limon',
  email: 'limon@example.com',
  phone: '+923001234567',
  role: 'student',
  createdAt: '2026-01-15T00:00:00.000Z',
};

const MOCK_TOKEN = 'mock_jwt_token_abc123';

const MOCK_PROGRESS: StudentProgress = {
  xp: 450,
  coins: 120,
  badges: [
    {
      id: 'badge_001',
      name: 'Quick Learner',
      icon: '⚡',
      description: 'Completed 5 quizzes in one day',
      earnedAt: '2026-07-20T00:00:00.000Z',
    },
  ],
  streak: {
    current: 5,
    longest: 12,
    lastActiveDate: '2026-07-20T00:00:00.000Z',
  },
  readinessScore: 78,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  const login = useCallback(
    async (email: string, _password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!email) {
        throw new Error('Email is required');
      }

      const mockUser: User = {
        ...MOCK_USER,
        email,
      };

      dispatch(
        setCredentials({
          user: mockUser,
          token: MOCK_TOKEN,
          progress: MOCK_PROGRESS,
        })
      );

      navigate(ROUTES.DASHBOARD);
    },
    [dispatch, navigate]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    navigate(ROUTES.HOME);
  }, [dispatch, navigate]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
