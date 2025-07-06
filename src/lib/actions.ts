"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { suggestBlogTags, SuggestBlogTagsInput } from "@/ai/flows/suggest-blog-tags";
import { suggestBlogContent, SuggestBlogContentInput } from "@/ai/flows/suggest-blog-content";
import { generateBlogImage, GenerateBlogImageInput } from "@/ai/flows/generate-blog-image";
import clientPromise from "./mongodb";
import { BlogPost, Project, Achievement } from "./types";
import { ObjectId } from "mongodb";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function handleContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors and try again.",
    };
  }
  
  // In a real app, you'd send an email here.
  // For this demo, we'll just log it to the console.
  console.log("Contact form submitted:", validatedFields.data);

  return { message: "Thank you for your message! I'll get back to you soon.", errors: {} };
}

const postSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    content: z.string().min(50, "Content must be at least 50 characters."),
    tags: z.string(), // comma separated string
    imageUrl: z.string().url("A valid featured image URL is required.").min(1),
});

const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Short description must be at least 10 characters."),
    longDescription: z.string().min(50, "Long description must be at least 50 characters."),
    technologies: z.string().min(1, "Please add at least one technology."),
    imageUrl: z.string().url("A valid image URL is required.").min(1),
    githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    liveUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    featured: z.preprocess((val) => val === 'on', z.boolean()),
});

const achievementSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    year: z.string().min(4, "Please enter a valid year."),
    icon: z.enum(['Trophy', 'Award', 'Code', 'Users'], {
        errorMap: () => ({ message: "Please select a valid icon." })
    }),
});

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    headline: z.string().min(10, "Headline must be at least 10 characters."),
    bio: z.string().min(20, "Bio must be at least 20 characters."),
    profilePictureUrl: z.string().url("Please enter a valid URL."),
    githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    linkedinUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    twitterUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

function createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters
      .trim()
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
}

export async function handleNewPost(prevState: any, formData: FormData) {
    let slug;
    try {
        const validatedFields = postSchema.safeParse({
            title: formData.get("title"),
            content: formData.get("content"),
            tags: formData.get("tags"),
            imageUrl: formData.get("imageUrl"),
        });
        
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }

        const { title, content, tags, imageUrl } = validatedFields.data;
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');
        
        const profile = await db.collection('profile').findOne({});
        if (!profile) {
            throw new Error("Profile data not found. Cannot create post without an author.");
        }

        slug = createSlug(title);

        const existingPost = await db.collection("posts").findOne({ slug });
        if (existingPost) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

        const newPost: Omit<BlogPost, '_id'> = {
            slug,
            title,
            content,
            tags: tagsArray,
            excerpt: content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
            author: profile.name,
            authorImage: profile.profilePictureUrl,
            date: new Date().toISOString(),
            imageUrl: imageUrl,
            'data-ai-hint': 'blog abstract',
        };
        
        const result = await db.collection("posts").insertOne(newPost);
        
        if (!result.insertedId) {
             throw new Error("Database error: Failed to create post.");
        }
        
        revalidatePath("/blog");
        revalidatePath(`/blog/${slug}`);
        revalidatePath("/admin/blog");
        revalidatePath("/");
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error("Post creation error:", error);

        if (error.message.includes('MONGODB_URI')) {
            return {
                message: "Database connection failed. Please check your MONGODB_URI in the .env file.", 
                errors: {} 
            }
        }

        return { 
            message: error.message || "An unexpected error occurred. Please try again.", 
            errors: {} 
        };
    }
    
    if (slug) {
        redirect(`/blog/${slug}`);
    }
}


