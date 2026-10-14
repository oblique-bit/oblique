// ARGS = { pageId, ids: [nodeId, ...] }
const page = figma.root.children.find((p) => p.id === ARGS.pageId);
await figma.setCurrentPageAsync(page);
const nodes = [];
for (const id of ARGS.ids) { const n = await figma.getNodeByIdAsync(id); if (n) nodes.push(n); }
figma.currentPage.selection = nodes;
return JSON.stringify({ selected: figma.currentPage.selection.map((n) => [n.id, n.type, n.name]) });
