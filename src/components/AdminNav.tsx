"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Briefcase, Award, User, Settings, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from './ui/sidebar';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/blog', label: 'Blog Posts', icon: Newspaper },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/achievements', label: 'Achievements', icon: Award },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">Rajit Kumar</span>
        </Link>
        <span className="text-sm text-muted-foreground -mt-2 ml-1 group-data-[collapsible=icon]:hidden">Admin Panel</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            const isDisabled = link.href === '/admin/profile' || link.href === '/admin/settings';
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  aria-disabled={isDisabled}
                  className={cn(isDisabled && 'opacity-50 cursor-not-allowed')}
                  tooltip={{ children: link.label }}
                >
                  <Link href={isDisabled ? '#' : link.href}>
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
                        <Settings />
                        <span>View Live Site</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
