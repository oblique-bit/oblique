# Oblique MCP installation and client configuration

This guide installs the development version of Oblique MCP from a local Oblique checkout. The build embeds an
authoritative source snapshot in `dist/runtime-data`, so the built server can run from any working directory. It is
not an npm registry installation guide: `npx @oblique/mcp`, global installation, remote HTTP/SSE transport,
marketplace installation, and automatic download are not available yet.

## Embedded-source architecture

```text
MCP client
    |
    | stdio
    v
node /absolute/path/to/oblique/projects/mcp/dist/server.js
    |
    v
dist/runtime-data (inside the MCP package)
```

Build/prepack copies the authoritative package metadata, public API sources, migration schematics, SDS examples, and
generated Design System tokens into `dist/runtime-data`. Runtime readers use that snapshot; the process working
directory is not used for these sources. Directus documentation remains live.

## Prerequisites and preparation

Install Git, npm, and Node.js **22.12.0 or later**, then obtain a local checkout of `oblique-bit/oblique`:

```shell
git clone <repository-url> oblique
cd oblique
npm ci
npm run build -w @oblique/mcp
```

`npm ci` is preferred for reproducible setup because it follows the committed lockfile. Use `npm install` only when deliberately developing dependencies or updating that lockfile. No global npm package is required.

## Local tarball mode

Developers can create an installable local artifact after building:

```shell
npm pack -w @oblique/mcp
```

Install the resulting `oblique-mcp-0.1.0.tgz` in a temporary directory to test the packaged executable. The package is
still `private: true` and unpublished: do not use or document `npx @oblique/mcp` as a registry command. Registry
publication belongs to a later release phase.

## Manual server start

Run either command after building:

```shell
node /absolute/path/to/oblique/projects/mcp/dist/server.js
```

```shell
npm run start -w @oblique/mcp
```

An MCP stdio server has no ordinary interactive UI. A process waiting silently for JSON-RPC on stdin is expected and is not, by itself, a failure.

### Corporate proxy mode

If access to the official Oblique Directus service requires `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`, or equivalent environment variables, start Node with proxy support:

```shell
node --use-env-proxy /absolute/path/to/oblique/projects/mcp/dist/server.js
```

Directus-backed documentation tools need network access; tools based on the embedded source snapshot do not. Proxy-related
Node warnings belong on stderr. stdout must contain JSON-RPC protocol output only. Do not put proxy URLs, credentials,
or other secrets in client configuration files.

## Codex and supported local OpenAI clients

Use the MCP section of Codex `config.toml` (normally `~/.codex/config.toml`, or `.codex/config.toml` for a trusted project). Supported local OpenAI Codex surfaces share this configuration. See the official [OpenAI MCP documentation](https://developers.openai.com/codex/mcp/).

```toml
[mcp_servers.oblique]
command = "node"
args = ["/absolute/path/to/oblique/projects/mcp/dist/server.js"]
```

For a corporate proxy:

```toml
[mcp_servers.oblique]
command = "node"
args = ["--use-env-proxy", "/absolute/path/to/oblique/projects/mcp/dist/server.js"]
```

Use the absolute server path in `config.toml`. Verify with `codex mcp list`, then use `/mcp` in a supported local client. ChatGPT on the web does not read a developer's local Codex configuration; it needs a remote integration, which is out of scope here.

## Visual Studio Code

VS Code uses a `servers` object, not `mcpServers`. Add this to workspace `.vscode/mcp.json`, or use the MCP command palette to configure a user server. See the official [VS Code MCP server documentation](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

```json
{
	"servers": {
		"oblique": {
			"type": "stdio",
			"command": "node",
			"args": ["/absolute/path/to/oblique/projects/mcp/dist/server.js"]
		}
	}
}
```

For proxy mode, use this `args` value:

```json
["--use-env-proxy", "/absolute/path/to/oblique/projects/mcp/dist/server.js"]
```

Proxy variables may be inherited or supplied through supported VS Code environment configuration. The server does not need a
`cwd`; it never reads the consumer Angular project. Verify with **MCP: List Servers** and use **Show Output** for troubleshooting.

## Cursor

Cursor supports project `.cursor/mcp.json` and global `~/.cursor/mcp.json`. Use the absolute server path; no shell wrapper
or `cwd` is required. See [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol).

### POSIX

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "node",
			"args": ["/absolute/path/to/oblique/projects/mcp/dist/server.js"]
		}
	}
}
```

For a proxy, use `"args": ["--use-env-proxy", "/absolute/path/to/oblique/projects/mcp/dist/server.js"]`.

### Native Windows

Use native Windows paths; do not mix them with WSL paths.

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "node.exe",
			"args": ["C:\\path\\to\\oblique\\projects\\mcp\\dist\\server.js"]
		}
	}
}
```

