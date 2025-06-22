'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrendingUp, Settings, Home, Bell, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

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
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gradient truncate">
              Deven Crypto Dashboard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 touch-target',
                  pathname === href
                    ? 'bg-crypto-accent/20 text-crypto-accent glow-effect'
                    : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-sm lg:text-base">{label}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-crypto-danger hover:bg-crypto-danger/10 touch-target"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm lg:text-base">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden touch-target p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700/50 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 w-full touch-target',
                    pathname === href
                      ? 'bg-crypto-accent/20 text-crypto-accent glow-effect'
                      : 'hover:bg-gray-800/50 text-gray-300 hover:text-white active:bg-gray-800/70'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-base">{label}</span>
                </Link>
              ))}
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 text-gray-300 hover:text-crypto-danger hover:bg-crypto-danger/10 active:bg-crypto-danger/20 w-full touch-target"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-base">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 