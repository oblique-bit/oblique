// fixture type "swap" (instance swap property) -> "instance-swap"; swap pair cases get sbType "component-swap"
for (const f of [{ family: 'Roboto Mono', style: 'Regular' }, { family: 'Inter', style: 'Regular' }]) await figma.loadFontAsync(f);
const out = { instanceSwap: 0, componentSwap: 0, labels: 0, knownBreaks: 0 };
const comp = figma.root.children.find((p) => p.name === 'Components'); await comp.loadAsync();
for (const n of comp.findAllWithCriteria({ types: ['INSTANCE'] })) {
  if (n.getSharedPluginData('sandbox', 'sbType') !== 'swap') continue;
  const c = n.getSharedPluginData('sandbox', 'sbComponent');
  const nn = 'fixture/' + c + '/instance-swap';
  n.name = nn; n.setSharedPluginData('sandbox', 'sbType', 'instance-swap'); out.instanceSwap++;
  const cell = n.parent;
  if (cell && cell.name.startsWith('cell / ')) { cell.name = 'cell / ' + nn; const t = cell.children.find((x) => x.type === 'TEXT'); if (t) { t.characters = nn; out.labels++; } }
}
const sw = figma.root.children.find((p) => p.name === 'Swaps'); await sw.loadAsync();
for (const n of sw.findAllWithCriteria({ types: ['INSTANCE'] })) {
  if (n.getSharedPluginData('sandbox', 'sbType') === 'swap') { n.setSharedPluginData('sandbox', 'sbType', 'component-swap'); out.componentSwap++; }
}
const kb = figma.root.children.find((p) => p.name === 'Known breaks'); await kb.loadAsync();
const root = kb.children.find((c) => c.name === 'Sandbox / Known breaks');
for (const row of root.children) {
  if (!row.name.startsWith('row / ') || row.children.length < 2) continue;
  const t = row.children[1];
  if (t.type === 'TEXT' && t.characters.split(', ').includes('swap')) { t.characters = t.characters.split(', ').map((x) => x === 'swap' ? 'instance-swap' : x).join(', '); out.knownBreaks++; }
}
return JSON.stringify(out);
