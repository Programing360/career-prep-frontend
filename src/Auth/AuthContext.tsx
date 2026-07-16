import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  provider: 'email' | 'google';
  onboardingCompleted: boolean;
  targetExams: string[];
  prepLevel: string;
  studyHoursPerDay: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  completeOnboarding: (data: {
    targetExams: string[];
    prepLevel: string;
    studyHoursPerDay: number;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('auth_user', JSON.stringify(u));
    else localStorage.removeItem('auth_user');
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const existingUsers: Record<string, User> = JSON.parse(localStorage.getItem('auth_users_db') || '{}');
    const existing = Object.values(existingUsers).find(u => u.email === email);
    if (existing) {
      localStorage.setItem('auth_token', 'mock-token-' + existing.id);
      persist(existing);
      return;
    }
    const newUser: User = {
      id: generateId(),
      name: email.split('@')[0],
      email,
      avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
      provider: 'email',
      onboardingCompleted: false,
      targetExams: [],
      prepLevel: '',
      studyHoursPerDay: 0,
    };
    existingUsers[newUser.id] = newUser;
    localStorage.setItem('auth_users_db', JSON.stringify(existingUsers));
    localStorage.setItem('auth_token', 'mock-token-' + newUser.id);
    persist(newUser);
  }, [persist]);

  const loginWithGoogle = useCallback(async () => {
    await new Promise(r => setTimeout(r, 1000));
    const googleUser: User = {
      id: generateId(),
      name: 'Ahmad Khan',
      email: 'ahmad.khan@gmail.com',
      avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
      provider: 'google',
      onboardingCompleted: false,
      targetExams: [],
      prepLevel: '',
      studyHoursPerDay: 0,
    };
    const existingUsers: Record<string, User> = JSON.parse(localStorage.getItem('auth_users_db') || '{}');
    const existing = Object.values(existingUsers).find(u => u.email === googleUser.email);
    if (existing) {
      localStorage.setItem('auth_token', 'mock-token-' + existing.id);
      persist(existing);
      return;
    }
    existingUsers[googleUser.id] = googleUser;
    localStorage.setItem('auth_users_db', JSON.stringify(existingUsers));
    localStorage.setItem('auth_token', 'mock-token-' + googleUser.id);
    persist(googleUser);
  }, [persist]);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      id: generateId(),
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
      provider: 'email',
      onboardingCompleted: false,
      targetExams: [],
      prepLevel: '',
      studyHoursPerDay: 0,
    };
    const existingUsers: Record<string, User> = JSON.parse(localStorage.getItem('auth_users_db') || '{}');
    existingUsers[newUser.id] = newUser;
    localStorage.setItem('auth_users_db', JSON.stringify(existingUsers));
    localStorage.setItem('auth_token', 'mock-token-' + newUser.id);
    persist(newUser);
  }, [persist]);

  const registerWithGoogle = useCallback(async () => {
    await new Promise(r => setTimeout(r, 1000));
    const googleUser: User = {
      id: generateId(),
      name: 'Ahmad Khan',
      email: 'ahmad.khan@gmail.com',
      avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
      provider: 'google',
      onboardingCompleted: false,
      targetExams: [],
      prepLevel: '',
      studyHoursPerDay: 0,
    };
    const existingUsers: Record<string, User> = JSON.parse(localStorage.getItem('auth_users_db') || '{}');
    const existing = Object.values(existingUsers).find(u => u.email === googleUser.email);
    if (existing) {
      localStorage.setItem('auth_token', 'mock-token-' + existing.id);
      persist(existing);
      return;
    }
    existingUsers[googleUser.id] = googleUser;
    localStorage.setItem('auth_users_db', JSON.stringify(existingUsers));
    localStorage.setItem('auth_token', 'mock-token-' + googleUser.id);
    persist(googleUser);
  }, [persist]);

  const verifyOtp = useCallback(async (_phone: string, otp: string) => {
    await new Promise(r => setTimeout(r, 600));
    if (otp !== '123456') throw new Error('Invalid OTP. Use 123456 for demo.');
    if (!user) throw new Error('No authenticated user');
    const updated = { ...user, phone: _phone };
    const existingUsers: Record<string, User> = JSON.parse(localStorage.getItem('auth_users_db') || '{}');
    existingUsers[updated.id] = updated;
    localStorage.setItem('auth_users_db', JSON.stringify(existingUsers));
    persist(updated);
  }, [user, persist]);

  const completeOnboarding = useCallback((data: {
    targetExams: string[];
    prepLevel: string;
    studyHoursPerDay: number;
  }) => {
    if (!user) return;
    const updated: User = {
      ...user,
      onboardingCompleted: true,
      targetExams: data.targetExams,
      prepLevel: data.prepLevel,
      studyHoursPerDay: data.studyHoursPerDay,
    };
    const existingUsers: Record<string, User> = JSON.parse(localStorage.getItem('auth_users_db') || '{}');
    existingUsers[updated.id] = updated;
    localStorage.setItem('auth_users_db', JSON.stringify(existingUsers));
    persist(updated);
  }, [user, persist]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    persist(null);
  }, [persist]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithGoogle,
      register,
      registerWithGoogle,
      verifyOtp,
      completeOnboarding,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
