# Oblique MCP server

Initial Model Context Protocol (MCP) server for the Oblique ecosystem. It makes Oblique repository metadata and
official documentation available to MCP-compatible clients such as Codex, Claude Code and VS Code.

The server reads version metadata from the checked-out repository's root `package.json`. Documentation and search data
come from the official Oblique Directus CMS used by the Swiss Design System (SDS), not scraped from the website. Code
examples come from `projects/sds/src/app/code-examples` in this repository.

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

Build the workspace, then run it from the repository root so it can read that checkout's package metadata:

```shell
npm run build -w @oblique/mcp
npm run start -w @oblique/mcp
```

Configure an MCP client to execute `node projects/mcp/dist/server.js` with the repository root as its working directory.

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

`projects/oblique/src/public_api.ts` is the authoritative boundary for APIs consumable from
`@oblique/oblique`. `get_oblique_api` only returns symbols reachable from that entry point; it does not expose
internal library source APIs.

`get_oblique_migration` derives its information from the checked-out official ng-update schematics under
`projects/oblique/schematics/index/ng-update/`. It reports their declared migration tasks and dependency requirements;
it never executes a migration or modifies a project.

`check_oblique_code` accepts TypeScript source text only (up to 100,000 characters). It parses the submitted text but
never executes it or reads it from disk. Validation uses the checked-out `projects/oblique/src/public_api.ts` boundary
for the current Oblique version; it does not replace ESLint or TypeScript compilation, and does not analyze templates,
HTML, SCSS or CSS.

For TypeScript API usage, `@oblique/oblique` is the supported package entry point. The published
`@oblique/oblique/styles/css/*.css` assets are permitted; other Oblique subpaths are reported as internal imports.
For namespace imports, direct properties and static string-literal element accesses are checked; dynamic element
accesses are intentionally ignored.

The server intentionally exposes no MCP resources, prompts or HTTP transport.
