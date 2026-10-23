// FigJam: make the lifecycle status badge a separate instance. The badge nested in the cover is hard to
// select in FigJam (a double click enters its text). The nested badge is hidden and a separate instance of
// the same variant is placed at its position inside the section "file_thumbnail". One click selects it, and
// the small toolbar above it opens the panel "Variants" to change the status.
// Safe to repeat: when the separate badge exists, nothing is changed.
// Scope: only the cover page is read or changed. Other pages of the file are never touched.
// ARGS: { key }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  if (figma.editorType !== 'figjam') return JSON.stringify({ error: 'not a FigJam board' });
  const findCoverPage = async () => {
    let pg = figma.root.children.find(p => /cover/i.test(p.name));
    if (!pg && figma.editorType === 'figjam') {
      for (const p of figma.root.children) { await p.loadAsync(); if (p.children.some(c => c.name === 'file_thumbnail')) { pg = p; break; } }
    }
    if (pg) await pg.loadAsync();
    return pg || null;
  };
  const pg = await findCoverPage();
  if (!pg) return JSON.stringify({ error: 'no cover page' });
  await figma.setCurrentPageAsync(pg);
  const sec = pg.children.find(c => c.type === 'SECTION' && c.name === 'file_thumbnail');
  const inst = sec.findOne(n => n.type === 'INSTANCE' && n.name === '~figma_only/thumbnail');
  if (!inst) return JSON.stringify({ error: 'no cover instance in the section' });
  if (sec.children.some(c => c.type === 'INSTANCE' && c.name === 'lifecycle_status')) return JSON.stringify({ already: true });
  const nested = inst.findOne(n => n.type === 'INSTANCE' && n.name === 'status');
  if (!nested) return JSON.stringify({ error: 'no nested status badge' });
  const main = await nested.getMainComponentAsync();
  const a = nested.absoluteBoundingBox, s = sec.absoluteBoundingBox;
  const badge = main.createInstance(); badge.name = 'lifecycle_status';
  sec.appendChild(badge);
  badge.x = (a.x - s.x) + a.width - badge.width; badge.y = (a.y - s.y) + (a.height - badge.height) / 2;
  nested.visible = false;
  let thumb = null;
  try { await figma.setFileThumbnailNodeAsync(null); await new Promise(r => setTimeout(r, 800)); await figma.setFileThumbnailNodeAsync(sec); await new Promise(r => setTimeout(r, 1200)); const cur = await figma.getFileThumbnailNodeAsync(); thumb = cur ? cur.name : null; } catch (e) { thumb = 'error: ' + (e.message || e); }
  return JSON.stringify({ variant: main.name, at: Math.round(badge.x) + ',' + Math.round(badge.y), size: Math.round(badge.width) + 'x' + Math.round(badge.height), thumbnail: thumb, img: figma.base64Encode(await sec.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.3 } })) });
})()
