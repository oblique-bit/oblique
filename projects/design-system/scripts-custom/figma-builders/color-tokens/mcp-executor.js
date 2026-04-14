#!/usr/bin/env node
/**
 * MCP Executor — rebuilds Figma color tables via the Desktop Bridge MCP server.
 *
 * Two-phase pipeline:
 *   1. Warmup: load all COLOR variables → return {name: id} map (no globalThis)
 *   2. Per-table: inject SPEC + VAR_MAP + builder.js code → atomic, no shared state
 *
 * Usage:
 *   node mcp-executor.js --all                  # rebuild all 12 tables
 *   node mcp-executor.js --tier <s1|s2|s3|p>   # rebuild one tier
 *   node mcp-executor.js <tableId> [tableId…]  # rebuild specific tables by ID
 *                                               # e.g. s1-status s3-free p-set1
 */
'use strict';
const fs   = require('fs');
const path = require('path');
const http = require('http');

const MCP_URL    = 'http://127.0.0.1:3845/mcp';
const TIMEOUT_MS = 60000;

const CONFIG_FILE  = path.join(__dirname, 'config.json');
const BUILDER_FILE = path.join(__dirname, 'builder.js');
const DATA_DIR     = path.join(__dirname, 'per-table-data');

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

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

function parseSSE(raw) {
  const lines = raw.split('\n');
  let lastData = null;
  for (const ln of lines) {
    if (ln.startsWith('data: ')) lastData = ln.slice(6);
  }
  if (!lastData) return null;
  try { return JSON.parse(lastData); } catch { return lastData; }
}

// ─── MCP protocol ─────────────────────────────────────────────────────────────

async function mcpInit() {
  const initRes = await postMCP({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'figma-builder-cli', version: '2.0.0' },
    },
  });
  const sid = initRes.sessionId;
  if (!sid) throw new Error('No session ID returned from initialize');
  await postMCP({ jsonrpc: '2.0', method: 'notifications/initialized' }, sid);
  return sid;
}

async function mcpExecute(sid, code, timeout = TIMEOUT_MS) {
  const res = await postMCP({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'figma_execute', arguments: { code, timeout } },
  }, sid);
  return parseSSE(res.raw);
}

// ─── Phase 1: warmup ─────────────────────────────────────────────────────────

const WARMUP_SCRIPT = `(async () => {
  // Load all COLOR variables and build name→id map
  const vars = await figma.variables.getLocalVariablesAsync('COLOR');
  const varMap = {};
  for (const v of vars) varMap[v.name] = v.id;
  return { varCount: vars.length, varMap };
})()`;

async function runWarmup(sid) {
  process.stdout.write('  Warming up (loading variable map) ... ');
  const t0 = Date.now();
  const result = await mcpExecute(sid, WARMUP_SCRIPT, TIMEOUT_MS);
  const elapsed = Date.now() - t0;
  let parsed = null;
  if (result?.result?.content) {
    for (const item of result.result.content) {
      if (item.text) { try { parsed = JSON.parse(item.text); } catch {} }
    }
  }
  if (!parsed?.varMap) {
    console.log(`FAILED (${elapsed}ms)`);
    console.error('  Warmup result:', JSON.stringify(result, null, 2));
    return null;
  }
  console.log(`OK (${elapsed}ms) — ${parsed.varCount} variables`);
  return parsed.varMap;
}

// ─── Phase 2: per-table build ─────────────────────────────────────────────────

const FONTS_CODE = `const FONTS = [
  { family: 'Noto Sans', style: 'ExtraBold' },
  { family: 'Noto Sans', style: 'Bold' },
  { family: 'Noto Sans', style: 'SemiBold' },
  { family: 'Noto Sans', style: 'Medium' },
  { family: 'Noto Sans', style: 'Regular' },
  { family: 'Noto Sans', style: 'Light' },
];
for (const f of FONTS) { try { await figma.loadFontAsync(f); } catch(e) {} }`;

