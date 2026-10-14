// read-mostly: compare every fixture with a fresh instance of its own current main component.
// A fresh instance is created and removed again (no net change). ARGS = { from, to } slice of the fixture list
const page = figma.root.children.find((p) => p.name === ARGS.page);
await page.loadAsync();
await figma.setCurrentPageAsync(page);
const fx = page.findAllWithCriteria({ types: ['INSTANCE'] }).filter((n) => n.getSharedPluginData('sandbox', 'sbType'));
const slice = fx.slice(ARGS.from, ARGS.to);
const r2 = (x) => Math.round(x * 10) / 10;
async function sig(n) {
  const out = { props: JSON.stringify(Object.entries(n.componentProperties).map(([k, v]) => [k, v.value]).sort()) + (Array.isArray(n.fills) ? JSON.stringify(n.fills.map((f) => f.type === 'SOLID' ? [f.color.r.toFixed(3), f.color.g.toFixed(3), f.color.b.toFixed(3)] : f.type)) : ''), w: r2(n.width), h: r2(n.height), d: [] };
  for (const d of n.findAll(() => true)) {
    const r = [d.name, d.type, d.visible ? 1 : 0, r2(d.width), r2(d.height)];
    if (d.type === 'TEXT') r.push(d.characters);
    if (d.type === 'INSTANCE') { const m = await d.getMainComponentAsync(); r.push(m ? m.key : null); }
    if ('fills' in d && Array.isArray(d.fills)) r.push(JSON.stringify(d.fills.map((f) => f.type === 'SOLID' ? [f.color.r.toFixed(3), f.color.g.toFixed(3), f.color.b.toFixed(3), f.visible !== false] : f.type)));
    out.d.push(JSON.stringify(r));
  }
  return out;
}
const res = [];
for (const n of slice) {
  const mc = await n.getMainComponentAsync();
  const fresh = mc.createInstance();
  let kinds = [];
  try {
    const a = await sig(n), b = await sig(fresh);
    if (a.props !== b.props) kinds.push('props');
    if (a.w !== b.w || a.h !== b.h) kinds.push('size');
    if (a.d.length !== b.d.length) kinds.push('layers');
    else for (let i = 0; i < a.d.length; i++) if (a.d[i] !== b.d[i]) { const x = JSON.parse(a.d[i]), y = JSON.parse(b.d[i]); kinds.push(x[2] !== y[2] ? 'visible' : x[1] === 'TEXT' && x[5] !== y[5] ? 'text' : x[1] === 'INSTANCE' && x[5] !== y[5] ? 'nested' : 'layer'); }
  } finally { fresh.remove(); }
  res.push([n.id, n.name, n.getSharedPluginData('sandbox', 'sbType'), [...new Set(kinds)]]);
}
return JSON.stringify({ total: fx.length, from: ARGS.from, rows: res });
