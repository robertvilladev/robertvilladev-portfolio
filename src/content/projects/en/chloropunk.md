---
title: Chloropunk
summary: A Brotato-style arena roguelike where a cyberpunk fighter smashes mutant vegetables in a neon city.
stack: [typescript, phaser 3, vite, vitest]
pid: '0666'
order: 4
repo: https://github.com/robertvilladev/chloropunk
demo: https://chloropunk.vercel.app
---
Timed waves against five vegetable types, with level-up picks and a shop between rounds: reroll, lock, sell and merge across 6 weapon types and 15 items. Weapons auto-fire; you just move.

- **Content is data**: enemies, weapons, items, upgrades and waves live in JSON, so a new enemy is a data change plus at most one behaviour function.
- **Balance by simulation**: a headless sim predicts per-wave outcomes, and an autopilot plays real runs in Playwright so their logs can be checked against it.
