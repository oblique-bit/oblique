// ARGS = { items: [{ nodeId, name, group, defs }], swapSources: [nodeId, ...] }
// For each staged instance: put it into a family frame on the page "Components", clone it once per
// supported override type, apply ONE override type per instance (the staged instance itself is the first one).
// Marks done items with plugin data so the script can run again.
const page = figma.root.children.find((p) => p.name === 'Components');
await figma.setCurrentPageAsync(page);
const FONTS = [{ family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Bold' }, { family: 'Roboto Mono', style: 'Regular' }];
for (const f of FONTS) { try { await figma.loadFontAsync(f); } catch (e) {} }
const labelFont = { family: 'Roboto Mono', style: 'Regular' };

function findOrMake(parent, name, make) {
  let n = parent.children.find((c) => c.name === name);
  if (!n) { n = make(); n.name = name; parent.appendChild(n); }
  return n;
}
function autoFrame(dir) {
  const f = figma.createFrame();
  f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
  f.fills = []; f.clipsContent = false;
  return f;
}
function text(str, size, bold) {
  const t = figma.createText();
  t.fontName = bold ? { family: 'Inter', style: 'Bold' } : labelFont;
  t.fontSize = size; t.characters = str;
  t.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  return t;
}
let root = page.children.find((c) => c.name === 'Sandbox / Components');
if (!root) {
  root = autoFrame('VERTICAL'); root.name = 'Sandbox / Components'; root.itemSpacing = 120; root.paddingTop = root.paddingBottom = root.paddingLeft = root.paddingRight = 40;
  root.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  page.appendChild(root); root.x = 0; root.y = 0;
}
function group(name) {
  return findOrMake(root, 'group / ' + name, () => {
    const g = autoFrame('VERTICAL'); g.itemSpacing = 32; g.paddingTop = g.paddingBottom = g.paddingLeft = g.paddingRight = 24;
    g.appendChild(text(name, 28, true));
    return g;
  });
}
function wrapRow(parent, name) {
  return findOrMake(parent, name, () => {
    const r = autoFrame('HORIZONTAL'); r.layoutWrap = 'WRAP'; r.primaryAxisSizingMode = 'FIXED'; r.resize(1800, 10);
    r.counterAxisSizingMode = 'AUTO'; r.itemSpacing = 24; r.counterAxisSpacing = 24; return r;
  });
}
function cell(label, inst) {
  const c = autoFrame('VERTICAL'); c.itemSpacing = 6; c.name = 'cell / ' + label;
  c.appendChild(text(label, 10, false)); c.appendChild(inst);
  return c;
}
async function loadTextFonts(node) {
  const names = new Set();
  const texts = node.type === 'TEXT' ? [node] : node.findAll((n) => n.type === 'TEXT');
  for (const t of texts) {
    if (t.fontName === figma.mixed) { for (const f of t.getRangeAllFontNames(0, t.characters.length)) names.add(JSON.stringify(f)); }
    else names.add(JSON.stringify(t.fontName));
  }
  for (const s of names) { await figma.loadFontAsync(JSON.parse(s)); }
}
const swapPool = [];
for (const id of ARGS.swapSources || []) { const n = await figma.getNodeByIdAsync(id); if (n && n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); if (mc) swapPool.push(mc.id); } }


function propKeys(inst, type) { return Object.entries(inst.componentProperties).filter(([, v]) => v.type === type).map(([k]) => k); }
const solid = (n) => 'fills' in n && Array.isArray(n.fills) && n.fills.some((f) => f.type === 'SOLID' && f.visible !== false);
const firstText = (inst) => inst.findOne((n) => n.type === 'TEXT' && n.characters.length > 0);
const hideTarget = (inst) => inst.findOne((x) => x.visible && x.type !== 'INSTANCE') || inst.findOne((x) => x.visible);

// plan(inst, type, defs): look up what to change WITHOUT changing anything; returns an apply function or null
async function plan(inst, type, defs) {
  if (type === 'text') {
    const k = propKeys(inst, 'TEXT')[0];
    if (k) return async () => { inst.setProperties({ [k]: 'Override text' }); return { ok: inst.componentProperties[k].value === 'Override text', note: 'prop ' + k }; };
    const t = firstText(inst);
    if (!t) return null;
    return async () => { await loadTextFonts(t); const b = t.characters; t.characters = 'Override text'; return { ok: t.characters === 'Override text' && b !== t.characters, note: 'layer ' + t.name }; };
  }
  if (type === 'boolean') {
    const k = propKeys(inst, 'BOOLEAN')[0];
    if (!k) return null;
    return async () => { const v = inst.componentProperties[k].value; inst.setProperties({ [k]: !v }); return { ok: inst.componentProperties[k].value === !v, note: 'prop ' + k }; };
  }
  if (type === 'instance-swap') {
    const k = propKeys(inst, 'INSTANCE_SWAP')[0];
    if (!k || !swapPool.length) return null;
    const cur = inst.componentProperties[k].value; const other = swapPool.find((id) => id !== cur);
    if (!other) return null;
    return async () => { inst.setProperties({ [k]: other }); return { ok: inst.componentProperties[k].value === other, note: 'prop ' + k }; };
  }
  if (type === 'nested-variant') {
    for (const ni of inst.findAll((n) => n.type === 'INSTANCE')) {
      const keys = Object.entries(ni.componentProperties).filter(([, v]) => v.type === 'VARIANT');
      if (!keys.length) continue;
      const nm = await ni.getMainComponentAsync();
      const set = nm && nm.parent && nm.parent.type === 'COMPONENT_SET' ? nm.parent : null;
      if (!set) continue;
      const d = set.componentPropertyDefinitions;
      for (const [k, v] of keys) {
        // target = first option that is not the DEFAULT of the nested component, so applying it again changes nothing (idempotent)
        const def = d[k] && d[k].defaultValue;
        const alt = ((d[k] && d[k].variantOptions) || []).find((o) => o !== def);
        if (alt) return async () => { if (ni.componentProperties[k].value !== alt) ni.setProperties({ [k]: alt }); return { ok: ni.componentProperties[k].value === alt, note: ni.name + ' ' + k + '=' + alt }; };
      }
    }
    return null;
  }
  if (type === 'hidden-layer') {
    const n = hideTarget(inst);
    if (!n) return null;
    return async () => { n.visible = false; return { ok: n.visible === false, note: n.name }; };
  }
  if (type === 'variant-after-override') {
    let pick = null;
    for (const [k, v] of Object.entries(inst.componentProperties).filter(([, v]) => v.type === 'VARIANT')) {
      const alt = ((defs && defs[k] && defs[k].variantOptions) || []).find((o) => o !== v.value);
      if (alt) { pick = [k, alt]; break; }
    }
    if (!pick) return null;
    const pre = (await plan(inst, 'text', defs)) || (await plan(inst, 'hidden-layer', defs));
    if (!pre) return null;
    return async () => { const r = await pre(); inst.setProperties({ [pick[0]]: pick[1] }); return { ok: r.ok && inst.componentProperties[pick[0]].value === pick[1], note: pick[0] + '=' + pick[1] + ' after ' + r.note }; };
  }
  if (type === 'resize') {
    return async () => { const w = inst.width, h = inst.height; inst.resize(Math.round(w + 24), Math.round(h)); return { ok: Math.abs(inst.width - (w + 24)) < 1.5, note: Math.round(w) + ' -> ' + Math.round(inst.width) }; };
  }
  if (type === 'fill') {
    const n = solid(inst) ? inst : inst.findOne(solid);
    if (!n) return null;
    return async () => { n.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }]; return { ok: true, note: n.name }; };
  }
  return null;
}
// Re-apply mode: ARGS.reapply = [{ id, type, defs }]. Puts the override of a fixture back after a library update reset it.
// Does not build frames or clones. For variant-after-override it re-applies the pre-override (text or hidden layer) only.
if (ARGS.reapply) {
  const out = [];
  const withTimeout = (p, ms, label) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout ' + label)), ms))]);
  for (const r of ARGS.reapply) {
    try {
      const inst = await withTimeout(figma.getNodeByIdAsync(r.id), 20000, 'get node');
      if (!inst) { out.push({ id: r.id, error: 'missing' }); continue; }
      await withTimeout(loadTextFonts(inst), 30000, 'fonts').catch(() => {});
      let ap = null;
      if (r.type === 'variant-after-override') ap = (await withTimeout(plan(inst, 'text', r.defs), 30000, 'plan text')) || (await withTimeout(plan(inst, 'hidden-layer', r.defs), 30000, 'plan hidden'));
      else ap = await withTimeout(plan(inst, r.type, r.defs), 30000, 'plan ' + r.type);
      if (!ap) { out.push({ id: r.id, name: inst.name, type: r.type, error: 'no way to apply' }); continue; }
      const res = await withTimeout(ap(), 30000, 'apply');
      out.push({ id: r.id, name: inst.name, type: r.type, ok: res.ok, note: res.note });
    } catch (e) { out.push({ id: r.id, type: r.type, error: String(e.message || e).slice(0, 120) }); }
  }
  return JSON.stringify(out);
}
const ORDER = ['text', 'boolean', 'instance-swap', 'nested-variant', 'hidden-layer', 'variant-after-override', 'resize', 'fill'];
const ICON_ORDER = ['resize', 'fill'];
const results = [];
for (const it of ARGS.items) {
  const staged = await figma.getNodeByIdAsync(it.nodeId);
  if (!staged || staged.type !== 'INSTANCE') { results.push({ name: it.name, error: 'staged node missing' }); continue; }
  if (staged.getSharedPluginData('sandbox', 'sbDone') === '1') { results.push({ name: it.name, skipped: 'done' }); continue; }
  const isIcon = it.group === 'Icons';
  const g = group(it.group);
  let host;
  if (isIcon) host = wrapRow(g, 'icons row');
  else {
    const fam = autoFrame('VERTICAL'); fam.name = 'family / ' + it.name; fam.itemSpacing = 12; fam.paddingTop = fam.paddingBottom = fam.paddingLeft = fam.paddingRight = 16;
    fam.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    fam.appendChild(text(it.name, 16, true));
    g.appendChild(fam);
    host = wrapRow(fam, 'row');
  }
  await loadTextFonts(staged).catch(() => {});
  const rec = { name: it.name, group: it.group, fixtures: [], skippedTypes: [] };
  const types = isIcon ? ICON_ORDER : ORDER;
  const applicable = [];
  for (const t of types) { if (await plan(staged, t, it.defs)) applicable.push(t); else rec.skippedTypes.push(t); }
  for (let i = 0; i < applicable.length; i++) {
    const type = applicable[i];
    const inst = i === applicable.length - 1 ? staged : staged.clone();
    let r;
    try { const ap = await plan(inst, type, it.defs); r = ap ? await ap() : { ok: false, note: 'plan lost' }; } catch (e) { r = { ok: false, note: 'error ' + String(e).slice(0, 140) }; }
    const fname = 'fixture/' + it.name + '/' + type;
    inst.name = fname; inst.setSharedPluginData('sandbox', 'sbType', type); inst.setSharedPluginData('sandbox', 'sbComponent', it.name);
    host.appendChild(cell(fname, inst));
    rec.fixtures.push({ id: inst.id, type, ok: r.ok, note: r.note });
  }
  if (!rec.fixtures.length) rec.error = 'no override type applied';
  staged.setSharedPluginData('sandbox', 'sbDone', '1');
  results.push(rec);
}
return JSON.stringify(results);
