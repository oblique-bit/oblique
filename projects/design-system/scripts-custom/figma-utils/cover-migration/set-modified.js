// Set the Modified month on the cover of the open file and show the Modified row again when it was hidden.
// Works in Figma design files and in FigJam boards. Writes only when the current value is one of `overwrite`
// (default: empty or "October 2026", the month an earlier run invented), so a value a person set is never replaced.
// With dryRun true nothing is changed and the answer says what would happen.
// ARGS: { key, modified, overwrite?: string[], dryRun?: boolean }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  await figma.loadAllPagesAsync();
  const overwrite = A.overwrite || ['', 'October 2026'];
  let thumb = null;
  try { thumb = await figma.getFileThumbnailNodeAsync(); } catch (e) { thumb = null; }
  if (!thumb) {
    for (const p of figma.root.children) { const hit = p.findOne(n => n.name === 'file_thumbnail'); if (hit) { thumb = hit; break; } }
  }
  if (!thumb) return JSON.stringify({ error: 'no cover found' });
  const prop = (i, name) => Object.keys(i.componentProperties).find(x => x.split('#')[0] === name);
  const candidates = thumb.findAll(n => n.type === 'INSTANCE');
  let inst = null, all = [];
  for (const c of candidates) {
    const list = []; const collect = i => { list.push(i); for (const e of i.exposedInstances) collect(e); }; collect(c);
    if (list.some(i => prop(i, 'modified_on'))) { inst = c; all = list; break; }
  }
  if (!inst) return JSON.stringify({ error: 'no instance with modified_on', thumb: thumb.name });
  const read = name => { for (const i of all) { const k = prop(i, name); if (k) return i.componentProperties[k].value; } return null; };
  const rows = names => thumb.findAll(x => names.includes(x.name));
  const state = () => ({
    modified: read('modified_on'), version: read('version'),
    visible: Object.fromEntries(['Modified label', 'Modified value', 'Version label', 'Version value', 'Info column 1', 'Separator'].map(n => [n, rows([n]).map(x => x.visible)])),
  });
  const before = state();
  const current = before.modified === null ? '' : before.modified;
  const hiddenNow = rows(['Modified label', 'Modified value']).some(x => !x.visible);
  const log = [];
  if (!overwrite.includes(current)) return JSON.stringify({ skipped: 'current value kept', before, wanted: A.modified });
  if (current === A.modified && !hiddenNow) return JSON.stringify({ unchanged: true, before });
  if (A.dryRun) return JSON.stringify({ dryRun: true, before, wanted: A.modified });
  for (const i of all) {
    const k = prop(i, 'modified_on');
    if (k) { i.setProperties({ [k]: A.modified }); log.push('modified_on = ' + A.modified); break; }
  }
  const show = names => { const hit = rows(names); hit.forEach(h => { h.visible = true; }); return hit.length; };
  log.push('showed modified ' + show(['Modified label', 'Modified value']));
  log.push('showed column 1 ' + show(['Info column 1', 'Separator']));
  if (!before.version) rows(['Version label', 'Version value']).forEach(h => { h.visible = false; });
  let thumbErr = null;
  try { await figma.setFileThumbnailNodeAsync(null); await new Promise(r => setTimeout(r, 800)); await figma.setFileThumbnailNodeAsync(thumb); await new Promise(r => setTimeout(r, 1000)); } catch (e) { thumbErr = String(e.message || e); }
  const texts = thumb.findAll(n => n.type === 'TEXT' && n.visible).map(t => t.name + '=' + t.characters.slice(0, 60).replace(/\n/g, '|'));
  let img = null;
  try { img = figma.base64Encode(await thumb.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.3 } })); } catch (e) { log.push('export failed: ' + (e.message || e)); }
  return JSON.stringify({ written: true, before, after: state(), log, thumbErr, texts, img });
})()
