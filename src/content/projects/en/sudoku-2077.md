---
title: Sudoku 2077
summary: A sudoku engine that generates puzzles and grades them by the solving techniques they need, served over a REST API.
stack: [typescript, fastify, prisma, postgresql, react, flutter]
pid: '2077'
order: 1
repo: https://github.com/robertvilladev/sudoku-2077
demo: https://sudoku-2077-api.vercel.app
---
A monorepo built around one question: what makes a sudoku *hard*? Instead of counting givens, puzzles are classified by the solving techniques they require.

- **sudoku-core**: seeded, tier-aimed generator with symmetry variants, a bitmask brute-force solver to check uniqueness, and a logical solver with 13 techniques, from singles to XYZ-Wing and naked quads. Pure TypeScript, no I/O.
- **api-types**: shared Zod schemas so every client uses the same contracts.
- **api**: Fastify + Prisma, with a job that keeps a pool of puzzles per difficulty tier in Postgres.
- **web** (Vite + React) and **mobile** (Flutter) clients.
