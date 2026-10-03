# Code quality guide

Read this before you pick up a Portfolio UI ticket. It covers the checks every PR has to pass, the conventions they enforce, and the Definition of Done. Layering rules are in [docs/architecture.md](architecture.md). Read that too.

## 1. Commands

Run everything CI runs, in the same order:

```sh
bun run ci
# = format:check && lint && lint:fsd && typecheck && test:ci && build
```

| Script                 | What it checks                                                                                                                                                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun run format:check` | oxfmt formatting (`bun run format` fixes it).                                                                                                                                                                                                 |
| `bun run lint`         | oxlint with type-aware rules. `--deny-warnings` is on, so a warning also fails. `bun run lint:fix` applies safe autofixes.                                                                                                                    |
| `bun run lint:fsd`     | Steiger: FSD layer/slice boundaries, including relative imports that leave a slice. Diagnostics show `.steiger/src/pages/...` paths. Read those as `src/views/...` (see [architecture](architecture.md#steiger)).                             |
| `bun run typecheck`    | `next typegen` + `tsc --noEmit` with the strict `tsconfig.json`.                                                                                                                                                                              |
| `bun run test:ci`      | Vitest + React Testing Library, run once with v8 coverage (no threshold yet). `bun run test` runs in watch mode.                                                                                                                              |
| `bun run build`        | `next build` (Turbopack). Fails on type errors and prerender errors.                                                                                                                                                                          |
| `bun run test:e2e`     | Playwright + axe against the production build on port 3100, `desktop` (1440×900) and `mobile` (390×844). **Not part of `bun run ci`.** Run it yourself before you open a UI PR. The first local run needs `bunx playwright install chromium`. |

Where each check runs:

| Check                  | pre-commit (lefthook)                  | pre-push (lefthook) | GitHub Actions                                                                           |
| ---------------------- | -------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| oxfmt                  | writes + re-stages staged files        | via `bun run ci`    | `CI / Format, lint, typecheck, build`                                                    |
| oxlint (type-aware)    | staged files only                      | via `bun run ci`    | same job                                                                                 |
| Steiger (`lint:fsd`)   | —                                      | via `bun run ci`    | same job                                                                                 |
| typecheck              | whole project, if a `.ts(x)` is staged | via `bun run ci`    | same job                                                                                 |
| Unit tests (`test:ci`) | —                                      | via `bun run ci`    | `CI / Unit tests`                                                                        |
| E2E + axe (`test:e2e`) | —                                      | —                   | `CI / E2E and accessibility` (Chromium, both viewports; HTML report uploaded on failure) |
| build                  | —                                      | via `bun run ci`    | `CI / Format, lint, typecheck, build`                                                    |
| commitlint             | commit message (`commit-msg`)          | —                   | `CI / Commit messages` and `PR title`                                                    |

Don't bypass hooks with `--no-verify`. If a hook is wrong or too slow, fix it in a PR.

## 2. Rule summary

The source of truth is the config: `.oxlintrc.json`, `tsconfig.json`, `steiger.config.ts`. Each rule that is turned off has a reason comment next to it. In short:

**Baseline.** oxlint categories `correctness` and `suspicious` are errors. `perf` is a warning, and warnings fail lint too.

**React hooks and JSX.** `rules-of-hooks`, `exhaustive-deps`, `jsx-key`, `no-array-index-key`, `self-closing-comp`, `jsx-no-useless-fragment`. The React Compiler is on, so don't add `useMemo`/`useCallback` by reflex.

**Accessibility (`jsx-a11y`).** All `correctness` rules: `alt-text`, `anchor-is-valid`, `control-has-associated-label`, `click-events-have-key-events`, `no-static-element-interactions`, `no-autofocus`, the `aria-*` and `role-*` rules, and others. Lint only sees static JSX. axe in the e2e suite checks the rendered page (see [§5](#5-accessibility-bar)).

**Next.js.** All `nextjs/*` rules, including `no-img-element`, `google-font-display`, `no-page-custom-font` and `no-html-link-for-pages`.

**TypeScript (lint).** `no-explicit-any`, `no-non-null-assertion`, `consistent-type-imports`, `consistent-type-definitions: type`, and `no-unused-vars` (a `_` prefix opts out).

**TypeScript (type-aware).** `no-floating-promises`, `no-misused-promises`, `await-thenable`, `no-unnecessary-type-assertion`, `switch-exhaustiveness-check`. If you mean fire-and-forget, write `void promise`. Don't hand an async function to `onClick` without handling its promise.

**TypeScript (compiler).** `strict`, plus `noUncheckedIndexedAccess` (`arr[i]` is `T | undefined`), `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax` (use `import type` for type-only imports) and `forceConsistentCasingInFileNames`. `exactOptionalPropertyTypes` is off because it rejects `next/image` props.

**General and complexity.** `eqeqeq`, `no-param-reassign`, and `no-console` (only `warn`/`error` are allowed). Limits: `sonarjs/cognitive-complexity` 15, `max-depth` 4, `max-params` 4, `max-nested-callbacks` 3, and `max-lines-per-function` 80 in `model/`, `lib/` and `api/` only. If a function hits a limit, split it. Don't disable the rule.

**FSD.** oxlint blocks imports from a higher layer, from your own layer through `@/`, and deep imports past a public API. `import/no-cycle` is on. Steiger also catches relative imports that leave a slice, slices without an `index.ts`, and slices without segments. Details are in [docs/architecture.md](architecture.md).

**Files.** `unicorn/filename-case`: kebab-case by default, PascalCase for files under `src/**/ui/**`. `index.ts(x)` is exempt.

### Asking for an exception

- **One line.** Disable the specific rule on the next line and give the reason after `--`:

  ```ts
  // oxlint-disable-next-line typescript/no-floating-promises -- fire-and-forget analytics beacon
  ```

  A bare disable, a file-wide disable, or a disable with no reason gets sent back in review. The same goes for `// @ts-expect-error <reason>`. `@ts-ignore` is never allowed.

- **Changing a rule.** Open a separate PR that edits the config (`.oxlintrc.json`, `tsconfig.json`, `steiger.config.ts`). Put the one-line reason in the config comment and fix the existing violations in the same PR. Don't relax a rule inside a feature PR to make it pass.

## 3. Component conventions

**Server Components by default.** Add `"use client"` only to the smallest leaf component that needs state, effects, event handlers or browser APIs. Keep its parents and siblings on the server and pass data down as serializable props. The client leaves in this design are:

| Client leaf                                           | Why it is client                                    |
| ----------------------------------------------------- | --------------------------------------------------- |
| Assistant launcher + panel (`features/ask-assistant`) | open/unread/typing state, async replies, focus trap |
| "Ask about this project" trigger on a project card    | opens the assistant                                 |
| Live local-time clock                                 | `setInterval`, current time                         |
| Marquee (`shared/ui`)                                 | pause button state                                  |
| Dialog base (`shared/ui`)                             | focus trap, Escape, focus return                    |
| Permissions-table demo (project card preview)         | interactive toggles                                 |

The section around each leaf (hero, selected work, about, ...) stays a Server Component.

To avoid hydration mismatches, render the clock's first value from a fixed `Date` passed in as a prop, or render a placeholder until mount. Format times with `formatLocalTime` from `@/shared/lib`.

**Images: `next/image` only.** `<img>` fails lint. Always give `alt`, and use `alt=""` for decorative images. For the above-the-fold avatar or logo, use `preload` or `fetchPriority="high"`. `priority` is deprecated in Next 16. Static assets go in `public/` or are imported statically so their size is known.

**Fonts: `next/font` only.** No `<link>` to Google Fonts (`no-page-custom-font`). Load Geist, Geist Mono and Instrument Serif once in `src/app/layout.tsx` with a `variable` each, and map those variables to Tailwind font tokens in `@theme`. Don't call `next/font` inside a slice.

**Styling: Tailwind v4 tokens.** Colors, fonts, radii and other design values are defined once as tokens in `src/app/globals.css` (`@theme`) and used through utilities (`bg-accent`, `text-muted`, `font-serif`). Don't hard-code hex values or arbitrary values like `text-[#ff5a1f]` in components. If the design needs a new value, add a token.

### Design tokens

Defined in `src/app/globals.css`. Tailwind's default colors and font sizes are reset, so `bg-zinc-900` or `text-sm` don't exist; use these.

| Group      | Tokens (utility suffix)                                                                                                                                                                                                                                                                                                                                 | Use                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ground     | `bg`                                                                                                                                                                                                                                                                                                                                                    | Page background `#0C0C0B`                                                                                                                                                                        |
| Surfaces   | `surface-1` … `surface-7`                                                                                                                                                                                                                                                                                                                               | Cards, panels, chips, hovers; darkest (`#141413`) to lightest (`#34332F`)                                                                                                                        |
| Lines      | `line`, `line-strong`, `line-hover`, `dim`                                                                                                                                                                                                                                                                                                              | `line` (`#262522`) for the 1px dividers between header, sections and footer; `line-strong` / `line-hover` for control borders; `dim` for decorative marks, not text                              |
| Text       | `fg`, `secondary`, `muted`                                                                                                                                                                                                                                                                                                                              | Cream primary text (also the avatar disc), secondary text, meta labels. `muted` passes 4.5:1 on `bg` and `surface-1`…`surface-4` only                                                            |
| Accent     | `accent`                                                                                                                                                                                                                                                                                                                                                | Orange for primary actions, focus ring and the logo dot                                                                                                                                          |
| Fonts      | `font-sans`, `font-mono`, `font-serif`                                                                                                                                                                                                                                                                                                                  | Geist (300–600), Geist Mono (400/500), Instrument Serif (400, normal + italic). Headline pattern: Geist plus one `font-serif italic` word                                                        |
| Type scale | `text-micro` 10, `meta` 11, `caption` 12, `small` 13, `ui` 14, `body` 15, `body-lg` 16, `lead` 17, `title` 18, `h4` 22, `h3` 26, `h3-tight` 26 (line height 1.1), `h2` 28, `h1` 36, `h2-mobile` 44 (section headings on mobile), `statement-sm` 28 (about lead on mobile), `statement` 52 (about lead), `display-xs` 58, `display-sm` 96, `display` 148 | px in the design; each step carries its line height (and letter spacing from `h4` up). `body` is the page default                                                                                |
| Layout     | `px-gutter`, `py-section`, `max-w-page`, `page-grid`                                                                                                                                                                                                                                                                                                    | Side gutter 20 → 64 px and section padding 56 → 120 px (switch at `md`; on mobile the header shell is 20/20/48 px and the footer 56/20/28 px), content max width 1312 px, grid of 4 → 12 columns |
| Motion     | `animate-marquee`, `paused`                                                                                                                                                                                                                                                                                                                             | Marquee loop; `paused` stops any animation (`group-hover:paused`)                                                                                                                                |

### Shared UI primitives

Import from `@/shared/ui`. Build sections from these instead of restyling raw elements.

| Primitive        | What it is                                                                                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Section`        | `<section>` with the 1px top border, `px-gutter py-section` and a `max-w-page` inner wrapper. Name it with `aria-labelledby`; lay out its content with `page-grid`.                                                                                               |
| `Logo`           | Lockup: avatar on the cream disc, "Johnny" (Geist 500), "Dang" (serif italic), accent dot. Not a link; wrap it.                                                                                                                                                   |
| `Avatar`         | `size` in px, `variant` `logo` or `chat`, decorative by default (`alt=""`). Images are `public/avatar.png` and `public/avatar-chat.png` (placeholders until the real exports replace them).                                                                       |
| `Button`         | `<button type="button">`, `variant` `primary` / `secondary` / `ghost`, `size` `sm` / `md`. `buttonClassName()` gives the same classes to other elements.                                                                                                          |
| `LinkButton`     | `<a>` with the button styles. `http(s)` links get the external style: new tab, "↗", and "(opens in a new tab)" for screen readers. `external={false}` opts out.                                                                                                   |
| `Marquee`        | Client. Looping row of `<li>` children with an accessible `label`. Pauses on hover/focus and has a Pause/Play button; static and wrapped under `prefers-reduced-motion`.                                                                                          |
| `Dialog`         | Client, controlled (`open`, `onClose`). `<dialog open aria-modal="true">` named by `aria-label` or `aria-labelledby`: focuses the first control, traps Tab, Escape calls `onClose`, returns focus on close. Unstyled: position and surface come from `className`. |
| `VisuallyHidden` | Screen-reader-only text.                                                                                                                                                                                                                                          |

`cn()` from `@/shared/lib` joins class names. It doesn't merge conflicting utilities, so pass a primitive one value per property in `className`. Site constants (name, email, time zone, links, availability) are in `siteConfig` from `@/shared/config`; placeholders still to be filled by the owner are marked `TODO(owner)` there.

**Naming.**

- Folders and slice names are kebab-case (`selected-work`, `ask-assistant`).
- Component files under `ui/` are PascalCase, one main component per file, and the file name matches the component name (`ProjectCard.tsx` exports `ProjectCard`).
- Other files are kebab-case (`format-local-time.ts`, `use-unread-count.ts`).
- Tests sit next to the file they test and take its name: `ProjectCard.test.tsx` next to `ProjectCard.tsx`.
- Use named exports. Default exports are only for Next route files (`page.tsx`, `layout.tsx`, ...).
- Every slice exposes its public API in `index.ts`. Export only what other slices need.

## 4. FSD mapping for the home page

Use these slices so parallel tickets don't invent conflicting ones. If you need a slice that isn't listed, say so in the ticket before you create it.

| Layer      | Slice           | Contents                                                                                                                   |
| ---------- | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `app`      | `src/app`       | `layout.tsx` (fonts, `<html lang>`, providers), `page.tsx` renders `HomePage`, `_providers/` mounts the assistant provider |
| `views`    | `home`          | `HomePage`: puts the widgets in order for desktop and mobile. One slot file per section in `ui/slots/`                     |
| `widgets`  | `site-header`   | Logo, nav, status, local-time clock                                                                                        |
| `widgets`  | `hero`          | Intro headline, avatar, stack marquee                                                                                      |
| `widgets`  | `selected-work` | Project card grid. Cards show previews (permissions-table demo, booking demo) and the `features/ask-assistant` trigger     |
| `widgets`  | `about`         | Bio, experience timeline (`entities/experience`), RTL sample text                                                          |
| `widgets`  | `stack-flow`    | Stack request-flow section ("Toolkit A · Request flow" board)                                                              |
| `widgets`  | `site-footer`   | Contact links, copyright                                                                                                   |
| `features` | `ask-assistant` | Chat launcher, assistant panel, typing/unread state, async replies, "ask about this project" trigger                       |
| `entities` | `project`       | `Project` type, project data, `ProjectCard` (display only)                                                                 |
| `entities` | `experience`    | `Experience` type, data, timeline item                                                                                     |
| `shared`   | `ui`            | Design-system primitives: `Button`, `Logo`, `Marquee`, `Dialog`, `VisuallyHidden`, ...                                     |
| `shared`   | `lib`           | Framework-free helpers, e.g. `formatLocalTime`                                                                             |
| `shared`   | `config`        | Site constants (owner name, time zone, links)                                                                              |

Notes:

- **Project cards open the assistant.** `entities/project` can't import a feature, so `ProjectCard` takes an `action` slot (a `ReactNode`). `widgets/selected-work` fills that slot with the trigger from `@/features/ask-assistant`.
- **Shared assistant state.** The launcher and the card triggers share open/unread state through a provider exported by `features/ask-assistant` and mounted in `app/_providers`. Widgets never import each other.
- **Mobile vs desktop** is one tree with responsive utilities, not separate `mobile-*` slices.
- **No AI-workflow section.** The home page has none ("Toolkit B" is an alternative board, not built). The permissions-table and booking demos are previews inside project cards, so they live in `widgets/selected-work`.
- **Home page slots.** `views/home/ui/HomePage.tsx` renders `HeaderSlot`, then `HeroSlot`, `WorkSlot`, `AboutSlot`, `StackSlot` inside `<main>`, then `FooterSlot` and `AssistantSlot`. A section ticket edits only its own slot file to return its widget, so parallel PRs don't conflict in `HomePage.tsx`.

## 5. Accessibility bar

Target WCAG 2.2 AA. The e2e suite fails on any axe violation with impact `serious` or `critical`, but axe can't check behaviour, so the items below are also checked in review.

- **Keyboard.** You can reach and use every control with Tab, Enter and Space, in visual order, with a visible focus ring. The launcher and clickable project cards are real `<button>`s (or `<a>` when they navigate), not `div`s with `onClick`. Don't nest interactive elements inside a card button.
- **Assistant panel.** It is a dialog: `role="dialog"`, `aria-modal="true"` and an accessible name. Focus moves into it when it opens and is trapped while it is open. Escape closes it, and focus goes back to the launcher.
- **Live updates.** The typing indicator and new assistant messages are announced through a polite `aria-live` region that stays mounted. The unread count is part of the launcher's accessible name (for example "Open assistant, 2 unread").
- **Motion.** The marquee, pulse and typing animations respect `prefers-reduced-motion` (Tailwind `motion-safe:` / `motion-reduce:`). The marquee can be paused and pauses on hover and focus.
- **Language and direction.** `<html lang="en">`. Arabic sample text is wrapped in `lang="ar" dir="rtl"`. Use logical properties (`ms-*`, `pe-*`, `text-start`) so RTL text lays out correctly.
- **Contrast.** Text needs 4.5:1, and 3:1 for large text, icons, borders and focus rings. Check the accent color on both the light and dark backgrounds, and when it is used as a text color.
- **Images and icons.** Meaningful images have a real `alt`. Decorative ones have `alt=""`. An icon-only button has an `aria-label`, and its icon has `aria-hidden`.

## 6. Testing bar

| Write a…                          | For                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit test** (Vitest)            | Every function in `model/` and `lib/`: state reducers (assistant open/typing/unread), formatters, data mapping.                                                                                                                                                                                                                                   |
| **Component test** (Vitest + RTL) | Every client component with behaviour: launcher toggles and shows the unread count, Escape closes the panel, a card trigger opens the assistant, clock updates (fake timers), table demo toggles.                                                                                                                                                 |
| **E2E spec** (Playwright + axe)   | Every page, on both viewports, with the axe gate and the console-error listener (copy `e2e/smoke.spec.ts`). Also flows that cross slices or need a real browser: focus trap and focus return, keyboard-only path through the home page, reduced-motion behaviour, layout that differs on mobile. Async Server Components can only be tested here. |

Conventions:

- Unit and component tests sit next to the code as `*.test.ts(x)`. There is no `__tests__/` folder. E2E specs go in `e2e/*.spec.ts`.
- Import `describe`/`it`/`expect`/`vi` from `vitest` (globals are off). Inside a slice, import the code under test with a relative path. FSD lint applies to tests too.
- Query by role, label or text (`getByRole`, `getByLabelText`). Don't use test IDs or class names. Assert with jest-dom matchers (`toBeInTheDocument`, `toHaveAccessibleName`).
- Keep tests deterministic: use a fixed `Date`, or `vi.useFakeTimers()` / `vi.setSystemTime()`. Never depend on the machine's time zone or on network calls.
- Use `test.skip(testInfo.project.name === "mobile", …)` only when the layout really differs.

## 7. Definition of Done for UI tickets

The same list is in the [PR template](../.github/pull_request_template.md).

- [ ] `bun run ci` passes locally, and `bun run test:e2e` passes on desktop and mobile.
- [ ] Matches the design at 1440 px and 390 px (screenshots of both in the PR).
- [ ] Code is in the slices from [§4](#4-fsd-mapping-for-the-home-page), and only public APIs are imported across slices.
- [ ] Server Component by default. `"use client"` only on the leaves that need it.
- [ ] `next/image` and `next/font` only. Colors and fonts come from `@theme` tokens, with no hard-coded hex values.
- [ ] Accessibility bar ([§5](#5-accessibility-bar)) met: keyboard-only pass done, focus visible, reduced motion respected, no serious/critical axe violations.
- [ ] Tests added according to [§6](#6-testing-bar): unit/component tests for the logic and behaviour, and an e2e spec for any new page or cross-slice flow.
- [ ] No new lint disables without a reason. No config changes mixed into the feature PR.
- [ ] No console errors or warnings in the browser.
- [ ] PR title and commits follow conventional commits and reference the ticket.
