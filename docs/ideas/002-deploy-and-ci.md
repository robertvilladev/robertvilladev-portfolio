# 002 · Deploy and CI

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 0 · Ship it | Foundation | H | S | none |

**Depends on:** —

## Why
Nothing is public yet. Every later feature needs a preview URL per branch to review it.

## Scope
**In**
- GitHub repo + Vercel project (static output)
- Preview deploy per branch/PR, production on `main`
- Domain `robertvilla.dev` (or chosen domain) with HTTPS
- GitHub Action: `npm ci && npm run build` (includes `astro check`) on every PR

**Out**
- Lighthouse/Playwright gates (that is 003)

## Approach
No adapter needed: Astro static output deploys as-is. One workflow file in `.github/workflows/ci.yml`.

## Guardrails
Build must fail on type errors or invalid content. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Domain already owned? Which registrar?
- Vercel or another static host (Cloudflare Pages, Netlify)?

## Done when
- [ ] Production URL serves the site
- [ ] Every PR gets a preview link and a green build check
