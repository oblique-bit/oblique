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

The server intentionally exposes no MCP resources, prompts or HTTP transport.
