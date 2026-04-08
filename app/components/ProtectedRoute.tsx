'use client';

/**
 * Route Guard HOC - Protects routes that require authentication
 * Redirects unauthenticated users to login
 * Prevents direct URL access without auth
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps protected page content and redirects if not authenticated
 * Usage:
 *   <ProtectedRoute>
 *     <YourPageContent />
 *   </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  // Show nothing while loading or not authenticated
  if (loading || !isLoggedIn) {
    return null;
  }

  // Render content only if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
