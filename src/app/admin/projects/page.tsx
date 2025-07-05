import { getProjects } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import ProjectsTable from '@/components/ProjectsTable';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Manage Projects</h1>
            <p className="text-muted-foreground">Here you can create, edit, and delete your projects.</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
