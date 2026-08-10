export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
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
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string;
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

// Legacy aliases kept for backward compatibility.
export type LoginPayload = LoginInput;
export type RegisterPayload = RegisterInput;

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
