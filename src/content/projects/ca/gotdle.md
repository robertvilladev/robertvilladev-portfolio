---
title: Gotdle
summary: Un joc diari d'endevinar personatges de Joc de Trons, amb un client en Vue 3 + TypeScript i el seu propi backend en FastAPI.
stack: [vue 3, typescript, pinia, vue router, vite, vitest]
pid: '0451'
order: 3
repo: https://github.com/robertvilladev/gotdle-vue3
---
L'app web fa servir Vue 3 amb Composition API i `<script setup>`, Pinia per a l'estat del joc, Vue Router i Vite per al build. Vitest, ESLint + oxlint i `vue-tsc` la mantenen en ordre. Es connecta a un backend FastAPI + PostgreSQL que vaig escriure en paral·lel ([gotdle-api-fast-api](https://github.com/robertvilladev/gotdle-api-fast-api)).
