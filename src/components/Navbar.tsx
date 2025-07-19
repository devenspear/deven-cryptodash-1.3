'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrendingUp, Settings, Home, Bell, LogOut, Menu, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { usePriceRefresh } from '@/app/providers';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { triggerRefresh, isRefreshing } = usePriceRefresh();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  const handleRefresh = async () => {
    try {
      await triggerRefresh();
      toast.success('Prices updated successfully!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to update prices');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
        router.refresh(); // Refresh to update middleware state
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Network error during logout');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="card-gradient mobile-sticky z-50 p-3 mb-4 sm:p-4 sm:mb-6 safe-area-top">
      <div className="max-w-7xl mx-auto">
        {/* Desktop and Mobile Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 touch-target">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-crypto-accent flex-shrink-0" />
            <span className="text-white font-semibold text-lg sm:text-xl truncate">
              Deven Crypto Dashboard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors touch-target',
                    isActive
                      ? 'bg-crypto-accent text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Refresh Button - Desktop */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors touch-target',
                'text-gray-300 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title="Refresh prices"
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors touch-target"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors touch-target"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-700/30">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors touch-target',
                      isActive
                        ? 'bg-crypto-accent text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Refresh Button - Mobile */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={cn(
                  'flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors touch-target text-left',
                  'text-gray-300 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <RefreshCw className={cn('w-5 h-5 flex-shrink-0', isRefreshing && 'animate-spin')} />
                <span>Refresh Prices</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors touch-target text-left"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 