// ARGS = { name }
const page = figma.root.children.find((p) => p.name === ARGS.name);
await figma.setCurrentPageAsync(page);
figma.currentPage.selection = [];
return JSON.stringify({ page: figma.currentPage.name, children: figma.currentPage.children.length });
