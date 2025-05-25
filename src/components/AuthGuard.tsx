'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're in production or on custom domains
        const isProduction = process.env.NODE_ENV === 'production';
        const isCustomDomain = typeof window !== 'undefined' && 
          (window.location.hostname.includes('deven.site') || 
           window.location.hostname.includes('vercel.app'));

        // Force authentication check for production or custom domains
        if (isProduction || isCustomDomain) {
          console.log('[AUTH GUARD] Checking authentication...', { 
            hostname: window.location.hostname, 
            isProduction, 
            isCustomDomain 
          });

          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include',
          });

          const isAuth = response.ok;
          console.log('[AUTH GUARD] Auth check result:', isAuth);
          
          setIsAuthenticated(isAuth);
          
          // Redirect to login if not authenticated and not on login page
          if (!isAuth && !isPublicRoute) {
            console.log('[AUTH GUARD] Redirecting to login');
            router.push('/login');
            return;
          }
          
          // Redirect to dashboard if authenticated and on login page
          if (isAuth && pathname === '/login') {
            console.log('[AUTH GUARD] Redirecting to dashboard');
            router.push('/');
            return;
          }
        } else {
          // Development mode - allow access
          console.log('[AUTH GUARD] Development mode - allowing access');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('[AUTH GUARD] Auth check failed:', error);
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crypto-dark via-gray-900 to-crypto-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show navbar and main content
  if (isAuthenticated && !isPublicRoute) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </>
    );
  }

  // If on public route (login), show content without navbar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Fallback - should not reach here normally
  return <>{children}</>;
} 