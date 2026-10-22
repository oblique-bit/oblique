// Drive one Figma Desktop tab over the Chrome DevTools Protocol (debug port 9222).
// Start Figma with the port first: `figma-ds-cli connect`.
//
// usage:
//   node cdp.mjs <fileKey> eval "<js expression>"   run JS in the tab, print the JSON-able result
//   node cdp.mjs <fileKey> click <x> <y>            mouse click in page pixels
//   node cdp.mjs <fileKey> type "<text>"            insert text into the focused field
//   node cdp.mjs <fileKey> key c|v                  send Cmd+C / Cmd+V (copy / paste)
//   node cdp.mjs <fileKey> shot <out.png>           screenshot of the tab
//
// <fileKey> must match exactly one open tab (for a branch, use the branch key).
const [fileKey, cmd, a, b] = process.argv.slice(2);
let targets;
try { targets = await (await fetch('http://localhost:9222/json')).json(); }
catch { console.log('no debug port on 9222: start Figma with `figma-ds-cli connect` (opening Figma normally does not open the port)'); process.exit(1); }
const tabs = targets.filter(t => t.type === 'page' && t.url.includes('/' + fileKey));
if (tabs.length !== 1) { console.log('tabs matching "' + fileKey + '":', tabs.length); process.exit(1); }
const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const send = (method, params = {}) => new Promise(res => {
  const i = ++id;
  const h = e => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); res(m); } };
  ws.addEventListener('message', h);
  ws.send(JSON.stringify({ id: i, method, params }));
});
await send('Page.bringToFront');

if (cmd === 'eval') {
  const r = await send('Runtime.evaluate', { expression: a, returnByValue: true, awaitPromise: true });
  console.log(JSON.stringify(r.result && r.result.result ? r.result.result.value : r));
} else if (cmd === 'click') {
  const x = Number(a), y = Number(b);
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 });
  }
  console.log('clicked', x, y);
} else if (cmd === 'type') {
  await send('Input.insertText', { text: a });
  console.log('typed', a);
} else if (cmd === 'key') {
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  const command = a === 'c' ? 'copy' : 'paste';
  for (const type of ['keyDown', 'keyUp']) {
    await send('Input.dispatchKeyEvent', { type, modifiers: 4, key: a, code: 'Key' + a.toUpperCase(), commands: type === 'keyDown' ? [command] : [] });
  }
  await new Promise(r => setTimeout(r, 1500));
  console.log('sent', command, 'to', tabs[0].title);
} else if (cmd === 'shot') {
  await new Promise(r => setTimeout(r, 800));
  const r = await send('Page.captureScreenshot', { format: 'png' });
  (await import('node:fs')).writeFileSync(a, Buffer.from(r.result.data, 'base64'));
  console.log('saved', a);
} else {
  console.log('unknown command:', cmd);
}
process.exit(0);
