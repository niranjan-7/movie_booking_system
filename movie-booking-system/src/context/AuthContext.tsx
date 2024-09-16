// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi, useUserApi } from '../services/api';

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loginApi, signUpApi } = useUserApi();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginApi(username, password);
      if (data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.token);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const signup = async (username: string, password: string, name: string) => {
    try {
      const data = await signUpApi(username, password, name);
      if (data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.token);
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ login, signup, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
