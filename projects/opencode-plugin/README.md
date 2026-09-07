# Oblique OpenCode Plugin

The Oblique OpenCode plugin is a thin integration layer between OpenCode and the existing Oblique MCP server.

It does not replace the MCP. The MCP remains the source of truth for Oblique components, APIs, examples, migrations, project creation, and documentation. The plugin only detects project context, configures MCP access for OpenCode, and injects minimal guidance for the model.

## Purpose

- MCP Oblique provides Oblique knowledge and tools.
- The OpenCode plugin integrates that MCP into OpenCode.
- The plugin does not duplicate Oblique documentation, examples, or tool behavior.
- The plugin is intentionally lightweight and project-aware, not a second implementation of Oblique.

## Architecture

OpenCode
↓
@oblique/opencode-plugin
↓
MCP Oblique
↓
Oblique documentation / API / examples

## Installation

This package is currently meant for local development inside the monorepo. It is not documented as a published npm package.

From the repository root:

```bash
npm install
```

Then build or test the plugin package directly:

```bash
npm run build -w @oblique/opencode-plugin
npm test -w @oblique/opencode-plugin -- --runInBand
npm run lint -w @oblique/opencode-plugin
```

For local OpenCode usage, configure the plugin in the local OpenCode environment or project setup that loads workspace plugins. This repository is the source of truth for the current implementation.

## Configuration

The plugin supports two MCP modes:

- remote MCP: OpenCode connects to an HTTP MCP endpoint
- local MCP: OpenCode starts a local MCP process or command

### Remote MCP

```json
{
	"mcp": {
		"oblique": {
			"type": "remote",
			"url": "https://example.com/mcp",
			"enabled": true
		}
	}
}
```

This is an example only. The actual endpoint must be supplied by config or environment, not hardcoded in the plugin.

### Local MCP

```json
{
	"mcp": {
		"oblique": {
			"type": "local",
			"command": ["node", "projects/mcp/dist/index.js"],
			"enabled": true
		}
	}
}
```

The plugin resolves local or remote configuration without overwriting an existing user-defined `config.mcp.oblique` entry.

### Environment variables

The plugin honors:

```bash
export OBLIQUE_MCP_MODE=remote
export OBLIQUE_MCP_URL=https://example.com/mcp
```

Optional local-mode variables also supported by the MCP config layer:

```bash
export OBLIQUE_MCP_COMMAND=node
export OBLIQUE_MCP_ARGS="projects/mcp/dist/index.js"
```

Environment variables override defaults, but do not replace explicit OpenCode user configuration.

## Automatic project detection

When OpenCode starts in a workspace, the plugin safely inspects project metadata without modifying files.

It checks, in order:

- `package.json` for Angular and Oblique dependencies
- `angular.json`, `workspace.json`, or `project.json` when available
- ancestor package roots to support workspace/monorepo layouts
- package manager hints such as `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`

The detector returns a typed structure with:

- `projectRoot`
- `isAngularProject`
- `isObliqueProject`
- `angularVersion`
- `obliqueVersion`
- `packageManager`

Malformed `package.json` is handled defensively and does not crash OpenCode.

## AI instructions

When the project is detected as Angular + Oblique, the plugin injects a short instruction block into the model context.

The generated guidance tells the model to:

- prefer existing Oblique components over custom implementations
- query the Oblique MCP before inventing APIs or selectors
- verify component availability for the current version
- use Oblique examples when available
- respect Angular and Oblique compatibility
- avoid deprecated Oblique APIs
- preserve accessibility requirements

The instruction is intentionally concise and non-duplicative. It does not copy Oblique documentation into the model prompt.

## Oblique agent

The plugin registers an Oblique-specialized agent when the current project is detected as Oblique.

Example usage:

```text
@oblique create a form with validation, date picker and notifications
```

The agent is designed to:

- inspect project context and installed versions
- use MCP Oblique before generating Oblique code
- prefer existing Oblique components over custom implementations
- retrieve APIs, examples, and migration guidance from the MCP when needed
- remain compatible with the current Angular and Oblique versions

## Commands

The following commands are currently implemented and registered for Oblique projects.

### `/oblique-review`

Used to review selected files, changed files, or the current feature from an Oblique perspective.

It is intended to flag:

- custom UI where an existing Oblique component may be used
- deprecated Oblique APIs
- version mismatch issues
- guessed selectors or invalid inputs/outputs
- accessibility and Angular compatibility concerns

The review is MCP-aware and does not change files unless explicitly requested.

### `/oblique-status`

Used to display integration health and diagnostics.

Example output:

```text
Oblique OpenCode Integration
Project
✓ Angular project detected
✓ Angular: 21.x
✓ Oblique: 15.4.4

MCP
✓ Oblique MCP configured
✓ Server reachable
✓ MCP initialized
✓ tools/list available

Configuration
Mode: remote
Endpoint: https://...
Plugin: @oblique/opencode-plugin
Plugin version: x.y.z
```

The status command reports useful failure reasons but never exposes credentials or secret values.

### `@oblique`

This is the specialized agent entry point, not a slash command.

## Troubleshooting

### MCP unavailable

- verify the URL or local command is valid
- ensure the Oblique MCP server is reachable
- check the environment variables
- run `/oblique-status` to inspect the integration state

### Wrong URL

- confirm `OBLIQUE_MCP_URL` points to the actual MCP endpoint
- verify the protocol is `http://` or `https://`
- avoid including credentials in the URL

### Project not detected

- ensure the workspace contains a `package.json`
- check whether Angular or Oblique is declared in `dependencies` or `devDependencies`
- confirm you started OpenCode within the project or a parent workspace root

### Incompatible versions

- compare the project Angular version with the installed Oblique package
- prefer the current Oblique component and API surface from the MCP over hardcoded assumptions
- use the Oblique agent or review command to validate compatibility before implementation

### Plugin not loaded

- ensure the plugin is installed/available in the OpenCode environment used for the project
- verify the workspace loads the plugin package from the monorepo
- check if the current project is detected as Oblique; non-Oblique projects do not register Oblique-specific features

## Development

From the repository root:

```bash
npm install
npm run build -w @oblique/opencode-plugin
npm test -w @oblique/opencode-plugin -- --runInBand
npm run lint -w @oblique/opencode-plugin
```

Formatting is also available via:

```bash
npm run format -w @oblique/opencode-plugin
```

## Current limitations

- The plugin is intentionally thin; it does not embed Oblique documentation or duplicate MCP knowledge.
- The Oblique MCP remains the source of truth for APIs, docs, examples, and migrations.
- The remote production endpoint is configurable but not permanently hardcoded in the plugin.
- The plugin only adds Oblique-specific behavior when the current project is detected as Angular + Oblique.
- Advanced OpenCode plugin behavior must remain aligned with the currently supported OpenCode API in this repo’s target version.
