import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts: drop a Markdown file in src/content/blog/ and it shows up
// automatically on /blog and in the RSS feed.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Projects: one Markdown file per project. Body is the project write-up;
// frontmatter drives the card on /projects.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().default(''),
    status: z.enum(['live', 'in progress', 'paused', 'planned']).default('planned'),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
