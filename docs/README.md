# docs

| File | What it is |
| --- | --- |
| [ROADMAP.md](ROADMAP.md) | Every planned feature, classified and ordered into phases. Start here. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the repo is laid out, the conventions, and the performance budget every feature must respect. |
| [CONTENT.md](CONTENT.md) | Voice, spelling and length rules for every text on the site. Read it before writing copy. |
| [ideas/](ideas/) | One spec per roadmap item. Each is refined on its own branch before it's built. |

## Workflow for a roadmap item

1. Branch from `main`: `feat/<id>-<slug>` (e.g. `feat/007-interactive-terminal`).
2. **Refine** the idea file: answer its open questions, fill in the approach, set `Status: ready`. Commit that alone.
3. **Build** it in the same branch, keeping to the guardrails in [ARCHITECTURE.md](ARCHITECTURE.md).
4. Set `Status: done`, update the row in [ROADMAP.md](ROADMAP.md), merge.
5. **Clean up**: stop every dev, preview and test server you started (see [CLAUDE.md](../CLAUDE.md)).

Status values: `idea` → `refining` → `ready` → `building` → `done` (or `dropped`, with a line on why).

New idea? Copy [ideas/_TEMPLATE.md](ideas/_TEMPLATE.md), take the next free number, add a row to the roadmap.
