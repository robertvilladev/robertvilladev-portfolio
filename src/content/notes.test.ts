import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { langs } from '../i18n/ui.ts';

// Notes are translated (018): every locale has every note, under the same slug.
test('every note exists in every locale', () => {
  const slugs = (lang: string) => readdirSync(new URL(`notes/${lang}/`, import.meta.url)).sort();
  assert.ok(slugs('en').length > 0);
  for (const lang of langs) assert.deepEqual(slugs(lang), slugs('en'), lang);
});
