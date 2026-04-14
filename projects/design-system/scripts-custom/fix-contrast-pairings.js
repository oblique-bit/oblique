#!/usr/bin/env node
/**
 * fix-contrast-pairings.js
 *
 * Fixes two issues on the "🎨 Colors – Contrast Pairings" page:
 *
 * 1. INTERACTION TEXT LABELS: Removes erroneous ".state." segment from token
 *    path labels in all Interaction section swatches.
 *    Wrong:   ob.s3.color.interaction.state.fg.enabled.inversity_normal
 *    Correct: ob.s3.color.interaction.fg.enabled.inversity_normal
 *
 * 2. FREE SECTION LAYER NAMES: Renames layer names in the Free section from
 *    old status terminology to color names (cosmetic, Layers panel only).
 *
 * Usage:
 *   node scripts-custom/fix-contrast-pairings.js          # apply fixes
 *   node scripts-custom/fix-contrast-pairings.js --dry    # inspect only, no writes
 *
 * Prerequisites:
 *   - Figma Desktop open with DesignSystem-Tokens-V9.6 (51tJjbxBSBmjAmKjQmhsz3)
 *   - Desktop Bridge plugin running (Plugins → Development → Figma Desktop Bridge)
 */
'use strict';

const { spawn } = require('child_process');

// ─── Config ────────────────────────────────────────────────────────────────

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const TIMEOUT_MS = 30000;

// Page and node IDs (Contrast Pairings page)
const PAGE_ID              = '9559:21413';
const INTERACTION_NODE_ID  = '9561:410210';
const FREE_NODE_ID         = '9709:52372';

// ─── Stdio MCP Client ──────────────────────────────────────────────────────

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
        env: { ...process.env, FIGMA_ACCESS_TOKEN, ENABLE_MCP_APPS: 'true' },
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
      });

      let stderrBuf = '';
      this.process.stderr.on('data', (chunk) => {
        stderrBuf += chunk.toString();
        const lines = stderrBuf.split('\n').filter(Boolean);
        const last = lines[lines.length - 1] ?? '';
        if (/error/i.test(last)) process.stderr.write('  [mcp] ' + last + '\n');
      });

      this.process.stdout.on('data', (chunk) => {
        this.buffer += chunk.toString();
        this._processBuffer();
      });

      this.process.on('error', (err) => reject(new Error('Failed to start figma-console-mcp: ' + err.message)));
      this.process.on('exit', (code) => {
        if (!this.ready) reject(new Error('figma-console-mcp exited ' + code + '\n' + stderrBuf.slice(-500)));
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
      clientInfo: { name: 'fix-contrast-pairings', version: '1.0.0' },
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
      } catch { /* non-JSON server log, ignore */ }
    }
  }

  stop() {
    if (this.process) { this.process.stdin.end(); this.process.kill('SIGTERM'); this.process = null; }
  }
}

// ─── Fix code: Interaction text labels ────────────────────────────────────

const FIX_INTERACTION_CODE = `
(async () => {
  await figma.loadAllPagesAsync();

  const page = figma.root.children.find(p => p.id === '${PAGE_ID}');
  if (!page) return { error: 'Page not found: ${PAGE_ID}' };

  await figma.setCurrentPageAsync(page);

  const category = await figma.getNodeByIdAsync('${INTERACTION_NODE_ID}');
  if (!category) return { error: 'Interaction category not found: ${INTERACTION_NODE_ID}' };

  const textNodes = category.findAll(n => n.type === 'TEXT');
  const results = [];
  let fixed = 0;

  for (const node of textNodes) {
    const chars = node.characters;
    if (!chars.includes('interaction.state.fg') && !chars.includes('interaction.state.bg')) continue;

    const newChars = chars
      .replace(/interaction\\.state\\.fg/g, 'interaction.fg')
      .replace(/interaction\\.state\\.bg/g, 'interaction.bg');

    try {
      // Load all fonts used in this node
      if (node.fontName !== figma.mixed) {
        await figma.loadFontAsync(node.fontName);
      } else {
        const seen = new Set();
        for (let i = 0; i < chars.length; i++) {
          const f = node.getRangeFontName(i, i + 1);
          const key = f.family + '|' + f.style;
          if (!seen.has(key)) {
            await figma.loadFontAsync(f);
            seen.add(key);
          }
        }
      }
      node.characters = newChars;
      fixed++;
      results.push({ id: node.id, name: node.name, status: 'fixed', was: chars, now: newChars });
    } catch (e) {
      results.push({ id: node.id, name: node.name, status: 'error: ' + e.message });
    }
  }

  return { scanned: textNodes.length, fixed, results };
})()
`;

