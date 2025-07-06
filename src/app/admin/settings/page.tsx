import { getTechStack } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import TechStackTable from '@/components/TechStackTable';

export default async function AdminSettingsPage() {
  const techStack = await getTechStack();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Manage Tech Stack</h1>
            <p className="text-muted-foreground">Here you can add, edit, and delete technologies from your stack.</p>
        </div>
        <Button asChild>
          <Link href="/admin/settings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Tech
          </Link>
        </Button>
      </div>
      <TechStackTable techStack={techStack} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
