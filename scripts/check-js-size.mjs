// Fails when a gzipped budget from docs/ARCHITECTURE.md is exceeded:
// - first paint: the JS the home page loads (its module scripts and their static imports) ≤ 60 KB
// - lazy terminal (007): every _astro asset no page loads up front + the largest /terminal/<lang>.json ≤ 14 KB
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const gz = (f) => gzipSync(readFileSync(f)).length;
const kb = (n) => (n / 1024).toFixed(1);
const read = (f) => readFileSync(f, 'utf8');

/** Page scripts in `html` plus every chunk they import statically (dynamic `import()` is skipped). */
function closure(html, seen = new Set()) {
  const visit = (f) => {
    if (seen.has(f)) return;
    seen.add(f);
    for (const [, dep] of read(`dist/_astro/${f}`).matchAll(/(?:from|import)\s*["']\.\/([^"']+\.js)["']/g)) visit(dep);
  };
  for (const [, f] of html.matchAll(/<script[^>]+src="\/_astro\/([^"]+\.js)"/g)) visit(f);
  return seen;
}

const pages = readdirSync('dist', { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.html')).map((f) => read(`dist/${f}`));
const upFront = closure(pages.join('\n'));
const assets = readdirSync('dist/_astro').filter((f) => /\.(js|css)$/.test(f));
const lazy = assets.filter((f) => !upFront.has(f) && !pages.some((h) => h.includes(f)));
const json = readdirSync('dist/terminal').map((f) => `terminal/${f}`).sort((a, b) => gz(`dist/${b}`) - gz(`dist/${a}`))[0];

let failed = false;
function budget(name, files, limit) {
  let total = 0;
  for (const f of files) {
    const size = gz(`dist/${f}`);
    total += size;
    console.log(`${kb(size).padStart(6)} KB  ${f}`);
  }
  const ok = total <= limit * 1024;
  failed ||= !ok;
  console.log(`${ok ? 'OK' : 'FAIL'}: ${name} ${kb(total)} KB gzipped, budget ${limit} KB\n`);
}

budget('first-paint JS', [...closure(read('dist/index.html'))].map((f) => `_astro/${f}`), 60);
budget('lazy terminal', [...lazy.map((f) => `_astro/${f}`), json], 14);
if (failed) process.exit(1);
