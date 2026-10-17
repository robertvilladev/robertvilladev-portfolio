# 009 · GitHub data at build time

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| idea | 2 · Real content | Content & data | M | S | none |

**Depends on:** [002](002-deploy-and-ci.md)

## Why
Stars, last commit and primary language make the projects feel alive, and a "currently building" line in the hero shows activity.

## Scope
**In**
- Per project: stars, last push date, main language
- Hero line: `~ $ git log -1` with the latest public commit
- Scheduled rebuild (daily) to refresh

**Out**
- Fetching from the browser

## Approach
`lib/github.ts` fetched at build with an optional `GITHUB_TOKEN`, cached per build. Falls back to no data (never fails the build) if the API is down. Vercel Cron or a GitHub Action schedule triggers a deploy hook.

## Guardrails
Zero runtime cost. The build must succeed offline. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Open questions
- Show stars at all (small numbers can read as negative)?

## Done when
- [ ] Cards show live data; the build passes without network
