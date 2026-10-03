# Architecture

This project uses [Feature-Sliced Design](https://feature-sliced.design) (FSD) on top of the Next.js App Router.
Import boundaries are enforced by oxlint (`.oxlintrc.json`).

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

## Known gap

Relative imports that escape a slice (e.g. `../../other-slice/ui`) are not caught by lint, because how many `../` it takes depends on file depth. Don't do it — import through the `@/` alias and the public API instead. If this becomes a problem, add [Steiger](https://github.com/feature-sliced/steiger) or a custom check.
