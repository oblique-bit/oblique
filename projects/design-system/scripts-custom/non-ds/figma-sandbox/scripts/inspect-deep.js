// ARGS = { name, depth }
const page = figma.root.children.find((p) => p.name === ARGS.name);
await page.loadAsync();
async function desc(n, d) {
  const r = { id: n.id, type: n.type, name: n.name.slice(0, 70), w: Math.round(n.width), h: Math.round(n.height) };
  if (n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); r.main = mc ? mc.name.slice(0, 70) : null; r.remote = mc ? mc.remote : null; }
  if ('children' in n && d < ARGS.depth && n.type !== 'INSTANCE') { r.n = n.children.length; r.kids = []; for (const c of n.children.slice(0, 6)) r.kids.push(await desc(c, d + 1)); }
  return r;
}
const out = [];
for (const n of page.children) out.push(await desc(n, 0));
return JSON.stringify(out, null, 1);
