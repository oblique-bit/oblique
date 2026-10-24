// The tab strip of Figma Desktop. The debug port lists only the tabs that are loaded; the strip itself holds all of them,
// and a tab that is not closed there stays in the app. This script works on the strip (the page "shell.html").
//
// usage:
//   node figma-tabs.mjs count              number of open file tabs (Home is not counted)
//   node figma-tabs.mjs close-all          close every file tab, one by one; exit code 2 when a tab does not close
//                                          (for example because a dialog "You have unsaved changes" is waiting)
//   node figma-tabs.mjs home <url>         open <url> in the Home tab (the file browser), for example a folder
const [cmd, arg] = process.argv.slice(2);
let targets;
try { targets = await (await fetch('http://localhost:9222/json')).json(); } catch { console.log('no debug port on 9222'); process.exit(3); }
const shell = targets.find(t => /shell\.html/.test(t.url));
if (!shell) { console.log('no tab strip found'); process.exit(3); }
const ws = new WebSocket(shell.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const send = (method, params = {}) => new Promise(res => { const i = ++id; const h = e => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); res(m); } }; ws.addEventListener('message', h); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result && r.result.result ? r.result.result.value : null; };
const count = () => ev(`[...document.querySelectorAll('button')].filter(b => b.getAttribute('aria-label') === 'Close tab').length`);
const wait = ms => new Promise(r => setTimeout(r, ms));

if (cmd === 'count') { console.log(await count()); process.exit(0); }
if (cmd === 'close-all') {
  let n = await count(), closed = 0;
  while (n > 0 && closed < 80) {
    await ev(`[...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Close tab').click()`);
    let m = n; for (let i = 0; i < 12 && m >= n; i++) { await wait(500); m = await count(); }
    if (m >= n) { console.log(JSON.stringify({ closed, left: n, stuck: true })); process.exit(2); }
    closed++; n = m;
  }
  console.log(JSON.stringify({ closed, left: n })); process.exit(0);
}
if (cmd === 'home') {
  const page = targets.find(t => t.type === 'page' && /\/files\/|desktop_new_tab/.test(t.url) && !/shell\.html/.test(t.url));
  if (!page) { console.log('no Home tab found'); process.exit(3); }
  const w2 = new WebSocket(page.webSocketDebuggerUrl); await new Promise(r => w2.addEventListener('open', r));
  w2.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: arg } })); await wait(1500);
  console.log('home ->', arg); process.exit(0);
}
console.log('usage: node figma-tabs.mjs count | close-all | home <url>'); process.exit(1);
