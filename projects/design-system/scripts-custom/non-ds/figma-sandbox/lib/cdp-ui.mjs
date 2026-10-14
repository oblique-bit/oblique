#!/usr/bin/env node
// UI driver over CDP for one Figma tab: evaluate DOM expressions, send keys, click, screenshot.
// Used to drive menus (for example Show version history and Duplicate on a version). Always check the text of the
// element under the pointer before a click, some neighbours (Restore, Delete version info) change things.
// usage: TAB_KEY=<fileKey> node cdp-ui.mjs eval '<js expression>' | key <KeyX> <vk> <modifiers> | click <x> <y> | shot <out.png>
import fs from 'node:fs';
const KEY = process.env.TAB_KEY;
if (!KEY) { console.error('set TAB_KEY to the file key of the tab'); process.exit(2); }
const [cmd, ...a] = process.argv.slice(2);
const targets = (await (await fetch('http://127.0.0.1:9222/json')).json()).filter((t) => t.type === 'page' && t.url.includes('/design/' + KEY + '/'));
if (targets.length !== 1) { console.error('expected one tab for', KEY, 'found', targets.length); process.exit(3); }
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await send('Page.bringToFront'); await send('Emulation.setFocusEmulationEnabled', { enabled: true }); await sleep(400);
if (cmd === 'eval') {
  const d = await send('Runtime.evaluate', { expression: a[0], awaitPromise: true, returnByValue: true });
  console.log(d.result?.exceptionDetails ? 'EXC ' + JSON.stringify(d.result.exceptionDetails.exception?.description) : JSON.stringify(d.result?.result?.value));
} else if (cmd === 'key') {
  const [code, vk, mod] = a; const base = { key: code.replace('Key', '').toLowerCase(), code, windowsVirtualKeyCode: Number(vk), nativeVirtualKeyCode: Number(vk), modifiers: Number(mod) };
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base }); await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base }); await sleep(900); console.log('key sent');
} else if (cmd === 'click') {
  const x = Number(a[0]), y = Number(a[1]);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); await sleep(900); console.log('clicked', x, y);
} else if (cmd === 'shot') {
  const d = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(a[0], Buffer.from(d.result.data, 'base64')); console.log('saved', a[0]);
}
ws.close(); process.exit(0);
