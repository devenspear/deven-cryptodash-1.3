'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TrendingUp, Settings, Home, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <nav className="card-gradient sticky top-0 z-50 p-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-crypto-accent" />
          <span className="text-xl font-bold text-gradient">Deven Crypto Dashboard</span>
        </Link>

        <div className="flex items-center space-x-6">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                pathname === href
                  ? 'bg-crypto-accent/20 text-crypto-accent glow-effect'
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-crypto-danger hover:bg-crypto-danger/10"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 