function buildTableScript(spec, varMap, tableId, tableData, builderCode) {
  return `(async () => {
const SPEC    = ${JSON.stringify(spec)};
const VAR_MAP = ${JSON.stringify(varMap)};
${FONTS_CODE}
${builderCode}
return await buildTable(${JSON.stringify(tableId)}, ${JSON.stringify(tableData)});
})()`;
}

async function executeTable(sid, spec, varMap, tableId, builderCode) {
  const dataFile = path.join(DATA_DIR, `${tableId}.json`);
  if (!fs.existsSync(dataFile)) {
    console.log(`  ${tableId} — SKIP (no data file: ${tableId}.json)`);
    return { tableId, ok: false, error: 'data file not found' };
  }
  const tableData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const script    = buildTableScript(spec, varMap, tableId, tableData, builderCode);
  const sizeKB    = (Buffer.byteLength(script) / 1024).toFixed(1);

  process.stdout.write(`  ${tableId} (${sizeKB}KB) ... `);
  const t0 = Date.now();
  const result = await mcpExecute(sid, script, TIMEOUT_MS);
  const elapsed = Date.now() - t0;

  let output = null;
  if (result?.result?.content) {
    for (const item of result.result.content) {
      if (item.text) { try { output = JSON.parse(item.text); } catch {} }
    }
  }

  if (output && !output.error) {
    const failNote = output.bindFail > 0 ? `, ${output.bindFail} failed` : '';
    console.log(`OK  ${elapsed}ms — ${output.tokenCount} tokens, ${output.bindCount} bound${failNote}`);
    return { tableId, ok: true, elapsed, output };
  } else {
    const errMsg = output?.error || 'no result';
    console.log(`FAIL  ${elapsed}ms — ${errMsg}`);
    return { tableId, ok: false, elapsed, error: errMsg };
  }
}

// ─── Tier filtering ───────────────────────────────────────────────────────────

const ALL_TABLES = [
  's1-neutral', 's1-interaction', 's1-status', 's1-free',
  's2-interaction',
  's3-brand', 's3-neutral', 's3-interaction', 's3-status', 's3-free',
  'p-set1', 'p-set2',
];

function getTableIds(filter) {
  if (!filter) return ALL_TABLES;
  return ALL_TABLES.filter(id => {
    if (filter === 'p') return id.startsWith('p-');
    return id.startsWith(filter + '-');
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node mcp-executor.js --all                  # rebuild all 12 tables');
    console.log('  node mcp-executor.js --tier <s1|s2|s3|p>   # rebuild one tier');
    console.log('  node mcp-executor.js <tableId> [tableId…]  # e.g. s1-status s3-free');
    process.exit(0);
  }

  const spec        = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  const builderCode = fs.readFileSync(BUILDER_FILE, 'utf8');

  let tableIds;
  if (args[0] === '--all') {
    tableIds = getTableIds();
  } else if (args[0] === '--tier') {
    const tier = args[1];
    if (!tier) { console.error('Missing tier (s1|s2|s3|p)'); process.exit(1); }
    tableIds = getTableIds(tier);
  } else {
    tableIds = args;
  }

  if (tableIds.length === 0) {
    console.error('No tables matched.');
    process.exit(1);
  }

  console.log('\n  Connecting to Figma MCP server...');
  const sid = await mcpInit();
  console.log(`  Session: ${sid}\n`);

  // Phase 1: warmup
  const varMap = await runWarmup(sid);
  if (!varMap) {
    console.error('\n  Warmup failed. Aborting.');
    process.exit(1);
  }

  // Phase 2: build tables sequentially
  console.log(`\n  Building ${tableIds.length} table(s):\n`);
  const results = [];
  for (const tableId of tableIds) {
    try {
      const r = await executeTable(sid, spec, varMap, tableId, builderCode);
      results.push(r);
    } catch (err) {
      console.log(`  ${tableId} — ERROR: ${err.message}`);
      results.push({ tableId, ok: false, error: err.message });
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60));
  const succeeded = results.filter(r => r.ok).length;
  const failed    = results.length - succeeded;
  console.log(`  Done: ${succeeded} succeeded, ${failed} failed out of ${results.length} tables`);
  console.log('─'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
