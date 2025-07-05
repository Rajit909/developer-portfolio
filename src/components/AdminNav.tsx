"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Briefcase, Award, User, Settings, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <aside className="w-64 flex-shrink-0 border-r bg-background hidden md:block">
      <div className="flex h-full flex-col">
        <div className="p-4 border-b">
           <Link href="/" className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg font-bold">Rajit Kumar</span>
            </Link>
            <span className="text-sm text-muted-foreground ml-1">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              const isDisabled = link.href !== '/admin' && link.href !== '/admin/blog';
              return (
                <li key={link.href}>
                  <Link
                    href={isDisabled ? '#' : link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
             <li>
                <Link
                    href="/"
                    target="_blank"
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Settings className="h-5 w-5" />
                    <span>View Live Site</span>
                  </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
