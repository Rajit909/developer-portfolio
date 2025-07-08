import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { getProfile } from '@/lib/api';
import { headers } from 'next/headers';
import type { User } from '@/lib/user';

// This function now reads user data securely passed from the middleware
// via request headers. It no longer needs to verify the token itself.
async function getUserFromHeaders(): Promise<(User & { id: string }) | null> {
    const headersList = headers();
    
    const userId = headersList.get('x-user-id');
    const userName = headersList.get('x-user-name');
    const userEmail = headersList.get('x-user-email');

    if (!userId || !userName || !userEmail) {
        // This case should ideally not be reached if the middleware is working
        // correctly, as it would have redirected unauthenticated users.
        return null;
    }

    return {
        _id: userId as any, // Not a real ObjectId, but satisfies the type for the client
        id: userId,
        name: userName,
        email: userEmail,
    };
}


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // By the time this layout renders, the middleware has already validated
  // the user's token. We can now safely get the user data from the headers.
  const user = await getUserFromHeaders();

  // If for some reason the user data isn't present in the headers,
  // it indicates a server or middleware configuration error.
  // We redirect to login to be safe, although the middleware should have already done this.
  if (!user) {
    redirect('/login');
  }

  const profile = await getProfile();
  
  // We rename the user object to session to match what AdminLayoutClient expects
  const session = { user };

  return <AdminLayoutClient profile={profile} session={session}>{children}</AdminLayoutClient>;
}
