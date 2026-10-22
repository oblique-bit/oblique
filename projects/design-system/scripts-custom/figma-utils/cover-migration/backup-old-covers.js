// Export the old cover frames as PNG and collect their texts, before they are removed.
// Save the result with: node save-images.mjs <result.json> <backup-dir> <prefix>
// ARGS: { key, namePattern }   namePattern = regular expression for the frame names, e.g. "^_helper / thumbnail"
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const pg = figma.root.children.find(p => /cover/i.test(p.name)); await pg.loadAsync(); await figma.setCurrentPageAsync(pg);
  const re = new RegExp(A.namePattern);
  const olds = pg.children.filter(c => c.type === 'FRAME' && re.test(c.name));
  const imgs = {}, texts = {};
  for (const f of olds) {
    imgs[f.name] = figma.base64Encode(await f.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.5 } }));
    texts[f.name] = f.findAll(n => n.type === 'TEXT').map(t => t.name + ' = ' + t.characters + (t.hyperlink ? ' [' + (t.hyperlink.value || '') + ']' : ''));
  }
  return JSON.stringify({ stage: 'backup', count: olds.length, imgs, texts });
})()
