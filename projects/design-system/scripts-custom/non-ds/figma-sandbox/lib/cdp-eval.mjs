#!/usr/bin/env node
// Run a Figma plugin-API script on the open tab of one file, over CDP port 9222.
// usage: node cdp-eval.mjs <fileKey> <script.js> [--write] [--out result.txt]
// The script is the body of an async function; use `return`. The file key is checked inside
// the tab before the script runs. Every call is logged to run.log (key, script, write flag).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [, , key, script, ...rest] = process.argv;
const write = rest.includes('--write');
const outIdx = rest.indexOf('--out');
const out = outIdx >= 0 ? rest[outIdx + 1] : null;
const argIdx = rest.indexOf('--args');
const ARGS = argIdx >= 0 ? rest[argIdx + 1] : 'null';
const base = 'http://localhost:9222';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!key || !script) { console.error('usage: cdp-eval.mjs <fileKey> <script.js> [--write] [--out file]'); process.exit(2); }

fs.appendFileSync(path.join(here, '..', 'run.log'),
  `${new Date().toISOString()}\t${key}\t${path.basename(script)}\t${write ? 'WRITE' : 'read'}\n`);

async function pages() { return (await (await fetch(base + '/json')).json()).filter((t) => t.type === 'page'); }

function evalOnce(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const timer = setTimeout(() => { try { ws.close(); } catch {} reject(new Error('timeout 15 min')); }, 15 * 60 * 1000);
    ws.onopen = () => ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true } }));
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id !== 1) return;
      clearTimeout(timer); ws.close();
      if (d.result?.exceptionDetails) {
        const e = d.result.exceptionDetails;
        reject(new Error(e.exception?.description || e.text || 'exception'));
      } else resolve(d.result?.result?.value);
    };
    ws.onerror = (e) => { clearTimeout(timer); reject(new Error('ws error ' + (e.message || ''))); };
  });
}

const code = fs.readFileSync(script, 'utf8');
const wrapped = `(async () => {
  if (typeof figma === 'undefined') return JSON.stringify({ __noFigma: true });
  if (figma.fileKey !== ${JSON.stringify(key)}) return JSON.stringify({ __wrongFile: figma.fileKey });
  const ARGS = ${ARGS};
  ${code}
})()`;

let lastErr = null;
for (let attempt = 1; attempt <= 6; attempt++) {
  let t = (await pages()).find((p) => p.url.includes('/' + key + '/'));
  for (let w = 0; !t && w < 8; w++) { if (w === 0) { try { execSync(`open -a Figma "https://www.figma.com/design/${key}"`); } catch {} } await sleep(3000); t = (await pages()).find((p) => p.url.includes('/' + key + '/')); }
  if (!t) { console.error('tab for ' + key + ' not open'); process.exit(3); }
  try {
    await fetch(base + '/json/activate/' + t.id);
    if (attempt >= 2) { try { execSync(`open -a Figma "https://www.figma.com/design/${key}"`); } catch {} await sleep(3000); }
    await sleep(attempt === 1 ? 1500 : 3000);
    const v = await evalOnce(t.webSocketDebuggerUrl, wrapped);
    if (typeof v === 'string' && (v.startsWith('{"__noFigma"') || v.startsWith('{"__wrongFile"'))) {
      lastErr = v; continue;
    }
    const text = typeof v === 'string' ? v : JSON.stringify(v);
    if (out) { fs.writeFileSync(out, text); console.log('written ' + out + ' (' + text.length + ' chars)'); }
    else { await new Promise((r) => process.stdout.write(text + '\n', r)); }
    process.exit(0);
  } catch (e) { lastErr = String(e.message || e); if (!/not\s*defined|figma/i.test(lastErr)) { console.error('ERROR: ' + lastErr); process.exit(1); } }
}
console.error('FAILED after retries: ' + lastErr);
process.exit(1);
