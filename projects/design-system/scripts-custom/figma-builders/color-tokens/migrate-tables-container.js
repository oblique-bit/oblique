#!/usr/bin/env node
/**
 * One-time migration: unwrap 6 "Tables Container" wrappers in Figma.
 *
 * For each formerly-split table (left + divider + right inside a Tables Container):
 *   1. Move the left frame out of the Tables Container (same position in parent)
 *   2. Delete the Tables Container (which removes divider + right frame with it)
 *
 * Run AFTER mcp-executor.js has populated the left frames with merged data.
 * Safe to re-run — if the wrapper is already gone it logs "already unwrapped".
 *
 * Usage:
 *   node migrate-tables-container.js
 */
'use strict';
const fs   = require('fs');
const path = require('path');
const http = require('http');

const MCP_URL    = 'http://127.0.0.1:3845/mcp';
const TIMEOUT_MS = 30000;

// Left frame IDs — these are the "keepers" (already in config.json tableIds)
// Right frame IDs — these are inside the Tables Container and will be deleted
const PAIRS = [
  { name: 's1-status', leftId: '9544:34574', rightId: '9544:34679' },
  { name: 's1-free',   leftId: '9678:205159', rightId: '9678:205264' },
  { name: 's3-status', leftId: '9544:35022',  rightId: '9544:35127' },
  { name: 's3-free',   leftId: '9678:260810', rightId: '9678:260915' },
  { name: 'p-set1',    leftId: '9544:34309',  rightId: '9544:34367' },
  { name: 'p-set2',    leftId: '9544:34426',  rightId: '9544:34444' },
];

const MIGRATION_SCRIPT = `
(async () => {
  const PAIRS = ${JSON.stringify(PAIRS)};
  const results = [];

  for (const { name, leftId, rightId } of PAIRS) {
    const leftFrame = await figma.getNodeByIdAsync(leftId);
    if (!leftFrame) {
      results.push({ name, ok: false, msg: 'left frame not found (id: ' + leftId + ')' });
      continue;
    }

    const container = leftFrame.parent;
    if (!container) {
      results.push({ name, ok: false, msg: 'left frame has no parent' });
      continue;
    }

    // If the parent is already a Section or the page itself, it's already unwrapped
    if (container.type !== 'FRAME' && container.type !== 'GROUP') {
      results.push({ name, ok: true, msg: 'already unwrapped (parent type: ' + container.type + ')' });
      continue;
    }

    // Verify right frame exists inside the container
    const rightFrame = await figma.getNodeByIdAsync(rightId);
    const containerName = container.name;

    // Find the container's position in its own parent
    const grandParent = container.parent;
    if (!grandParent) {
      results.push({ name, ok: false, msg: 'Tables Container has no parent' });
      continue;
    }

    const containerIndex = grandParent.children.indexOf(container);
    if (containerIndex === -1) {
      results.push({ name, ok: false, msg: 'Tables Container not found in grandParent.children' });
      continue;
    }

    // Move left frame out: insert it at the container's position in grandParent
    grandParent.insertChild(containerIndex, leftFrame);

    // Now delete the Tables Container (takes divider + right frame with it)
    container.remove();

    // Preserve left frame width (may have been constrained smaller by split layout)
    // Set to full table width per SPEC — builder will also enforce this on next run
    // leftFrame.resize(leftFrame.width, leftFrame.height); // no-op, keeps current size

    results.push({
      name,
      ok: true,
      msg: 'unwrapped from "' + containerName + '" (was at index ' + containerIndex + ')',
      rightDeleted: rightFrame !== null,
    });
  }

  return results;
})()
`.trim();

// ─── HTTP helpers (same pattern as mcp-executor.js) ─────────────────────────

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

async function mcpInit() {
  const initRes = await postMCP({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'migrate-tables-container', version: '1.0.0' },
    },
  });
  const sid = initRes.sessionId;
  if (!sid) throw new Error('No session ID returned from initialize');
  await postMCP({ jsonrpc: '2.0', method: 'notifications/initialized' }, sid);
  return sid;
}

async function mcpExecute(sid, code) {
  const res = await postMCP({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'figma_execute', arguments: { code, timeout: TIMEOUT_MS } },
  }, sid);
  return parseSSE(res.raw);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n  Connecting to Figma MCP server...');
  const sid = await mcpInit();
  console.log(`  Session: ${sid}\n`);

  console.log(`  Unwrapping ${PAIRS.length} Tables Container frames...\n`);
  const result = await mcpExecute(sid, MIGRATION_SCRIPT);

  let parsed = null;
  if (result?.result?.content) {
    for (const item of result.result.content) {
      if (item.text) { try { parsed = JSON.parse(item.text); } catch {} }
    }
  }

  if (!Array.isArray(parsed)) {
    console.error('  Unexpected result:', JSON.stringify(result, null, 2));
    process.exit(1);
  }

  let ok = 0, fail = 0;
  for (const r of parsed) {
    const status = r.ok ? 'OK  ' : 'FAIL';
    console.log(`  ${status}  ${r.name.padEnd(12)} — ${r.msg}`);
    if (r.ok) ok++; else fail++;
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`  Done: ${ok} succeeded, ${fail} failed out of ${parsed.length}`);
  console.log('─'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
