#!/usr/bin/env node
/**
 * push-token-descriptions.js
 *
 * Reads $description from compiled token JSON files and writes them to the
 * corresponding Figma variable descriptions via the Desktop Bridge MCP.
 *
 * Sources:
 *   - S3 compiled  → src/lib/themes/03_semantic/color/compiled.json  (ob/s/color/*)
 *
 * Usage:
 *   node scripts-custom/push-token-descriptions.js           # push all
 *   node scripts-custom/push-token-descriptions.js --dry     # inspect only, no writes
 *   node scripts-custom/push-token-descriptions.js --family status  # one family only
 *
 * Prerequisites:
 *   - Figma Desktop open with DesignSystem-Tokens V9.6 (51tJjbxBSBmjAmKjQmhsz3)
 *   - Desktop Bridge plugin running in LOCAL mode (not Cloud Mode)
 *     → In the plugin UI, click "Cloud Mode" to toggle to Desktop/Local mode
 */
'use strict';

const fs     = require('fs');
const path   = require('path');
const { spawn } = require('child_process');

const DRY_RUN = process.argv.includes('--dry');
const FAMILY_FILTER = (() => {
  const idx = process.argv.indexOf('--family');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

const ROOT         = path.join(__dirname, '..');
const COMPILED_JSON = path.join(ROOT, 'src/lib/themes/03_semantic/color/compiled.json');

const TIMEOUT_MS = 30000;

// ─── Build token → description map ──────────────────────────────────────────
// Walks compiled.json and collects { "ob/s/color/…": "$description" }
// Skips token_family_docs nodes and any key starting with "$".

function buildDescMap(json) {
  const map = {};
  const root = json?.ob?.s?.color ?? {};

  function walk(obj, parts) {
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$') || key === 'token_family_docs') continue;
      if (!val || typeof val !== 'object') continue;

      const nextParts = [...parts, key];

      if ('$value' in val) {
        // Leaf token — record description if present
        if (val.$description) {
          const varName = nextParts.join('/');
          map[varName] = val.$description;
        }
      } else {
        walk(val, nextParts);
      }
    }
  }

  walk(root, ['ob', 's', 'color']);
  return map;
}

// ─── StdioMCPClient ──────────────────────────────────────────────────────────
// Spawns figma-console-mcp@latest — same pattern as push-primitives-role.js.
// Requires the Desktop Bridge plugin running in LOCAL mode (not Cloud Mode).

class StdioMCPClient {
  constructor() {
    this.process = null;
    this.requestId = 0;
    this.pending = new Map();
    this.buffer = '';
    this.ready = false;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.process = spawn('npx', ['-y', 'figma-console-mcp@latest'], {
        env: { ...process.env, ENABLE_MCP_APPS: 'true' },
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
      });

      this.process.stderr.on('data', () => {});
      this.process.stdout.on('data', (chunk) => {
        this.buffer += chunk.toString();
        this._processBuffer();
      });
      this.process.on('error', (err) =>
        reject(new Error('Failed to start figma-console-mcp: ' + err.message))
      );
      this.process.on('exit', (code) => {
        if (!this.ready) reject(new Error('figma-console-mcp exited ' + code));
        for (const [, p] of this.pending) {
          p.reject(new Error('Process exited'));
          clearTimeout(p.timer);
        }
        this.pending.clear();
      });

      setTimeout(async () => {
        try {
          await this._initialize();
          this.ready = true;
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 2000);
    });
  }

  async _initialize() {
    await this._send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'push-token-descriptions', version: '1.0.0' },
    }, 15000);
    this._sendNotification('notifications/initialized');
  }

  async execute(code, timeout = TIMEOUT_MS) {
    const result = await this._send('tools/call', {
      name: 'figma_execute',
      arguments: { code, timeout },
    }, timeout + 5000);

    if (result?.content) {
      for (const item of result.content) {
        if (item.text) {
          try { return JSON.parse(item.text); } catch { return item.text; }
        }
      }
    }
    return result;
  }

  _send(method, params, timeout = TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timeout after ${timeout}ms for ${method}`));
      }, timeout);
      this.pending.set(id, { resolve, reject, timer });
      this.process.stdin.write(
        JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'
      );
    });
  }

  _sendNotification(method, params) {
    this.process.stdin.write(
      JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n'
    );
  }

  _processBuffer() {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject, timer } = this.pending.get(msg.id);
          clearTimeout(timer);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      } catch { /* non-JSON output, ignore */ }
    }
  }

  stop() {
    if (this.process) {
      this.process.stdin.end();
      this.process.kill('SIGTERM');
      this.process = null;
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading compiled.json…');
  const compiled = JSON.parse(fs.readFileSync(COMPILED_JSON, 'utf8'));
  let descMap = buildDescMap(compiled);

  if (FAMILY_FILTER) {
    const prefix = `ob/s/color/${FAMILY_FILTER}/`;
    descMap = Object.fromEntries(
      Object.entries(descMap).filter(([k]) => k.startsWith(prefix))
    );
    console.log(`  Filtering to family "${FAMILY_FILTER}": ${Object.keys(descMap).length} tokens`);
  } else {
    console.log(`  Built map: ${Object.keys(descMap).length} tokens`);
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — description map sample:');
    let count = 0;
    for (const [k, v] of Object.entries(descMap)) {
      console.log(`  ${k}\n    → ${v}`);
      if (++count >= 5) { console.log('  …'); break; }
    }
    console.log(`\nTotal: ${Object.keys(descMap).length} entries`);
    process.exit(0);
  }

  console.log('\nConnecting to Figma Desktop Bridge…');
  const mcp = new StdioMCPClient();
  await mcp.start();
  console.log('  Connected.');

  const code = `
(async () => {
  const DESC_MAP = ${JSON.stringify(descMap)};

  const vars = await figma.variables.getLocalVariablesAsync('COLOR');
  let updated = 0;
  let skipped = 0;
  const notFound = [];

  for (const v of vars) {
    const desc = DESC_MAP[v.name];
    if (desc === undefined) continue;

    if (v.description === desc) {
      skipped++;
      continue;
    }

    v.description = desc;
    updated++;
  }

  // Report tokens in map that had no matching variable
  const varNames = new Set(vars.map(v => v.name));
  for (const name of Object.keys(DESC_MAP)) {
    if (!varNames.has(name)) notFound.push(name);
  }

  return {
    totalVars: vars.length,
    mapSize:   Object.keys(DESC_MAP).length,
    updated,
    skipped,
    notFound,
  };
})()
`;

  console.log('\nPushing descriptions to Figma…');
  const result = await mcp.execute(code, TIMEOUT_MS);

  if (result?.error) {
    console.error(`  ERROR: ${result.error}`);
    mcp.stop();
    process.exit(1);
  }

  console.log(`\nDone.`);
  console.log(`  Variables scanned : ${result.totalVars}`);
  console.log(`  Map entries       : ${result.mapSize}`);
  console.log(`  Updated           : ${result.updated}`);
  console.log(`  Already current   : ${result.skipped}`);

  if (result.notFound?.length) {
    console.warn(`\n  Not matched in Figma (${result.notFound.length}):`);
    for (const n of result.notFound.slice(0, 20)) console.warn(`    ${n}`);
    if (result.notFound.length > 20) console.warn(`    …and ${result.notFound.length - 20} more`);
  }

  mcp.stop();
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
