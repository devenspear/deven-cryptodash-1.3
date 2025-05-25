import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[CLEAR] Clearing authentication cookies');
  
  const response = NextResponse.json(
    { success: true, message: 'Authentication cookies cleared' },
    { status: 200 }
  );

  // Clear the auth token cookie with multiple domain configurations
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  // Also try clearing with explicit domain
  const host = request.headers.get('host');
  if (host?.includes('deven.site')) {
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      domain: '.deven.site',
    });
  }

  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
} 