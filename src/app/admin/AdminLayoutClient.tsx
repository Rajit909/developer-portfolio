"use client";

import AdminNav from '@/components/AdminNav';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { Profile } from '@/lib/types';

export default function AdminLayoutClient({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {
  return (
    <SidebarProvider>
        <Sidebar>
            <AdminNav profile={profile} />
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
