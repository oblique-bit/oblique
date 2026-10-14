// more space between cells (shadows and overflowing content reach 12-16 px beyond the box), wider rows for wide fixtures
const out = { cells: 0, rows: 0, widened: [] };
for (const pn of ['Components', 'Swaps']) {
  const page = figma.root.children.find((p) => p.name === pn); await page.loadAsync();
  await figma.setCurrentPageAsync(page);
  const frames = [];
  (function walk(n) { for (const c of n.children || []) { if (c.type === 'INSTANCE') continue; if (c.type === 'FRAME') frames.push(c); if ('children' in c) walk(c); } })(page);
  for (const f of frames) {
    if (f.name.startsWith('cell / ')) { f.itemSpacing = 20; f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = 10; out.cells++; }
  }
  for (const f of frames) {
    if (f.name === 'row' || f.name === 'icons row' || f.name === 'swap row') {
      f.itemSpacing = 40; f.counterAxisSpacing = 40; out.rows++;
      const maxW = Math.max(0, ...f.children.map((c) => c.width));
      if (maxW > f.width - 4) { f.resize(Math.ceil(maxW + 8), f.height); out.widened.push([f.parent.name, Math.round(maxW)]); }
    }
  }
}
return JSON.stringify(out);
