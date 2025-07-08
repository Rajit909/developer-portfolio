import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// Helper function to verify the JWT
// We put this outside the middleware to avoid re-declaring it on every request
const verifyAuth = async (token: string): Promise<boolean> => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jose.jwtVerify(token, secret);
    return true;
  } catch (error) {
    // This is expected if the token is invalid or expired
    return false;
  }
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPath = pathname === '/login' || pathname === '/signup';
  const isAdminPath = pathname.startsWith('/admin');

  const hasVerifiedToken = token ? await verifyAuth(token) : false;

  // If the user is on an auth page (login/signup)
  if (isAuthPath) {
    // And they have a valid token, redirect them to the admin dashboard
    if (hasVerifiedToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    // Otherwise, let them see the login/signup page
    return NextResponse.next();
  }

  // If the user is on a protected admin page
  if (isAdminPath) {
    // And they do NOT have a valid token, redirect them to login
    if (!hasVerifiedToken) {
      // To prevent redirect loops, we first clear any invalid token
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.set('auth_token', '', { maxAge: -1, path: '/' });
      return response;
    }
    // Otherwise, let them access the admin page
    return NextResponse.next();
  }

  // For any other path, just continue
  return NextResponse.next();
}

// Update the matcher to run on all relevant paths
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
