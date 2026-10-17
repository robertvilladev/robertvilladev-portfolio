# 002 · Deploy and CI

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| done | 0 · Ship it | Foundation | H | S | none |

**Depends on:** —

## Why
Nothing is public yet. Every later feature needs a preview URL per branch to review it.

## Scope
**In**
- GitHub repo + Vercel project (static output)
- Preview deploy per branch/PR, production on `main`
- GitHub Action: `npm ci && npm run build` (includes `astro check`) on every PR

**Out**
- Lighthouse/Playwright gates (that is 003)
- Custom domain: `robertvilla.dev` isn't owned yet. Ship on the Vercel URL; buying and attaching the domain is a follow-up

## Approach
- **Host: Vercel.** Its GitHub app builds every push: preview URL per branch/PR, production on `main`. Framework preset Astro, build `npm run build`, output `dist/`. No adapter, no `vercel.json`.
- **Repo:** public `robertvilladev/robertvilladev-portfolio` (free Actions minutes, doubles as a code sample). Commits already use the GitHub noreply email.
- **CI:** `.github/workflows/ci.yml` on `pull_request` and `push` to `main`: checkout, `setup-node` (Node 24, npm cache), `npm ci`, `npm run build`. `build` already runs `astro check`, so type and content errors fail it.
- **Domain:** none for now. `site` in `astro.config.ts` stays `https://robertvilla.dev`, so canonical/sitemap URLs point there until it's bought.

## Guardrails
Build must fail on type errors or invalid content. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Decisions
- Domain: not owned yet; launch on `*.vercel.app`, domain later.
- Host: Vercel.

## Done when
- [x] Production URL serves the site: https://robertvilladev-portfolio.vercel.app
- [x] Every PR gets a preview link and a green build check
