// ARGS = { ids: [...] } -> { id: base64 png }
const out = {};
for (const id of ARGS.ids) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) { out[id] = null; continue; }
  const bytes = await n.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 } });
  out[id] = figma.base64Encode(bytes);
}
return JSON.stringify(out);