For proxy mode, put `"--use-env-proxy"` before the server path. Verify in **Cursor Customize / MCPs**. If the Cursor CLI is installed, `agent mcp list` and `agent mcp list-tools oblique` are useful; the CLI is not required for Cursor editor use.

## Claude Code

Claude Code supports local stdio servers. The command shape follows the official [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp).

### POSIX

```shell
claude mcp add --transport stdio --scope user oblique -- \
  node /absolute/path/to/oblique/projects/mcp/dist/server.js
```

For a proxy, use `node --use-env-proxy /absolute/path/to/oblique/projects/mcp/dist/server.js`. Check `claude mcp add --help` when Claude Code is installed, then verify with `claude mcp list`, `claude mcp get oblique`, or `/mcp`.

Claude Code has local, project, and user scopes. Do not casually commit a project-scoped `.mcp.json` containing an absolute checkout path: it is machine-specific. Portable team distribution belongs to later phases.

### Native Windows

Use the JSON form to keep `cmd.exe` quoting explicit:

```shell
claude mcp add-json --scope user oblique "{\"type\":\"stdio\",\"command\":\"node.exe\",\"args\":[\"C:\\\\path\\\\to\\\\oblique\\\\projects\\\\mcp\\\\dist\\\\server.js\"]}"
```

For proxy mode, add `--use-env-proxy` before the server path in the JSON command string. Run this in a native Windows shell that passes the quoted JSON unchanged.

## Claude Desktop

Local Claude Desktop stdio servers are separate from remote Claude connectors. In `claude_desktop_config.json`, use the absolute server path:

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "node",
			"args": ["/absolute/path/to/oblique/projects/mcp/dist/server.js"],
			"env": {}
		}
	}
}
```

For native Windows, use this equivalent `cmd.exe` configuration:

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "node.exe",
			"args": ["C:\\path\\to\\oblique\\projects\\mcp\\dist\\server.js"],
			"env": {}
		}
	}
}
```

Use `node --use-env-proxy` with the same absolute server path for proxy mode. Restart Claude Desktop after changing the configuration. Local stdio MCP runs on the workstation; it is different from remote Claude connectors. Neither claude.ai nor remote Claude connectors execute this local process. See Anthropic's [local-versus-remote connector guidance](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## WSL and other MCP clients

Use paths native to the environment that starts Node. If the client runs in WSL, use `/home/.../oblique`; if it runs natively on Windows, use `C:\path\to\oblique`. Do not casually combine the two forms.

Any compatible client uses stdio and launches:

```text
command: node /absolute/path/to/oblique/projects/mcp/dist/server.js
```

No `cwd` setting or shell wrapper is required for the embedded runtime data. No HTTP URL exists in Phase 12.

## Verify the connection

A successful `tools/list` currently exposes exactly these 13 tools:

1. `get_oblique_version`
2. `get_oblique_component`
3. `search_oblique`
4. `get_oblique_examples`
5. `get_oblique_api`
6. `get_oblique_migration`
7. `check_oblique_code`
8. `search_oblique_design_tokens`
9. `check_oblique_styles`
10. `check_oblique_template`
11. `get_oblique_template_api`
12. `prepare_oblique_project`
13. `create_oblique_project`

