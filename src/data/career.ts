import type { Lang } from '@/i18n/ui';

type Localized = Record<Lang, string>;
export interface CareerEntry {
  hash: string;
  period: Localized;
  role: Localized;
  note: Localized;
}

const now: Localized = { en: 'now', es: 'hoy', ca: 'ara' };
const span = (from: string, to: string | Localized): Localized =>
  typeof to === 'string'
    ? { en: `${from} → ${to}`, es: `${from} → ${to}`, ca: `${from} → ${to}` }
    : { en: `${from} → ${to.en}`, es: `${from} → ${to.es}`, ca: `${from} → ${to.ca}` };

// Source: LinkedIn experience. Newest first; the last entry renders as the root commit.
export const career: CareerEntry[] = [
  {
    hash: 'e4f2a91',
    period: span('2024.11', now),
    role: { en: 'Full-Stack Engineer @ ERNI', es: 'Full-Stack Engineer @ ERNI', ca: 'Full-Stack Engineer @ ERNI' },
    note: {
      en: 'I build MedTech frontends for medical devices and own the E2E and automated UI testing strategy. Moving our React components to CSS Modules led to far fewer styling bugs.',
      es: 'Construyo frontends MedTech para dispositivos médicos y llevo la estrategia de tests E2E y de UI automatizados. Migrar nuestros componentes React a CSS Modules redujo mucho los bugs de estilos.',
      ca: 'Construeixo frontends MedTech per a dispositius mèdics i porto l’estratègia de tests E2E i d’UI automatitzats. Migrar els nostres components React a CSS Modules va reduir molt els errors d’estils.',
    },
  },
  {
    hash: 'b71c0d3',
    period: span('2022.07', '2024.11'),
    role: { en: 'Frontend Developer @ ERNI', es: 'Frontend Developer @ ERNI', ca: 'Frontend Developer @ ERNI' },
    note: {
      en: 'In Barcelona, I built React, TypeScript and Vite apps on microfrontends and microservices, shipped with Jenkins and Docker.',
      es: 'En Barcelona desarrollé apps en React, TypeScript y Vite sobre microfrontends y microservicios, desplegadas con Jenkins y Docker.',
      ca: 'A Barcelona vaig desenvolupar apps en React, TypeScript i Vite sobre microfrontends i microserveis, desplegades amb Jenkins i Docker.',
    },
  },
  {
    hash: '5a9e3f7',
    period: span('2021.10', '2022.07'),
    role: { en: 'Full-Stack Developer @ SpaceDev', es: 'Full-Stack Developer @ SpaceDev', ca: 'Full-Stack Developer @ SpaceDev' },
    note: {
      en: 'In Montevideo, I built web apps and online stores with React, Next.js, NestJS and TypeORM, hosted on AWS behind Cloudflare.',
      es: 'En Montevideo desarrollé apps web y tiendas online con React, Next.js, NestJS y TypeORM, alojadas en AWS detrás de Cloudflare.',
      ca: 'A Montevideo vaig desenvolupar apps web i botigues en línia amb React, Next.js, NestJS i TypeORM, allotjades a AWS darrere de Cloudflare.',
    },
  },
  {
    hash: '2d8b6c4',
    period: span('2020.09', '2021.10'),
    role: {
      en: 'Developer & Bootcamp Teacher @ Plataforma 5',
      es: 'Developer y profesor de bootcamp @ Plataforma 5',
      ca: 'Developer i professor de bootcamp @ Plataforma 5',
    },
    note: {
      en: 'I started as an assistant teacher and became lead, teaching JavaScript, Node and REST. Alongside that, I built APIs and e-learning platforms with React, Redux and Next.js.',
      es: 'Empecé como profesor asistente y pasé a titular, enseñando JavaScript, Node y REST. A la vez, construí APIs y plataformas de e-learning con React, Redux y Next.js.',
      ca: 'Vaig començar com a professor assistent i vaig passar a titular, ensenyant JavaScript, Node i REST. Alhora, vaig construir APIs i plataformes d’e-learning amb React, Redux i Next.js.',
    },
  },
  {
    hash: '0000001',
    period: span('2020.05', '2020.10'),
    role: {
      en: 'Full-Stack & React Native Developer @ Palmarius',
      es: 'Full-Stack y React Native Developer @ Palmarius',
      ca: 'Full-Stack i React Native Developer @ Palmarius',
    },
    note: {
      en: 'I built cross-platform iOS and Android apps and PWAs with React Native, Redux and Firebase.',
      es: 'Desarrollé apps multiplataforma para iOS y Android y PWAs con React Native, Redux y Firebase.',
      ca: 'Vaig desenvolupar apps multiplataforma per a iOS i Android i PWAs amb React Native, Redux i Firebase.',
    },
  },
];
