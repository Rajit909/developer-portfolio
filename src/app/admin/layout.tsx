
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { getProfile } from '@/lib/api';
import { cookies } from 'next/headers';
import * as jose from 'jose';

// This payload must match what's in the JWT created during login
interface UserJwtPayload {
    id: string;
    name: string;
    email: string;
}

// We decode the token directly in the layout.
// This is the most reliable way to get user info in a Server Component.
async function getUserFromCookie(): Promise<UserJwtPayload | null> {
    const token = cookies().get('auth_token')?.value;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
        return null;
    }

    try {
        const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(secret));
        return payload as UserJwtPayload;
    } catch (e) {
        console.error("Failed to verify token in AdminLayout:", e);
        return null;
    }
}


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware has already protected this route. Now, we get the
  // user data from the cookie to pass to UI components in the tree.
  const userPayload = await getUserFromCookie();

  // This is a safety net. If the token becomes invalid between the
  // middleware check and this render (e.g., it expires), we redirect.
  if (!userPayload) {
    redirect('/login');
  }

  const profile = await getProfile();
  
  // The AdminLayoutClient component expects a specific 'session' object shape.
  // We construct it here from the token payload.
  const session = {
      user: {
        id: userPayload.id,
        name: userPayload.name,
        email: userPayload.email,
        image: null // The image is not stored in the JWT in this app
      }
  };

  return <AdminLayoutClient profile={profile} session={session}>{children}</AdminLayoutClient>;
}
