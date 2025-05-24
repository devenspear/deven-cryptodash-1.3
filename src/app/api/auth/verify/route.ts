import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    
    try {
      await jwtVerify(token, secret);
      return NextResponse.json(
        { authenticated: true },
        { status: 200 }
      );
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
} 