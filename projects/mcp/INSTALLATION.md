# Oblique MCP installation and client configuration

This guide installs the development version of Oblique MCP from a local Oblique checkout. It is not an npm package installation guide: `npx @oblique/mcp`, global installation, remote HTTP/SSE transport, marketplace installation, and automatic download are not available yet.

## Checkout-based architecture

```text
MCP client
    |
    | stdio
    v
node projects/mcp/dist/server.js
    |
    v
checked-out Oblique repository
```

The server reads authoritative data from the checkout: root `package.json`, `public_api.ts`, ng-update schematics, SDS examples, and generated Design System tokens. Its working directory **must** be the Oblique repository root. This is intentional until a later packaging/distribution phase.

## Prerequisites and preparation

Install Git, npm, and Node.js **22.12.0 or later**, then obtain a local checkout of `oblique-bit/oblique`:

```shell
git clone <repository-url> oblique
cd oblique
npm ci
npm run build -w @oblique/mcp
```

`npm ci` is preferred for reproducible setup because it follows the committed lockfile. Use `npm install` only when deliberately developing dependencies or updating that lockfile. No global npm package is required.

## Manual server start

Run either command **from the Oblique repository root**:

```shell
node projects/mcp/dist/server.js
```

```shell
npm run start -w @oblique/mcp
```

An MCP stdio server has no ordinary interactive UI. A process waiting silently for JSON-RPC on stdin is expected and is not, by itself, a failure.

### Corporate proxy mode

If access to the official Oblique Directus service requires `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`, or equivalent environment variables, start Node with proxy support:

```shell
node --use-env-proxy projects/mcp/dist/server.js
```

Directus-backed documentation tools need network access; tools based on checked-out source do not. Proxy-related Node warnings belong on stderr. stdout must contain JSON-RPC protocol output only. Do not put proxy URLs, credentials, or other secrets in client configuration files.

## Codex and supported local OpenAI clients

Use the MCP section of Codex `config.toml` (normally `~/.codex/config.toml`, or `.codex/config.toml` for a trusted project). Supported local OpenAI Codex surfaces share this configuration. See the official [OpenAI MCP documentation](https://developers.openai.com/codex/mcp/).

```toml
[mcp_servers.oblique]
command = "node"
args = ["projects/mcp/dist/server.js"]
cwd = "/absolute/path/to/oblique"
```

For a corporate proxy:

```toml
[mcp_servers.oblique]
command = "node"
args = ["--use-env-proxy", "projects/mcp/dist/server.js"]
cwd = "/absolute/path/to/oblique"
```

Because the server requires a particular `cwd`, prefer `config.toml` over a `codex mcp add ...` command that loses this setting. Verify with `codex mcp list`, then use `/mcp` in a supported local client. ChatGPT on the web does not read a developer's local Codex configuration; it needs a remote integration, which is out of scope here.

## Visual Studio Code

VS Code uses a `servers` object, not `mcpServers`. Add this to workspace `.vscode/mcp.json`, or use the MCP command palette to configure a user server. See the official [VS Code MCP server documentation](https://code.visualstudio.com/docs/agent-customization/mcp-servers).

```json
{
	"servers": {
		"oblique": {
			"type": "stdio",
			"command": "node",
			"args": ["projects/mcp/dist/server.js"],
			"cwd": "/absolute/path/to/oblique"
		}
	}
}
```

For proxy mode, use this `args` value:

```json
["--use-env-proxy", "projects/mcp/dist/server.js"]
```

Proxy variables may be inherited or supplied through supported VS Code environment configuration. If configured globally while editing another project, `cwd` still points to the Oblique checkout, not the consumer Angular project. Verify with **MCP: List Servers** and use **Show Output** for troubleshooting.

## Cursor

Cursor supports project `.cursor/mcp.json` and global `~/.cursor/mcp.json`. Its documented stdio configuration does not guarantee a `cwd` field, so use a shell wrapper. See [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol).

### POSIX

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "/bin/sh",
			"args": ["-lc", "cd '/absolute/path/to/oblique' && exec node projects/mcp/dist/server.js"]
		}
	}
}
```

For a proxy, replace `node` in the final argument with `node --use-env-proxy`.

### Native Windows

Use native Windows paths with `cmd.exe`; do not mix them with WSL paths.

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "cmd.exe",
			"args": ["/d", "/s", "/c", "cd /d \"C:\\path\\to\\oblique\" && node projects\\mcp\\dist\\server.js"]
		}
	}
}
```

For proxy mode, use `node --use-env-proxy projects\\mcp\\dist\\server.js` in the final argument. Verify in **Cursor Customize / MCPs**. If the Cursor CLI is installed, `agent mcp list` and `agent mcp list-tools oblique` are useful; the CLI is not required for Cursor editor use.

## Claude Code

