import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// Define the structure of the JWT payload
interface UserJwtPayload extends jose.JWTPayload {
    id: string;
    name: string;
    email: string;
}

const verifyAuth = async (token: string, secret: Uint8Array): Promise<UserJwtPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    // Ensure the payload matches our expected structure
    if (payload.id && payload.name && payload.email) {
      return payload as UserJwtPayload;
    }
    console.error('Invalid token payload:', payload);
    return null;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;
  
  const jwtSecret = process.env.JWT_SECRET;

  const isAuthPath = pathname === '/login' || pathname === '/signup';
  const isAdminPath = pathname.startsWith('/admin');

  if (!jwtSecret && isAdminPath) {
    console.error('CRITICAL: JWT_SECRET is not set. Redirecting to login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  const payload = token && jwtSecret ? await verifyAuth(token, new TextEncoder().encode(jwtSecret)) : null;
  const hasVerifiedToken = !!payload;

  if (isAuthPath) {
    if (hasVerifiedToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (isAdminPath) {
    if (!hasVerifiedToken) {
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.set('auth_token', '', { maxAge: -1, path: '/' });
      return response;
    }

    // Add user data to request headers for use in server components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-name', payload.name);
    requestHeaders.set('x-user-email', payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
