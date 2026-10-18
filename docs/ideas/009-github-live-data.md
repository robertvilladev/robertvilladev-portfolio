# 009 · GitHub data at build time

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 2 · Real content | Content & data | M | S | none |

**Depends on:** [002](002-deploy-and-ci.md)

## Why
Last push, recent commits and languages make the projects feel alive, and a `git log -1` line in the hero shows activity.

## Scope
**In**
- Per public project: ps-style status from the last push, "updated <relative>", language bar, last 3 commits
- Hero line: `~ $ git log -1 --oneline` with the newest public commit (portfolio included)
- Terminal (007): `git log [project]`, data baked into `/terminal/<lang>.json`
- JSON-LD `SoftwareSourceCode`: `dateModified`, `programmingLanguage`
- `private` flag on projects: no repo link anywhere, a "private repo" tag, never fetched
- Daily rebuild through a Vercel deploy hook

**Out**
- Fetching from the browser
- Stars (see open questions)

## Approach
- `src/lib/github.ts`, build time only, one memoized promise per build so every page shares one fetch. Repos: the public projects' `repo` URLs plus `robertvilladev/robertvilladev-portfolio`.
- Per repo, in parallel: `repos/:r` (`pushed_at`, `default_branch`, `private`), `repos/:r/languages`, `repos/:r/commits?per_page=10` (merge commits dropped, keep sha, subject, date, url). The public events API no longer carries commit messages.
- A repo the API reports as private is dropped. Optional `GITHUB_TOKEN` as `Authorization: Bearer`.
- Never fails the build: 4 s timeout per request; any error makes that repo `null` with one `console.warn`. `GITHUB_DATA=off` skips the network (CI e2e uses it, so tests are deterministic).
- Pure helpers, unit tested: `status(pushedAt, now)` (running < 30 days, sleeping < 365, else stopped), latest-commit pick, language percentages (top 4 + other).
- Rendering falls back to today's markup when data is missing: cards keep "running", the hero line and the detail extras disappear.
- `.github/workflows/rebuild.yml`: daily cron 05:00 UTC + manual, POSTs `secrets.VERCEL_DEPLOY_HOOK`; exits 0 with a notice if unset.

## Guardrails
Zero runtime cost: no new client JS outside the lazy terminal chunk (≤ 10 KB). The build must succeed offline. Colors only from tokens, light and dark. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Show stars at all? No. Every repo has 0–1 stars; they're not fetched or shown.
- Private repos (mancos-gg, omdb-explorer, veggie-vendetta)? `private: true` in their content: no repo link (card, page, terminal, JSON-LD `codeRepository`), a localized tag, never fetched.

## Done when
- [ ] Cards show live data
- [ ] The build passes without network (`GITHUB_DATA=off` and actually offline)
- [ ] Private repos are never linked or fetched
- [ ] The daily rebuild workflow exists
