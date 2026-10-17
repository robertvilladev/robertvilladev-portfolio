// Fails when the gzipped JS in dist/_astro exceeds the first-paint budget (docs/ARCHITECTURE.md).
// ponytail: sums every chunk, which equals first-paint JS while nothing is lazy-loaded; split per entry once dynamic imports land.
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET = 60 * 1024;
const dir = 'dist/_astro';
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
let total = 0;
for (const f of files) {
  const size = gzipSync(readFileSync(`${dir}/${f}`)).length;
  total += size;
  console.log(`${(size / 1024).toFixed(1).padStart(6)} KB  ${f}`);
}
const ok = total <= BUDGET;
console.log(`${ok ? 'OK' : 'FAIL'}: ${(total / 1024).toFixed(1)} KB gzipped JS, budget ${BUDGET / 1024} KB`);
if (!ok) process.exit(1);
