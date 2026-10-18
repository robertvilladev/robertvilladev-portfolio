---
title: Sudoku 2077
summary: Un motor de sudokus que genera puzzles y los clasifica por las técnicas que exige resolverlos, servidos por una API REST.
stack: [typescript, fastify, prisma, postgresql, react, flutter]
pid: '2077'
order: 1
repo: https://github.com/robertvilladev/sudoku-2077
demo: https://sudoku-2077-api.vercel.app
---
Un monorepo construido alrededor de una pregunta: ¿qué hace que un sudoku sea *difícil*? En lugar de contar las pistas, cada puzzle se clasifica por las técnicas de resolución que exige.

- **sudoku-core**: generador con semilla y nivel objetivo, con variantes por simetría, un solver de fuerza bruta con bitmasks para comprobar unicidad y un solver lógico con 13 técnicas, desde singles hasta XYZ-Wing y naked quads. TypeScript puro, sin I/O.
- **api-types**: esquemas Zod compartidos para que todos los clientes usen los mismos contratos.
- **api**: Fastify + Prisma, con un job que mantiene en Postgres un pool de puzzles por nivel.
- Clientes **web** (Vite + React) y **móvil** (Flutter).
