# 013 · Achievements

| Status | Phase | Category | Impact | Effort | Perf cost |
| --- | --- | --- | --- | --- | --- |
| ready | 3 · Delight | Delight | M | S | low |

**Depends on:** [007](007-interactive-terminal.md), [012](012-konami-glitch.md)

## Why
Turns the easter eggs into a small game: visitors who find them get a toast, and the terminal lists what is left to find.

## Scope
**In**
- 12 unlocks (below), stored per visitor in localStorage
- A toast styled as a system notification
- An `achievements` command in the terminal, with `reset`

**Out**
- Accounts or server storage

## The 12 unlocks

| ID | Name | Unlocked by | Hint (when locked) |
| --- | --- | --- | --- |
| `terminal` | Hello, world | Opening the terminal | Some prompts are just a keystroke away… |
| `konami` | Some codes never die | Konami code or `glitch` | Some codes never die… |
| `polyglot` | Polyglot | Visiting all of en, es and ca | Say it in every tongue this site speaks… |
| `hire` | Hire me | `sudo hire-me` | Some doors only open for superusers… |
| `clicker` | Clicker | 100 clicks in total | Click. Click. Click. Keep going… |
| `explorer` | Explorer | Reading every project page, in any locale | Every project has a story. Read them all… |
| `offgrid` | Off the grid | Any hidden theme | Not every theme is on the menu… |
| `chromatic` | Chromatic | All four hidden themes | Collect every color that hides… |
| `lost` | Lost in /dev/null | Landing on the 404 page | Go somewhere that doesn't exist… |
| `root` | Root of all evil | `rm -rf /` | With great power comes great rm… |
| `reboot` | Have you tried turning it off and on? | `reboot` | When in doubt, start over… |
| `completionist` | Completionist | Every other achievement | Find everything else first… |

Names and hints are in `ui.ts` (`ach.<id>`, `ach.<id>.hint`) for en, es and ca.

## Decisions
- **Core.** `lib/achievements.ts` holds the logic: the ID list, `unlock(id)`, `click()`, `collect(set, value, all, id)` and `reset()`. It has no DOM and no imports, so `node --test` runs it with a storage stub. State lives in localStorage `ach` as `{ unlocked: { id: timestamp }, clicks, visited: { langs: [], projects: [] }, themes: [] }`. It is read fresh on every change, so two tabs don't overwrite each other. Storage access is wrapped in try/catch; if storage is blocked, state lives in memory for the page and nothing persists. A repeat unlock does nothing. `completionist` unlocks on its own once the other 11 are done.
- **Wiring.** `scripts/achievements.ts` (first paint, about 1 KB with the core) connects the core to the page:
  - On the terminal bus, `open` unlocks `terminal`. `command:run` unlocks `hire` (`sudo hire-me`), `root` (`rm -rf /`), `reboot` and `konami` (`glitch`), and a hidden theme unlocks `offgrid` and counts toward `chromatic`. No command file changes.
  - At load it records the page's language (`html[lang]`; the full list comes from the page's `hreflang` links) and the project slug from the URL. The full slug list comes from `html[data-projects]`, rendered by `Base.astro`. The 404 page unlocks `lost`.
  - A document `click` listener counts clicks until `clicker` unlocks.
  - `konami.ts` calls `unlock('konami')` directly.
- **Toast.** `scripts/toast.ts` is lazy-loaded the first time something unlocks, or at load if toasts are still waiting.
  - Each unlock is queued in sessionStorage (`ach-q`, or memory if blocked) with its count at that moment. One cut off by a navigation shows on the next page, since entries leave the queue only after they've been shown.
  - Toasts show one at a time, about 4 s each, bottom right: `ACHIEVEMENT UNLOCKED · <name> · 4/12` above a 12-pixel progress bar. Strings come from the already cached `/terminal/<lang>.json`, which now includes the `ach.` keys.
  - The region is `aria-live="polite"`, `pointer-events: none`, and never takes focus. It's a `popover="manual"`, re-shown for each toast so it sits above an open terminal (both are in the top layer).
  - It waits while `html[data-boot]` is set, using a MutationObserver, not polling. It slides in and out with `transform`. Under reduced motion it just appears and disappears.
  - 012's reduced-motion message becomes a toast too: queue entries are either an unlock or a `ui.ts` key.
- **`achievements` command.** Visible in `help`, with man strings in all three languages.
  - It prints `[██████░░░░] 6/12`, then one row per achievement: unlocked rows show `✓ name — date`, locked rows (muted) show `· name — hint`. At 12/12 it adds an ASCII trophy.
  - `achievements reset` asks for confirmation. The next command must be `y`, a hidden command that wipes progress; any other command cancels. Typed without a pending reset, `y` answers like an unknown command.
- **Existing tests.** `playwright.config.ts` presets `ach` with all 12 unlocked, next to `booted`, so no achievement toast appears in other specs. `achievements.spec.ts` starts clean.
- **Budget.** The lazy-terminal budget goes from 10 KB to 14 KB (ARCHITECTURE.md and check-js-size.mjs). The toast and the command are lazy chunks, so they count toward it. First paint stays ≤ 60 KB.

## Guardrails
Toasts in an `aria-live="polite"` region; never cover content for long. Plus the budget and rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Done when
- [ ] Every unlock in the table works, persists per visitor and shows a toast with the right count
- [ ] Repeat unlocks do nothing; `completionist` unlocks itself
- [ ] Toasts queue, wait for the boot panel, survive a navigation and never take focus; no slide under reduced motion
- [ ] `achievements` lists progress, dates and hints, shows a trophy at 12/12, and `reset` asks for `y`
- [ ] Unit tests (unlock, dedupe, completionist, counters, theme and project sets) and e2e tests pass; first paint ≤ 60 KB, lazy ≤ 14 KB
