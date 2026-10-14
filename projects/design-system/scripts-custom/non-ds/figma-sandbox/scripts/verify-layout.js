// read only: layout problems the bounding-box check can miss: collapsed fixtures, fixtures outside the root frame, sibling overlaps by RENDER bounds
const res = { tiny: [], outside: [], renderOverlaps: [], overlapsByBox: 0, containers: 0 };
const rect = (b) => b ? [b.x, b.y, b.x + b.width, b.y + b.height] : null;
for (const pn of ['Components', 'Swaps', 'Known breaks']) {
  const page = figma.root.children.find((p) => p.name === pn); await page.loadAsync();
  const roots = page.children.filter((c) => c.type === 'FRAME');
  const frames = [];
  (function walk(n) { for (const c of n.children || []) { if (c.type === 'INSTANCE') continue; if (c.type === 'FRAME' && c.children.length > 1) frames.push(c); if ('children' in c) walk(c); } })(page);
  for (const f of [page, ...frames]) {
    res.containers++;
    const kids = f.children.filter((c) => c.visible).map((c) => [c, rect(c.absoluteRenderBounds)]).filter((x) => x[1]);
    kids.sort((a, b) => a[1][0] - b[1][0]);
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      if (kids[j][1][0] >= kids[i][1][2] - 0.5) break;
      const a = kids[i][1], b = kids[j][1];
      const ix = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), iy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
      if (ix > 1 && iy > 1) res.renderOverlaps.push([pn, f.name.slice(0, 40), kids[i][0].name.slice(0, 40), kids[j][0].name.slice(0, 40), Math.round(ix), Math.round(iy)]);
    }
  }
  if (pn !== 'Known breaks') {
    for (const n of page.findAllWithCriteria({ types: ['INSTANCE'] }).filter((x) => x.getSharedPluginData('sandbox', 'sbType'))) {
      if (n.width < 4 || n.height < 4) res.tiny.push([n.id, n.name, Math.round(n.width), Math.round(n.height)]);
      const root = roots[0], rb = root.absoluteBoundingBox, nb = n.absoluteBoundingBox;
      if (nb.x < rb.x - 1 || nb.y < rb.y - 1 || nb.x + nb.width > rb.x + rb.width + 1 || nb.y + nb.height > rb.y + rb.height + 1) res.outside.push([n.id, n.name, Math.round(nb.width), Math.round(nb.height)]);
    }
  }
}
res.tinyCount = res.tiny.length; res.outsideCount = res.outside.length; res.renderOverlapCount = res.renderOverlaps.length;
res.tiny = res.tiny.slice(0, 15); res.outside = res.outside.slice(0, 15); res.renderOverlaps = res.renderOverlaps.slice(0, 25);
return JSON.stringify(res);
