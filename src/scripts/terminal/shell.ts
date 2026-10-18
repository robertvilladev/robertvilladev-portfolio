// The terminal overlay: a modal <dialog> (focus trap, Escape, backdrop and focus return are native),
// input → parse → registry, history, completion, and state that survives navigation.
// Lazy: loaded by ./index.ts on first intent, data fetched from /terminal/<lang>.json.
import css from './shell.css?inline'; // ?inline: Astro would otherwise hoist it into every page's HTML
import { commands, complete, parse, pathString, resolve, suggest, type Command, type Ctx, type Part, type TermData } from './core';
import { bus } from './bus';
import { setTheme } from '@/scripts/theme';

import.meta.glob('./commands/*.ts', { eager: true });

const KEY = 'term';
let saved: { cwd?: string[]; history?: string[] } = {};
try { saved = JSON.parse(sessionStorage.getItem(KEY) ?? '{}'); } catch {}

let ready: Promise<Ctx> | undefined;
let dialog: HTMLDialogElement;

const URLS = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[a-z]{2,})/;

function link(text: string, href: string) {
  const a = document.createElement('a');
  a.textContent = text;
  a.href = href;
  if (a.origin !== location.origin && a.protocol.startsWith('http')) [a.target, a.rel] = ['_blank', 'noopener'];
  return a;
}

/** Text with URLs and emails turned into links. Never parses HTML. */
const linkify = (text: string) =>
  text.split(URLS).map((s, i) => (i % 2 ? link(s, s.includes('@') && !s.includes('/') ? `mailto:${s}` : s) : s));

function build(data: TermData): Ctx {
  const t = (k: string) => data.strings[k] ?? k;
  dialog = document.createElement('dialog');
  dialog.className = 'tx mono';
  dialog.dataset.lenisPrevent = '';
  dialog.setAttribute('aria-label', t('term.title'));
  dialog.innerHTML = `<div class="tx__bar"><span class="tx__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="tx__title">robert@villa — zsh</span><button class="tx__x" type="button"><span aria-hidden="true">×</span></button></div><div class="tx__out" role="log" aria-live="polite" tabindex="0"></div><form class="tx__form"><span class="tx__ps1" aria-hidden="true"></span><input class="tx__in" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send"></form>`;
  const $ = <T extends HTMLElement>(s: string) => dialog.querySelector<T>(s)!;
  const out = $('.tx__out');
  const input = $<HTMLInputElement>('.tx__in');
  const ps1 = $('.tx__ps1');
  $('.tx__x').setAttribute('aria-label', t('term.close'));
  input.setAttribute('aria-label', t('term.input'));

  const ctx: Ctx = {
    data,
    fs: data.fs,
    cwd: resolve(data.fs, [], `~/${(saved.cwd ?? []).join('/')}`) ?? [],
    lang: data.lang,
    history: saved.history ?? [],
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    print(...parts: Part[]) {
      const line = document.createElement('div');
      line.append(...parts.flatMap((p) => (typeof p === 'string' ? linkify(p) : [link(p.text, p.href)])));
      out.append(line);
      out.scrollTop = out.scrollHeight;
      return line;
    },
    error: (text) => void (ctx.print(text).className = 'tx__err'),
    usage: () => current?.man && ctx.error(`${t('term.usage')}: ${t(current.man).split(' — ')[0]}`),
    t,
    navigate: (url) => location.assign(url),
    openTab: (url) => void window.open(url, '_blank', 'noopener'),
    setTheme,
    clear: () => out.replaceChildren(),
    close: () => dialog.close(),
  };

  let pos = ctx.history.length;
  let current: Command | undefined;
  const prompt = () => `${pathString(ctx.cwd)} $`;
  const save = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ open: dialog.open, cwd: ctx.cwd, history: ctx.history })); } catch {}
  };
  const echo = (line: string) => {
    const span = document.createElement('span');
    span.className = 'tx__ps1';
    span.textContent = prompt();
    ctx.print(` ${line}`).prepend(span);
  };
  const candidates = (words: string[]) =>
    words.length === 1
      ? [...commands.values()].filter((c) => !c.hidden).map((c) => c.name)
      : (commands.get(words[0])?.complete?.(words.at(-1)!, ctx, words) ?? []);

  async function run(line: string) {
    echo(line);
    line = line.trim();
    if (line) ctx.history.splice(0, ctx.history.push(line) - 50);
    pos = ctx.history.length;
    const a = parse(line);
    const cmd = (current = commands.get(a.name));
    if (cmd) {
      bus.dispatchEvent(new CustomEvent('command:run', { detail: a }));
      try { await cmd.run(a, ctx); } catch (e) { ctx.error(String(e)); }
    } else if (a.name) {
      ctx.error(`zsh: ${t('404.msg')}: ${a.name}`);
      const s = suggest(a.name, commands.keys());
      if (s) ctx.print(`${t('404.hint')} ${s}?`);
    }
    ps1.textContent = prompt();
    save();
  }

  $('form').addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      pos = Math.max(0, Math.min(ctx.history.length, pos + (e.key === 'ArrowUp' ? -1 : 1)));
      input.value = ctx.history[pos] ?? '';
    } else if (e.key === 'Tab' && !e.shiftKey && input.value) {
      e.preventDefault();
      const r = complete(input.value, candidates);
      if (r.options.length) {
        echo(input.value);
        ctx.print(r.options.map((o) => o.slice(o.lastIndexOf('/', o.length - 2) + 1)).join('  '));
      }
      input.value = r.line;
    }
  });
  $('.tx__x').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close()); // the backdrop
  out.addEventListener('click', () => getSelection()?.isCollapsed && input.focus());
  dialog.addEventListener('close', () => bus.dispatchEvent(new Event('close')));
  // The close event lands a task later, so a close right before navigating would be missed without this.
  addEventListener('pagehide', save);

  ps1.textContent = prompt();
  ctx.print(t('term.welcome')).className = 'tx__mute';
  const style = document.createElement('style');
  style.textContent = css;
  document.body.append(style, dialog);
  return ctx;
}

export async function open() {
  try {
    await (ready ??= fetch(`/terminal/${document.documentElement.lang}.json`).then((r) => r.json()).then(build));
  } catch {
    ready = undefined; // offline or blocked: try again on the next intent
    return;
  }
  if (dialog.open) return;
  dialog.showModal();
  dialog.querySelector('input')!.focus();
  bus.dispatchEvent(new Event('open'));
}
