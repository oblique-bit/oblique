// Select one node (the cover template) so it can be copied with `cdp.mjs <key> key c`.
// Run it in the file that owns the template.
// ARGS: { key, nodeId }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  await figma.loadAllPagesAsync();
  const node = await figma.getNodeByIdAsync(A.nodeId);
  if (!node) return JSON.stringify({ error: 'node not found', nodeId: A.nodeId });
  let p = node; while (p && p.type !== 'PAGE') p = p.parent;
  await figma.setCurrentPageAsync(p);
  figma.currentPage.selection = [node];
  return JSON.stringify({ selected: node.name, page: p.name });
})()
