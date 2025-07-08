import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { getProfile } from '@/lib/api';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import type { User } from '@/lib/user';

async function getUserFromToken(): Promise<(User & { id: string }) | null> {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jose.jwtVerify(token, secret);
        
        // The payload from our JWT should match this structure
        return {
            _id: payload.id as any,
            id: payload.id as string,
            name: payload.name as string,
            email: payload.email as string,
        };

    } catch (error) {
        console.error("Failed to verify token:", error);
        return null;
    }
}


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user) {
    redirect('/login?callbackUrl=/admin');
  }

  const profile = await getProfile();
  
  // We rename the user object to session to match what AdminLayoutClient expects
  const session = { user };

  return <AdminLayoutClient profile={profile} session={session}>{children}</AdminLayoutClient>;
}
