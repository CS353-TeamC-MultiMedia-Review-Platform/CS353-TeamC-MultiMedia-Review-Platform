/**
 * Authentication types and interfaces
 * Defines the shape of auth data throughout the application
 */

export interface AuthUser {
  token: string;      // Firebase JWT token
  uid: string;        // Firebase user ID
  userName: string;   // User display name
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

export type AuthState = AuthUser | null;
