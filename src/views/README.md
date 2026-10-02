# views

FSD "pages" layer (renamed so it doesn't collide with Next's `src/pages` Pages Router).
One slice per page: `views/<page>/{ui,model,api,lib}/` + `index.ts`. Route files in `src/app` render these.
May import: widgets, features, entities, shared. See [docs/architecture.md](../../docs/architecture.md).
