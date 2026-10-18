// Terminal core: parser, command registry, filesystem, completion. No DOM and no imports,
// so `node --test` runs it as is. Commands register themselves from ./commands/*.ts.

/** Virtual filesystem: a string is a file's contents, an object is a directory. */
export type Dir = { [name: string]: Dir | string };

/** The build-time payload from /terminal/<lang>.json. */
export interface TermData {
  lang: string;
  home: string;
  name: string;
  role: string;
  email: string | null;
  links: Record<string, string>;
  since: number;
  stack: string;
  strings: Record<string, string>;
  fs: Dir;
  projects: Record<string, { title: string; url: string; repo?: string; demo?: string }>;
  /** Note page URL per slug; `cat notes/<slug>` links to it (018). */
  notes: Record<string, string>;
  /** Commits, newest first. `p` is a project slug or `portfolio`, `url` ends in the sha, `when` is relative (009). */
  log: { p: string; s: string; url: string; when: string }[];
}

/** One piece of an output line: text (URLs and emails get linked) or an explicit link. */
export type Part = string | { text: string; href: string };

export interface Ctx {
  data: TermData;
  fs: Dir;
  cwd: string[];
  lang: string;
  history: string[];
  reducedMotion: boolean;
  print(...parts: Part[]): HTMLElement;
  error(text: string): void;
  /** Prints `usage: …` for the running command. */
  usage(): void;
  t(key: string): string;
  navigate(url: string): void;
  openTab(url: string): void;
  setTheme(name: string): void;
  clear(): void;
  close(): void;
}

export interface Args { name: string; args: string[]; flags: Set<string> }

export interface Command {
  name: string;
  run(a: Args, ctx: Ctx): void | Promise<void>;
  /** Candidates for the word being typed after the command name; `words` is the whole line so far. */
  complete?(word: string, ctx: Ctx, words: string[]): string[];
  /** ui.ts key holding `usage — description`. */
  man?: string;
  /** Left out of help and completion (easter eggs). */
  hidden?: boolean;
}

export const commands = new Map<string, Command>();
export const register = (c: Command) => void commands.set(c.name, c);

/** Splits a line into a command, positional args and flags. Quotes group words; `-rf` = r + f. */
export function parse(line: string): Args {
  const words = [...line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)];
  const [first, ...rest] = words;
  const args: string[] = [];
  const flags = new Set<string>();
  for (const [, dq, sq, w] of rest) {
    if (w === undefined) args.push(dq ?? sq);
    else if (/^--./.test(w)) flags.add(w.slice(2));
    else if (/^-\w/.test(w)) for (const c of w.slice(1)) flags.add(c);
    else args.push(w);
  }
  return { name: first ? (first[1] ?? first[2] ?? first[3]) : '', args, flags };
}

export const nodeAt = (fs: Dir, segs: string[]) =>
  segs.reduce<Dir | string | undefined>((n, s) => (typeof n === 'object' && Object.hasOwn(n, s) ? n[s] : undefined), fs);

/** Absolute path segments for `path` from `cwd`, or null if nothing is there. Home is the root: `/` = `~`. */
export function resolve(fs: Dir, cwd: string[], path = ''): string[] | null {
  const segs = /^[~/]/.test(path) ? [] : [...cwd];
  for (const s of path.replace(/^~/, '').split('/')) {
    if (s === '..') segs.pop();
    else if (s && s !== '.') segs.push(s);
  }
  return nodeAt(fs, segs) === undefined ? null : segs;
}

/** The node at `path` from `cwd` (undefined if missing) and its absolute segments. */
export function stat(fs: Dir, cwd: string[], path: string) {
  const at = resolve(fs, cwd, path);
  return { at, node: at ? nodeAt(fs, at) : undefined };
}

export const pathString = (segs: string[]) => ['~', ...segs].join('/');

/** Path completions for `word`, keeping what was typed before the last `/`. Dirs end in `/`. */
export function paths(fs: Dir, cwd: string[], word: string, dirsOnly = false) {
  const base = word.slice(0, word.lastIndexOf('/') + 1);
  const at = resolve(fs, cwd, base);
  const dir = at && nodeAt(fs, at);
  if (!dir || typeof dir !== 'object') return [];
  return Object.entries(dir)
    .filter(([, n]) => !dirsOnly || typeof n === 'object')
    .map(([name, n]) => base + name + (typeof n === 'object' ? '/' : ''));
}

/** Completes the last word of `line`: one match fills it in, several extend to their common prefix and are returned. */
export function complete(line: string, candidates: (words: string[]) => string[]) {
  // ponytail: splits on spaces, so quoted words with spaces don't complete; fine for slugs and paths.
  const words = line.split(' ');
  const word = words.at(-1)!;
  const options = candidates(words).filter((c) => c.startsWith(word));
  if (!options.length) return { line, options };
  let common = options[0];
  for (const o of options) while (!o.startsWith(common)) common = common.slice(0, -1);
  words[words.length - 1] = common + (options.length === 1 && !common.endsWith('/') ? ' ' : '');
  return { line: words.join(' '), options: options.length > 1 ? options : [] };
}

/** Edit distance counting a swap of two neighbours as one edit (`sl` → `ls`). */
export function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i || j));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

/** The closest name if it's a likely typo (≤ 1 edit, ≤ 2 for names longer than 4), else undefined. */
export function suggest(name: string, names: Iterable<string>) {
  let best: string | undefined;
  let min = name.length > 4 ? 2 : 1;
  for (const n of names) {
    const d = distance(name, n);
    if (d <= min) [best, min] = [n, d - 1];
  }
  return best;
}
