'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Welcome to Deven Crypto Dashboard!');
        router.push('/');
        router.refresh(); // Refresh to update middleware state
      } else {
        toast.error(data.error || 'Authentication failed');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-crypto-accent/20 rounded-full glow-effect">
              <TrendingUp className="w-12 h-12 text-crypto-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Deven Crypto Dashboard
          </h1>
          <p className="text-gray-400">
            Enter your password to access your portfolio
          </p>
        </div>

        {/* Login Form */}
        <div className="card-gradient rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-crypto-accent focus:outline-none focus:ring-1 focus:ring-crypto-accent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 px-4 bg-gradient-to-r from-crypto-accent to-crypto-purple hover:from-crypto-accent/80 hover:to-crypto-purple/80 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] glow-effect"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Security Features */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400 text-center">
                🔒 Secured with server-side JWT authentication
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div className="text-center">
                ✓ HTTP-only cookies
              </div>
              <div className="text-center">
                ✓ Secure token validation
              </div>
              <div className="text-center">
                ✓ Brute force protection
              </div>
              <div className="text-center">
                ✓ 24h session expiry
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Built with ❤️ using Next.js and enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
} 