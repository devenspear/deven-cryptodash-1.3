import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Only allow debug in development or with special header
  if (isProduction && request.headers.get('x-debug-key') !== 'deven-debug-2025') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Safely extract cookies
  const cookies: Record<string, string> = {};
  const cookieEntries = request.cookies.getAll();
  for (const cookie of cookieEntries) {
    cookies[cookie.name] = cookie.name === 'auth-token' 
      ? `${cookie.value.substring(0, 10)}...` 
      : cookie.value;
  }

  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasPassword: !!process.env.DASHBOARD_PASSWORD,
    hasJwtSecret: !!process.env.JWT_SECRET,
    passwordLength: process.env.DASHBOARD_PASSWORD?.length || 0,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
    cookies: cookies,
  };

  return NextResponse.json(debugInfo);
} 