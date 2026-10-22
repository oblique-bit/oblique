// Open the cover page (create it when the file has none) and clear the selection, so the next paste lands on it.
// In FigJam the first page is used. ARGS: { key }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  await figma.loadAllPagesAsync();
  let pg = figma.root.children.find(p => /cover/i.test(p.name));
  let created = false;
  if (!pg && figma.editorType === 'figjam') pg = figma.root.children[0];
  if (!pg) { pg = figma.createPage(); pg.name = '🎬 Cover'; figma.root.insertChild(0, pg); created = true; }
  await pg.loadAsync(); await figma.setCurrentPageAsync(pg); figma.currentPage.selection = [];
  return JSON.stringify({ page: pg.name, created, children: pg.children.length });
})()
