// ARGS = { changes: [...] } from selftest-change.js
const out = [];
for (const c of ARGS.changes) {
  const n = await figma.getNodeByIdAsync(c.id);
  if (c.kind === 'text-prop') n.setProperties({ [c.key]: c.old });
  else if (c.kind === 'boolean') n.setProperties({ [c.key]: c.old });
  else if (c.kind === 'hidden') { const h = await figma.getNodeByIdAsync(c.layerId); h.visible = false; }
  else if (c.kind === 'root-fill') { n.fills = JSON.parse(c.old); }
  else if (c.kind === 'resize') { n.resize(c.w, c.h); }
  out.push(c.id);
}
return JSON.stringify(out);
