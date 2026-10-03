# Architecture

This project uses [Feature-Sliced Design](https://feature-sliced.design) (FSD) on top of the Next.js App Router.
Import boundaries are enforced by oxlint (`.oxlintrc.json`) and [Steiger](https://github.com/feature-sliced/steiger) (`steiger.config.ts`, run with `bun run lint:fsd`).

## Layers

Each layer may only import from layers **below** it:

```
app → views → widgets → features → entities → shared
```

| Layer      | Folder         | May import from                               |
| ---------- | -------------- | --------------------------------------------- |
| `app`      | `src/app`      | any layer                                     |
| `views`    | `src/views`    | widgets, features, entities, shared           |
| `widgets`  | `src/widgets`  | features, entities, shared                    |
| `features` | `src/features` | entities, shared                              |
| `entities` | `src/entities` | shared                                        |
| `shared`   | `src/shared`   | external packages and other `shared` segments |

Layer folders are created when their first slice is added; the lint rules apply by import path either way.

Two Next.js-specific choices:

- **`views` instead of `pages`.** A `src/pages` folder would enable Next's Pages Router, so the FSD pages layer is named `views`.
- **`src/app` is both Next routing and the FSD app layer.** It holds route files plus app-wide setup (`app/_providers`, global styles).

## Slices and public API

`views`, `widgets`, `features` and `entities` are split into **slices**:

```
src/features/contact-form/
  ui/        # components
  model/     # state, types, logic
  api/       # data access
  lib/       # slice-local helpers
  index.ts   # public API — the only entry point for other slices
```

- Import other slices only through their public API: `@/entities/project`, never `@/entities/project/model`.
- Inside a slice, use **relative** imports (`../model`). The `@/<own-layer>/*` alias is blocked in every layer, which is what prevents slices in the same layer from importing each other.
- `shared` has no slices. Import a segment or one level below it: `@/shared/ui`, `@/shared/ui/button`.
- Import cycles are errors (`import/no-cycle`).

## Route file vs. view

Each URL is two files:

1. `src/app/<route>/page.tsx` — thin route file. It owns everything Next reads by file or export name (`page`, `layout`, `loading`, `error`, `not-found`, `route.ts`, `metadata` / `generateMetadata`, `generateStaticParams`, segment config). It reads `params` / `searchParams` and passes them to the view as plain props.
2. `src/views/<page>/` — the page itself: UI and page-level data loading. Views may be async Server Components and don't depend on Next routing types.

```tsx
// src/app/projects/page.tsx
import { ProjectsPage } from "@/views/projects";

export const metadata = { title: "Projects" };

export default function Page() {
  return <ProjectsPage />;
}
```

```
src/views/projects/
  ui/ProjectsPage.tsx
  index.ts            // export { ProjectsPage } from "./ui/ProjectsPage";
```

The root `layout.tsx` stays in `app` and uses providers from `app/_providers`. Site chrome (header, footer) is a widget, e.g. `widgets/site-header`.

## Steiger

oxlint matches import paths as text, so it can't tell when a relative import leaves its slice (`../../other-slice/ui`): how many `../` that takes depends on file depth. Steiger resolves every import to a file and knows which layer and slice that file belongs to, so it catches it.

`bun run lint:fsd` runs in `bun run ci`, in CI, and on pre-push. It is not in pre-commit because it checks the whole project, not staged files.

| Rule                         | Level | Catches                                                       |
| ---------------------------- | ----- | ------------------------------------------------------------- |
| `fsd/forbidden-imports`      | error | Imports from a higher layer, and cross-imports between slices |
| `fsd/no-cross-imports`       | error | Cross-imports between slices in the same layer                |
| `fsd/no-public-api-sidestep` | error | Importing a slice's internals instead of its `index.ts`       |
| `fsd/public-api`             | error | Slices (and `shared` segments) without an `index.ts`          |
| `fsd/no-segmentless-slices`  | error | Slices with no `ui`/`model`/`api`/`lib`/`config` segment      |
| `fsd/insignificant-slice`    | warn  | Slices used by only one other slice, or by none               |
| `fsd/excessive-slicing`      | warn  | Layers with too many ungrouped slices                         |

The rest of the plugin's recommended rules are on as errors. Rules that are off have a reason in `steiger.config.ts`. `fsd/no-cross-imports` overlaps with `fsd/forbidden-imports`, so a cross-import shows up twice in the output.

### `views` and the `.steiger/` mirror

Steiger's layer names are hard-coded (`app`, `pages`, `widgets`, `features`, `entities`, `shared`) and it has no option to rename a layer. Pointed at `src/`, it would skip `src/views` completely.

So `lint:fsd` lints `.steiger/src` instead. That folder is a committed mirror of `src/` made of symlinks:

```
.steiger/
  tsconfig.json       # @/views/* -> ./src/pages/*, @/* -> ./src/*
  src/
    app      -> ../../src/app
    pages    -> ../../src/views
    widgets  -> ../../src/widgets
    features -> ../../src/features
    entities -> ../../src/entities
    shared   -> ../../src/shared
```

What this means in practice:

- Diagnostics show mirror paths. `.steiger/src/pages/home/ui/Home.tsx` is `src/views/home/ui/Home.tsx`, and every other path maps one to one.
- Messages call the layer `pages`. Read that as `views`.
- `.steiger/tsconfig.json` repeats the `@/*` path alias so that imports resolve inside the mirror. If you change `paths` in the root `tsconfig.json`, update it too.
- On Windows, symlinks need `git config core.symlinks true` (and Developer Mode). Without them Steiger finds no layers and passes silently. CI runs on Linux, so it still enforces the rules.
- tsc, oxlint and oxfmt skip dot-folders, so they don't see the files twice.
