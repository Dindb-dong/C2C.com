import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAccessToken, setAccessToken, removeAccessToken } from '../utils/storage';
import { request } from '../utils/request';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.post<{ token: string; user: User }>('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      await setAccessToken(token);
      setUser(user);
    } catch (error) {
      setError('로그인에 실패했습니다.');
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await request.post('/auth/logout');
      await removeAccessToken();
      setUser(null);
    } catch (error) {
      setError('로그아웃에 실패했습니다.');
      console.error('Error logging out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setUser(null);
        return;
      }

      const response = await request.get<User>('/auth/me');
      setUser(response.data);
    } catch (error) {
      setError('인증 확인에 실패했습니다.');
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 