import { getProjects } from '@/lib/api';
import ProjectFilters from '@/components/ProjectFilters';

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">My Work</h1>
        <p className="mt-2 text-lg text-muted-foreground">A collection of my projects. Use the filters to explore.</p>
      </div>
      <ProjectFilters projects={projects} />
    </div>
  );
}
