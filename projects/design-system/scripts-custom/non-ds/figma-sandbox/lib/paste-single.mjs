#!/usr/bin/env node
// Copy ONE library component at a time and paste it into the sandbox page "Components".
// A single component pastes as an INSTANCE linked to the library (batches do not).
// Two persistent CDP connections (library tab, sandbox tab). Resumable via snapshots/staging-map.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadConfig, mayWrite } from './config.mjs';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = loadConfig();
const LIB = cfg.library, SB = cfg.sandbox;
if (!mayWrite(cfg, SB)) { console.error('refused: the sandbox is not in allowedWrite'); process.exit(4); }
const LIMIT = Number(process.env.LIMIT || 100000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.appendFileSync(path.join(here, 'run.log'), `${new Date().toISOString()}\t${SB}\tpaste-single.mjs\tWRITE\n`);

class Tab {
  constructor(key) { this.fileKey = key; this.id = 0; this.pending = new Map(); }
  async connect() {
    const ts = (await (await fetch('http://127.0.0.1:9222/json')).json()).filter((t) => t.type === 'page' && t.url.includes('/design/' + this.fileKey + '/'));
    if (ts.length !== 1) throw new Error('expected one tab for ' + this.fileKey + ', found ' + ts.length);
    this.t = ts[0];
    this.ws = new WebSocket(this.t.webSocketDebuggerUrl);
    await new Promise((r, j) => { this.ws.onopen = r; this.ws.onerror = j; });
    this.ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); } };
    await this.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  }
  send(method, params = {}) { return new Promise((res) => { const i = ++this.id; this.pending.set(i, res); this.ws.send(JSON.stringify({ id: i, method, params })); }); }
  async front() { await this.send('Page.bringToFront'); await fetch('http://127.0.0.1:9222/json/activate/' + this.t.id); }
  async figma(code) {
    const expr = `(async()=>{ if (typeof figma==='undefined') return 'NOFIGMA'; if (figma.fileKey!==${JSON.stringify(this.fileKey)}) return 'WRONG'; ${code} })()`;
    for (let a = 0; a < 8; a++) {
      const d = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (d.result?.exceptionDetails) throw new Error(d.result.exceptionDetails.exception?.description || 'exception');
      const v = d.result?.result?.value;
      if (v === 'NOFIGMA' || v === 'WRONG') { await this.front(); await sleep(700); continue; }
      return v;
    }
    throw new Error('figma not available in tab ' + this.fileKey);
  }
  async key(cmd) {
    const L = cmd === 'copy' ? 'c' : 'v';
    const base = { modifiers: 4, key: L, code: 'Key' + L.toUpperCase(), windowsVirtualKeyCode: L.toUpperCase().charCodeAt(0), nativeVirtualKeyCode: L.toUpperCase().charCodeAt(0), commands: [cmd] };
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', ...base });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  }
}
const clipKey = () => {
  try {
    const h = execFileSync('pbpaste', ['-Prefer', 'public.html'], { encoding: 'utf8', maxBuffer: 1 << 28 });
    const m = h.match(/figmeta\)([A-Za-z0-9+/=]+)/);
    return m ? JSON.parse(Buffer.from(m[1], 'base64').toString()).fileKey : null;
  } catch { return null; }
};

const inv = JSON.parse(fs.readFileSync(path.join(here, 'snapshots/inventory-library.json'), 'utf8'));
const order = ['🧱 Components', '🔧 Utilities', '🛑  End of life', '🧷 Icons'];
const items = inv.filter((x) => !'._'.includes(x.name[0])).map((x) => ({
  name: x.name, type: x.type, page: x.page, pageId: x.pageId, libId: x.id,
  copyId: x.type === 'COMPONENT_SET' ? x.defaultVariantId : x.id,
  copyKey: x.type === 'COMPONENT_SET' ? x.defaultVariantKey : x.key,
})).sort((a, b) => order.indexOf(a.page) - order.indexOf(b.page));
const mapFile = path.join(here, 'snapshots/staging-map.json');
const map = JSON.parse(fs.readFileSync(mapFile, 'utf8')).filter((m) => m.ok);
const save = () => fs.writeFileSync(mapFile, JSON.stringify(map, null, 1));

