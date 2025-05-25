import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define routes that absolutely don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/clear', '/api/debug'];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  // Force authentication for any custom domain or production environment
  const isCustomDomain = host.includes('deven.site') || host.includes('vercel.app');
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`[MIDDLEWARE] ${pathname} | Host: ${host} | Custom Domain: ${isCustomDomain} | Production: ${isProduction}`);

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.includes('.') && !pathname.includes('/')
  ) {
    return NextResponse.next();
  }

  // Allow auth-related routes
  if (publicRoutes.includes(pathname)) {
    console.log(`[MIDDLEWARE] Allowing public route: ${pathname}`);
    return NextResponse.next();
  }

  // For custom domains or production, FORCE authentication check
  if (isCustomDomain || isProduction) {
    console.log(`[MIDDLEWARE] Checking authentication for: ${pathname}`);
    
    const token = request.cookies.get('auth-token')?.value;
    console.log(`[MIDDLEWARE] Token exists: ${!!token}`);

    if (!token) {
      console.log(`[MIDDLEWARE] No token - redirecting to login`);
      const loginUrl = new URL('/login', origin);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify JWT token with both possible secrets
      const secrets = [
        process.env.JWT_SECRET || 'deven-crypto-dashboard-jwt-secret-key-super-secure-2025',
        'your-super-secure-jwt-secret-key', // fallback for older tokens
      ];

      let verified = false;
      for (const jwtSecret of secrets) {
        try {
          const secret = new TextEncoder().encode(jwtSecret);
          await jwtVerify(token, secret);
          verified = true;
          break;
        } catch (e) {
          continue;
        }
      }

      if (!verified) {
        throw new Error('Token verification failed with all secrets');
      }

      console.log(`[MIDDLEWARE] Token verified successfully`);
      return NextResponse.next();

    } catch (error) {
      console.log(`[MIDDLEWARE] Token verification failed:`, error);
      
      // Clear invalid token and redirect
      const loginUrl = new URL('/login', origin);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'expired');
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      
      return response;
    }
  }

  // For development, allow everything
  console.log(`[MIDDLEWARE] Development mode - allowing ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes that don't need protection
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}; 