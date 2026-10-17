# 019 · Privacy-friendly analytics

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 4 · Depth | Foundation | M | S | low |

**Depends on:** [002](002-deploy-and-ci.md)

## Why
To know which projects get opened, which languages are used and whether anyone finds the easter eggs. Without cookies or a consent banner.

## Scope
**In**
- Page views per locale, project opens, terminal commands used (no free text)
- No cookies, no personal data

**Out**
- Session recording, ad trackers

## Approach
Vercel Web Analytics or Plausible (one small script, cookieless). Custom events from the terminal/achievements bus.

## Guardrails
Under 2 KB; respects Do Not Track. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Vercel Analytics (free tier limits) or Plausible (paid, EU-hosted)?

## Done when
- [ ] Dashboard shows views per locale and top projects
