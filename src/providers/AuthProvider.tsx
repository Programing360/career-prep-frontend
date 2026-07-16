import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAuthenticated: false,
        login: async () => {
          console.warn('login not implemented');
        },
        logout: () => {
          console.warn('logout not implemented');
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
