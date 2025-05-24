'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePortfolioStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = usePortfolioStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to login page
    if (pathname === '/login') {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, pathname]);

  // Show loading screen while checking authentication
  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-accent mx-auto mb-4" />
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If on login page and already authenticated, redirect to dashboard
  if (isAuthenticated && pathname === '/login') {
    router.push('/');
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-accent mx-auto mb-4" />
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 