export async function handleUpdatePost(originalSlug: string, prevState: any, formData: FormData) {
    let newSlug = originalSlug;
    try {
        const validatedFields = postSchema.safeParse({
            title: formData.get("title"),
            content: formData.get("content"),
            tags: formData.get("tags"),
            imageUrl: formData.get("imageUrl"),
        });
        
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }

        const { title, content, tags, imageUrl } = validatedFields.data;
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');

        const profile = await db.collection('profile').findOne({});
        if (!profile) {
            throw new Error("Profile data not found. Cannot update post without an author.");
        }
        
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

        const updatedPostData: Partial<BlogPost> = {
            title,
            content,
            tags: tagsArray,
            excerpt: content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
            imageUrl,
            date: new Date().toISOString(),
            author: profile.name,
            authorImage: profile.profilePictureUrl,
        };

        // If title changed, slug might need to change
        const potentialNewSlug = createSlug(title);
        if (potentialNewSlug !== originalSlug) {
            const existingPost = await db.collection("posts").findOne({ slug: potentialNewSlug });
            if (existingPost) {
                return {
                    errors: { title: ["This title creates a slug that is already in use."] },
                    message: "Please choose a different title.",
                };
            }
            updatedPostData.slug = potentialNewSlug;
            newSlug = potentialNewSlug;
        }

        const result = await db.collection("posts").updateOne(
            { slug: originalSlug },
            { $set: updatedPostData }
        );

        if (result.matchedCount === 0) {
            throw new Error("Post to update not found.");
        }

        // Revalidate all relevant paths
        revalidatePath("/blog");
        revalidatePath("/admin/blog");
        revalidatePath(`/blog/${originalSlug}`);
        if(newSlug !== originalSlug) {
            revalidatePath(`/blog/${newSlug}`);
        }
        revalidatePath("/");
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Post update error:", error);
        return { 
            message: error.message || "An unexpected error occurred. Please try again.", 
            errors: {} 
        };
    }
    
    redirect(`/blog/${newSlug}`);
}


export async function deletePost(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB URI not found.");
    }

    const client = await clientPromise;
    const db = client.db('portfolio-data');

    const result = await db.collection("posts").deleteOne({ slug });

    if (result.deletedCount === 0) {
      throw new Error("Could not find the post to delete.");
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath("/");

    return { success: true, message: "Post deleted successfully." };
  } catch (error: any) {
    console.error("Failed to delete post:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function handleNewProject(prevState: any, formData: FormData) {
    let slug;
    try {
        const validatedFields = projectSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }

        const { title, technologies, ...rest } = validatedFields.data;
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');
        
        slug = createSlug(title);

        const existingProject = await db.collection("projects").findOne({ slug });
        if (existingProject) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        
        const techsArray = technologies.split(',').map(tech => tech.trim()).filter(Boolean);

        const newProject: Omit<Project, '_id'> = {
            slug,
            title,
            technologies: techsArray,
            ...rest,
            'data-ai-hint': 'project technology',
        };
        
        const result = await db.collection("projects").insertOne(newProject);
        
        if (!result.insertedId) {
             throw new Error("Database error: Failed to create project.");
        }
        
        revalidatePath("/projects");
        revalidatePath(`/projects/${slug}`);
        revalidatePath("/admin/projects");
        revalidatePath("/");
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error("Project creation error:", error);
        if (error.message.includes('MONGODB_URI')) {
            return { message: "Database connection failed.", errors: {} }
        }
        return { message: error.message || "An unexpected error occurred.", errors: {} };
    }
    
    redirect(`/admin/projects`);
}

export async function handleUpdateProject(originalSlug: string, prevState: any, formData: FormData) {
    let newSlug = originalSlug;
    try {
        const validatedFields = projectSchema.safeParse(Object.fromEntries(formData.entries()));
        
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }

        const { title, technologies, ...rest } = validatedFields.data;
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');
        
        const techsArray = technologies.split(',').map(tech => tech.trim()).filter(Boolean);

        const updatedProjectData: Partial<Project> = {
            title,
            technologies: techsArray,
            ...rest
        };

        const potentialNewSlug = createSlug(title);
        if (potentialNewSlug !== originalSlug) {
            const existingProject = await db.collection("projects").findOne({ slug: potentialNewSlug });
            if (existingProject) {
                return {
                    errors: { title: ["This title creates a slug that is already in use."] },
                    message: "Please choose a different title.",
                };
            }
            updatedProjectData.slug = potentialNewSlug;
            newSlug = potentialNewSlug;
        }

        const result = await db.collection("projects").updateOne(
            { slug: originalSlug },
            { $set: updatedProjectData }
        );

        if (result.matchedCount === 0) throw new Error("Project to update not found.");

        revalidatePath("/projects");
        revalidatePath("/admin/projects");
        revalidatePath(`/projects/${originalSlug}`);
        if(newSlug !== originalSlug) revalidatePath(`/projects/${newSlug}`);
        revalidatePath("/");
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error("Project update error:", error);
        return { message: error.message || "An unexpected error occurred.", errors: {} };
    }
    
    redirect(`/admin/projects`);
}

