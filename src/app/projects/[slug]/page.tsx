import { getProjects, getProjectBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
        <article className="space-y-8">
            <div className="space-y-4">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">{project.title}</h1>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                </div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={project['data-ai-hint']}
                />
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>{project.longDescription}</p>
            </div>

            <div className="flex gap-4">
                {project.githubUrl && (
                    <Button asChild>
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" /> View Code
                        </Link>
                    </Button>
                )}
                {project.liveUrl && (
                    <Button asChild variant="outline">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                        </Link>
                    </Button>
                )}
            </div>
        </article>
    </div>
  );
}
