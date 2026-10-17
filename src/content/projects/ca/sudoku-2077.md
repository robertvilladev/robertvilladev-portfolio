---
title: Sudoku 2077
summary: Una "màquina de sudokus" que genera puzzles, els classifica segons les tècniques necessàries per resoldre'ls i els serveix per una API REST.
stack: [typescript, fastify, prisma, postgresql, react, flutter]
pid: '2077'
order: 1
repo: https://github.com/robertvilladev/sudoku-2077
demo: https://sudoku-2077-api.vercel.app
---
Un monorepo construït al voltant d'una pregunta: què fa que un sudoku sigui *difícil*? En lloc de comptar les pistes, cada puzzle es classifica per les tècniques de resolució que exigeix.

- **sudoku-core**: generador amb llavor i nivell objectiu, amb variants per simetria, un solver de força bruta amb bitmasks per comprovar la unicitat i un solver lògic amb 13 tècniques, des de singles fins a XYZ-Wing i naked quads. TypeScript pur, sense I/O.
- **api-types**: esquemes Zod compartits perquè tots els clients facin servir els mateixos contractes.
- **api**: Fastify + Prisma, amb un job que manté a Postgres un pool de puzzles per nivell.
- Clients **web** (Vite + React) i **mòbil** (Flutter).
