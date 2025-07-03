"use server";

import { z } from "zod";
import { suggestBlogTags, SuggestBlogTagsInput } from "@/ai/flows/suggest-blog-tags";

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