// ─── Fix code: Free section layer names ───────────────────────────────────

const FREE_LAYER_RENAMES = {
  'Header: Closed (in-hue fg)':    'Header: Cobalt (in-hue fg)',
  'Header: Closed (text link)':    'Header: Cobalt (text link)',
  'Header: Pending (in-hue fg)':   'Header: Yellow (in-hue fg)',
  'Header: Pending (text link)':   'Header: Yellow (text link)',
  'Header: Confirmed (in-hue fg)': 'Header: Teal (in-hue fg)',
  'Header: Confirmed (text link)': 'Header: Teal (text link)',
  'Header: Progress (in-hue fg)':  'Header: Indigo (in-hue fg)',
  'Header: Progress (text link)':  'Header: Indigo (text link)',
  'Header: Scheduled (in-hue fg)': 'Header: Pink (in-hue fg)',
  'Header: Scheduled (text link)': 'Header: Pink (text link)',
};

const FIX_FREE_NAMES_CODE = `
(async () => {
  await figma.loadAllPagesAsync();

  const page = figma.root.children.find(p => p.id === '${PAGE_ID}');
  if (!page) return { error: 'Page not found: ${PAGE_ID}' };

  await figma.setCurrentPageAsync(page);

  const category = await figma.getNodeByIdAsync('${FREE_NODE_ID}');
  if (!category) return { error: 'Free category not found: ${FREE_NODE_ID}' };

  const renames = ${JSON.stringify(FREE_LAYER_RENAMES)};

  let renamed = 0;
  const results = [];

  const nodes = category.findAll(n => renames[n.name] !== undefined);
  for (const node of nodes) {
    const newName = renames[node.name];
    results.push({ id: node.id, was: node.name, now: newName });
    node.name = newName;
    renamed++;
  }

  return { renamed, results };
})()
`;

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry');

  console.log('\n  fix-contrast-pairings.js');
  console.log('  ========================');
  if (dryRun) console.log('  DRY RUN — no Figma writes will happen\n');

  console.log('  Connecting to Figma MCP server (figma-console-mcp via stdio)...');
  const client = new StdioMCPClient();
  try {
    await client.start();
  } catch (err) {
    console.error('\n  ERROR: Cannot connect to MCP server.');
    console.error('  Make sure Figma Desktop is open and the Desktop Bridge plugin is running.');
    console.error('  Details:', err.message);
    process.exit(1);
  }
  console.log('  Connected\n');

  // ── Fix 1: Interaction text labels ─────────────────────────────────────
  console.log('  Fix 1: Interaction text labels (.state. removal)');
  if (!dryRun) {
    const fix1 = await client.execute(FIX_INTERACTION_CODE);
    if (!fix1 || fix1.error) {
      console.error('  ERROR:', fix1?.error ?? 'no result');
    } else {
      console.log(`  Scanned ${fix1.scanned} text nodes, fixed ${fix1.fixed}`);
      if (fix1.results && fix1.results.length > 0) {
        for (const r of fix1.results) {
          const icon = r.status === 'fixed' ? '✓' : '✗';
          console.log(`    ${icon} ${r.name ?? r.id}: ${r.status}`);
        }
      }
    }
  } else {
    console.log('  (skipped in dry run)');
  }

  console.log();

  // ── Fix 2: Free section layer names ────────────────────────────────────
  console.log('  Fix 2: Free section layer names');
  if (!dryRun) {
    const fix2 = await client.execute(FIX_FREE_NAMES_CODE);
    if (!fix2 || fix2.error) {
      console.error('  ERROR:', fix2?.error ?? 'no result');
    } else {
      console.log(`  Renamed ${fix2.renamed} nodes`);
      if (fix2.results && fix2.results.length > 0) {
        for (const r of fix2.results) {
          console.log(`    ✓ "${r.was}" → "${r.now}"`);
        }
      }
    }
  } else {
    console.log('  (skipped in dry run)');
  }

  console.log('\n  Done.\n');
  client.stop();
}

main().catch((err) => {
  console.error('  Unexpected error:', err.message);
  process.exit(1);
});
