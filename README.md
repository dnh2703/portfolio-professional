# portfolio-professional

Personal portfolio site built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript, on Bun.

## Getting started

```sh
bun install          # also installs the lefthook git hooks
bun run dev          # http://localhost:3000
```

The first local e2e run also needs `bunx playwright install chromium`.

The assistant's `/api/assistant` route reads optional server-only keys (TypeSafe, Telegram, Upstash). Copy [.env.example](.env.example) to `.env.local` to set them; without them it falls back to keyword matching, no alerts and an in-memory rate limit.

## Scripts

| Script                   | What it does                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `bun run dev`            | Dev server                                                                                               |
| `bun run build`          | Production build                                                                                         |
| `bun run start`          | Serve the production build                                                                               |
| `bun run format`         | Format with oxfmt (`format:check` to only check)                                                         |
| `bun run lint`           | oxlint, including type-aware rules (`lint:fix` for autofixes)                                            |
| `bun run lint:fsd`       | Steiger: Feature-Sliced Design boundaries                                                                |
| `bun run typecheck`      | Generate route types and run `tsc`                                                                       |
| `bun run test`           | Vitest in watch mode (`test:ci` runs once with coverage)                                                 |
| `bun run test:e2e`       | Playwright + axe against the production build, desktop + mobile                                          |
| `bun run ci`             | Everything CI runs except e2e. The pre-push hook runs it too                                             |
| `bun run eval:assistant` | Asks real Jev ~30 sample questions to tune the confidence threshold. Needs `TYPESAFE_API_KEY`; not in CI |

## Docs

- [docs/code-quality.md](docs/code-quality.md): **read before picking up a UI ticket.** Checks, rules, component conventions, the FSD slice map, accessibility and testing bar, Definition of Done.
- [docs/architecture.md](docs/architecture.md): Feature-Sliced Design layers, slices and import rules.

## Contributing

Branch from `main`, use [conventional commits](https://www.conventionalcommits.org) for commits and PR titles, and fill in the [PR template](.github/pull_request_template.md). Lefthook runs format, lint and typecheck on commit and `bun run ci` on push. Don't skip the hooks. How PRs are merged (squash vs. stacked PRs, keeping branches up to date) is in [AGENTS.md](AGENTS.md#merging-pull-requests).
