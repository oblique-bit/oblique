#!/usr/bin/env node
// node cdp-key.mjs <copy|paste> <fileKey>
// Send Cmd+C or Cmd+V as a CDP key event to the Figma tab of exactly that file.
// Copy only from the library, paste only into the sandbox (hard guard).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig, mayWrite } from './config.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const [cmd, key] = process.argv.slice(2);
const cfg = loadConfig();
const LIB = cfg.library, SANDBOX = cfg.sandbox;
if (cmd === 'copy' && key !== LIB) { console.error('refusing: copy only from the library'); process.exit(2); }
if (cmd === 'paste' && (key !== SANDBOX || !mayWrite(cfg, key))) { console.error('refusing: paste only into the sandbox, and only if it is in allowedWrite'); process.exit(2); }
fs.appendFileSync(path.join(here, '..', 'run.log'), `${new Date().toISOString()}\t${key}\tkey-${cmd}\t${cmd === 'paste' ? 'WRITE' : 'read'}\n`);
let match = [];
for (let w = 0; w < 8 && match.length !== 1; w++) {
  const targets = await (await fetch('http://127.0.0.1:9222/json')).json();
  match = targets.filter((t) => t.type === 'page' && t.url.includes('/design/' + key + '/'));
  if (match.length === 0 && w === 0) { (await import('node:child_process')).execSync(`open -a Figma "https://www.figma.com/design/${key}"`); }
  if (match.length !== 1) await new Promise((r) => setTimeout(r, 3000));
}
if (match.length !== 1) { console.error('expected exactly one tab for', key, 'found', match.length); process.exit(3); }
const t = match[0];
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.bringToFront');
await fetch('http://127.0.0.1:9222/json/activate/' + t.id);
await send('Emulation.setFocusEmulationEnabled', { enabled: true });
await new Promise((r) => setTimeout(r, 1500));
const letter = cmd === 'copy' ? 'c' : 'v';
const base = { modifiers: 4, key: letter, code: 'Key' + letter.toUpperCase(), windowsVirtualKeyCode: letter.toUpperCase().charCodeAt(0), nativeVirtualKeyCode: letter.toUpperCase().charCodeAt(0), commands: [cmd] };
await send('Input.dispatchKeyEvent', { type: 'keyDown', ...base });
await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
await new Promise((r) => setTimeout(r, 4000));
ws.close();
console.log(cmd + ' sent to', t.title);
