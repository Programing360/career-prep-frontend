import { createContext } from 'react';
import type { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const stubLogin = async (): Promise<void> => {
  throw new Error('AuthProvider is not mounted.');
};

const stubLogout = (): void => {
  throw new Error('AuthProvider is not mounted.');
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: stubLogin,
  logout: stubLogout,
});
