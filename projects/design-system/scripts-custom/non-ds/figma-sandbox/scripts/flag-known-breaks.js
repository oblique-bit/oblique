// ARGS = { variant: [component names], swaps: [fixture names 'swap/from/to'], summary }
for (const f of [{ family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Bold' }]) await figma.loadFontAsync(f);
const page = figma.root.children.find((p) => p.name === 'Known breaks'); await page.loadAsync();
await figma.setCurrentPageAsync(page);
const root = page.children.find((c) => c.name === 'Sandbox / Known breaks');
let n1 = 0, n2 = 0;
const day = new Date().toISOString().slice(0, 10);
for (const row of root.children) {
  if (!row.name.startsWith('row / ') || row.children.length < 4) continue;
  const key = row.name.slice(6);
  const last = row.children[3];
  if (ARGS.variant.includes(key)) { last.characters = 'BREAK built ' + day + ': the override set before the variant change was reset (a resize was added after the change)'; n1++; }
  else if (ARGS.swaps.includes(key.replace(/^swap /, 'swap/').replace(' -> ', '/'))) { last.characters = 'BREAK built ' + day + ': every override was lost at the swap (a resize was added after the swap)'; n2++; }
}
if (!root.children.some((c) => c.name === 'summary')) {
  const t = figma.createText(); t.fontName = { family: 'Inter', style: 'Regular' }; t.fontSize = 13; t.characters = ARGS.summary; t.name = 'summary';
  t.textAutoResize = 'HEIGHT'; t.resize(1400, t.height); t.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  root.insertChild(1, t);
}
return JSON.stringify({ variantRows: n1, swapRows: n2 });
