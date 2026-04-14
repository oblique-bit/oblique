#!/usr/bin/env node
/**
 * push-primitives-role.js
 *
 * Reads $description from src/lib/themes/02_primitive/color.json and writes
 * it to the `role` component property of every _Primitive Color Row instance
 * on the "🎨 Colors – Tokens" page in Figma.
 *
 * Prerequisites:
 *   - Figma Desktop open with DesignSystem@Tokens V9.6 (51tJjbxBSBmjAmKjQmhsz3)
 *   - Desktop Bridge plugin running (Plugins → Development → Figma Desktop Bridge)
 *
 * Usage:
 *   node scripts-custom/push-primitives-role.js           # apply to Figma
 *   node scripts-custom/push-primitives-role.js --dry     # inspect only, no writes
 */
'use strict';

const fs     = require('fs');
const path   = require('path');
const { spawn } = require('child_process');

const DRY_RUN = process.argv.includes('--dry');

const ROOT      = path.join(__dirname, '..');
const COLOR_JSON = path.join(ROOT, 'src/lib/themes/02_primitive/color.json');

const TIMEOUT_MS = 25000;

// Known table frame IDs on "🎨 Colors – Tokens" page
const TABLE_IDS = [
  '9966:19582',  // Token Table Left  (Tables Container 1)
  '9966:19640',  // Token Table Right (Tables Container 1)
  '9966:19699',  // Token Table Left  (Tables Container 2)
  '9966:19717',  // Token Table Right (Tables Container 2)
];

// ─── Build token → description map from color.json ─────────────────────────

function buildTokenMap(json) {
  const map = {};
  const colors = json?.ob?.p?.color ?? {};

  function walk(obj, prefix) {
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$') || key === 'parent' || key === 'description') continue;
      if (key === '$extensions' || key === 'token_family_docs') continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object') {
        if ('$value' in val && '$description' in val) {
          // Leaf token
          map[`ob.p.color.${path}`] = val['$description'];
        } else {
          walk(val, path);
        }
      }
    }
  }

  walk(colors, '');
  return map;
}

// ─── StdioMCPClient ────────────────────────────────────────────────────────

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
      this.process.on('error', (err) => reject(new Error('Failed to start figma-console-mcp: ' + err.message)));
      this.process.on('exit', (code) => {
        if (!this.ready) reject(new Error('figma-console-mcp exited ' + code));
        for (const [, p] of this.pending) { p.reject(new Error('Process exited')); clearTimeout(p.timer); }
        this.pending.clear();
      });

      setTimeout(async () => {
        try { await this._initialize(); this.ready = true; resolve(); }
        catch (err) { reject(err); }
      }, 2000);
    });
  }

  async _initialize() {
    await this._send('initialize', {
      protocolVersion: '2024-11-05', capabilities: {},
      clientInfo: { name: 'push-primitives-role', version: '1.0.0' },
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
      this.process.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  _sendNotification(method, params) {
    this.process.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
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
          clearTimeout(timer); this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      } catch { /* non-JSON output, ignore */ }
    }
  }

  stop() {
    if (this.process) { this.process.stdin.end(); this.process.kill('SIGTERM'); this.process = null; }
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading color.json…');
  const colorJson = JSON.parse(fs.readFileSync(COLOR_JSON, 'utf8'));
  const tokenMap = buildTokenMap(colorJson);
  console.log(`  Built map: ${Object.keys(tokenMap).length} tokens`);

  if (DRY_RUN) {
    console.log('\nDRY RUN — token map sample:');
    let count = 0;
    for (const [k, v] of Object.entries(tokenMap)) {
      console.log(`  ${k}\n    → ${v}`);
      if (++count >= 5) { console.log('  …'); break; }
    }
    process.exit(0);
  }

  console.log('\nConnecting to Figma Desktop Bridge…');
  const mcp = new StdioMCPClient();
  await mcp.start();
  console.log('  Connected.');

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const tableId of TABLE_IDS) {
    console.log(`\nProcessing table ${tableId}…`);

    const code = `
(async () => {
  const TOKEN_MAP = ${JSON.stringify(tokenMap)};
  const PROP_KEY = 'role#10053:2';
  const DRY = false;

  const tableNode = await figma.getNodeByIdAsync('${tableId}');
  if (!tableNode) return { error: 'Node not found: ${tableId}' };

  const rows = tableNode.children.filter(c =>
    c.type === 'INSTANCE' && c.name === '_Primitive Color Row'
  );

  let updated = 0;
  let skipped = 0;
  let notFound = [];

  for (const row of rows) {
    const tokenNameNode = row.findOne(n => n.type === 'TEXT' && n.name === 'tokenName');
    if (!tokenNameNode) { skipped++; continue; }

    const tokenPath = tokenNameNode.characters.trim();
    const desc = TOKEN_MAP[tokenPath];
    if (!desc) { notFound.push(tokenPath); skipped++; continue; }

    // Check current value to avoid unnecessary writes
    const current = row.componentProperties?.[PROP_KEY]?.value ?? '';
    if (current === desc) { skipped++; continue; }

    row.setProperties({ [PROP_KEY]: desc });
    updated++;
  }

  return {
    tableId: '${tableId}',
    tableName: tableNode.name,
    totalRows: rows.length,
    updated,
    skipped,
    notFound
  };
})()
`;

    const result = await mcp.execute(code, TIMEOUT_MS);
    if (result?.error) {
      console.error(`  ERROR: ${result.error}`);
    } else {
      console.log(`  ${result.tableName}: ${result.updated} updated, ${result.skipped} skipped`);
      if (result.notFound?.length) {
        console.warn(`  Not in map: ${result.notFound.join(', ')}`);
      }
      totalUpdated += result.updated ?? 0;
      totalSkipped += result.skipped ?? 0;
    }
  }

  console.log(`\nDone. Total updated: ${totalUpdated}, skipped: ${totalSkipped}`);
  mcp.stop();
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
