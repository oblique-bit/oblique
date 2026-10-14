// read only: measures checks C1, C2, C3, C5, C6 on the new pages
const res = { pages: {}, fixtures: 0, byType: {}, noOverride: [], noOverrideByType: {}, detached: [], localComponents: 0, overlaps: [], components: [], swaps: 0, fieldsSeen: {}, labelMismatch: [] };
const NEW = ['Components', 'Swaps', 'Known breaks'];
for (const p of figma.root.children) {
  await p.loadAsync();
  res.localComponents += p.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] }).length;
}
const compSet = new Set();
for (const pn of ['Components', 'Swaps']) {
  const page = figma.root.children.find((p) => p.name === pn);
  const all = page.findAllWithCriteria({ types: ['INSTANCE'] });
  const fx = all.filter((n) => n.getSharedPluginData('sandbox', 'sbType'));
  res.pages[pn] = { instancesTotal: all.length, fixtures: fx.length, top: page.children.length };
  for (const n of fx) {
    const type = n.getSharedPluginData('sandbox', 'sbType');
    res.fixtures++; res.byType[type] = (res.byType[type] || 0) + 1;
    if (type === 'component-swap') res.swaps++; else compSet.add(n.getSharedPluginData('sandbox', 'sbComponent'));
    const mc = await n.getMainComponentAsync();
    if (!mc || !mc.remote) res.detached.push([n.id, n.name]);
    if (n.name !== 'fixture/' + n.getSharedPluginData('sandbox', 'sbComponent') + '/' + type && type !== 'component-swap') res.labelMismatch.push(n.name);
    const ov = n.overrides || [];
    let fields = 0;
    const IGNORE = new Set(['name', 'pluginData', 'reactions', 'exportSettings', 'targetAspectRatio']);
    for (const o of ov) for (const f of o.overriddenFields) { res.fieldsSeen[f] = (res.fieldsSeen[f] || 0) + 1; if (!IGNORE.has(f)) fields++; }
    if (fields === 0) { res.noOverride.push([n.id, n.name]); res.noOverrideByType[type] = (res.noOverrideByType[type] || 0) + 1; }
  }
  // instances without sbType that are not nested inside another instance = stray instances (should be none)
  const inInstance = (n) => { let p = n.parent; while (p && p.type !== 'PAGE') { if (p.type === 'INSTANCE') return true; p = p.parent; } return false; };
  const strayTop = all.filter((n) => !n.getSharedPluginData('sandbox', 'sbType') && !inInstance(n));
  res.pages[pn].stray = strayTop.map((n) => [n.id, n.name]).slice(0, 20);
  res.pages[pn].strayCount = strayTop.length;
}
res.components = [...compSet];
// overlaps: siblings inside every frame on the new pages
function rect(n) { const b = n.absoluteBoundingBox; return b ? [b.x, b.y, b.x + b.width, b.y + b.height] : null; }
for (const pn of NEW) {
  const page = figma.root.children.find((p) => p.name === pn);
  const frames = [];
  (function walk(n) { for (const c of n.children || []) { if (c.type === 'INSTANCE') continue; if (c.type === 'FRAME' && c.children.length > 1) frames.push(c); if ('children' in c) walk(c); } })(page);
  let checkedFrames = 0;
  for (const f of [page, ...frames]) {
    if (f.type === 'INSTANCE') continue;
    const kids = f.children.filter((c) => c.visible).map((c) => [c, rect(c)]).filter((x) => x[1]);
    kids.sort((a, b) => a[1][0] - b[1][0]);
    checkedFrames++;
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      if (kids[j][1][0] >= kids[i][1][2] - 0.5) break;
      const a = kids[i][1], b = kids[j][1];
      const ix = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), iy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
      if (ix > 0.5 && iy > 0.5) res.overlaps.push([pn, f.name, kids[i][0].name, kids[j][0].name]);
    }
  }
  res.pages[pn] = res.pages[pn] || {}; res.pages[pn].framesChecked = checkedFrames;
}
res.overlapCount = res.overlaps.length; res.overlaps = res.overlaps.slice(0, 30);
res.noOverrideCount = res.noOverride.length; res.noOverride = res.noOverride.slice(0, 40);
res.detachedCount = res.detached.length;
return JSON.stringify(res);
