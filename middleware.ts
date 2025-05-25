import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware running for:', pathname);

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    console.log('Allowing public route:', pathname);
    return NextResponse.next();
  }

  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.includes('.')
  ) {
    console.log('Allowing static file:', pathname);
    return NextResponse.next();
  }

  // Check for authentication token
  const token = request.cookies.get('auth-token')?.value;
  console.log('Auth token present:', !!token);

  if (!token) {
    console.log('No token found, redirecting to login');
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Get JWT secret from environment or use fallback
    const jwtSecret = process.env.JWT_SECRET || 'deven-crypto-dashboard-jwt-secret-key-super-secure-2025';
    const secret = new TextEncoder().encode(jwtSecret);
    
    // Verify JWT token
    const payload = await jwtVerify(token, secret);
    console.log('JWT verification successful');
    
    // Token is valid, continue
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired, redirect to login
    console.log('JWT verification failed:', error);
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // Clear invalid token - set for all domains
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      domain: undefined, // Let browser handle domain
    });
    
    return response;
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except static files and API auth routes
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',
  ],
}; 