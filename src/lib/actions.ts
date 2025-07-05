"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { suggestBlogTags, SuggestBlogTagsInput } from "@/ai/flows/suggest-blog-tags";
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

  return { message: "Thank you for your message! I'll get back to you soon." };
}

const postSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    content: z.string().min(50, "Content must be at least 50 characters."),
    tags: z.string(), // comma separated string
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
    if (!process.env.MONGODB_URI) {
        return { message: "Database is not configured. Please set the MONGODB_URI environment variable.", errors: {} };
    }

    const validatedFields = postSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
        tags: formData.get("tags"),
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors and try again.",
        };
    }

    const { title, content, tags } = validatedFields.data;
    let finalSlug = "";

    try {
        const client = await clientPromise;
        const db = client.db();
        
        let slug = createSlug(title);

        // Check if slug already exists and make it unique if necessary
        const existingPost = await db.collection("posts").findOne({ slug });
        if (existingPost) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        finalSlug = slug;
        
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
            imageUrl: 'https://placehold.co/800x600.png',
            'data-ai-hint': 'blog abstract',
        };

        const result = await db.collection("posts").insertOne(newPost);
        
        if (!result.insertedId) {
             return { message: "Database error: Failed to create post.", errors: {} };
        }

        revalidatePath("/blog");
        revalidatePath(`/blog/${slug}`);

    } catch (error) {
        console.error("Database insertion error:", error);
        return { message: "An unexpected error occurred. Please try again.", errors: {} };
    }
    
    // If we reach here, it means success. Redirect to the new post.
    redirect(`/blog/${finalSlug}`);
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
