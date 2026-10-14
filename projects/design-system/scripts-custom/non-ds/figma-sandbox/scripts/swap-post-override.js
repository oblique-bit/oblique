// ARGS = { ids }  component-swap cases that lost every override at the swap get one override AFTER the swap
const out = [];
for (const id of ARGS.ids) {
  const n = await figma.getNodeByIdAsync(id);
  const w = n.width, h = n.height;
  n.resize(Math.round(w + 24), Math.round(h));
  n.setSharedPluginData('sandbox', 'sbPostOverride', 'resize');
  out.push([id, n.name, Math.round(w), Math.round(n.width)]);
}
return JSON.stringify(out);
