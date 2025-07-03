import { projects, blogPosts, achievements, techStack } from './data';
import type { Project, BlogPost, Achievement, Tech } from './types';

export async function getProjects(): Promise<Project[]> {
    return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    return projects.find(p => p.slug === slug);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    return blogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return blogPosts.find(p => p.slug === slug);
}

export async function getAchievements(): Promise<Achievement[]> {
    return achievements;
}

export async function getTechStack(): Promise<Tech[]> {
    return techStack;
}
