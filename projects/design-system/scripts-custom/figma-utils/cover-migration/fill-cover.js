// Fill the pasted cover template instance, wrap it in a 1920x1080 frame and return a preview.
// The old cover frames are NOT touched here (see backup-old-covers.js and remove-old-covers.js).
//
// ARGS: {
//   key, instanceId,
//   values: { product, doc, purpose, version, modified, owner, docs, status },
//   frame:  { name: "file_thumbnail", x, y }     // put it beside the old cover first
// }
// Text values are set through the component properties of the template. Writing rules used so far:
//   product  "Oblique <release number>"      version  no letter V, e.g. "16.0.0-F1.3"
//   modified "Month YYYY"                    purpose  empty = the Purpose row is hidden
//   status   a lifecycle_status variant value, e.g. "active", "maintenance", "end_of_life"
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const pg = figma.root.children.find(p => /cover/i.test(p.name)); await pg.loadAsync(); await figma.setCurrentPageAsync(pg);
  const inst = await figma.getNodeByIdAsync(A.instanceId);
  if (!inst || inst.type !== 'INSTANCE') return JSON.stringify({ error: 'instance missing', instanceId: A.instanceId });
  const log = [];
  const all = []; const collect = i => { all.push(i); for (const e of i.exposedInstances) collect(e); }; collect(inst);
  const set = (prop, value) => {
    for (const i of all) {
      const k = Object.keys(i.componentProperties).find(x => x.split('#')[0] === prop);
      if (k) { i.setProperties({ [k]: value }); log.push(prop + ' = ' + JSON.stringify(value)); return; }
    }
    log.push('NOT FOUND ' + prop);
  };
  const v = A.values;
  set('product', v.product); set('document_name', v.doc); set('purpose', v.purpose || '');
  set('version', v.version); set('modified_on', v.modified); set('ownership', v.owner);
  set('documentation', v.docs); set('lifecycle_status', v.status);

  const fr = A.frame;
  let ft = pg.children.find(c => c.type === 'FRAME' && c.name === fr.name);
  if (!ft) {
    ft = figma.createFrame(); ft.name = fr.name; ft.resize(1920, 1080); ft.clipsContent = true; ft.fills = [];
    pg.appendChild(ft); ft.x = fr.x; ft.y = fr.y;
    ft.appendChild(inst); inst.x = 0; inst.y = 0; log.push('wrapped in frame ' + fr.name);
  }
  // an empty text still takes a row and pushes the title up: hide the row instead
  const purposeRow = ft.findOne(n => n.name === 'Purpose');
  if (purposeRow) { purposeRow.visible = !!v.purpose; log.push('purpose row visible = ' + purposeRow.visible); }
  await new Promise(r => setTimeout(r, 1500));
  const texts = ft.findAll(n => n.type === 'TEXT').map(t => t.name + '=' + t.characters + (t.hyperlink ? ' [link]' : ''));
  return JSON.stringify({
    log, texts, children: pg.children.map(c => c.type + ' ' + c.name + ' @' + Math.round(c.x) + ',' + Math.round(c.y)),
    img: figma.base64Encode(await ft.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.5 } })),
  });
})()
