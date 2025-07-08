"use client";

import AdminNav from '@/components/AdminNav';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { Profile } from '@/lib/types';
import type { User } from '@/lib/user';

// Simplified session type for our custom auth
interface CustomSession {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

export default function AdminLayoutClient({
  children,
  profile,
  session,
}: {
  children: React.ReactNode;
  profile: Profile;
  session: CustomSession;
}) {
  return (
    <SidebarProvider>
        <Sidebar>
            <AdminNav session={session} />
        </Sidebar>
        <SidebarInset className="bg-muted/40">
            <div className="p-8">
                <div className="mb-4">
                    <SidebarTrigger />
                </div>
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
