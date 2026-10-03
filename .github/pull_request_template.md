## Summary

<!-- What does this PR do and why? -->

## Related issue

<!-- e.g. Closes POR-12. Delete if not applicable. -->

## Changes

-

## Screenshots

<!-- UI changes: desktop (1440 px) and mobile (390 px). Delete if not applicable. -->

| Desktop | Mobile |
| ------- | ------ |
|         |        |

## Test plan

- [ ] `bun run ci` passes locally
- [ ] `bun run test:e2e` passes (desktop + mobile, no serious/critical axe violations)
- [ ] Checked in the browser at desktop and mobile width

## Definition of Done (UI changes)

<!-- See docs/code-quality.md. Delete this section for non-UI PRs. -->

- [ ] Matches the design at both viewports
- [ ] Code is in the agreed FSD slices; only public APIs are imported across slices
- [ ] Server Component by default; `"use client"` only on leaves that need it
- [ ] `next/image` / `next/font` only; colors and fonts from `@theme` tokens, no hard-coded hex
- [ ] Accessibility: keyboard-only pass, visible focus, dialog focus trap + Escape, `aria-live` for live updates, reduced motion respected, contrast checked
- [ ] Tests added: unit/component tests for logic and behaviour, e2e spec for new pages or cross-slice flows

## Checklist

- [ ] PR title follows conventional commits (e.g. `feat: add projects section`)
- [ ] No lint disables without a reason; no config changes mixed into feature work
- [ ] No console errors or warnings
- [ ] Self-reviewed the diff
