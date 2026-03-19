import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  phone: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: Omit<User, 'id' | 'role'> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pb_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      const userToStore = { ...userData, token, id: userData._id };
      setUser(userToStore);
      localStorage.setItem('pb_user', JSON.stringify(userToStore));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (data: Omit<User, 'id' | 'role'> & { password: string }) => {
    try {
      const response = await api.post('/auth/register', data);
      const { token, ...userData } = response.data;
      const userToStore = { ...userData, token, id: userData._id };
      setUser(userToStore);
      localStorage.setItem('pb_user', JSON.stringify(userToStore));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pb_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
