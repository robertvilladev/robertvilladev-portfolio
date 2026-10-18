// Achievements core (013): state in localStorage `ach`, read fresh on every change so tabs don't clobber each other.
// Blocked storage keeps it in memory for the page (nothing persists). No DOM and no imports, so `node --test` runs it;
// scripts/achievements.ts wires it to the page.
export const ids = ['terminal', 'konami', 'polyglot', 'hire', 'clicker', 'explorer', 'offgrid', 'chromatic', 'lost', 'root', 'reboot', 'completionist'];

export interface State {
  unlocked: Record<string, number>;
  clicks: number;
  visited: { langs: string[]; projects: string[] };
  themes: string[];
}

const fresh = (): State => ({ unlocked: {}, clicks: 0, visited: { langs: [], projects: [] }, themes: [] });
let mem = fresh();
let listener = (_id: string, _count: number) => {};

export function load(): State {
  try {
    return { ...fresh(), ...JSON.parse(localStorage.getItem('ach')!) };
  } catch {
    return mem;
  }
}

function save(s: State) {
  mem = s;
  try { localStorage.setItem('ach', JSON.stringify(s)); } catch {}
}

/** Called once per new unlock with the id and how many are unlocked now. */
export const onUnlock = (f: typeof listener) => void (listener = f);

export function unlock(id: string) {
  const s = load();
  if (s.unlocked[id]) return;
  s.unlocked[id] = Date.now();
  save(s);
  const n = ids.filter((i) => s.unlocked[i]).length;
  listener(id, n);
  if (n === ids.length - 1 && !s.unlocked.completionist) unlock('completionist');
}

export function click() {
  const s = load();
  if (s.unlocked.clicker) return;
  s.clicks++;
  save(s);
  if (s.clicks >= 100) unlock('clicker');
}

/** Adds `value` to a set; unlocks `id` once the set holds all of `all`. */
export function collect(set: 'langs' | 'projects' | 'themes', value: string, all: string[], id: string) {
  const s = load();
  const list = set === 'themes' ? s.themes : s.visited[set];
  if (!list.includes(value)) {
    list.push(value);
    save(s);
  }
  if (all.length && all.every((v) => list.includes(v))) unlock(id);
}

export const reset = () => save(fresh());
