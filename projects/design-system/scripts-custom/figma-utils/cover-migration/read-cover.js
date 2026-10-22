// Read-only report of the cover page of the open file: frames, their texts, the file thumbnail.
// Run first on every file, before anything is changed.
// ARGS: { key }   key = file key (for a branch: the branch key). Aborts when another file is open.
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  await figma.loadAllPagesAsync();
  const pageOf = n => { let p = n; while (p && p.type !== 'PAGE') p = p.parent; return p ? p.name : null; };
  const cur = await figma.getFileThumbnailNodeAsync();
  const pg = figma.root.children.find(p => /cover/i.test(p.name));
  if (!pg) return JSON.stringify({ error: 'no page with "cover" in its name', pages: figma.root.children.map(p => p.name) });
  const frames = [];
  for (const c of pg.children) {
    const texts = c.findAll ? c.findAll(n => n.type === 'TEXT').map(t => t.name + '=' + t.characters.slice(0, 80).replace(/\n/g, '|') + (t.hyperlink ? ' [link]' : '')) : [];
    let main = null;
    if (c.type === 'INSTANCE') { const m = await c.getMainComponentAsync(); main = m ? m.name + ' remote=' + m.remote : null; }
    frames.push({ type: c.type, name: c.name, x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height), main, texts: texts.slice(0, 14) });
  }
  return JSON.stringify({
    key: figma.fileKey, name: figma.root.name, coverPage: pg.name, pages: figma.root.children.map(p => p.name),
    thumbnail: cur ? { id: cur.id, name: cur.name, page: pageOf(cur), w: Math.round(cur.width), h: Math.round(cur.height) } : null,
    frames,
  });
})()
