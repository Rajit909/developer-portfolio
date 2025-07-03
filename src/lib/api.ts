import { projects, achievements, techStack } from './data';
import type { Project, BlogPost, Achievement, Tech } from './types';

// This is a temporary solution for determining the base URL.
// In a real production environment, you should use environment variables
// that are set differently for development and production.
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
    // Assume localhost for development. Update the port if yours is different.
    return 'http://localhost:9002'; 
};

const API_BASE_URL = getBaseUrl();

export async function getProjects(): Promise<Project[]> {
    // This still uses local data. Can be migrated later.
    return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    // This still uses local data. Can be migrated later.
    return projects.find(p => p.slug === slug);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, returning empty array for blog posts.");
        return [];
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/blog`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch blog posts, status: ${res.status}`);
            return [];
        }
        const postsData = await res.json();
        // Ensure the returned data is properly typed
        const posts: BlogPost[] = postsData.map((post: any) => ({
            ...post,
            date: new Date(post.date).toISOString(),
        }));
        return posts;
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return [];
    }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
     if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, returning undefined for blog post.");
        return undefined;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/blog/${slug}`, { cache: 'no-store' });
        if (!res.ok) {
            return undefined;
        }
        const postData = await res.json();
        const post: BlogPost = {
            ...postData,
            date: new Date(postData.date).toISOString(),
        }
        return post;
    } catch (error) {
        console.error(`Failed to fetch blog post with slug ${slug}:`, error);
        return undefined;
    }
}

export async function getAchievements(): Promise<Achievement[]> {
    return achievements;
}

export async function getTechStack(): Promise<Tech[]> {
    return techStack;
}
