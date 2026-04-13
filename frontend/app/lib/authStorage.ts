/**
 * Centralized authentication storage utilities
 * Handles all localStorage and cookie operations for auth
 */

import { AuthUser } from '../types/auth';

// Define all auth keys in one place
const AUTH_KEYS = {
  TOKEN: 'token',
  UID: 'uid',
  USER_NAME: 'userName',
} as const;

/**
 * Save auth user to localStorage and cookies
 */
export const saveAuthUser = (user: AuthUser): void => {
  try {
    localStorage.setItem(AUTH_KEYS.TOKEN, user.token);
    localStorage.setItem(AUTH_KEYS.UID, user.uid);
    localStorage.setItem(AUTH_KEYS.USER_NAME, user.userName);
    
    // Also set cookie for middleware/server-side access
    document.cookie = `${AUTH_KEYS.TOKEN}=${user.token}; path=/`;
  } catch (error) {
    console.error('Failed to save auth user:', error);
  }
};

/**
 * Retrieve auth user from localStorage
 */
export const getAuthUser = (): AuthUser | null => {
  try {
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    const uid = localStorage.getItem(AUTH_KEYS.UID);
    const userName = localStorage.getItem(AUTH_KEYS.USER_NAME);

    if (!token || !uid || !userName) {
      return null;
    }

    return { token, uid, userName };
  } catch (error) {
    console.error('Failed to retrieve auth user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const user = getAuthUser();
  return user !== null;
};

/**
 * Get auth token for API calls
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
};

/**
 * Get user ID
 */
export const getUserId = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.UID);
};

/**
 * Get user display name
 */
export const getUserName = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.USER_NAME);
};

/**
 * Clear all auth data from localStorage and cookies
 */
export const clearAuthUser = (): void => {
  try {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.UID);
    localStorage.removeItem(AUTH_KEYS.USER_NAME);
    
    // Clear cookie
    document.cookie = `${AUTH_KEYS.TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  } catch (error) {
    console.error('Failed to clear auth user:', error);
  }
};

/**
 * Get all auth keys (for debugging or reset operations)
 */
export const getAuthKeys = () => AUTH_KEYS;
