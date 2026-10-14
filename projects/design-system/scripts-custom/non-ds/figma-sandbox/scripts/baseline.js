const ORIG = ['25:4457', '0:1', '2981:3336', '6802:126'];
const lines = [];
for (const p of figma.root.children) {
  if (!ORIG.includes(p.id)) continue;
  await p.loadAsync();
  const nodes = p.findAll(() => true);
  for (const n of nodes) {
    let extra = '';
    if (n.type === 'INSTANCE') {
      const mc = await n.getMainComponentAsync();
      extra = (mc ? mc.key : 'nomain') + '|' + JSON.stringify(n.componentProperties);
    } else if (n.type === 'TEXT') extra = n.characters;
    lines.push([p.id, n.id, n.type, n.name, Math.round(n.width * 100) / 100, Math.round(n.height * 100) / 100, n.visible, extra].join('\t'));
  }
}
return lines.join('\n');
