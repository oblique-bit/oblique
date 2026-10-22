// Open the cover page and clear the selection, so the next paste lands on it.
// ARGS: { key }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const pg = figma.root.children.find(p => /cover/i.test(p.name));
  if (!pg) return JSON.stringify({ error: 'no cover page' });
  await pg.loadAsync(); await figma.setCurrentPageAsync(pg);
  figma.currentPage.selection = [];
  return JSON.stringify({ page: pg.name, children: pg.children.length });
})()
