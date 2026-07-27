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
  console.warn('login not implemented');
};

const stubLogout = (): void => {
  console.warn('logout not implemented');
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: stubLogin,
  logout: stubLogout,
});
