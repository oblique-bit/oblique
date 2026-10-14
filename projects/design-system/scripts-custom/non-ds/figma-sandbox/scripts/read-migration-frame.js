const n = await figma.getNodeByIdAsync('26518:7149');
if (!n) return JSON.stringify({ missing: true });
const insts = n.findAll((x) => x.type === 'INSTANCE');
const rows = [];
for (const i of insts) {
  const mc = await i.getMainComponentAsync();
  rows.push({ name: i.name, main: mc ? mc.name : null, mainKey: mc ? mc.key : null, parentSet: mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : null });
}
const texts = n.findAll((x) => x.type === 'TEXT').map((t) => t.characters).filter((c) => c.length > 0).slice(0, 80);
return JSON.stringify({ name: n.name, type: n.type, w: n.width, h: n.height, instances: rows.length, rows: rows.slice(0, 120), texts });
