# portfolio-professional

Personal portfolio site built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript, on Bun.

## Getting started

```sh
bun install          # also installs the lefthook git hooks
bun run dev          # http://localhost:3000
```

The first local e2e run also needs `bunx playwright install chromium`.

## Scripts

| Script              | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `bun run dev`       | Dev server                                                      |
| `bun run build`     | Production build                                                |
| `bun run start`     | Serve the production build                                      |
| `bun run format`    | Format with oxfmt (`format:check` to only check)                |
| `bun run lint`      | oxlint, including type-aware rules (`lint:fix` for autofixes)   |
| `bun run lint:fsd`  | Steiger: Feature-Sliced Design boundaries                       |
| `bun run typecheck` | Generate route types and run `tsc`                              |
| `bun run test`      | Vitest in watch mode (`test:ci` runs once with coverage)        |
| `bun run test:e2e`  | Playwright + axe against the production build, desktop + mobile |
| `bun run ci`        | Everything CI runs except e2e. The pre-push hook runs it too    |

## Docs

- [docs/code-quality.md](docs/code-quality.md): **read before picking up a UI ticket.** Checks, rules, component conventions, the FSD slice map, accessibility and testing bar, Definition of Done.
- [docs/architecture.md](docs/architecture.md): Feature-Sliced Design layers, slices and import rules.

## Contributing

Branch from `main`, use [conventional commits](https://www.conventionalcommits.org) for commits and PR titles, and fill in the [PR template](.github/pull_request_template.md). Lefthook runs format, lint and typecheck on commit and `bun run ci` on push. Don't skip the hooks.
