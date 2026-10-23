// Read-only report of the cover page of the open file: frames, their texts, the file thumbnail.
// Run first on every file, before anything is changed. Works in Figma design files and in FigJam boards.
// Scope: only the cover page is read or changed. Other pages of the file are never touched.
// ARGS: { key }   key = file key (for a branch: the branch key). Aborts when another file is open.
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
  const pg = await findCoverPage();
  if (!pg) return JSON.stringify({ key: figma.fileKey, name: figma.root.name, editor: figma.editorType, coverPage: null, pages: figma.root.children.map(p => p.name), thumbnail: null, frames: [] });
  const pageOf = n => { let p = n; while (p && p.type !== 'PAGE') p = p.parent; return p ? p.name : null; };
  let cur = null;
  try { cur = await figma.getFileThumbnailNodeAsync(); } catch (e) { cur = null; }
  const frames = [];
  for (const c of pg.children) {
    if (c.type === 'SECTION' && figma.editorType === 'figjam' && c.name !== 'file_thumbnail' && !(cur && c.id === cur.id)) continue;
    const texts = c.findAll ? c.findAll(n => n.type === 'TEXT').map(t => t.name + '=' + t.characters.slice(0, 80).replace(/\n/g, '|') + (t.hyperlink ? ' [link]' : '')) : [];
    let main = null;
    if (c.type === 'INSTANCE') { const m = await c.getMainComponentAsync(); main = m ? m.name + ' remote=' + m.remote : null; }
    frames.push({ type: c.type, name: c.name, x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height), main, texts: texts.slice(0, 16) });
  }
  return JSON.stringify({
    key: figma.fileKey, name: figma.root.name, editor: figma.editorType, coverPage: pg.name, pages: figma.root.children.map(p => p.name),
    thumbnail: cur ? { id: cur.id, name: cur.name, page: pageOf(cur), w: Math.round(cur.width), h: Math.round(cur.height) } : null,
    frames,
  });
})()
