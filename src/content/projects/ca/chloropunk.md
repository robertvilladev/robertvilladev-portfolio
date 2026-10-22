---
title: Chloropunk
summary: Un roguelike d'arena a l'estil Brotato en què un lluitador cyberpunk aixafa verdures mutants en una ciutat de neó.
stack: [typescript, phaser 3, vite, vitest]
pid: '0666'
order: 4
repo: https://github.com/robertvilladev/chloropunk
demo: https://chloropunk.vercel.app
---
Onades amb temps contra cinc tipus de verdura, amb millores en pujar de nivell i una botiga entre rondes: rerolls, bloqueig, venda i fusió entre 6 tipus d'arma i 15 objectes. Les armes disparen soles; tu només et mous.

- **El contingut són dades**: enemics, armes, objectes, millores i onades viuen en JSON, de manera que un enemic nou és un canvi de dades i com a molt una funció de comportament.
- **Balanç per simulació**: una simulació headless prediu cada onada, i un pilot automàtic juga partides reals a Playwright per contrastar-ne els registres.
