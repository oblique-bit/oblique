// change 3 fixtures on purpose; returns what is needed to revert
const page = figma.root.children.find((p) => p.name === 'Components');
await page.loadAsync();
const insts = page.findAllWithCriteria({ types: ['INSTANCE'] }).filter((n) => n.getSharedPluginData('sandbox', 'sbType'));
const changes = [];
async function loadTextFonts(node) { const names = new Set(); for (const t of node.findAll((n) => n.type === 'TEXT')) { if (t.fontName === figma.mixed) { for (const f of t.getRangeAllFontNames(0, t.characters.length)) names.add(JSON.stringify(f)); } else names.add(JSON.stringify(t.fontName)); } for (const s of names) await figma.loadFontAsync(JSON.parse(s)); }
// 1: text override changed
for (const n of insts.filter((x) => x.getSharedPluginData('sandbox', 'sbType') === 'text')) {
  const tk = Object.entries(n.componentProperties).find(([, v]) => v.type === 'TEXT' && v.value === 'Override text');
  if (tk) { n.setProperties({ [tk[0]]: 'SELFTEST CHANGED' }); changes.push({ id: n.id, kind: 'text-prop', key: tk[0], old: 'Override text' }); break; }
}
// 2: boolean toggled
for (const n of insts.filter((x) => x.getSharedPluginData('sandbox', 'sbType') === 'boolean')) {
  const bk = Object.entries(n.componentProperties).find(([, v]) => v.type === 'BOOLEAN');
  if (bk) { n.setProperties({ [bk[0]]: !bk[1].value }); changes.push({ id: n.id, kind: 'boolean', key: bk[0], old: bk[1].value }); break; }
}
// 3: hidden layer shown again
for (const n of insts.filter((x) => x.getSharedPluginData('sandbox', 'sbType') === 'hidden-layer')) {
  const h = n.findOne((d) => !d.visible);
  if (h) { h.visible = true; changes.push({ id: n.id, kind: 'hidden', layerId: h.id }); break; }
}
// 4: root fill changed (the blind spot found in review)
for (const n of insts.filter((x) => x.getSharedPluginData('sandbox', 'sbType') === 'fill')) {
  if (Array.isArray(n.fills) && n.fills[0] && n.fills[0].type === 'SOLID') { const old = n.fills; n.fills = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }]; changes.push({ id: n.id, kind: 'root-fill', old: JSON.stringify(old) }); break; }
}
// 5: size changed
for (const n of insts.filter((x) => x.getSharedPluginData('sandbox', 'sbType') === 'resize')) {
  const w = n.width, h = n.height; n.resize(w + 10, h); changes.push({ id: n.id, kind: 'resize', w, h }); break;
}
return JSON.stringify(changes);