export async function deleteProject(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MongoDB URI not found.");
    const client = await clientPromise;
    const db = client.db('portfolio-data');
    const result = await db.collection("projects").deleteOne({ slug });
    if (result.deletedCount === 0) throw new Error("Could not find the project to delete.");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true, message: "Project deleted successfully." };
  } catch (error: any) {
    console.error("Failed to delete project:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function handleNewAchievement(prevState: any, formData: FormData) {
    try {
        const validatedFields = achievementSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');
        
        const result = await db.collection("achievements").insertOne(validatedFields.data);
        
        if (!result.insertedId) {
             throw new Error("Database error: Failed to create achievement.");
        }
        
        revalidatePath("/admin/achievements");
        revalidatePath("/");
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error("Achievement creation error:", error);
        if (error.message.includes('MONGODB_URI')) {
            return { message: "Database connection failed.", errors: {} }
        }
        return { message: error.message || "An unexpected error occurred.", errors: {} };
    }
    
    redirect(`/admin/achievements`);
}

export async function handleUpdateAchievement(id: string, prevState: any, formData: FormData) {
    try {
        const validatedFields = achievementSchema.safeParse(Object.fromEntries(formData.entries()));
        
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');
        
        const result = await db.collection("achievements").updateOne(
            { _id: new ObjectId(id) },
            { $set: validatedFields.data }
        );

        if (result.matchedCount === 0) throw new Error("Achievement to update not found.");

        revalidatePath("/admin/achievements");
        revalidatePath("/");
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error("Achievement update error:", error);
        return { message: error.message || "An unexpected error occurred.", errors: {} };
    }
    
    redirect(`/admin/achievements`);
}


export async function deleteAchievement(id: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MongoDB URI not found.");
    const client = await clientPromise;
    const db = client.db('portfolio-data');
    const result = await db.collection("achievements").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error("Could not find the achievement to delete.");
    revalidatePath("/admin/achievements");
    revalidatePath("/");
    return { success: true, message: "Achievement deleted successfully." };
  } catch (error: any) {
    console.error("Failed to delete achievement:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function handleUpdateProfile(prevState: any, formData: FormData) {
    try {
        const validatedFields = profileSchema.safeParse(Object.fromEntries(formData.entries()));
        
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please correct the errors and try again.",
            };
        }
        
        const client = await clientPromise;
        const db = client.db('portfolio-data');
        
        const { ...profileData } = validatedFields.data;

        const result = await db.collection("profile").updateOne(
            {}, // Update the single document in the collection
            { $set: profileData },
            { upsert: true } // Create it if it doesn't exist
        );

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            throw new Error("Profile to update not found and could not be created.");
        }

        revalidatePath('/', 'layout'); // Revalidate the entire site
        
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error("Profile update error:", error);
        return { message: error.message || "An unexpected error occurred.", errors: {} };
    }
    
    redirect(`/admin/profile`);
}


export async function getTagSuggestions(content: string) {
    if (!content || content.trim().length < 50) {
        return { error: "Please provide at least 50 characters of content to get suggestions." };
    }
    
    try {
        const input: SuggestBlogTagsInput = { content };
        const result = await suggestBlogTags(input);
        return { tags: result.tags };
    } catch (error) {
        console.error("Error getting tag suggestions:", error);
        return { error: "Failed to get tag suggestions. Please try again later." };
    }
}

export async function getBlogContentSuggestion(topic: string) {
    if (!topic || topic.trim().length < 5) {
        return { error: "Please provide a topic of at least 5 characters." };
    }

    try {
        const input: SuggestBlogContentInput = { topic };
        const result = await suggestBlogContent(input);
        return { content: result.content };
    } catch (error) {
        console.error("Error getting blog content suggestion:", error);
        return { error: "Failed to get content suggestion. Please try again later." };
    }
}

export async function getBlogImageSuggestion(prompt: string) {
    if (!prompt || prompt.trim().length < 5) {
        return { error: "Please provide a prompt of at least 5 characters." };
    }

    try {
        const input: GenerateBlogImageInput = { prompt };
        const result = await generateBlogImage(input);
        return { imageUrl: result.imageUrl };
    } catch (error) {
        console.error("Error getting blog image suggestion:", error);
        return { error: "Failed to get image suggestion. Please try again later." };
    }
}
