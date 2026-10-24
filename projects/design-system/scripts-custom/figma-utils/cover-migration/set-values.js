// Change fields of the cover that is already in the file, and show or hide the rows that depend on them.
// Only the fields named in `values` are changed. The cover is the instance inside the frame or section "file_thumbnail".
// Rows follow the values: version, modified and tickets rows are visible only when they have a value.
// The git row follows its own switch unless `git` is given: an empty git text keeps the template placeholder, so the text alone says nothing. To hide the row pass git ''.
// Scope: only the cover page is read or changed. Other pages of the file are never touched.
// ARGS: { key, values: { distribution?, product?, doc?, tickets?, git?, purpose?, version?, modified?, owner?, docs?, status? }, dryRun? }
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
  if (!pg) return JSON.stringify({ error: 'no cover page' });
  const thumb = pg.children.find(c => c.name === 'file_thumbnail');
  if (!thumb) return JSON.stringify({ error: 'no file_thumbnail on the cover page' });
  const inst = thumb.findAll(n => n.type === 'INSTANCE').find(c => c.name === '~figma_only/thumbnail') || thumb.findOne(n => n.type === 'INSTANCE');
  if (!inst) return JSON.stringify({ error: 'no cover instance in file_thumbnail' });
  const gather = () => { const all = []; const collect = i => { all.push(i); for (const e of i.exposedInstances) collect(e); }; collect(inst); return all; };
  const prop = (i, name) => Object.keys(i.componentProperties).find(x => x.split('#')[0] === name);
  const read = name => { for (const i of gather()) { const k = prop(i, name); if (k) return i.componentProperties[k].value; } return null; };
  const set = (name, value, log) => { for (const i of gather()) { const k = prop(i, name); if (k) { i.setProperties({ [k]: value }); log.push(name + ' = ' + JSON.stringify(value)); return; } } log.push('NOT FOUND ' + name); };
  const v = A.values || {};
  const before = { distribution: read('distribution'), doc: read('document_name'), version: read('version'), modified: read('modified_on'), owner: read('ownership'), purpose: read('purpose'), tickets: read('tickets'), git: read('git'), docs: read('documentation'), status: read('file_status') || read('lifecycle_status') };
  if (A.dryRun) return JSON.stringify({ dryRun: true, before, wanted: v });
  const log = [];
  if (v.distribution !== undefined) set('distribution', v.distribution, log);
  const dist = v.distribution !== undefined ? v.distribution : read('distribution');
  const internal = dist === 'internal';
  if (v.product !== undefined) set('product', v.product, log);
  if (v.doc !== undefined) set('document_name', v.doc, log);
  if (v.purpose !== undefined) set('purpose', v.purpose, log);
  if (v.version !== undefined) set('version', v.version, log);
  if (v.modified !== undefined) set('modified_on', v.modified, log);
  if (v.owner !== undefined) set('ownership', v.owner, log);
  const hasProp = name => gather().some(i => Object.keys(i.componentProperties).some(k => k.split('#')[0] === name));
  if (v.tickets !== undefined && internal) set('tickets', v.tickets, log);
  if (v.git !== undefined && internal) {
    if (hasProp('git')) { set('git', v.git, log); set('show_git', !!v.git, log); } else log.push('NOT FOUND git (publish the library and update it in this file)');
  }
  if (v.docs !== undefined && !internal) set('documentation', v.docs, log);
  if (v.status !== undefined) set(internal ? 'file_status' : 'lifecycle_status', v.status, log);
  const rows = names => thumb.findAll(x => names.includes(x.name));
  const vis = (names, on) => rows(names).forEach(h => { h.visible = on; });
  const now = { version: read('version'), modified: read('modified_on'), owner: read('ownership'), tickets: internal ? (v.tickets !== undefined ? v.tickets : (read('tickets') === 'ABC-123' ? '' : read('tickets'))) : '', git: internal ? (v.git !== undefined ? v.git : (read('show_git') ? read('git') : '')) : '' };
  // the purpose row and the second title line have a switch each; an older library version has only the layers
  if (hasProp('show_purpose')) set('show_purpose', !!read('purpose'), log); else { const purposeRow = thumb.findOne(n => n.name === 'Purpose'); if (purposeRow) purposeRow.visible = !!read('purpose'); }
  // an empty second title line would still take the height of one line: hide its row
  if (hasProp('show_document_name')) set('show_document_name', !!read('document_name'), log); else thumb.findAll(n => n.name === 'Line Button' || n.name === 'Title line 2').forEach(n => { n.visible = !!read('document_name'); });
  if (internal && hasProp('show_version')) {
    // every row has its own switch: an empty value switches the row off (also repairs the rows after a library update)
    set('show_version', !!now.version, log); set('show_modified', !!now.modified, log); set('show_owner', !!now.owner, log);
    if (hasProp('show_tickets')) set('show_tickets', !!now.tickets, log);
    if (hasProp('show_git')) set('show_git', !!now.git, log);
    const c1 = !!(now.version || now.modified || now.owner), c2 = !!(now.tickets || now.git);
    vis(['Info column 1'], c1); vis(['Info column 2'], c2); vis(['Separator'], c1 && c2);
  } else {
    vis(['Version label', 'Version value'], !!now.version);
    vis(['Modified label', 'Modified value'], !!now.modified);
    vis(['Info column 1', 'Separator'], !!(now.version || now.modified));
    if (internal) { if (hasProp('show_tickets')) set('show_tickets', !!now.tickets, log); else vis(['Tickets label', 'Tickets value'], !!now.tickets); }
  }
  let thumbErr = null;
  try { await figma.setFileThumbnailNodeAsync(null); await new Promise(r => setTimeout(r, 800)); await figma.setFileThumbnailNodeAsync(thumb); await new Promise(r => setTimeout(r, 1000)); } catch (e) { thumbErr = String(e.message || e); }
  let img = null;
  try { img = figma.base64Encode(await thumb.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.5 } })); } catch (e) { log.push('export failed: ' + (e.message || e)); }
  return JSON.stringify({ before, log, thumbErr, img });
})()
