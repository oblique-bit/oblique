// FigJam variant of fill-cover.js: the pasted template instance goes into a Section "file_thumbnail"
// (1920x1080, white), which is set as the board thumbnail. FigJam cannot hold frames, and a paste can land
// inside another section, so the page is found by walking up from the instance.
// The lifecycle status badge is made a separate instance (see standalone-badge.js), because the badge nested
// in the cover is hard to select in FigJam.
// An existing section "file_thumbnail" is replaced and keeps its place. Old cover frames on the page
// ("_helper / thumbnail...") are kept, renamed "<name>_depr" and moved below the new section; the new
// section takes the place of the current thumbnail frame.
// Scope: only the cover page is read or changed. Other pages of the file are never touched.
// ARGS: { key, instanceId, values: { distribution, product, doc, tickets, purpose, version, modified, owner, docs, status } }
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
  const cover = await findCoverPage();
  if (!cover) return JSON.stringify({ stop: 'no cover page, nothing changed' });
  const inst = await figma.getNodeByIdAsync(A.instanceId);
  if (!inst || inst.type !== 'INSTANCE') return JSON.stringify({ error: 'instance missing', instanceId: A.instanceId });
  let pg = inst; while (pg && pg.type !== 'PAGE') pg = pg.parent;
  if (pg !== cover) return JSON.stringify({ stop: 'the pasted instance is on the page "' + (pg ? pg.name : '?') + '", not on the cover page, nothing changed' });
  await figma.setCurrentPageAsync(pg);
  const log = [];
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
  if (v.distribution) set('distribution', v.distribution);
  set('product', v.product); set('document_name', v.doc); set('purpose', v.purpose || ''); set('version', v.version || '');
  set('modified_on', v.modified || ''); set('ownership', v.owner);
  if (internal) { set('tickets', v.tickets || ''); set('file_status', v.status); }
  else { set('documentation', v.docs); set('lifecycle_status', v.status); }
  const hide = names => { const hit = inst.findAll(x => names.includes(x.name)); hit.forEach(h => { h.visible = false; }); return hit.length; };
  if (!v.version) log.push('hid version ' + hide(['Version label', 'Version value']));
  if (!v.modified) log.push('hid modified ' + hide(['Modified label', 'Modified value']));
  if (!v.version && !v.modified) log.push('hid column 1 ' + hide(['Info column 1', 'Separator']));
  if (internal && !v.tickets) log.push('hid tickets ' + hide(['Tickets label', 'Tickets value']));
  const row = inst.findOne(n => n.name === 'Purpose'); if (row) row.visible = !!v.purpose;
  const old = pg.children.find(c => c.type === 'SECTION' && c.name === 'file_thumbnail');
  const curThumb = await figma.getFileThumbnailNodeAsync();
  const olds = pg.children.filter(c => c !== old && c !== inst && (c.type === 'FRAME' || c.type === 'SECTION') && !/_depr$/.test(c.name) && (/^_helper \/ thumbnail/.test(c.name) || (curThumb && c.id === curThumb.id && c.name !== 'file_thumbnail')));
  const mainOld = olds.find(o => curThumb && o.id === curThumb.id) || olds[0];
  let x = inst.x, y = inst.y;
  if (old) { x = old.x; y = old.y; old.remove(); log.push('replaced the earlier file_thumbnail section'); }
  else if (mainOld) { x = mainOld.x; y = mainOld.y; }
  else { const others = pg.children.filter(c => c !== inst); if (others.length) { x = Math.min(...others.map(c => c.x)) - 2200; y = Math.min(...others.map(c => c.y)); } }
  const sec = figma.createSection(); sec.name = 'file_thumbnail'; sec.resizeWithoutConstraints(1920, 1080); sec.x = x; sec.y = y;
  sec.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  sec.appendChild(inst); inst.x = 0; inst.y = 0;
  const nestedBadge = inst.findOne(n => n.type === 'INSTANCE' && n.name === 'status');
  if (nestedBadge) {
    const bm = await nestedBadge.getMainComponentAsync();
    const ba = nestedBadge.absoluteBoundingBox, bs = sec.absoluteBoundingBox;
    const badge = bm.createInstance(); badge.name = 'lifecycle_status'; sec.appendChild(badge);
    badge.x = (ba.x - bs.x) + ba.width - badge.width; badge.y = (ba.y - bs.y) + (ba.height - badge.height) / 2;
    nestedBadge.visible = false; log.push('separate status badge: ' + bm.name);
  }
  for (const o of olds) { o.name = o.name.replace(/^_helper \/ /, '') + '_depr'; o.x = x + (o === mainOld ? 0 : 1920 + 120); o.y = y + 1080 + 400; }
  let thumbErr = null, thumb = null;
  try {
    await figma.setFileThumbnailNodeAsync(null); await new Promise(r => setTimeout(r, 800));
    await figma.setFileThumbnailNodeAsync(sec); await new Promise(r => setTimeout(r, 1500));
    const cur = await figma.getFileThumbnailNodeAsync(); thumb = cur ? cur.name : null;
  } catch (e) { thumbErr = String(e.message || e); }
  let img = null;
  try { img = figma.base64Encode(await sec.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.3 } })); } catch (e) { log.push('export failed: ' + (e.message || e)); }
  return JSON.stringify({ log, page: pg.name, thumbnail: thumb, thumbErr, children: pg.children.filter(c => c.type === 'SECTION' || c.type === 'FRAME').map(c => c.type + ' ' + c.name + ' @' + Math.round(c.x) + ',' + Math.round(c.y)), img });
})()
