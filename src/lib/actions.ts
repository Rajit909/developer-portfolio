"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { suggestBlogTags, SuggestBlogTagsInput } from "@/ai/flows/suggest-blog-tags";
import { suggestBlogContent, SuggestBlogContentInput } from "@/ai/flows/suggest-blog-content";
import { generateBlogImage, GenerateBlogImageInput } from "@/ai/flows/generate-blog-image";
import clientPromise from "./mongodb";

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
    imageUrl: z.string().min(10, "A featured image is required."),
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
        
        slug = createSlug(title);

        const existingPost = await db.collection("posts").findOne({ slug });
        if (existingPost) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

        const newPost = {
            slug,
            title,
            content,
            tags: tagsArray,
            excerpt: content.substring(0, 150) + '...',
            author: 'Rajit Kumar',
            authorImage: 'https://placehold.co/40x40.png',
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