const lib = new Tab(LIB), sb = new Tab(SB);
await lib.connect(); await sb.connect();
// scan what is already in the sandbox (Components and Swaps pages): instances whose main key is a copy key
await sb.front(); await sleep(700);
const scan = JSON.parse(await sb.figma(`
  const out = [];
  for (const name of ['Components', 'Swaps']) {
    const p = figma.root.children.find((x) => x.name === name); await p.loadAsync();
    for (const n of p.children) { if (n.type !== 'INSTANCE') continue; const mc = await n.getMainComponentAsync(); out.push({ id: n.id, name: n.name, key: mc && mc.key, remote: mc && mc.remote }); }
  }
  return JSON.stringify(out);`));
const have = new Set(map.map((m) => m.copyKey));
const usedNodes = new Set(map.map((m) => m.nodeId));
for (const s of scan) { if (usedNodes.has(s.id) || !s.remote) continue; const it = items.find((i) => i.name === s.name && !have.has(i.copyKey)); if (it) { map.push({ ...it, nodeId: s.id, mainKey: s.key, ok: true }); have.add(it.copyKey); usedNodes.add(s.id); } }
save();
const known = new Set(scan.map((s) => s.id));
for (const m of map) if (m.nodeId) known.add(m.nodeId);
const todo = items.filter((i) => !have.has(i.copyKey)).slice(0, LIMIT);
console.log(new Date().toISOString(), 'todo', todo.length, 'already', have.size);
const failed = [];
let curLibPage = null, n = 0;
for (const it of todo) {
  n++;
  try {
    await lib.front(); await sleep(450);
    const sel = await lib.figma(`
      const page = figma.root.children.find((p) => p.id === ${JSON.stringify(it.pageId)});
      if (figma.currentPage.id !== page.id) await figma.setCurrentPageAsync(page);
      const node = await figma.getNodeByIdAsync(${JSON.stringify(it.copyId)});
      figma.currentPage.selection = node ? [node] : [];
      return figma.currentPage.selection.length;`);
    if (sel !== 1) throw new Error('select ' + sel);
    await lib.key('copy'); await sleep(350);
    if (clipKey() !== LIB) { await lib.key('copy'); await sleep(500); if (clipKey() !== LIB) throw new Error('clipboard not from library'); }
    await sb.front(); await sleep(450);
    await sb.figma(`if (figma.currentPage.name !== 'Components') await figma.setCurrentPageAsync(figma.root.children.find((p) => p.name === 'Components')); figma.currentPage.selection = []; return 1;`);
    if (process.env.DEBUG) console.log('clip ok, pasting', it.name);
    await sb.key('paste'); await sleep(800);
    let found = null;
    const tPaste = Date.now();
    for (let t = 0; t < 16 && !found; t++) {
      const rows = JSON.parse(await sb.figma(`
        const kids = figma.currentPage.children.slice(-4); const out = [];
        for (const k of kids) { const r = { id: k.id, type: k.type, name: k.name }; if (k.type === 'INSTANCE') { const mc = await k.getMainComponentAsync(); r.key = mc && mc.key; r.remote = mc && mc.remote; } out.push(r); }
        return JSON.stringify(out);`));
      if (process.env.DEBUG) console.log('poll', t, JSON.stringify(rows.map((r) => [r.id, r.type, r.name && r.name.slice(0, 20), known.has(r.id)])));
      const fresh = rows.filter((r) => !known.has(r.id));
      const hit = fresh.find((r) => r.type === 'INSTANCE' && r.name === it.name && r.remote);
      if (hit) found = hit;
      else if (t === 15) {
        // pasted as something else (local component etc.): remove it so no local component stays
        const bad = fresh.filter((r) => r.type !== 'INSTANCE');
        if (bad.length) await sb.figma(`for (const id of ${JSON.stringify(bad.map((b) => b.id))}) { const x = await figma.getNodeByIdAsync(id); if (x) x.remove(); } return 1;`);
        fresh.forEach((r) => known.add(r.id));
      } else await sleep(700);
    }
    if (found) { found.ms = Date.now() - tPaste; known.add(found.id); map.push({ ...it, nodeId: found.id, mainKey: found.key, ms: found.ms, ok: true }); }
    else { failed.push(it.name); map.push({ ...it, nodeId: null, ok: false, reason: 'not pasted as instance' }); }
  } catch (e) {
    failed.push(it.name); map.push({ ...it, nodeId: null, ok: false, reason: String(e.message).slice(0, 120) });
    try { await sleep(1500); } catch {}
  }
  if (n % 10 === 0) { save(); console.log(new Date().toISOString(), n + '/' + todo.length, 'ok', map.filter((m) => m.ok).length, 'failed', failed.length); }
}
save();
console.log(new Date().toISOString(), 'DONE ok', map.filter((m) => m.ok).length, 'failed', failed.length, failed.slice(0, 20));
process.exit(0);
