import api, { AUTH_TOKEN_KEY } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { setStorageItem } from '@/utils/storageHelpers';
import type {
  ForgotPasswordInput,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  ResetPasswordInput,
  ResendOtpInput,
  User,
  VerifyOtpInput,
} from '@/types';

type UnknownRecord = Record<string, unknown>;

/**
 * Strip a generic { data: ... } / { result: ... } envelope so callers can read
 * the payload regardless of whether the backend wraps responses.
 */
function unwrap<T>(body: unknown): T {
  if (body && typeof body === 'object') {
    const record = body as UnknownRecord;
    if (record.data && typeof record.data === 'object') {
      return record.data as T;
    }
    if (record.result && typeof record.result === 'object') {
      return record.result as T;
    }
  }
  return body as T;
}

function readString(record: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

/**
 * Normalize a backend user object (which may use `_id` instead of `id`) into
 * the frontend `User` shape.
 */
function asUser(value: unknown): User | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as UnknownRecord;
  const source =
    record.user && typeof record.user === 'object'
      ? (record.user as UnknownRecord)
      : record;
  const id = readString(source, ['id', '_id', 'userId']);
  const email = readString(source, ['email']);
  if (!id || !email) return undefined;
  return {
    id,
    email,
    name: readString(source, ['name']) ?? email.split('@')[0] ?? '',
    role: (source.role as User['role']) ?? 'user',
    phone: readString(source, ['phone']),
    avatar: readString(source, ['avatar']),
    isEmailVerified: Boolean(source.isEmailVerified),
    createdAt: readString(source, ['createdAt']) ?? '',
  };
}

/**
 * Register a new student account.
 * POST /auth/register
 */
export async function registerUser(
  input: RegisterInput
): Promise<RegisterResponse> {
  const { data } = await api.post<unknown>(API_ENDPOINTS.AUTH.REGISTER, input);
  const record = unwrap<UnknownRecord>(data);
  console.log(record);
  const user = asUser(record);
  return {
    message:
      readString(record, ['message']) ??
      'Registration successful. Please verify your email to continue.',
    email: readString(record, ['email']) ?? user?.email ?? input.email,
    expiresInSeconds: record.expiresInSeconds as number | undefined,
  };
}

/**
 * Authenticate with email/password. The backend returns an access token in the
 * body and sets the refresh token as an HTTP-only cookie, then we fetch the
 * user profile to build a complete session.
 * POST /auth/login, GET /auth/me
 */
export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<unknown>(API_ENDPOINTS.AUTH.LOGIN, input);
  const record = unwrap<UnknownRecord>(data);
  const accessToken = readString(record, [
    'accessToken',
    'token',
    'access_token',
  ]);

  if (!accessToken) {
    throw new Error('Login failed: the server did not return an access token.');
  }

  // Store the access token so the follow-up profile request is authorized.
  setStorageItem(AUTH_TOKEN_KEY, accessToken);

  const user = await getCurrentUser();
  return { user, accessToken };
}

/**
 * Verify a user's email with the OTP sent during registration.
 * POST /auth/verify-email
 */
export async function verifyEmail(
  input: VerifyOtpInput
): Promise<{ message: string; user?: User }> {
  const { data } = await api.post<unknown>(
    API_ENDPOINTS.AUTH.VERIFY_EMAIL,
    input
  );
  const record = unwrap<UnknownRecord>(data);
  return {
    message: readString(record, ['message']) ?? 'Email verified successfully.',
    user: asUser(record),
  };
}

/**
 * Request a fresh OTP to be re-sent to the given email.
 * POST /auth/resend-otp
 */
export async function resendOtp(
  input: ResendOtpInput
): Promise<{ message: string; expiresInSeconds?: number }> {
  const { data } = await api.post<unknown>(
    API_ENDPOINTS.AUTH.RESEND_OTP,
    input
  );
  const record = unwrap<UnknownRecord>(data);
  return {
    message:
      readString(record, ['message']) ??
      'A new verification code has been sent.',
    expiresInSeconds: record.expiresInSeconds as number | undefined,
  };
}

/**
 * Request a password reset link to be emailed to the given address.
 * POST /auth/forgot-password
 */
export async function forgotPassword(
  input: ForgotPasswordInput
): Promise<{ message: string }> {
  const { data } = await api.post<unknown>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    input
  );
  const record = unwrap<UnknownRecord>(data);
  return {
    message:
      readString(record, ['message']) ??
      'If an account exists with that email, a reset link has been sent.',
  };
}

/**
 * Set a new password using the reset token from the emailed link.
 * POST /auth/reset-password/:token
 */
export async function resetPassword(
  token: string,
  input: ResetPasswordInput
): Promise<{ message: string }> {
  const { data } = await api.post<unknown>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD(encodeURIComponent(token)),
    input
  );
  const record = unwrap<UnknownRecord>(data);
  return {
    message:
      readString(record, ['message']) ??
      'Your password has been reset. Please sign in.',
  };
}

/**
 * Get the currently authenticated user profile.
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<unknown>(API_ENDPOINTS.AUTH.ME);
  const record = unwrap<UnknownRecord>(data);
  const user = asUser(record);
  if (!user) {
    throw new Error('Could not load your profile. Please log in again.');
  }
  return user;
}

/**
 * Log out the current user (server-side token invalidation).
 * POST /auth/logout
 */
export async function logoutUser(): Promise<void> {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT);
}

/**
 * Update the current user's profile fields.
 * PATCH /auth/profile
 */
export async function updateProfile(
  payload: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>
): Promise<User> {
  const { data } = await api.patch<unknown>(
    API_ENDPOINTS.AUTH.PROFILE,
    payload
  );
  const record = unwrap<UnknownRecord>(data);
  const user = asUser(record);
  if (!user) {
    throw new Error('Could not update your profile. Please try again.');
  }
  return user;
}
