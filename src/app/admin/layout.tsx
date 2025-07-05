import AdminNav from '@/components/AdminNav';

export const metadata = {
  title: 'Admin - Rajit Kumar',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
