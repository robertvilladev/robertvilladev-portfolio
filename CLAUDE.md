# robertvilla.dev

Astro portfolio. Start with [docs/README.md](docs/README.md) (workflow) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (rules and budgets).

## Clean up before you finish

Several sessions work in parallel worktrees on this machine, so leftover servers collide.

- Stop every server or watcher you started before your final turn ends: `astro dev`/`preview`, Playwright, `lhci`. Use `preview_stop` for servers from `preview_start`; for anything started from a shell, kill the whole process tree (on Windows: `taskkill /PID <shell pid> /T /F`).
- Then check that nothing of yours still listens on ports 4321–4399.
- Before `npm run test:e2e` locally, make sure port 4321 is free. Playwright reuses whatever already listens there, which may be another worktree's build, so the tests would run against the wrong code.