These client-agnostic prompts describe expected diagnostic behavior; a model might choose a different tool or ask a clarifying question.

- “Use Oblique MCP to report the embedded Oblique version.” Expected tool: `get_oblique_version`.
- “Show the public template API for ObDateComponent.” Expected tool: `get_oblique_template_api`.
- “Validate this template: `<ob-date [date]=\"date\"></ob-date>`.” Expected tool: `check_oblique_template`.
- “Prepare a new federal `employee-portal` project in `/workspace`.” Expected tool:
  `prepare_oblique_project` with `{ "projectName": "employee-portal", "applicationOperator": "Federal Test Office",
"contact": "accessibility@example.test", "parentDirectory": "/workspace", "npmrcMode": "federal" }`. It returns a
  fresh opaque plan ID, `CREATE employee-portal` confirmation phrase, and a canonical argument array ending in
  `--npmrc`; use `"external"` for `--no-npmrc`. Missing the mode is blocked with `NPMRC_MODE_REQUIRED`.
- “Create the prepared project.” Expected tool: `create_oblique_project` with only the plan ID and the exact
  `CREATE employee-portal` confirmation. It creates files and downloads the pinned CLI package, so enable it only for
  trusted developers. Plans are single-use and expire after roughly ten minutes; the tool refuses an existing
  destination, applies a fifteen-minute timeout, and never automatically deletes a partial project. A destination
  lock blocks a concurrent request without consuming its plan, so it can be retried after the active creation ends.

The implementation uses RxJS internally to coordinate revalidation, child-process completion, cancellation, timeout, and
cleanup. It deliberately does not use Angular Signals, Angular dependency injection, or Angular runtime APIs: this is a
headless Node.js MCP server. The external MCP request and response contract is unchanged; only the SDK handler converts
the final Observable to its required Promise-compatible result. Teardown always releases the destination lock and removes
the process, timer, and abort listeners.

## Troubleshooting

1. **Node is too old.** Run `node --version`; the required version is at least `22.12.0`.
2. **`dist/server.js` is missing.** Run `npm run build -w @oblique/mcp` from the checkout root.
3. **Runtime data is missing.** Rebuild the MCP package. Its `dist/runtime-data` snapshot must travel with `dist/server.js`; the working directory is not relevant.
4. **`spawn node ENOENT`.** Run `which node` on POSIX or `where node` on Windows, then configure an absolute Node path if necessary.
5. **A Directus-backed tool fails.** Embedded-source tools can still work while Directus calls fail. Check network and proxy settings, then try `node --use-env-proxy /absolute/path/to/oblique/projects/mcp/dist/server.js`.
6. **The connection closes immediately.** Run the exact configured command manually and inspect stderr. Do not expect normal stdout logs.
7. **JSON-RPC is corrupted.** stdout contains protocol output only; diagnostics and logging belong on stderr.
8. **The client shows an old tool list.** Restart or reload the server and clear cached tools where the client supports it.

## Security

Most Oblique MCP tools are read-only: they read embedded official Oblique metadata, query official Oblique Directus
documentation, or analyze submitted source text. `create_oblique_project` is the explicit exception: it creates files
only from a validated, unexpired prepared plan and exact confirmation. It executes a pinned CLI without a shell using a
minimal child environment allowlist for Node/npm, temporary directories, certificates, proxies, and platform path
resolution; unrelated server secrets are not forwarded or returned. It can download packages and may leave partial
files, so restrict it to trusted developers. No tool exposes an HTTP listener or scans arbitrary directories.
On Windows, stopping `npx.cmd` cannot guarantee that every descendant process has stopped; the server deliberately
does not use a shell or unsafe process-tree wrapper to overstate this guarantee.
Likewise, another operating-system process can change a path after the final pre-spawn check; canonical-path checks and
post-creation validation reduce this unavoidable TOCTOU race but cannot eliminate it without platform-specific isolation.

The Node process still runs with the operating-system permissions of the user who launches it. This guide does not make additional sandboxing guarantees.
