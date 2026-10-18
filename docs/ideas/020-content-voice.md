# 020 · Content voice

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 4 · Depth | Content & data | H | M | none |

**Depends on:** —

## Why
The landing copy should present Robert as a software engineer, in one steady voice. Right now the title changes from place to place ("Fullstack developer", "Full Stack Engineer", "Full Stack Developer"). Career notes switch between third person, first person and no subject. Some notes carry metrics in too much detail, the skills list puts `motion/` first and leaves out testing, CI and Docker, and the project summaries have no common shape.

## Scope
**In**
- `docs/CONTENT.md`: a short voice and style guide for every future text, linked from `docs/README.md` and `CLAUDE.md`.
- A rewrite in en, es and ca of:
  - meta title, description and jobTitle (the jobTitle feeds the JSON-LD Person and the home OG image);
  - the hero role;
  - the About body (keeping the "I build things to see how they actually work" headline) and the Contact body;
  - the About skills list, plus `site.stack` to match it;
  - all 5 career notes;
  - all 6 project summaries, with a light consistency pass on the project bodies;
  - the terminal's `whoami` and `about.md`, which read the same keys.
- Tests that assert old copy.

**Out**
- New facts: no new roles, dates, metrics, clients or skills he hasn't listed somewhere already.
- New sections, layout changes, new i18n keys.
- Microcopy (prompts, `./nav`, terminal jokes). It stays as it is.

## Research: how well-known developer portfolios write
Sites read: Brittany Chiang, Lee Robinson, Josh Comeau, Cassie Evans, Paco Coursey, Delba de Oliveira, Kent C. Dodds, Rauno Freiberg and Tania Rascia. These are patterns only, with no copied text.

| Section | Pattern |
| --- | --- |
| **Hero** | A name, a plain title or one-line identity, and at most one sentence on what they do. Most use first person ("I build…"). The rest use bare fragments. No metrics. The title is a common one, not a list of stacks. |
| **About** | Almost always first person, warm and plain, in two or three short paragraphs. Present tense for now and past tense for history. Employers are named inside sentences, not as a résumé. A personal line (hobbies, what drives them) closes it. |
| **Skills** | Almost nobody has a skills section. Skills show up as short tag lists under a job or project, or as a "tools" list. Plain names in neutral lists, with no proficiency bars or levels. |
| **Experience** | Where there is a timeline (Chiang is the clearest), each role gets a "Role · Company" heading, a date range and 2–3 sentences that start with a verb and have an implied "I". Present tense for the current role, past for earlier ones. Metrics are rare; the credibility comes from the kind of work and the clients. Others fold their career into the About prose. |
| **Projects** | A linked name, then one sentence or noun phrase: what it is and why it's interesting. Present tense and impersonal. Numbers only when public and simple (stars, installs). |
| **Contact** | Short and low-pressure: one inviting line ("say hi" style) or just a row of links and an email. Nobody writes a sales pitch. |

**What this repo takes from it**
- One title, stated plainly, in the hero and meta.
- First person in prose, with a plain, warm, short tone.
- A career note is a verb-led sentence or two, and the tense follows the role.
- A project summary is one sentence: what it is, then the interesting part.
- The skills list stays (it's part of the terminal look), but as plain tags grouped by area.
- Contact is one neutral invitation.

## Decisions (approved by Robert)
1. **Title.** "Software engineer" everywhere: `meta.title`, `meta.jobTitle` and `hero.role`. "Full-stack" goes in the descriptions, e.g. "Software engineer building full-stack web products".
2. **`docs/CONTENT.md`** sets the rules:
   - first person, plain words;
   - present tense for the current role, past tense for earlier ones;
   - terminal flavour in microcopy only, never in the substance;
   - "full-stack" with a hyphen, and product names in their official casing;
   - the length limits below;
   - es and ca written natively, with the same structure as en.

   | Field | Limit |
   | --- | --- |
   | Hero role | ≤ 60 chars |
   | About body | ≤ 3 short paragraphs |
   | Career note | 1–2 sentences, at most one plain-language outcome |
   | Project summary | 1 sentence, ≤ 160 chars: what it is + what's interesting |
3. **Skills.** `motion/` is replaced by `quality/` (testing · e2e · ci · docker). gsap moves into `frontend/`. `curiosity.lock` stays. `site.stack` follows.
4. **Contact.** A neutral invitation, with no availability claim. Ask Robert in the PR.
5. **Add no new facts.** Only rephrase, trim and restructure. Anything uncertain keeps the fact and becomes a question in the PR.
6. **i18n keys stay stable**, which matters because 018 adds keys to the same file in parallel.

## Approach
- The copy lives in `src/i18n/ui.ts` (existing keys only), `src/data/career.ts`, `src/content/projects/*/*.md`, `src/components/sections/About.astro` and `src/config.ts`.
- The About body may hold up to 3 paragraphs in one key, separated by a blank line. `About.astro` splits it into `<p>`s.
- The terminal (`/terminal/<lang>.json`) and the OG images read the same keys, so they update without code changes.

## Guardrails
- The SEO tests need unique titles and descriptions per locale, and Lighthouse SEO stays at 100.
- No overflow or awkward wrapping at 375 px in any locale.
- Perf: none. Text only.

## Open questions
- Is Robert open to new roles? The Contact copy stays neutral until he answers.
- Career headings show the job titles he held ("Full Stack Engineer @ ERNI"). Those are facts, so they stay, written as "Full-Stack" to follow the guide.

## Done when
- [ ] `docs/CONTENT.md` exists and is linked from `docs/README.md` and `CLAUDE.md`.
- [ ] Every string listed in Scope is rewritten in en, es and ca and follows the guide.
- [ ] Build, unit, size and e2e checks pass, and Lighthouse SEO is 100.
- [ ] Visual check at desktop and 375 px in all three locales, OG images included.
