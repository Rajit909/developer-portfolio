import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import type { Session } from 'next-auth';
import { getProfile } from '@/lib/api';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  const profile = await getProfile();
  return <AdminLayoutClient profile={profile} session={session}>{children}</AdminLayoutClient>;
}
