// Accept the pending update of the cover components in one FigJam board, and nothing else.
// A FigJam board has no "Manage libraries" dialog: the update is the blue banner "N component updates" in the tab "Stickers"
// of the plus menu in the toolbar at the bottom. The script reads N first and presses "Update" only when N is at most 4
// (the cover needs the thumbnail, the footer and the status badges); a bigger N means other libraries wait too: it stops.
//
// usage: node update-figjam.mjs <fileKey> [maxUpdates]      (the board must be open in exactly one tab)
// answer: {"updates": N, "updated": true|false, "reason": "..."}
const [fileKey, maxArg = '4'] = process.argv.slice(2);
if (!fileKey) { console.log('usage: node update-figjam.mjs <fileKey> [maxUpdates]'); process.exit(1); }
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
const done = (o, code = 0) => { console.log(JSON.stringify(o)); process.exit(code); };

// the element with exactly this text: its centre in page pixels
const centre = text => ev(`(() => { for (const e of document.querySelectorAll('button,[role=tab],[role=button],div,span')) { if (e.children.length === 0 || e.tagName === 'BUTTON') { const t = (e.textContent || '').trim(); const r = e.getBoundingClientRect(); if (t === ${JSON.stringify(text)} && r.width > 0 && r.height > 0) return JSON.stringify([Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]); } } return null; })()`).then(v => v && JSON.parse(v));
const bannerText = () => ev(`(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (/^\\d+ component updates?$/.test(t)) return t; } return null; })()`);

const size = JSON.parse(await ev(`JSON.stringify([window.innerWidth, window.innerHeight])`));
if (!(await centre('Stickers'))) {
  // the plus button sits at the right end of the bottom toolbar
  await click(Math.round(size[0] * 0.605), Math.round(size[1] * 0.974)); await wait(2500);
}
const st = await centre('Stickers');
if (!st) done({ updates: null, updated: false, reason: 'the tab Stickers was not found: take a screenshot and adjust' }, 2);
await click(st[0], st[1]); await wait(2500);
let banner = await bannerText();
if (!banner) { done({ updates: 0, updated: false, reason: 'no banner: nothing to update' }); }
const n = Number(banner.match(/^(\d+)/)[1]);
if (n > Number(maxArg)) done({ updates: n, updated: false, reason: 'more updates than expected: stop and ask' }, 3);
const up = await centre('Update');
if (!up) done({ updates: n, updated: false, reason: 'no Update button found' }, 2);
await click(up[0], up[1]); await wait(6000);
const left = await bannerText();
// close the panel (the X next to the search field)
const x = await ev(`(() => { for (const b of document.querySelectorAll('button,[role=button]')) { const l = (b.getAttribute('aria-label') || '').toLowerCase(); const r = b.getBoundingClientRect(); if ((l === 'close' || l === 'close panel') && r.width > 0 && r.y > 100) return JSON.stringify([Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]); } return null; })()`);
if (x) { const [cx, cy] = JSON.parse(x); await click(cx, cy); }
done({ updates: n, updated: !left, left });
