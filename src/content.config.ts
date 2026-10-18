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
    /** Private repo: never linked or fetched (009). */
    private: z.boolean().default(false),
  }),
});

// One MDX file per note per locale: src/content/notes/<lang>/<slug>.mdx (018). Every locale has every slug.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    /** Slug of the project this note is about; its page links here. */
    project: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };
