import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
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
  login: stubLogin,
  logout: stubLogout,
});
