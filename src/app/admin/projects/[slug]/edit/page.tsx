import { getProjectBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditProjectForm from '@/components/EditProjectForm';
import { Project } from '@/lib/types';

interface EditProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const plainProject = JSON.parse(JSON.stringify(project)) as Project;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Edit Project</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Make changes to your project and save them.
        </p>
      </div>
      <EditProjectForm project={plainProject} />
    </div>
  );
}
