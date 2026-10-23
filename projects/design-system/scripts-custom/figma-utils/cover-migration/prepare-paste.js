// Open the cover page (create it when the file has none) and clear the selection, so the next paste lands on it.
// A FigJam board without a cover page gets one as well: the cover never goes onto a page with content.
// Scope: only the cover page is read or changed. Other pages of the file are never touched.
// ARGS: { key }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const findCoverPage = async () => {
    let pg = figma.root.children.find(p => /cover/i.test(p.name));
    if (!pg && figma.editorType === 'figjam') {
      for (const p of figma.root.children) { await p.loadAsync(); if (p.children.some(c => c.name === 'file_thumbnail')) { pg = p; break; } }
    }
    if (pg) await pg.loadAsync();
    return pg || null;
  };
  let pg = await findCoverPage();
  let created = false;
  if (!pg) {
    try { pg = figma.createPage(); pg.name = '🎬 Cover'; figma.root.insertChild(0, pg); created = true; }
    catch (e) { return JSON.stringify({ stop: 'no cover page, and it cannot be created here: ' + String(e.message || e) }); }
  }
  await figma.setCurrentPageAsync(pg); figma.currentPage.selection = [];
  return JSON.stringify({ page: pg.name, created, children: pg.children.length });
})()
