<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Architecture

Follow Feature-Sliced Design as described in `docs/architecture.md`. Respect the layer import rules; `bun run lint` enforces them.

# Code quality

Before any UI work, read `docs/code-quality.md`: commands, lint/TS rules, component conventions, the FSD slice map for the home page, the accessibility and testing bar, and the Definition of Done.
