// Read-only snapshot of the cover in the open file: every property of the cover instance and its exposed nested
// instances, which rows are visible, the visible texts and a small picture. Take it before a library update and again
// after it, then compare: the values must be the same.
// Scope: only the cover page is read. ARGS: { key }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const pg = figma.root.children.find(p => /cover/i.test(p.name)); await pg.loadAsync();
  const thumb = pg.children.find(c => c.name === 'file_thumbnail');
  if (!thumb) return JSON.stringify({ error: 'no file_thumbnail' });
  const inst = thumb.findAll(n => n.type === 'INSTANCE').find(c => c.name === '~figma_only/thumbnail') || thumb.findOne(n => n.type === 'INSTANCE');
  const all = []; const collect = i => { all.push(i); for (const e of i.exposedInstances) collect(e); }; collect(inst);
  const props = {}; for (const i of all) for (const [k, v] of Object.entries(i.componentProperties)) props[k.split('#')[0]] = v.value;
  const vis = {}; for (const n of ['Version label', 'Modified label', 'Tickets label', 'Info column 1', 'Git label', 'Git value', 'Documentation label', 'Docs']) { const h = thumb.findAll(x => x.name === n); if (h.length) vis[n] = h.map(x => x.visible); }
  const texts = thumb.findAll(n => n.type === 'TEXT' && n.visible).map(t => t.name + '=' + t.characters.slice(0, 50));
  return JSON.stringify({ name: figma.root.name, props, vis, texts, img: figma.base64Encode(await thumb.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.4 } })) });
})()
