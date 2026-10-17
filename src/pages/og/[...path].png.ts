import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { langs, t as useT, type Lang } from '@/i18n/ui';
import { projectPaths, slugOf, type Project } from '@/lib/projects';
import { site } from '@/config';

// Build-time share cards: /og/<lang>/home.png and /og/<lang>/<slug>.png (1200×630, dark palette from tokens.css).
const c = { bg: '#0c0a18', surface: '#15122a', line: '#2e2950', text: '#eceaf6', body: '#bdb8d6', muted: '#968fb8', accent: '#2ef2d0', pink: '#ff4fa3', hash: '#febc2e' };
const homeStack = ['typescript', 'python', 'react', 'angular', 'node'];

// satori can't read woff2 (what the site ships), so the static woff builds of the same families are loaded.
const font = (pkg: string, file: string) => readFileSync(createRequire(import.meta.url).resolve(`@fontsource/${pkg}/files/${pkg}-latin-${file}-normal.woff`));
const fonts = [
  { name: 'JetBrains Mono', data: font('jetbrains-mono', '400'), weight: 400 as const },
  { name: 'JetBrains Mono', data: font('jetbrains-mono', '700'), weight: 700 as const },
  { name: 'Space Grotesk', data: font('space-grotesk', '700'), weight: 700 as const },
];

const h = (type: string, style: object, children?: unknown) => ({ type, props: { style: { display: 'flex', ...style }, children } });

interface Card { cmd: string; title: string; subtitle?: string; body?: string; tags: string[] }

const card = ({ cmd, title, subtitle, body, tags }: Card) =>
  h('div', { width: 1200, height: 630, background: c.bg, padding: 56, fontFamily: 'JetBrains Mono' }, [
    h('div', { flexDirection: 'column', width: 1088, height: 518, background: c.surface, border: `2px solid ${c.line}` }, [
      h('div', { alignItems: 'center', height: 56, padding: '0 24px', borderBottom: `2px solid ${c.line}`, gap: 10 }, [
        ...[c.pink, c.hash, c.accent].map((bg) => h('div', { width: 14, height: 14, borderRadius: 7, background: bg })),
        h('div', { marginLeft: 12, color: c.muted, fontSize: 20 }, `${site.handle} — zsh`),
      ]),
      h('div', { flexDirection: 'column', flex: 1, padding: '40px 48px', gap: 20 }, [
        h('div', { fontSize: 30, color: c.accent }, `~ $ ${cmd}`),
        h('div', { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: title.length > 18 ? 76 : 96, lineHeight: 1, color: c.text }, title),
        ...(subtitle ? [h('div', { fontSize: 34, color: c.accent }, subtitle)] : []),
        ...(body ? [h('div', { fontSize: 28, lineHeight: 1.4, color: c.body, maxWidth: 980 }, body)] : []),
        h('div', { flex: 1 }),
        h('div', { gap: 12, flexWrap: 'wrap' }, tags.map((tag) => h('div', { border: `2px solid ${c.line}`, padding: '8px 16px', fontSize: 24, color: c.text }, tag))),
      ]),
    ]),
  ]);

export async function getStaticPaths() {
  const homes = langs.map((lang) => ({ params: { path: `${lang}/home` }, props: { lang } }));
  const projects = (await projectPaths()).map(({ props: { lang, entry } }) => ({ params: { path: `${lang}/${slugOf(entry)}` }, props: { lang, entry } }));
  return [...homes, ...projects];
}

export const GET: APIRoute = async ({ props }) => {
  const { lang, entry } = props as { lang: Lang; entry?: Project };
  const spec: Card = entry
    ? { cmd: `cat ${slugOf(entry)}`, title: entry.data.title, body: entry.data.summary, tags: entry.data.stack }
    : { cmd: 'whoami', title: site.name, subtitle: useT(lang)('meta.jobTitle'), tags: homeStack };
  const svg = await satori(card(spec) as never, { width: 1200, height: 630, fonts });
  return new Response(new Uint8Array(new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng()), { headers: { 'Content-Type': 'image/png' } });
};
