// Fixtures whose instance is set to FILL in its parent collapse inside the hug cells (height 1 px).
// Make them FIXED with the size of their main component (+24 width for the resize type).
const page = figma.root.children.find((p) => p.name === 'Components');
await page.loadAsync();
await figma.setCurrentPageAsync(page);
const fx = page.findAllWithCriteria({ types: ['INSTANCE'] }).filter((n) => n.getSharedPluginData('sandbox', 'sbType'));
const fixed = [], skipped = [];
for (const n of fx) {
  const vf = n.layoutSizingVertical === 'FILL', hf = n.layoutSizingHorizontal === 'FILL';
  const tiny = n.height < 4;
  if (!vf && !hf && !tiny) continue;
  const mc = await n.getMainComponentAsync();
  const type = n.getSharedPluginData('sandbox', 'sbType');
  const w = Math.round(mc.width + (type === 'resize' ? 24 : 0)), h = Math.round(mc.height);
  try {
    if (vf) n.layoutSizingVertical = 'FIXED';
    if (hf) n.layoutSizingHorizontal = 'FIXED';
    n.resize(w, h);
    fixed.push([n.id, n.name, vf, hf, Math.round(n.width), Math.round(n.height)]);
  } catch (e) { skipped.push([n.id, n.name, String(e).slice(0, 100)]); }
}
return JSON.stringify({ fixed: fixed.length, skipped, sample: fixed.slice(0, 8) });
