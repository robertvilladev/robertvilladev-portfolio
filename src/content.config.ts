import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One markdown file per project per locale: src/content/projects/<lang>/<slug>.md
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    pid: z.string(),
    order: z.number(),
    repo: z.url(),
    demo: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
