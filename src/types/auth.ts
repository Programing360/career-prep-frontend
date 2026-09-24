export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  name?: string; // Optional — backend does not persist name at registration; synthesized from email prefix
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  /** AI token balance stored on the backend user document */
  aiTokenBalance?: number;
}

export interface StudentProgress {
  xp: number;
  coins: number;
  badges: Badge[];
  streak: Streak;
  readinessScore: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastActiveDate: string;
}

export interface RegisterInput {
  name?: string; // Collected on FE but not yet in backend RegisterInputSchema — treated as optional
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string; // Collected on FE but not yet in backend RegisterInputSchema — treated as optional
}

export interface RegisterResponse {
  message: string;
  email: string;
  expiresInSeconds?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ResendOtpInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  password: string;
}

export interface AuthMeResponse {
  user: User;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  avatar?: string;
}

// Legacy aliases kept for backward compatibility.
export type LoginPayload = LoginInput;
export type RegisterPayload = RegisterInput;

/**
 * @deprecated Use LoginResponse instead.
 * This legacy shape assumed a refresh token in the response body.
 * The backend now issues the refresh token as an HTTP-only cookie
 * and returns `accessToken` (not `token`) in the JSON body.
 */
export interface AuthResponse {
  user: User;
  /** @deprecated Use `accessToken` from LoginResponse */
  token: string;
  /** @deprecated Refresh token is now an HTTP-only cookie, never in the response body */
  refreshToken?: string;
}
