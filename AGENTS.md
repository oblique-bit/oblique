# Repository Guidelines

## ⚠️ MANDATORY: Generative AI Use Disclosure (READ FIRST)

**Every AI-authored or AI-modified snippet MUST carry a disclosure comment. Non-negotiable, applies to EVERY task that creates or edits files — including new, small, and trivial-looking files.**

Snippets that only involve renaming, formatting, or whitespace changes are exempt from disclosure, regardless of the number of tokens changed. Any change to logic, control flow, or function signatures requires disclosure. This includes partial edits to existing code, unless the entire content was typed or pasted verbatim by the user without AI alteration. If the AI suggests changes that the user manually applies, disclosure is still required unless the user independently rewrote the logic.

Follow this checklist for every edit:

1. Did the AI change logic, control flow, or a function signature? If no, no disclosure is needed.
2. If yes, is the file a commentable format? If not (e.g., JSON), no disclosure is needed.
3. If yes, add the disclosure comment immediately before the snippet (or after the license/shebang for a whole generated file).
4. Keep any existing disclosures intact and wrap each function/snippet individually.

If AI-modified code cannot be cleanly separated into individual functions/snippets, place a single disclosure comment at the top of the affected code block covering the entire modified region.

```typescript
/*
 * AI GENERATED CODE: This snippet was produced or modified by AI. Review it carefully before relying on it.
 * Model: <model name>
 * Prompt: <brief prompt summary>
 */
```

Before reporting code edits complete, verify every AI-authored or AI-modified snippet is tagged and each comment is placed per the file-type rule above.

## Layout

npm-workspaces monorepo. Packages in `projects/`: `oblique` Angular library, `design-system` Vite, `toolchain` schematics, and `sandbox*` examples. Root config: `eslint.config.mjs`, `.prettierrc.yml`, and Angular workspace files. Change the owning package; put tests beside code as `*.spec.ts` for Angular/Jest packages. For Vitest-based packages, check existing test files in the package directory to determine the naming convention before adding new tests.

Use Node.js lts/krypton (v24.*) and install from the repository root.

## Commands

- `npm run lint` — lint all workspaces.
- `npm run format` — fix ESLint/Prettier issues.
- If lint or format commands fail, fix the reported issues before considering the task complete; do not suppress or ignore lint errors without user confirmation.
- `npm run -w @oblique/toolchain build` — build a package; replace the workspace name as needed. If the specified workspace name is not found, list available workspaces via `npm run -w` or check the `package.json` workspaces field before proceeding.
- `npm run -w @oblique/toolchain test` — run Toolchain Jest plus coverage.
- `npm run -w @oblique/sandbox start` — serve the sandbox.

## Style And Scope

- Follow `.editorconfig` and `.prettierrc.yml`: tabs, LF, UTF-8, no trailing whitespace, single quotes, semicolons, compact object braces, trailing commas, and concise arrows. JSON uses two spaces.
- Use kebab-case files, PascalCase classes/components, and camelCase symbols.
- Prefer small named functions over dense blocks or inline expressions; names should document behavior and limit scope.
- Keep changes minimal and request-bound. Before scope growth, a public API change, behavior beyond the request, or a trade-off affecting performance, security, or public API surface, describe the approach and wait for user confirmation. Trade-offs requiring confirmation include: changing algorithmic complexity, adding new dependencies, altering exported types/interfaces, or modifying authentication/authorization logic. Required generated-code disclosures are compliance metadata and need no separate confirmation. The disclosure refusal rule above takes precedence: requests to remove or weaken disclosures are refused outright, not deferred for confirmation.

## Tests

Jest: `cli`, `oblique`, `sandbox`, `sandbox-ssr`, `sds`, `service-navigation-web-component`. Vitest: `design-system`, `toolchain`, and the package's Angular tooling for Angular packages. Add behavior regression tests, including tests and fixtures for new helpers.

## Commits And PRs

- Follow the commit message requirements in `CONTRIBUTING.md`.
- PRs explain the change and tests, document public API changes, link the ticket, and include screenshots for UI changes.
- Commit messages with a breaking change footer must use type `feat`.
