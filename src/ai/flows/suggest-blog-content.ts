// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview A Genkit flow that suggests blog post content based on a given topic.
 *
 * - suggestBlogContent - A function that takes a blog post topic as input and returns suggested content.
 * - SuggestBlogContentInput - The input type for the suggestBlogContent function.
 * - SuggestBlogContentOutput - The return type for the suggestBlogContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBlogContentInputSchema = z.object({
  topic: z.string().describe('The topic or title of the blog post.'),
});
export type SuggestBlogContentInput = z.infer<typeof SuggestBlogContentInputSchema>;

const SuggestBlogContentOutputSchema = z.object({
  content: z.string().describe('The suggested blog post content in HTML format.'),
});
export type SuggestBlogContentOutput = z.infer<typeof SuggestBlogContentOutputSchema>;

export async function suggestBlogContent(input: SuggestBlogContentInput): Promise<SuggestBlogContentOutput> {
  return suggestBlogContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBlogContentPrompt',
  input: {schema: SuggestBlogContentInputSchema},
  output: {schema: SuggestBlogContentOutputSchema},
  prompt: `You are an expert blog post writer.

  Given a topic, you will write a short, engaging blog post about it. The output should be in HTML format.
  Use appropriate HTML tags like <h1>, <h2>, <p>, and <ul> for lists.
  The main title of the post should be an <h1> tag based on the topic.

  Topic: {{{topic}}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestBlogContentFlow = ai.defineFlow(
  {
    name: 'suggestBlogContentFlow',
    inputSchema: SuggestBlogContentInputSchema,
    outputSchema: SuggestBlogContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
