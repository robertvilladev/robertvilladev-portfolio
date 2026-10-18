# Content guide

Every piece of text on the site follows this, in all three languages. The reasoning and research are in [ideas/020-content-voice.md](ideas/020-content-voice.md).

## Voice
- **First person, plain words.** Write "I build…", not "Owns…" or a bare fragment. Use short sentences and no buzzwords.
- **Tense follows the role.** Use present tense for the current job and past tense for earlier ones.
- **The title is "Software engineer"** everywhere: meta, JSON-LD, hero. "Full-stack" can describe the work, as in "building full-stack web products".
- **Terminal flavour is for microcopy only.** Prompts, labels, `./nav`, `cd ..` and the jokes in the terminal can play. Everything that says what Robert does or did stays plain.
- **No new facts.** Copy changes rephrase what's true. A number, client or skill needs a source (LinkedIn, the repo).

## Spelling
- Write "full-stack" with a hyphen ("Full-Stack" in a job title).
- Product names keep their official casing: TypeScript, Next.js, GSAP in prose, PostgreSQL. Lowercase tag lists (`stack`, skills) are a style and are fine.

## Length

| Field | Where | Limit |
| --- | --- | --- |
| Hero role | `hero.role` | ≤ 60 chars |
| Meta description | `meta.description` | ≤ 160 chars, unique per locale |
| About body | `about.body` | ≤ 3 short paragraphs, separated by a blank line |
| Career note | `src/data/career.ts` | 1–2 sentences, at most one plain-language outcome (no metric chains) |
| Project summary | `summary` in `src/content/projects/*/*.md` | 1 sentence, ≤ 160 chars: what it is, then what's interesting about it |
| Project body | the markdown below the front matter | one short paragraph or a short list, about how it's built |

## Languages
- es and ca are written natively. They keep the same structure and the same facts as en, not a word-for-word translation.
- Tech terms people use untranslated (frontend, stack, E2E, roguelike) stay in English.
