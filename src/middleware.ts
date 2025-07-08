import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// A simple verifier function to check if the JWT is valid
async function verify(token: string, secret: string): Promise<boolean> {
    try {
        await jose.jwtVerify(token, new TextEncoder().encode(secret));
        return true; // Token is valid
    } catch (e) {
        // This can happen if the token is expired or malformed
        console.error("Token verification failed in middleware:", e);
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;
    const { pathname } = req.nextUrl;
    const secret = process.env.JWT_SECRET;

    // If the JWT_SECRET is not configured, we cannot proceed securely.
    // The middleware will be effectively disabled and will protect admin routes by default.
    if (!secret) {
        console.error("CRITICAL: JWT_SECRET is not set. Middleware is in a locked-down state.");
        if (pathname.startsWith('/admin')) {
             return NextResponse.redirect(new URL('/login?error=config', req.url));
        }
        return NextResponse.next();
    }
    
    const hasVerifiedToken = token ? await verify(token, secret) : false;
    
    // If the user is logged in and tries to access login/signup pages,
    // redirect them to the admin dashboard.
    if ((pathname === '/login' || pathname === '/signup') && hasVerifiedToken) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }
    
    // If the user is not logged in and tries to access a protected admin page,
    // redirect them to the login page.
    if (pathname.startsWith('/admin') && !hasVerifiedToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Otherwise, allow the request to proceed.
    return NextResponse.next();
}

// The matcher ensures this middleware runs only on the specified routes.
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