Claude Code supports local stdio servers. Its stdio documentation does not provide a guaranteed `cwd` setting, so use a shell wrapper. The command shape follows the official [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp).

### POSIX

```shell
claude mcp add --transport stdio --scope user oblique -- \
  /bin/sh -lc \
  "cd '/absolute/path/to/oblique' && exec node projects/mcp/dist/server.js"
```

For a proxy, use `exec node --use-env-proxy projects/mcp/dist/server.js`. Check `claude mcp add --help` when Claude Code is installed, then verify with `claude mcp list`, `claude mcp get oblique`, or `/mcp`.

Claude Code has local, project, and user scopes. Do not casually commit a project-scoped `.mcp.json` containing an absolute checkout path: it is machine-specific. Portable team distribution belongs to later phases.

### Native Windows

Use the JSON form to keep `cmd.exe` quoting explicit:

```shell
claude mcp add-json --scope user oblique "{\"type\":\"stdio\",\"command\":\"cmd.exe\",\"args\":[\"/d\",\"/s\",\"/c\",\"cd /d \\\"C:\\\\path\\\\to\\\\oblique\\\" && node projects\\\\mcp\\\\dist\\\\server.js\"]}"
```

For proxy mode, add `--use-env-proxy` after `node` in the JSON command string. Run this in a native Windows shell that passes the quoted JSON unchanged.

## Claude Desktop

Local Claude Desktop stdio servers are separate from remote Claude connectors. In `claude_desktop_config.json`, use a wrapper for the checkout requirement:

```json
{
	"mcpServers": {
		"oblique": {
			"type": "stdio",
			"command": "/bin/sh",
			"args": ["-lc", "cd '/absolute/path/to/oblique' && exec node projects/mcp/dist/server.js"],
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
			"command": "cmd.exe",
			"args": ["/d", "/s", "/c", "cd /d \"C:\\path\\to\\oblique\" && node projects\\mcp\\dist\\server.js"],
			"env": {}
		}
	}
}
```

Use `node --use-env-proxy projects\\mcp\\dist\\server.js` for proxy mode. Restart Claude Desktop after changing the configuration. Local stdio MCP runs on the workstation; it is different from remote Claude connectors. Neither claude.ai nor remote Claude connectors execute this local process. See Anthropic's [local-versus-remote connector guidance](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## WSL and other MCP clients

Use paths native to the environment that starts Node. If the client runs in WSL, use `/home/.../oblique`; if it runs natively on Windows, use `C:\path\to\oblique`. Do not casually combine the two forms.

Any compatible client uses stdio and launches:

```text
command: node projects/mcp/dist/server.js
working directory: Oblique repository root
```

Use its `cwd` setting where supported. Otherwise use an OS-appropriate shell wrapper that changes to the checkout before executing Node. No HTTP URL exists in Phase 11.

## Verify the connection

A successful `tools/list` currently exposes exactly these 11 tools:

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

These client-agnostic prompts describe expected diagnostic behavior; a model might choose a different tool or ask a clarifying question.

- “Use Oblique MCP to report the checked-out Oblique version.” Expected tool: `get_oblique_version`.
- “Show the public template API for ObDateComponent.” Expected tool: `get_oblique_template_api`.
- “Validate this template: `<ob-date [date]=\"date\"></ob-date>`.” Expected tool: `check_oblique_template`.

## Troubleshooting

1. **Node is too old.** Run `node --version`; the required version is at least `22.12.0`.
2. **`dist/server.js` is missing.** Run `npm run build -w @oblique/mcp` from the checkout root.
3. **The working directory is wrong.** Missing `package.json`, `public_api.ts`, SDS examples, migration sources, or Design System tokens indicate that `cwd`, or the wrapper's `cd`, must point to the Oblique repository root.
4. **`spawn node ENOENT`.** Run `which node` on POSIX or `where node` on Windows, then configure an absolute Node path if necessary.
5. **A Directus-backed tool fails.** Checked-out source tools can still work while Directus calls fail. Check network and proxy settings, then try `node --use-env-proxy projects/mcp/dist/server.js`.
6. **The connection closes immediately.** Run the exact configured command manually and inspect stderr. Do not expect normal stdout logs.
7. **JSON-RPC is corrupted.** stdout contains protocol output only; diagnostics and logging belong on stderr.
8. **The client shows an old tool list.** Restart or reload the server and clear cached tools where the client supports it.

## Security

Oblique MCP is read-only. It reads checked-out Oblique metadata, queries official Oblique Directus documentation, and accepts submitted source text for static analysis. It does not modify a consumer project, execute submitted Angular/TypeScript/template/style code, expose an HTTP listener, provide shell tools, or mutate the Oblique checkout through MCP tools.

The Node process still runs with the operating-system permissions of the user who launches it. This guide does not make additional sandboxing guarantees.
