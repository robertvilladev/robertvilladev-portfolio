---
title: Gotdle
summary: Un juego diario de adivinar personajes de Juego de Tronos. El cliente web es Vue 3 + TypeScript, con su propio servicio en FastAPI.
stack: [vue 3, typescript, pinia, vue router, vite, vitest]
pid: '0451'
order: 3
repo: https://github.com/robertvilladev/gotdle-vue3
---
La webapp es Vue 3 con Composition API y `<script setup>`, Pinia para el estado del juego, Vue Router y Vite para el build. Vitest, ESLint + oxlint y `vue-tsc` la mantienen en orden. Se conecta a un backend FastAPI + PostgreSQL que escribí en paralelo ([gotdle-api-fast-api](https://github.com/robertvilladev/gotdle-api-fast-api)).
