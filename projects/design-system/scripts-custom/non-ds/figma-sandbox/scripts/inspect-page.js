// ARGS = { name }
const page = figma.root.children.find((p) => p.name === ARGS.name);
await page.loadAsync();
const rows = [];
for (const n of page.children) {
  const r = { id: n.id, type: n.type, name: n.name, w: Math.round(n.width), h: Math.round(n.height) };
  if (n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); r.main = mc ? mc.name : null; r.mainRemote = mc ? mc.remote : null; r.mainKey = mc ? mc.key : null; }
  if (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') { r.remote = n.remote; r.key = n.key; }
  rows.push(r);
}
return JSON.stringify(rows);
