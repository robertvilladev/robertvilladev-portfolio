---
title: Gotdle
summary: A daily Game of Thrones guessing game. The web client is Vue 3 + TypeScript, backed by its own FastAPI service.
stack: [vue 3, typescript, pinia, vue router, vite, vitest]
pid: '0451'
order: 3
repo: https://github.com/robertvilladev/gotdle-vue3
---
The webapp is Vue 3 with the Composition API and `<script setup>`, Pinia for game state, Vue Router, and Vite for the build. Vitest, ESLint + oxlint and `vue-tsc` keep it honest. It talks to a FastAPI + PostgreSQL backend I wrote alongside it ([gotdle-api-fast-api](https://github.com/robertvilladev/gotdle-api-fast-api)).
