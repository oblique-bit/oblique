# Repository Guidelines

## Layout

npm-workspaces monorepo. Packages in `projects/`: `oblique` Angular library; `design-system` Vite; `toolchain` schematics; `sandbox*` examples. Root config: `eslint.config.mjs`, `.prettierrc.yml`, Angular workspace files. Keep change in owning package. Put tests beside code: `*.spec.ts`.

## Commands

Node.js 22.12+. Install from repository root.

- `npm run lint` — lint all workspaces.
- `npm run format` — fix ESLint/Prettier issues.
- `npm run build -w @oblique/toolchain` — build package; replace package name as needed.
- `npm run test -w @oblique/toolchain` — run package test with coverage; replace package name as needed.
- `npm run start -w @oblique/sandbox` — serve package; replace package name as needed.

## Style

Follow `.editorconfig`: tabs, LF, UTF-8, no trailing whitespace; JSON two spaces. Prettier: single quotes, semicolons, compact object braces, trailing commas, concise arrows. Names: kebab-case files (`add-i18n.ts`), PascalCase classes/components, camelCase symbols.

## Scope

Keep change minimal, request-bound. No unrelated edits. Before scope growth, public API change, behavior beyond request, or material trade-off: describe approach; wait for user confirmation.

## Tests

Jest: `cli`, `oblique`, `sandbox`, `sandbox-ssr`, `sds`, `service-navigation-web-component`, `toolchain`. Vitest: `design-system`. Angular tooling: Angular packages. Add behavior regression tests. Toolchain coverage: 100% statements, branches, functions, lines. Exercise new helpers and fixtures.

## Commits and PRs

Header: `type(package/scope): subject`; example: `test(toolchain/schematics): cover locale imports`. Types: `feat`, `fix`, `docs`, `refactor`, `test`. One package, scope, logical change per commit. Lines under 101 characters. PR: explain change, tests, public API docs, linked ticket; screenshots for UI change.

## Generated Code

Put exact comment before generated code. Entire generated file: after license/shebang header. Keep existing disclosures.

```typescript
/*
 * AI GENERATED CODE
 * Model: <model name>
 * Prompt: <brief prompt summary>
 */
```
