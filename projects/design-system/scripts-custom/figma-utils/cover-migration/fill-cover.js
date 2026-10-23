// Fill the pasted cover template instance in a Figma design file, wrap it in a 1920x1080 frame and set it
// as the file thumbnail. The old cover frames are kept: renamed "<name>_depr" and moved below the new one
// (backup-old-covers.js and remove-old-covers.js remove them later).
//
// Scope: only the cover page is read or changed. Other pages of the file are never touched.
// ARGS: { key, instanceId, values: { distribution, product, doc, tickets, purpose, version, modified, owner, docs, status } }
// Writing rules: product "Oblique <release number>"; version without the letter V; modified "Mon YYYY" (month with three letters);
// distribution = internal (person as owner, tickets, file_status badge) or external (team as owner, docs, lifecycle_status badge).
// status = a variant of that badge set (external: active, release_candidate, maintenance, end_of_life, deprecated;
// internal: work_in_progress_figma_only, dev_handoff_figma_only, ..., deprecated).
// An empty purpose hides the Purpose row; an empty version or modified hides its row (both: the whole column).
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
  if (!pg) return JSON.stringify({ stop: 'no cover page, nothing changed' });
  await figma.setCurrentPageAsync(pg);
  const inst = await figma.getNodeByIdAsync(A.instanceId);
  if (!inst || inst.type !== 'INSTANCE') return JSON.stringify({ error: 'instance missing', instanceId: A.instanceId });
  let ip = inst; while (ip && ip.type !== 'PAGE') ip = ip.parent;
  if (ip !== pg) return JSON.stringify({ stop: 'the pasted instance is on the page "' + (ip ? ip.name : '?') + '", not on the cover page, nothing changed' });
  const log = [];
  let ft = pg.children.find(c => c.type === 'FRAME' && c.name === 'file_thumbnail');
  const cur = await figma.getFileThumbnailNodeAsync();
  const olds = pg.children.filter(c => c !== ft && c.type === 'FRAME' && !/_depr$/.test(c.name) && (/^_helper \/ thumbnail/.test(c.name) || (cur && c.id === cur.id)));
  const main = olds.find(o => cur && o.id === cur.id) || olds[0];
  const x0 = main ? main.x : 0, y0 = main ? main.y : 0;
  const gather = () => { const all = []; const collect = i => { all.push(i); for (const e of i.exposedInstances) collect(e); }; collect(inst); return all; };
  const set = (prop, value) => {
    for (const i of gather()) {
      const k = Object.keys(i.componentProperties).find(x => x.split('#')[0] === prop);
      if (k) { i.setProperties({ [k]: value }); log.push(prop + ' = ' + JSON.stringify(value)); return; }
    }
    log.push('NOT FOUND ' + prop);
  };
  const v = A.values;
  const internal = v.distribution === 'internal';
  if (v.distribution && !gather().some(i => Object.keys(i.componentProperties).includes('distribution'))) return JSON.stringify({ stop: 'the pasted cover has no property "distribution": the library version in this file is older than the footer variants. Publish the library, update it in this file and paste again. Nothing was filled.' });
  if (v.distribution) set('distribution', v.distribution);
  set('product', v.product); set('document_name', v.doc); set('purpose', v.purpose || '');
  set('version', v.version || ''); set('modified_on', v.modified || ''); set('ownership', v.owner);
  if (internal) { set('tickets', v.tickets || ''); set('file_status', v.status); }
  else { set('documentation', v.docs); set('lifecycle_status', v.status); }
  if (!ft) {
    ft = figma.createFrame(); ft.name = 'file_thumbnail'; ft.resize(1920, 1080); ft.clipsContent = true; ft.fills = [];
    pg.appendChild(ft); ft.x = x0; ft.y = y0; ft.appendChild(inst); inst.x = 0; inst.y = 0; log.push('wrapped in frame file_thumbnail');
  }
  const hide = names => { const hit = ft.findAll(x => names.includes(x.name)); hit.forEach(h => { h.visible = false; }); return hit.length; };
  const row = ft.findOne(n => n.name === 'Purpose'); if (row) row.visible = !!v.purpose;
  if (!v.version) log.push('hid version ' + hide(['Version label', 'Version value']));
  if (!v.modified) log.push('hid modified ' + hide(['Modified label', 'Modified value']));
  if (!v.version && !v.modified) log.push('hid column 1 ' + hide(['Info column 1', 'Separator']));
  if (internal && !v.tickets) log.push('hid tickets ' + hide(['Tickets label', 'Tickets value']));
  const oy = y0 + 1080 + 400;
  for (const o of olds) { o.name = o.name.replace(/^_helper \/ /, '') + '_depr'; o.x = x0 + (o === main ? 0 : 1920 + 120); o.y = oy; }
  let thumbErr = null;
  try { await figma.setFileThumbnailNodeAsync(null); await new Promise(r => setTimeout(r, 800)); } catch (e) { log.push('restore: ' + (e.message || e)); }
  try { await figma.setFileThumbnailNodeAsync(ft); } catch (e) { thumbErr = String(e.message || e); }
  await new Promise(r => setTimeout(r, 1500));
  const now = await figma.getFileThumbnailNodeAsync();
  const texts = ft.findAll(n => n.type === 'TEXT').map(t => t.name + '=' + t.characters + (t.hyperlink ? ' [link]' : ''));
  return JSON.stringify({
    log, texts, thumbnail: now ? now.name : null, thumbErr,
    children: pg.children.map(c => c.type + ' ' + c.name + ' @' + Math.round(c.x) + ',' + Math.round(c.y)),
    img: figma.base64Encode(await ft.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.5 } })),
  });
})()
