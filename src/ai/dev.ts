import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-blog-tags.ts';
import '@/ai/flows/suggest-blog-content.ts';
import '@/ai/flows/generate-blog-image.ts';
import '@/ai/flows/generate-project-description.ts';
