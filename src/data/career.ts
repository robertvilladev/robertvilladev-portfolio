import type { Lang } from '../i18n/ui';

type Localized = Record<Lang, string>;
export interface CareerEntry {
  hash: string;
  period: Localized;
  role: Localized;
  note: Localized;
}

// TODO: replace placeholders with real roles, newest first.
export const career: CareerEntry[] = [
  {
    hash: 'a1f3c9e',
    period: { en: '[YEAR] → now', es: '[AÑO] → hoy', ca: '[ANY] → avui' },
    role: { en: '[ROLE] @ [COMPANY]', es: '[PUESTO] @ [EMPRESA]', ca: '[CÀRREC] @ [EMPRESA]' },
    note: { en: '[One line on what you built there]', es: '[Una línea sobre lo que construiste]', ca: '[Una línia sobre el que vas construir]' },
  },
  {
    hash: '7be21d0',
    period: { en: '[YEAR] → [YEAR]', es: '[AÑO] → [AÑO]', ca: '[ANY] → [ANY]' },
    role: { en: '[ROLE] @ [COMPANY]', es: '[PUESTO] @ [EMPRESA]', ca: '[CÀRREC] @ [EMPRESA]' },
    note: { en: '[One line on what you built there]', es: '[Una línea sobre lo que construiste]', ca: '[Una línia sobre el que vas construir]' },
  },
  {
    hash: '0000001',
    period: { en: '2020', es: '2020', ca: '2020' },
    role: { en: 'Bootcamp · first commit', es: 'Bootcamp · primer commit', ca: 'Bootcamp · primer commit' },
    note: { en: '[Where it started]', es: '[Dónde empezó todo]', ca: '[On va començar tot]' },
  },
];
