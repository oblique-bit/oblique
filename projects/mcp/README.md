# Oblique MCP server

Initial Model Context Protocol (MCP) server for the Oblique ecosystem. It makes Oblique repository metadata and
official documentation available to MCP-compatible clients such as Codex, Claude Code and VS Code.

The build embeds an authoritative snapshot of repository sources under `dist/runtime-data`. Directus documentation
and search remain live queries; code examples and static API/design-system data are read from that snapshot.

## Install dependencies

From the monorepo root:

```shell
npm install
```

## Build and test

From the monorepo root:

```shell
npm run build -w @oblique/mcp
npm run test -w @oblique/mcp
npm run lint -w @oblique/mcp
```

## Run through stdio

Build the workspace, then run the generated server from any directory:

```shell
npm run build -w @oblique/mcp
npm run start -w @oblique/mcp
```

Configure an MCP client to execute the built server by absolute path; it can run from any working directory.

## Installation and MCP client configuration

The package remains private and unpublished. For checkout development, a local tarball, proxy mode, and Codex, VS Code,
Cursor, Claude Code, and Claude Desktop examples, see [INSTALLATION.md](INSTALLATION.md).

## Available tools

- `get_oblique_version` returns the version, Angular compatibility, Node.js requirement and repository name.
- `get_oblique_component` resolves a component by case-insensitive slug or name and returns official Directus data.
- `search_oblique` finds compatible tabbed and text documentation pages by name or slug, for example
  `{ "query": "notification" }`.
- `get_oblique_examples` returns SDS source snippets for a component, for example `{ "component": "button" }`.
- `get_oblique_api` returns a public TypeScript API symbol, for example
  `{ "symbol": "ObNotificationService" }`.
- `get_oblique_migration` returns the official read-only upgrade path, for example
  `{ "fromVersion": 14, "toVersion": 15 }`.
- `check_oblique_code` performs read-only TypeScript API checks, for example
  `{ "code": "import {ObNotificationService} from '@oblique/oblique';" }`.
- `search_oblique_design_tokens` finds embedded Design System tokens, for example
  `{ "query": "color interaction" }`.
- `check_oblique_styles` performs read-only CSS/SCSS Design System token checks, for example
  `{ "language": "scss", "code": ".card { color: var(--ob-s3-color-text-default); }" }`.
- `check_oblique_template` performs read-only Angular template API checks, for example
  `{ "code": "<ob-alert></ob-alert>" }`.
- `get_oblique_template_api` returns the effective public Angular template contract, for example
  `{ "symbol": "ObDateComponent" }` or `{ "selector": "[obInputClear]" }`.
- `prepare_oblique_project` prepares, but never executes, an Oblique CLI project creation plan. For example,
  `{ "projectName": "employee-portal", "parentDirectory": "/workspace" }` returns a confirmation-required
  `npx --yes @oblique/cli@15.4.4 new employee-portal` argument plan after validating the directory, destination,
  pinned version, and current Node.js version. A request such as `{ "projectName": "Employee Portal" }` is blocked
  with `INVALID_PROJECT_NAME`. Phase 14 will add controlled execution only after explicit developer confirmation.

`projects/oblique/src/public_api.ts` is the authoritative boundary for APIs consumable from
`@oblique/oblique`. `get_oblique_api` only returns symbols reachable from that entry point; it does not expose
internal library source APIs.

`get_oblique_migration` derives its information from the embedded official ng-update schematics under
`projects/oblique/schematics/index/ng-update/`. It reports their declared migration tasks and dependency requirements;
it never executes a migration or modifies a project.

`check_oblique_code` accepts TypeScript source text only (up to 100,000 characters). It parses the submitted text but
never executes it or reads it from disk. Validation uses the embedded `projects/oblique/src/public_api.ts` boundary
for the current Oblique version; it does not replace ESLint or TypeScript compilation, and does not analyze templates,
HTML, SCSS or CSS.

For TypeScript API usage, `@oblique/oblique` is the supported package entry point. The published
`@oblique/oblique/styles/css/*.css` assets are permitted; other Oblique subpaths are reported as internal imports.
For namespace imports, direct properties and static string-literal element accesses are checked; dynamic element
accesses are intentionally ignored.

`search_oblique_design_tokens` reads the embedded generated
`projects/design-system/src/lib/css/layers/tokens.css` artifact; it does not contact Figma. By default it returns only
project-usable semantic tokens. HTML and component tokens are internal implementation details and appear only with
`{ "scope": "all" }`, clearly marked as unusable by projects. `total` is the number of matches before the result limit.

`check_oblique_styles` accepts CSS or SCSS source text only (up to 100,000 characters). It parses source in memory and
never compiles Sass, resolves filesystem imports, executes source, or modifies files. Semantic tokens are supported for
projects; HTML and component tokens are Oblique implementation details. Its exact-value candidates only prove that a
semantic token has the same embedded base value, not that it is the intended semantic replacement. Warnings do not
make the submitted code invalid, and the tool never applies an autofix.

`check_oblique_template` accepts Angular template source text only (up to 100,000 characters). It parses submitted
source in memory with the Angular template parser and never executes expressions, reads project files, or applies an
autofix. The embedded `projects/oblique/src/public_api.ts` boundary determines public Oblique components and
directives: public `ob-*` component selectors are checked, known public directives are recognized, and deprecated
public template APIs can be reported. It also understands classic and signal inputs/outputs, aliases, required inputs,
inheritance, models and explicitly exposed host-directive bindings. `bindingDiagnostics` defaults to `safe`, which only
reports proven missing required and deprecated Oblique bindings. `verbose` can additionally report bindings not exposed
by matched public Oblique APIs; those informational findings do not state that Angular itself is invalid, because another
directive may own the binding. The tool does not type-check expressions, load a consumer directive registry or apply an
autofix. Unknown directive-like attributes are intentionally not reported, because this tool does not claim ownership
of arbitrary application attributes.

`get_oblique_template_api` reads the same embedded public API index without executing Angular code or inspecting a
consumer project. It exposes effective public component and directive selectors, consumer-visible input/output aliases,
required and inherited bindings, and explicitly exposed host-directive bindings. Deprecated APIs and bindings remain in
the result so clients can avoid them. Only symbols reachable from `projects/oblique/src/public_api.ts` are returned.

The server intentionally exposes no MCP resources, prompts or HTTP transport.

`prepare_oblique_project` accepts `projectName`, optional `parentDirectory`, and optional `obliqueVersion`. It only
reads the selected parent directory and destination to create a plan; it never starts `npx`, the Oblique CLI, Angular
CLI, or another subprocess, and never creates or modifies a project. The canonical command is an argument array, not
a shell command. It rejects unsafe project names, existing destinations, unsupported Node.js versions, invalid version
aliases/ranges, and known unsafe CLI versions `15.4.0` and `15.4.1`. Compatibility metadata is embedded only for the
installed Oblique version, so an explicit `obliqueVersion` must equal that version; other valid semantic versions are
blocked with `UNSUPPORTED_OBLIQUE_VERSION` and an `oblique-version` failed check. The result is a preflight only: it does not reserve the destination, and a
future controlled execution phase must revalidate it immediately before creating anything.
