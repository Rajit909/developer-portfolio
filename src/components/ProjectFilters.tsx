"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProjectGridProps {
    projects: Project[];
}

export default function ProjectFilters({ projects }: ProjectGridProps) {
    const allTechs = Array.from(new Set(projects.flatMap(p => p.technologies)));
    const [activeFilter, setActiveFilter] = useState<string>('All');

    const filteredProjects = activeFilter === 'All'
        ? projects
        : projects.filter(p => p.technologies.includes(activeFilter));

    return (
        <div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Button
                    variant={activeFilter === 'All' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('All')}
                >
                    All
                </Button>
                {allTechs.map(tech => (
                    <Button
                        key={tech}
                        variant={activeFilter === tech ? 'default' : 'outline'}
                        onClick={() => setActiveFilter(tech)}
                    >
                        {tech}
                    </Button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                    <ProjectCard key={project.slug} project={project} />
                ))}
            </div>
        </div>
    );
}
