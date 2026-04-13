'use client';

/**
 * Authentication Context Provider
 * Provides centralized auth state management across the application
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthContextType } from '../types/auth';
import { saveAuthUser, getAuthUser, clearAuthUser } from '../lib/authStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const savedUser = getAuthUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const login = (newUser: AuthUser) => {
    saveAuthUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    clearAuthUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: user !== null,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 * Must be used within AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
