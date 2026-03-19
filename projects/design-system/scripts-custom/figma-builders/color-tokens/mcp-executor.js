#!/usr/bin/env node
/**
 * MCP Executor — rebuilds Figma color tables via the Desktop Bridge MCP server.
 *
 * Two-phase pipeline:
 *   1. Install the builder (split-setup.js) on globalThis.__B
 *   2. Run split-data-*.js files that call globalThis.__B.buildTable()
 *
 * Usage:
 *   node mcp-executor.js --all                      # rebuild all 14 tables
 *   node mcp-executor.js --tier <s1|s2|s3|p>        # rebuild one tier
 *   node mcp-executor.js <split-data-*.js>           # rebuild specific table(s)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');

const MCP_URL = 'http://127.0.0.1:3845/mcp';
const TIMEOUT_MS = 30000;

// ─── HTTP helpers ───────────────────────────────────────────────────────────

function postMCP(body, sessionId) {
  return new Promise((resolve, reject) => {
    const url = new URL(MCP_URL);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    };
    if (sessionId) headers['mcp-session-id'] = sessionId;

    const payload = JSON.stringify(body);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers,
      timeout: TIMEOUT_MS + 5000,
    };

    const req = http.request(opts, (res) => {
      let raw = '';
      const sid = res.headers['mcp-session-id'] || sessionId;
      res.setEncoding('utf8');
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => resolve({ status: res.statusCode, raw, sessionId: sid }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('HTTP timeout')); });
    req.end(payload);
  });
}

/** Parse SSE body → extract last `data:` JSON */
function parseSSE(raw) {
  const lines = raw.split('\n');
  let lastData = null;
  for (const ln of lines) {
    if (ln.startsWith('data: ')) {
      lastData = ln.slice(6);
    }
  }
  if (!lastData) return null;
  try { return JSON.parse(lastData); } catch { return lastData; }
}

// ─── MCP protocol flow ─────────────────────────────────────────────────────

async function mcpInit() {
  // Step 1: initialize
  const initRes = await postMCP({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'figma-builder-cli', version: '1.0.0' },
    },
  });
  const sid = initRes.sessionId;
  if (!sid) throw new Error('No session ID returned from initialize');

  // Step 2: send initialized notification (no id = notification)
  await postMCP({ jsonrpc: '2.0', method: 'notifications/initialized' }, sid);

  return sid;
}

async function mcpExecute(sid, code, timeout = TIMEOUT_MS) {
  const res = await postMCP({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: {
      name: 'figma_execute',
      arguments: { code, timeout },
    },
  }, sid);
  return parseSSE(res.raw);
}

// ─── Main ──────────────────────────────────────────────────────────────────

const BUILDERS_DIR = path.join(__dirname);
const DATA_DIR = path.join(BUILDERS_DIR, 'per-table-scripts');
const SETUP_FILE = path.join(BUILDERS_DIR, 'split-setup.js');

function getDataScripts(filter) {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('split-data-') && f.endsWith('.js'))
    .sort();
  if (!filter) return files;
  return files.filter(f => {
    if (filter === 'p') return f.includes('-p-');
    return f.includes(`-${filter}-`);
  });
}

async function installSetup(sid) {
  const code = fs.readFileSync(SETUP_FILE, 'utf8');
  const sizeKB = (Buffer.byteLength(code) / 1024).toFixed(1);
  process.stdout.write(`  Installing split-setup.js (${sizeKB}KB) ... `);

  const t0 = Date.now();
  const result = await mcpExecute(sid, code, TIMEOUT_MS);
  const elapsed = Date.now() - t0;

  // Verify installation
  const check = await mcpExecute(sid, `return { ready: typeof globalThis.__B?.buildTable === 'function' };`);
  const ready = check?.result?.content?.[0]?.text;
  if (ready && ready.includes('"ready":true')) {
    console.log(`OK (${elapsed}ms)`);
    return true;
  }
  console.log(`FAILED (${elapsed}ms)`);
  return false;
}

async function executeDataScript(sid, filePath) {
  const name = path.basename(filePath, '.js');
  const code = fs.readFileSync(filePath, 'utf8');
  const sizeKB = (Buffer.byteLength(code) / 1024).toFixed(1);

  process.stdout.write(`  ${name} (${sizeKB}KB) ... `);

  const t0 = Date.now();
  const execResult = await mcpExecute(sid, code, TIMEOUT_MS);
  const elapsed = Date.now() - t0;

  // Parse result
  let output = null;
  if (execResult?.result?.content) {
    for (const item of execResult.result.content) {
      if (item.text) {
        try { output = JSON.parse(item.text); } catch {}
      }
    }
  }

  if (output && !output.error) {
    const entries = Object.values(output);
    let totalTokens = 0, totalBound = 0, totalFail = 0;
    for (const t of entries) {
      totalTokens += (t.tokenCount || 0);
      totalBound += (t.bindCount || 0);
      totalFail += (t.bindFail || 0);
    }
    const failNote = totalFail > 0 ? `, ${totalFail} failed` : '';
    console.log(`OK  ${elapsed}ms — ${totalTokens} tokens, ${totalBound} bound${failNote}`);
    return { name, ok: true, elapsed, output };
  } else {
    const errMsg = output?.error || 'no result';
    console.log(`FAIL  ${elapsed}ms — ${errMsg}`);
    return { name, ok: false, elapsed, execResult };
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node mcp-executor.js --all               # rebuild all 14 tables');
    console.log('  node mcp-executor.js --tier s3            # rebuild one tier (s1|s2|s3|p)');
    console.log('  node mcp-executor.js <split-data-*.js>    # rebuild specific table(s)');
    process.exit(0);
  }

  console.log('\n  Connecting to Figma MCP server...');
  const sid = await mcpInit();
  console.log(`   Session: ${sid}\n`);

  // Phase 1: Install builder on globalThis.__B
  const ok = await installSetup(sid);
  if (!ok) {
    console.error('\n  Setup installation failed. Aborting.');
    process.exit(1);
  }

  // Phase 2: Run data scripts
  let scripts = [];
  if (args[0] === '--all') {
    scripts = getDataScripts().map(f => path.join(DATA_DIR, f));
  } else if (args[0] === '--tier') {
    const tier = args[1];
    if (!tier) { console.error('Missing tier (s1|s2|s3|p)'); process.exit(1); }
    scripts = getDataScripts(tier).map(f => path.join(DATA_DIR, f));
  } else {
    scripts = args.map(a => path.resolve(a));
  }

  if (scripts.length === 0) {
    console.error('No data scripts found.');
    process.exit(1);
  }

  console.log(`\n  Building ${scripts.length} table(s):\n`);

  const results = [];
  for (const s of scripts) {
    try {
      const r = await executeDataScript(sid, s);
      results.push(r);
    } catch (err) {
      console.log(`  ${path.basename(s)} — ERROR: ${err.message}`);
      results.push({ name: path.basename(s, '.js'), ok: false, error: err.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  const succeeded = results.filter(r => r.ok).length;
  const failed = results.length - succeeded;
  console.log(`  Done: ${succeeded} succeeded, ${failed} failed out of ${results.length} tables`);
  console.log('='.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
