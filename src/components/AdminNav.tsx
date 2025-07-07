"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Briefcase, Award, User, Settings, Code2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from './ui/sidebar';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/blog', label: 'Blog Posts', icon: Newspaper },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/achievements', label: 'Achievements', icon: Award },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminNav({ session }: { session: Session }) {
  const pathname = usePathname();
  const userInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'A';

  return (
    <>
      <SidebarHeader>
         <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">{session.user?.name}</span>
                <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{session.user?.email}</span>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={{ children: link.label }}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: 'View Live Site'}}>
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                        <Code2 />
                        <span>View Live Site</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/' })} tooltip={{children: 'Sign Out'}}>
                    <LogOut />
                    <span>Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
