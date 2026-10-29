---
title: Chloropunk
summary: Un roguelike de arena al estilo Brotato en el que un luchador cyberpunk aplasta verduras mutantes en una ciudad de neón.
stack: [typescript, phaser 3, vite, vitest]
pid: '0666'
order: 4
repo: https://github.com/robertvilladev/chloropunk
demo: https://chloropunk.vercel.app
---
Oleadas con tiempo contra cinco tipos de verdura, con mejoras al subir de nivel y una tienda entre rondas: rerolls, bloqueo, venta y fusión entre 6 tipos de arma y 15 objetos. Las armas disparan solas; tú solo te mueves.

- **El contenido son datos**: enemigos, armas, objetos, mejoras y oleadas viven en JSON, así que un enemigo nuevo es un cambio de datos y como mucho una función de comportamiento.
- **Balance por simulación**: una simulación headless predice cada oleada, y un piloto automático juega partidas reales en Playwright para contrastar sus registros con ella.
