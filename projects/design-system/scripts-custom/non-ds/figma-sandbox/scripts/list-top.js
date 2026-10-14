// ARGS = { name }  list top-level nodes of a page with main component info
const page = figma.root.children.find((p) => p.name === ARGS.name);
await page.loadAsync();
const rows = [];
for (const n of page.children) {
  const r = { id: n.id, type: n.type, name: n.name };
  if (n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); r.mainKey = mc ? mc.key : null; r.mainName = mc ? mc.name : null; r.remote = mc ? mc.remote : null; }
  rows.push(r);
}
return JSON.stringify(rows);
