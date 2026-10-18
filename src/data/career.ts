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
    hash: 'a7c3e58',
    period: span('2026.08', now),
    role: { en: 'Software Engineer @ Aurela', es: 'Software Engineer @ Aurela', ca: 'Software Engineer @ Aurela' },
    note: {
      en: 'Barcelona. Online therapy platform. Full stack: Next.js web app, Django API and back office, calendar and video-call integrations, payments, jobs. Azure, SQL, Sentry, Mixpanel, GitHub Actions.',
      es: 'Barcelona. Plataforma de terapia online. Full stack: web en Next.js, API y back office en Django, integraciones de calendario y videollamada, pagos y jobs. Azure, SQL, Sentry, Mixpanel y GitHub Actions.',
      ca: 'Barcelona. Plataforma de teràpia en línia. Full stack: web en Next.js, API i back office en Django, integracions de calendari i videotrucada, pagaments i jobs. Azure, SQL, Sentry, Mixpanel i GitHub Actions.',
    },
  },
  {
    hash: 'e4f2a91',
    period: span('2024.11', now),
    role: { en: 'Full Stack Engineer @ ERNI', es: 'Full Stack Engineer @ ERNI', ca: 'Full Stack Engineer @ ERNI' },
    note: {
      en: 'MedTech frontends for medical devices. Moved 25+ React components to CSS Modules: −28% stylesheet bundle, −40% styling defects. Owns the E2E and automated UI testing strategy.',
      es: 'Frontends MedTech para dispositivos médicos. Migré más de 25 componentes React a CSS Modules: −28% de CSS y −40% de bugs de estilos. Responsable de la estrategia de tests E2E y de UI automatizados.',
      ca: 'Frontends MedTech per a dispositius mèdics. Vaig migrar més de 25 components React a CSS Modules: −28% de CSS i −40% d’errors d’estils. Responsable de l’estratègia de tests E2E i d’UI automatitzats.',
    },
  },
  {
    hash: 'b71c0d3',
    period: span('2022.07', '2024.11'),
    role: { en: 'Frontend Developer @ ERNI', es: 'Frontend Developer @ ERNI', ca: 'Frontend Developer @ ERNI' },
    note: {
      en: 'Barcelona. React, TypeScript and Vite apps built on microfrontends and microservices, shipped with Jenkins and Docker.',
      es: 'Barcelona. Apps en React, TypeScript y Vite sobre microfrontends y microservicios, desplegadas con Jenkins y Docker.',
      ca: 'Barcelona. Apps en React, TypeScript i Vite sobre microfrontends i microserveis, desplegades amb Jenkins i Docker.',
    },
  },
  {
    hash: '5a9e3f7',
    period: span('2021.10', '2022.07'),
    role: { en: 'Full Stack Developer @ SpaceDev', es: 'Full Stack Developer @ SpaceDev', ca: 'Full Stack Developer @ SpaceDev' },
    note: {
      en: 'Montevideo. Web apps and eCommerce with React, Next.js, NestJS and TypeORM, hosted on AWS behind Cloudflare.',
      es: 'Montevideo. Apps web y eCommerce con React, Next.js, NestJS y TypeORM, alojadas en AWS detrás de Cloudflare.',
      ca: 'Montevideo. Apps web i eCommerce amb React, Next.js, NestJS i TypeORM, allotjades a AWS darrere de Cloudflare.',
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
      en: 'Started as assistant teacher, then lead. Built APIs and e-learning platforms with React, Redux and Next.js while teaching JavaScript, Node and REST.',
      es: 'Empecé como profesor asistente y luego titular. Construí APIs y plataformas de e-learning con React, Redux y Next.js mientras enseñaba JavaScript, Node y REST.',
      ca: 'Vaig començar com a professor assistent i després titular. Vaig construir APIs i plataformes d’e-learning amb React, Redux i Next.js mentre ensenyava JavaScript, Node i REST.',
    },
  },
  {
    hash: '0000001',
    period: span('2020.05', '2020.10'),
    role: {
      en: 'Full Stack & React Native Developer @ Palmarius',
      es: 'Full Stack y React Native Developer @ Palmarius',
      ca: 'Full Stack i React Native Developer @ Palmarius',
    },
    note: {
      en: 'First commit. Cross-platform iOS/Android apps and PWAs with React Native, Redux and Firebase.',
      es: 'Primer commit. Apps multiplataforma iOS/Android y PWAs con React Native, Redux y Firebase.',
      ca: 'Primer commit. Apps multiplataforma iOS/Android i PWAs amb React Native, Redux i Firebase.',
    },
  },
];
