import { getProfile } from '@/lib/api';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  return <AdminLayoutClient profile={profile}>{children}</AdminLayoutClient>;
}
