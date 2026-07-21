import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    lastModified: z.string().optional(),
    category: z.string(),
    readTime: z.string(),
    image: z.string(),
    linkedinUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    keyTakeaways: z.array(z.string()).optional(),
  }),
});

export const collections = { articles };
