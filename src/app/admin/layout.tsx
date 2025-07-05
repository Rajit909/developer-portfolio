"use client";

import AdminNav from '@/components/AdminNav';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <Sidebar>
            <AdminNav />
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
