#!/usr/bin/env node
/**
 * MCP Executor — rebuilds Figma contrast pairings via the Figma Console MCP.
 *
 * Uses stdio transport (JSON-RPC 2.0 over stdin/stdout) to communicate with
 * figma-console-mcp, which connects to Figma Desktop via WebSocket bridge.
 *
 * Two-phase pipeline:
 *   Phase 1: Install builder (contrast-setup.js) on globalThis.__CP
 *   Phase 2: Run data scripts that call __CP.buildCategory()
 *
 * Usage:
 *   node mcp-executor.js --all                # rebuild all 4 categories
 *   node mcp-executor.js neutral              # rebuild only neutral
 *   node mcp-executor.js interaction          # rebuild only interaction
 *   node mcp-executor.js status               # rebuild only status
 *   node mcp-executor.js navigation           # rebuild only navigation
 *   node mcp-executor.js --extract            # extract current state to JSON
 *
 * Prerequisites:
 *   - Figma Desktop open with the target file
 *   - Desktop Bridge plugin running (Plugins → Development → Figma Desktop Bridge)
 *   - FIGMA_ACCESS_TOKEN env var set (or hard-coded below for dev)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ─── Config ─────────────────────────────────────────────────────────────────

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const TIMEOUT_MS = 60000;  // per-call timeout (contrast builds are heavier)
const INIT_TIMEOUT_MS = 15000; // time to wait for MCP server startup

const BUILDERS_DIR = __dirname;
const DATA_DIR = path.join(BUILDERS_DIR, 'per-category-scripts');
const SETUP_FILE = path.join(BUILDERS_DIR, 'contrast-setup.js');
const JSON_DIR = path.join(BUILDERS_DIR, 'extracted-json');

// ─── Stdio MCP Client ──────────────────────────────────────────────────────

class StdioMCPClient {
  constructor() {
    this.process = null;
    this.requestId = 0;
    this.pending = new Map(); // id → { resolve, reject, timer }
    this.buffer = '';
    this.ready = false;
  }

  /**
   * Start the figma-console-mcp process and initialize MCP session.
   */
  async start() {
    return new Promise((resolve, reject) => {
      const env = {
        ...process.env,
        FIGMA_ACCESS_TOKEN,
        ENABLE_MCP_APPS: 'true',
      };

      this.process = spawn('npx', ['-y', 'figma-console-mcp@latest'], {
        env,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
      });

      // Buffer stderr for diagnostics (server logs go here)
      let stderrBuf = '';
      this.process.stderr.on('data', (chunk) => {
        stderrBuf += chunk.toString();
        // Show last line for progress
        const lines = stderrBuf.split('\n').filter(Boolean);
        if (lines.length > 0) {
          const last = lines[lines.length - 1];
          if (last.includes('ERROR') || last.includes('error')) {
            process.stderr.write('  [mcp-stderr] ' + last + '\n');
          }
        }
      });

      // Parse JSON-RPC messages from stdout
      this.process.stdout.on('data', (chunk) => {
        this.buffer += chunk.toString();
        this._processBuffer();
      });

      this.process.on('error', (err) => {
        reject(new Error('Failed to start figma-console-mcp: ' + err.message));
      });

      this.process.on('exit', (code) => {
        if (!this.ready) {
          reject(new Error('figma-console-mcp exited with code ' + code + '\nStderr: ' + stderrBuf.slice(-500)));
        }
        // Reject all pending requests
        for (const [id, pending] of this.pending) {
          pending.reject(new Error('Process exited'));
          clearTimeout(pending.timer);
        }
        this.pending.clear();
      });

      // Give the server time to start, then initialize
      setTimeout(async () => {
        try {
          await this._initialize();
          this.ready = true;
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 2000); // wait 2s for npx to resolve and start
    });
  }

  /**
   * Perform MCP initialize handshake.
   */
  async _initialize() {
    const result = await this._send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'contrast-builder-cli', version: '1.0.0' },
    }, INIT_TIMEOUT_MS);

    // Send initialized notification (no id = notification)
    this._sendNotification('notifications/initialized');
    return result;
  }

  /**
   * Call figma_execute with the given code.
   */
  async execute(code, timeout = TIMEOUT_MS) {
    const result = await this._send('tools/call', {
      name: 'figma_execute',
      arguments: { code, timeout },
    }, timeout + 5000);

    // Extract text content from MCP response
    if (result && result.content) {
      for (const item of result.content) {
        if (item.text) {
          try { return JSON.parse(item.text); }
          catch { return item.text; }
        }
      }
    }
    return result;
  }

  /**
   * Send a JSON-RPC request and wait for response.
   */
  _send(method, params, timeout = TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';

      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timeout after ${timeout}ms for ${method}`));
      }, timeout);

      this.pending.set(id, { resolve, reject, timer });
      this.process.stdin.write(msg);
    });
  }

  /**
   * Send a JSON-RPC notification (no response expected).
   */
  _sendNotification(method, params) {
    const msg = JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n';
    this.process.stdin.write(msg);
  }

  /**
   * Process buffered stdout data into JSON-RPC messages.
   */
  _processBuffer() {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop(); // keep incomplete last line

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject, timer } = this.pending.get(msg.id);
          clearTimeout(timer);
          this.pending.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          } else {
            resolve(msg.result);
          }
        }
      } catch {
        // Non-JSON line (server log?), ignore
      }
    }
  }

  /**
   * Gracefully stop the MCP server process.
   */
  stop() {
    if (this.process) {
      this.process.stdin.end();
      this.process.kill('SIGTERM');
      this.process = null;
    }
  }
}

// ─── Build Logic ────────────────────────────────────────────────────────────

const CATEGORIES = ['neutral', 'interaction', 'status', 'navigation'];

async function installSetup(client) {
  const code = fs.readFileSync(SETUP_FILE, 'utf8');
  const sizeKB = (Buffer.byteLength(code) / 1024).toFixed(1);
  process.stdout.write(`  Installing contrast-setup.js (${sizeKB} KB) ... `);

  const t0 = Date.now();
  const result = await client.execute(code, TIMEOUT_MS);
  const elapsed = Date.now() - t0;

  if (result && result.installed) {
    console.log(`OK (${elapsed}ms) — ${result.varCount} variables cached, fonts: ${result.fonts?.length || 0}`);
    return true;
  }
  console.log(`FAILED (${elapsed}ms)`);
  console.log('  Result:', JSON.stringify(result, null, 2));
  return false;
}

async function buildCategory(client, categoryName) {
  const jsonPath = path.join(JSON_DIR, categoryName + '.json');
  if (!fs.existsSync(jsonPath)) {
    console.log(`  ${categoryName}: SKIP (no ${categoryName}.json)`);
    return { name: categoryName, ok: false, error: 'No data file' };
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const sizeKB = (Buffer.byteLength(JSON.stringify(data)) / 1024).toFixed(1);
  process.stdout.write(`  ${categoryName} (${data.length} swatches, ${sizeKB} KB) ... `);

  // Build the code that calls __CP.buildCategory()
  const code = `
    const data = ${JSON.stringify(data)};
    const result = await globalThis.__CP.buildCategory('${categoryName}', data);
    return result;
  `;

  const t0 = Date.now();
  try {
    const result = await client.execute(code, TIMEOUT_MS * 3); // extra time for status
    const elapsed = Date.now() - t0;

    if (result && !result.error) {
      const swatches = result.swatchCount || 0;
      const binds = result.bindCount || 0;
      console.log(`OK (${elapsed}ms) — ${swatches} swatches, ${binds} bindings`);
      return { name: categoryName, ok: true, elapsed, result };
    } else {
      console.log(`FAIL (${elapsed}ms) — ${result?.error || 'unknown'}`);
      return { name: categoryName, ok: false, elapsed, error: result?.error };
    }
  } catch (err) {
    const elapsed = Date.now() - t0;
    console.log(`ERROR (${elapsed}ms) — ${err.message}`);
    return { name: categoryName, ok: false, elapsed, error: err.message };
  }
}

async function buildAll(client) {
  // Phase 1: Install builder
  const ok = await installSetup(client);
  if (!ok) {
    console.error('\n  Setup installation failed. Aborting.');
    return false;
  }

  console.log('');

  // Phase 2: Build each category
  const results = [];
  for (const cat of CATEGORIES) {
    const r = await buildCategory(client, cat);
    results.push(r);
  }

  // Phase 3: Store pluginData
  process.stdout.write('\n  Storing pluginData ... ');
  try {
    const code = `
      const allData = ${JSON.stringify(JSON.parse(fs.readFileSync(path.join(JSON_DIR, 'all.json'), 'utf8')))};
      const count = await globalThis.__CP.collectAndStorePluginData(allData);
      return { stored: count };
    `;
    const pdResult = await client.execute(code, TIMEOUT_MS);
    console.log(`OK — ${pdResult?.stored || 0} entries`);
  } catch (err) {
    console.log(`FAIL — ${err.message}`);
  }

  return results;
}

async function extractCurrent(client) {
  // Install setup (for utility functions)
  const ok = await installSetup(client);
  if (!ok) {
    console.error('  Setup installation failed. Cannot extract.');
    return;
  }

  process.stdout.write('\n  Extracting pluginData from Figma ... ');
  const code = `
    const pd = await globalThis.__CP.getPluginData();
    if (!pd) return { error: 'No pluginData found' };
    return { total: pd.length, data: pd };
  `;

  const result = await client.execute(code, TIMEOUT_MS);
  if (result?.error) {
    console.log('FAIL — ' + result.error);
    return;
  }

  console.log(`OK — ${result.total} entries`);

  const allData = result.data;

  // Split by category
  const neutral = allData.filter(d => d.bg.includes('neutral.'));
  const interaction = allData.filter(d => d.bg.includes('interaction.'));
  const status = allData.filter(d => d.bg.includes('status.'));
  const navigation = allData.filter(d => d.bg.includes('navigation.'));

  fs.writeFileSync(path.join(JSON_DIR, 'neutral.json'), JSON.stringify(neutral, null, 2));
  fs.writeFileSync(path.join(JSON_DIR, 'interaction.json'), JSON.stringify(interaction, null, 2));
  fs.writeFileSync(path.join(JSON_DIR, 'status.json'), JSON.stringify(status, null, 2));
  fs.writeFileSync(path.join(JSON_DIR, 'navigation.json'), JSON.stringify(navigation, null, 2));
  fs.writeFileSync(path.join(JSON_DIR, 'all.json'), JSON.stringify(allData, null, 2));

  console.log(`  Written: neutral=${neutral.length}, interaction=${interaction.length}, status=${status.length}, navigation=${navigation.length}, all=${allData.length}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
  Contrast Pairings Builder — MCP Executor

  Usage:
    node mcp-executor.js --all              Rebuild all 4 categories
    node mcp-executor.js neutral            Rebuild neutral only (30 swatches)
    node mcp-executor.js interaction        Rebuild interaction only (14 swatches)
    node mcp-executor.js status             Rebuild status only (240 swatches)
    node mcp-executor.js navigation         Rebuild navigation only (12 swatches)
    node mcp-executor.js --extract          Extract current state from Figma to JSON

  Prerequisites:
    1. Figma Desktop open with DesignSystem-Tokens V9.6
    2. Desktop Bridge plugin running
    3. FIGMA_ACCESS_TOKEN env var set
`);
    process.exit(0);
  }

  console.log('\n  Starting Figma Console MCP server via stdio ...');
  const client = new StdioMCPClient();

  try {
    await client.start();
    console.log('  Connected.\n');

    if (args[0] === '--extract') {
      await extractCurrent(client);
    } else if (args[0] === '--all') {
      const results = await buildAll(client);
      printSummary(results);
    } else {
      // Specific category
      const cat = args[0].toLowerCase();
      if (!CATEGORIES.includes(cat)) {
        console.error(`  Unknown category: ${cat}. Use: ${CATEGORIES.join(', ')}`);
        process.exit(1);
      }

      const ok = await installSetup(client);
      if (!ok) {
        console.error('\n  Setup installation failed. Aborting.');
        process.exit(1);
      }
      console.log('');
      const result = await buildCategory(client, cat);
      printSummary([result]);
    }
  } catch (err) {
    console.error('\n  Fatal: ' + err.message);
    process.exit(1);
  } finally {
    client.stop();
  }
}

function printSummary(results) {
  if (!results || !Array.isArray(results)) return;
  console.log('\n' + '═'.repeat(60));
  const succeeded = results.filter(r => r.ok).length;
  const failed = results.length - succeeded;
  console.log(`  Done: ${succeeded} succeeded, ${failed} failed of ${results.length} categories`);
  for (const r of results) {
    const icon = r.ok ? '✓' : '✗';
    const time = r.elapsed ? ` (${r.elapsed}ms)` : '';
    console.log(`    ${icon} ${r.name}${time}`);
  }
  console.log('═'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
