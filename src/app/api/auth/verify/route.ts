import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'deven-crypto-dashboard-jwt-secret-key-super-secure-2025';

export async function GET(request: NextRequest) {
  try {
    console.log('[VERIFY] Auth verification request received');
    const token = request.cookies.get('auth-token')?.value;
    console.log('[VERIFY] Token present:', !!token);

    if (!token) {
      console.log('[VERIFY] No token found');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    
    try {
      await jwtVerify(token, secret);
      console.log('[VERIFY] Token verification successful');
      return NextResponse.json(
        { authenticated: true },
        { status: 200 }
      );
    } catch (jwtError) {
      // Token is invalid or expired
      console.log('[VERIFY] Token verification failed:', jwtError);
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('[VERIFY] Verification error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
} 