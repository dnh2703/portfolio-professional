import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// Steiger has no layer aliasing, so `bun run lint:fsd` lints `.steiger/src`: a mirror of `src/`
// made of symlinks, with `pages -> src/views`. See docs/architecture.md.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      "fsd/forbidden-imports": "error",
      "fsd/no-cross-imports": "error",
      "fsd/no-public-api-sidestep": "error",
      "fsd/public-api": "error",
      "fsd/no-segmentless-slices": "error",
      "fsd/insignificant-slice": "warn",
      "fsd/excessive-slicing": "warn",
      // Off: already covered by fsd/forbidden-imports.
      "fsd/no-higher-level-imports": "off",
      // Off: same-slice relative imports are the convention, and oxlint already blocks `@/<own-layer>/*`.
      "fsd/import-locality": "off",
      // Off: `export *` in a public API is allowed; not part of our conventions.
      "fsd/no-wildcard-exports": "off",
    },
  },
]);
