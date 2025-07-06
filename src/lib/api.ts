import { projects, achievements as staticAchievements, techStack, blogPosts as staticBlogPosts, profileData } from './data';
import type { Project, BlogPost, Achievement, Tech, Profile } from './types';

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

export async function getProfile(): Promise<Profile> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, falling back to static profile data.");
        return profileData;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/profile`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch profile, status: ${res.status}. Falling back to static data.`);
            return profileData;
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch profile, falling back to static data:", error);
        return profileData;
    }
}

export async function getProjects(): Promise<Project[]> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, falling back to static project data.");
        return projects;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/projects`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch projects, status: ${res.status}. Falling back to static data.`);
            return projects;
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch projects, falling back to static data:", error);
        return projects;
    }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, falling back to static project data for slug:", slug);
        return projects.find(p => p.slug === slug);
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${slug}`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`API failed to fetch project '${slug}', status: ${res.status}. Falling back to static data.`);
            return projects.find(p => p.slug === slug);
        }
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch project with slug ${slug}, falling back to static data:`, error);
        return projects.find(p => p.slug === slug);
    }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, falling back to static blog posts.");
        return staticBlogPosts;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/blog`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch blog posts, status: ${res.status}. Falling back to static data.`);
            return staticBlogPosts;
        }
        const postsData = await res.json();
        // Ensure the returned data is properly typed
        const posts: BlogPost[] = postsData.map((post: any) => ({
            ...post,
            date: new Date(post.date).toISOString(),
        }));
        return posts;
    } catch (error) {
        console.error("Failed to fetch blog posts, falling back to static data:", error);
        return staticBlogPosts;
    }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
     if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, falling back to static blog post for slug:", slug);
        return staticBlogPosts.find(p => p.slug === slug);
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/blog/${slug}`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`API failed to fetch post '${slug}', status: ${res.status}. Falling back to static data.`);
            return staticBlogPosts.find(p => p.slug === slug);
        }
        const postData = await res.json();
        const post: BlogPost = {
            ...postData,
            date: new Date(postData.date).toISOString(),
        }
        return post;
    } catch (error) {
        console.error(`Failed to fetch blog post with slug ${slug}, falling back to static data:`, error);
        return staticBlogPosts.find(p => p.slug === slug);
    }
}

export async function getAchievements(): Promise<Achievement[]> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, falling back to static achievement data.");
        return staticAchievements;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/achievements`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch achievements, status: ${res.status}. Falling back to static data.`);
            return staticAchievements;
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch achievements, falling back to static data:", error);
        return staticAchievements;
    }
}

export async function getAchievementById(id: string): Promise<Achievement | undefined> {
    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB URI not found, cannot fetch achievement by ID from static data.");
        return undefined;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/achievements/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch achievement by ID ${id}, status: ${res.status}.`);
            return undefined;
        }
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch achievement with ID ${id}:`, error);
        return undefined;
    }
}

export async function getTechStack(): Promise<Tech[]> {
    return techStack;
}
