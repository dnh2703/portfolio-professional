<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Architecture

Follow Feature-Sliced Design as described in `docs/architecture.md`. Respect the layer import rules; `bun run lint` enforces them.

# Code quality

Before any UI work, read `docs/code-quality.md`: commands, lint/TS rules, component conventions, the FSD slice map for the home page, the accessibility and testing bar, and the Definition of Done.

# Merging pull requests

`main` is protected by the "Protect main" ruleset: changes land only through a PR, the `Format, lint, typecheck, build`, `Commit messages` and `PR title` checks must pass, and the PR branch must be up to date with `main`. Merged head branches are deleted automatically.

- **Never bypass the ruleset.** Don't use `gh pr merge --admin`, don't push to `main`, and don't force-push to `main`.
- **Before merging**, all checks are green and `mergeStateStatus` is `CLEAN`. If the branch is behind `main`, run `gh pr update-branch <pr>` (merges `main` in) and wait for CI again. Don't rebase a branch that is in review just to catch up.
- **Single PR → squash merge** (`gh pr merge <pr> --squash`). The PR title becomes the commit on `main`, so it must be a conventional commit (`feat: …`, `chore(lint): …`) and reference the Linear issue, e.g. `(POR-1)`.
- **Stacked PRs** (each PR targets the branch of the one before it):
  - Merge bottom-up, one at a time, with a **merge commit** (`gh pr merge <pr> --merge`). Squash or rebase merges rewrite the commits, so the next PR would show them again and need a rebase.
  - After each merge, wait for GitHub to retarget the next PR to `main` (auto-delete does this), then `gh pr update-branch`, wait for CI, and merge.
  - Never delete a base branch by hand while PRs still target it: GitHub closes those PRs instead of retargeting them.
  - Say it is a stack, and the merge order, at the top of every PR description.
- **Don't merge your own PR unless the user asked for it** in this session.
- **After merging**, move the Linear issue to Done and remove the local branch and any worktree used for it.
