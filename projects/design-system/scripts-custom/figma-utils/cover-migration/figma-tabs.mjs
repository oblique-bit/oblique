// The tab strip of Figma Desktop. The debug port lists only the tabs that are loaded; the strip itself holds all of them,
// and a tab that is not closed there stays in the app. This script works on the strip (the page "shell.html").
//
// usage:
//   node figma-tabs.mjs count              number of open file tabs (Home is not counted)
//   node figma-tabs.mjs close-all          close every file tab, one by one, with patience (45 s per tab); exit code 2 when a tab does not close
//                                          (for example because a dialog "You have unsaved changes" is waiting)
//   node figma-tabs.mjs close-matching <text>   close only the tab whose title contains <text> (other tabs stay open, also ones with unsaved work)
//   node figma-tabs.mjs home <url>         open <url> in the Home tab (the file browser), for example a folder
const argv = process.argv.slice(2);
const ki = argv.indexOf('--keep');
const KEEP = ki >= 0 ? argv.splice(ki, 2)[1] : (process.env.FIGMA_KEEP_TAB || '');
const [cmd, arg] = argv;
let targets;
try { targets = await (await fetch('http://localhost:9222/json')).json(); } catch { console.log('no debug port on 9222'); process.exit(3); }
const shell = targets.find(t => /shell\.html/.test(t.url));
if (!shell) { console.log('no tab strip found'); process.exit(3); }
const ws = new WebSocket(shell.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const send = (method, params = {}) => new Promise(res => { const i = ++id; const h = e => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); res(m); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result && r.result.result ? r.result.result.value : null; };
// the close buttons of the tabs that are not kept: a tab is found by walking up from its close button to the element that holds exactly that button
const PICK = `(keep, click) => { const bs = [...document.querySelectorAll('button')].filter(b => b.getAttribute('aria-label') === 'Close tab'); const out = []; for (const b of bs) { let e = b, label = ''; for (let i = 0; i < 6 && e; i++) { e = e.parentElement; if (e && e.querySelectorAll('button[aria-label="Close tab"]').length === 1 && (e.textContent || '').trim()) { label = e.textContent; break; } } if (keep && label.includes(keep)) continue; out.push(b); } if (click && out.length) out[0].click(); return out.length; }`;
const count = () => ev(`(${PICK})(${JSON.stringify(KEEP)}, false)`);
const wait = ms => new Promise(r => setTimeout(r, ms));

if (cmd === 'count') { console.log(await count()); process.exit(0); }
if (cmd === 'close-all') {
  let n = await count(), closed = 0;
  while (n > 0 && closed < 80) {
    await ev(`(${PICK})(${JSON.stringify(KEEP)}, true)`);
    let m = n; for (let i = 0; i < 90 && m >= n; i++) { await wait(500); m = await count(); } // up to 45 s: a tab with changes that are still syncing asks first, never click again meanwhile
    if (m >= n) { console.log(JSON.stringify({ closed, left: n, stuck: true })); process.exit(2); }
    closed++; n = m;
  }
  console.log(JSON.stringify({ closed, left: n })); process.exit(0);
}
if (cmd === 'close-matching') {
  const find = `(() => { const bs = [...document.querySelectorAll('button')].filter(b => b.getAttribute('aria-label') === 'Close tab'); for (const b of bs) { let e = b; for (let i = 0; i < 6 && e; i++) { e = e.parentElement; if (e && (e.textContent || '').includes(${JSON.stringify(arg)}) && e.querySelectorAll('button[aria-label="Close tab"]').length === 1) { b.click(); return true; } } } return false; })()`;
  const n0 = await count();
  if (!(await ev(find))) { console.log(JSON.stringify({ found: false })); process.exit(2); }
  let m = n0; for (let i = 0; i < 90 && m >= n0; i++) { await wait(500); m = await count(); }
  console.log(JSON.stringify({ closed: m < n0, left: m })); process.exit(m < n0 ? 0 : 2);
}
if (cmd === 'home') {
  const page = targets.find(t => t.type === 'page' && /\/files\/|desktop_new_tab/.test(t.url) && !/shell\.html/.test(t.url));
  if (!page) { console.log('no Home tab found'); process.exit(3); }
  const w2 = new WebSocket(page.webSocketDebuggerUrl); await new Promise(r => w2.addEventListener('open', r));
  w2.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: arg } })); await wait(1500);
  console.log('home ->', arg); process.exit(0);
}
console.log('usage: node figma-tabs.mjs count | close-all | close-matching <text> | home <url>'); process.exit(1);
