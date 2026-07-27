import api from '@/lib/axios';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types';

/**
 * Authenticate user with email/password.
 * POST /api/auth/login
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  return data;
}

/**
 * Register a new student account.
 * POST /api/auth/register
 */
export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return data;
}

/**
 * Get currently authenticated user profile.
 * GET /api/auth/me
 */
export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>('/api/auth/me');
  return data;
}

/**
 * Refresh an expired access token using a refresh token.
 * POST /api/auth/refresh
 */
export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/refresh', {
    refreshToken,
  });
  return data;
}

/**
 * Logout current user (server-side token invalidation).
 * POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}

/**
 * Update user profile fields.
 * PATCH /api/auth/profile
 */
export async function updateProfile(
  payload: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>
): Promise<User> {
  const { data } = await api.patch<User>('/api/auth/profile', payload);
  return data;
}
