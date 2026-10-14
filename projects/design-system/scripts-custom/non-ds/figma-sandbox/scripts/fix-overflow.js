// content that renders beyond the instance box (shadows, overflowing menus): give the cell padding of that size
const out = { cells: 0, padded: 0 };
for (const pn of ['Components', 'Swaps']) {
  const page = figma.root.children.find((p) => p.name === pn); await page.loadAsync();
  await figma.setCurrentPageAsync(page);
  const cells = page.findAll((n) => n.type === 'FRAME' && n.name.startsWith('cell / '));
  for (const c of cells) {
    out.cells++;
    const inst = c.children.find((x) => x.type === 'INSTANCE');
    if (!inst || !inst.absoluteRenderBounds) continue;
    const ab = inst.absoluteBoundingBox, rb = inst.absoluteRenderBounds;
    const l = Math.max(0, ab.x - rb.x), t = Math.max(0, ab.y - rb.y), r = Math.max(0, rb.x + rb.width - (ab.x + ab.width)), b = Math.max(0, rb.y + rb.height - (ab.y + ab.height));
    if (l + t + r + b < 1) continue;
    c.itemSpacing = Math.max(20, Math.ceil(t) + 10);
    c.paddingLeft = Math.ceil(10 + l); c.paddingTop = Math.ceil(10 + t); c.paddingRight = Math.ceil(10 + r); c.paddingBottom = Math.ceil(10 + b);
    out.padded++;
  }
}
return JSON.stringify(out);
