import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  sex: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (userData: AuthUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('vitasyn_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vitasyn_token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('vitasyn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vitasyn_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vitasyn_token', token);
    } else {
      localStorage.removeItem('vitasyn_token');
    }
  }, [token]);

  const login = (userData: AuthUser, tok: string) => {
    setUser(userData);
    setToken(tok);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
