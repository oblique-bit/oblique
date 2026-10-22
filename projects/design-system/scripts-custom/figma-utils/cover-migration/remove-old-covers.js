// Remove the old cover frames, move the new frame to the freed place and set it as the file thumbnail.
// Run only after backup-old-covers.js has been saved. Component and instance nodes are never removed:
// only plain FRAME nodes whose name matches namePattern.
// ARGS: { key, namePattern, keepName: "file_thumbnail", move: { x, y } }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const pg = figma.root.children.find(p => /cover/i.test(p.name)); await pg.loadAsync(); await figma.setCurrentPageAsync(pg);
  const keep = pg.children.find(c => c.type === 'FRAME' && c.name === A.keepName);
  if (!keep) return JSON.stringify({ stop: 'new frame "' + A.keepName + '" is missing, nothing removed' });
  const re = new RegExp(A.namePattern);
  const log = [];
  for (const f of pg.children.filter(c => c.type === 'FRAME' && c !== keep && re.test(c.name))) { log.push('removed ' + f.name); f.remove(); }
  keep.x = A.move.x; keep.y = A.move.y;
  let thumb = null, err = null;
  try {
    await figma.setFileThumbnailNodeAsync(keep);
    await new Promise(r => setTimeout(r, 1500));
    const cur = await figma.getFileThumbnailNodeAsync(); thumb = cur ? cur.name : null;
  } catch (e) { err = String(e.message || e); }
  return JSON.stringify({ log, thumbnail: thumb, error: err, children: pg.children.map(c => c.type + ' ' + c.name + ' @' + Math.round(c.x) + ',' + Math.round(c.y) + ' ' + Math.round(c.width) + 'x' + Math.round(c.height)) });
})()
