import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { getProfile } from '@/lib/api';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import type { User } from '@/lib/user';

async function getUserFromToken(): Promise<(User & { id: string })> {
    const token = cookies().get('auth_token')?.value;

    // This should not happen if middleware is working correctly.
    if (!token) {
        throw new Error('Authentication token not found. Middleware might be misconfigured.');
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        
        // The payload from our JWT should match this structure
        return {
            _id: payload.id as any,
            id: payload.id as string,
            name: payload.name as string,
            email: payload.email as string,
        };

    } catch (error) {
        console.error("Failed to verify token in AdminLayout:", error);
        // This is an unexpected error because middleware should have caught invalid tokens.
        throw new Error('Failed to verify authentication token.');
    }
}


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If we've reached this layout, the middleware has already validated the token.
  // We can now safely get the user data from it.
  // The redirect logic is now solely in middleware.ts.
  const user = await getUserFromToken();

  const profile = await getProfile();
  
  // We rename the user object to session to match what AdminLayoutClient expects
  const session = { user };

  return <AdminLayoutClient profile={profile} session={session}>{children}</AdminLayoutClient>;
}
