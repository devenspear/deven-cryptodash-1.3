import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'CRYPTODASHp@ss2025';
const JWT_SECRET = process.env.JWT_SECRET || 'deven-crypto-dashboard-jwt-secret-key-super-secure-2025';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    console.log('Login attempt received');

    if (!password) {
      console.log('No password provided');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // In production, you'd hash the stored password, but for simplicity we'll do direct comparison
    // For better security, hash the password: const hashedPassword = await bcrypt.hash(DASHBOARD_PASSWORD, 12);
    const isValidPassword = password === DASHBOARD_PASSWORD;
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password provided');
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ authenticated: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Token expires in 24 hours
      .sign(secret);

    console.log('JWT token created successfully');

    // Create response with secure cookie
    const response = NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

    // Set secure HTTP-only cookie - optimized for custom domains
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: true, // Always use secure in production
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
      // Don't specify domain - let browser handle it for subdomains
    });

    console.log('Auth cookie set successfully');
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 