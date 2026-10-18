import { readdirSync, readFileSync } from 'node:fs';

/** Project slugs, repos and the private flag, read from the default locale's frontmatter. */
export const projects = readdirSync('src/content/projects/en').map((f) => {
  const md = readFileSync(`src/content/projects/en/${f}`, 'utf8');
  return { slug: f.replace(/\.md$/, ''), repo: md.match(/^repo: (.+)$/m)![1].trim(), private: /^private: true$/m.test(md) };
});
export const privateSlugs = projects.filter((p) => p.private).map((p) => p.slug);
