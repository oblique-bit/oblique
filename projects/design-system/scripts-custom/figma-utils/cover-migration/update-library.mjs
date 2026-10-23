// Accept the pending updates of the cover components in one design file, and nothing else.
// A file can wait for many other library updates (old helpers, other libraries): "Update all" would apply them too.
// This script opens the cover page, opens "Manage libraries > Updates" and presses "Update" only next to components whose
// name starts with the prefix (default "~figma_only/"). Needs Figma Desktop started with the debug port.
//
// usage: node update-library.mjs <fileKey> [prefix]      (the file must be open in exactly one tab)
const [fileKey, prefix = '~figma_only/'] = process.argv.slice(2);
if (!fileKey) { console.log('usage: node update-library.mjs <fileKey> [prefix]'); process.exit(1); }
let targets;
try { targets = await (await fetch('http://localhost:9222/json')).json(); } catch { console.log('no debug port on 9222'); process.exit(1); }
const tabs = targets.filter(t => t.type === 'page' && t.url.includes('/' + fileKey));
if (tabs.length !== 1) { console.log('tabs matching "' + fileKey + '":', tabs.length); process.exit(1); }
const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const send = (method, params = {}) => new Promise(res => { const i = ++id; const h = e => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); res(m); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result && r.result.result ? r.result.result.value : null; };
const click = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 }); };
const wait = ms => new Promise(r => setTimeout(r, ms));
await send('Page.bringToFront');

// the cover page is the only page whose updates are looked at
const page = await ev(`(async () => { const pg = figma.root.children.find(p => /cover/i.test(p.name)); if (!pg) return null; await pg.loadAsync(); await figma.setCurrentPageAsync(pg); return pg.name; })()`);
if (!page) { console.log('no cover page'); process.exit(1); }

// rows of the Updates list: name of the component and the position of its Update button
const rows = () => ev(`(() => {
  const dialog = [...document.querySelectorAll('*')].find(e => e.children.length && /Manage libraries/.test(e.textContent || '') && e.getBoundingClientRect().width > 500 && e.getBoundingClientRect().width < 900);
  const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  const btns = [...document.querySelectorAll('button,[role=button]')].filter(b => (b.textContent || '').trim() === 'Update' && b.getBoundingClientRect().x > 900).map(b => { const r = b.getBoundingClientRect(); return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; });
  while ((n = w.nextNode())) { const t = n.textContent.trim(); if (/^~(figma_only|deprecated)/.test(t)) { const r = n.parentElement.getBoundingClientRect(); if (r.width > 0) out.push({ name: t, y: Math.round(r.y + r.height / 2) }); } }
  return JSON.stringify({ open: !!dialog, rows: out.map(o => ({ name: o.name, btn: btns.find(b => Math.abs(b.y - o.y) < 45) || null })) });
})()`).then(JSON.parse);

let st = await rows();
if (!st.open) {
  await click(27, 192); await wait(2500);            // Assets panel
  await click(475, 24); await wait(3000);            // Manage libraries
  st = await rows();
  if (!st.open) { console.log('could not open Manage libraries'); process.exit(1); }
}
const done = [], skipped = [];
for (let round = 0; round < 12; round++) {
  const next = st.rows.find(r => r.btn && r.name.startsWith(prefix) && !done.includes(r.name + '#' + round));
  if (!next) break;
  await click(next.btn.x, next.btn.y); done.push(next.name); await wait(4500);
  st = await rows();
}
st.rows.filter(r => !r.name.startsWith(prefix)).forEach(r => skipped.push(r.name));
const left = st.rows.filter(r => r.name.startsWith(prefix)).map(r => r.name);
// close the dialog
await click(1636, 79); await wait(1000);
console.log(JSON.stringify({ page, updated: done, notTouched: skipped, stillPending: left }));
process.exit(0);
