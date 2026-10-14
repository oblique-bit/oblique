// ARGS = { pairs: [{ fromNodeId, toNodeId, fromName, toName }] }
// For every pair: fresh instance of the "from" component, set overrides, swap it to the "to" component,
// record which overrides survived. Placed on the page "Swaps".
const page = figma.root.children.find((p) => p.name === 'Swaps');
await figma.setCurrentPageAsync(page);
for (const f of [{ family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Bold' }, { family: 'Roboto Mono', style: 'Regular' }]) { try { await figma.loadFontAsync(f); } catch (e) {} }
function autoFrame(dir) { const f = figma.createFrame(); f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; f.clipsContent = false; return f; }
function text(str, size, bold) { const t = figma.createText(); t.fontName = bold ? { family: 'Inter', style: 'Bold' } : { family: 'Roboto Mono', style: 'Regular' }; t.fontSize = size; t.characters = str; t.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]; return t; }
let root = page.children.find((c) => c.name === 'Sandbox / Swaps');
if (!root) { root = autoFrame('VERTICAL'); root.name = 'Sandbox / Swaps'; root.itemSpacing = 48; root.paddingTop = root.paddingBottom = root.paddingLeft = root.paddingRight = 40; root.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }]; root.appendChild(text('Component swaps: overrides set first, then the instance is swapped to the other component', 20, true)); page.appendChild(root); root.x = 0; root.y = 0; }
let row = root.children.find((c) => c.name === 'swap row');
if (!row) { row = autoFrame('HORIZONTAL'); row.name = 'swap row'; row.layoutWrap = 'WRAP'; row.primaryAxisSizingMode = 'FIXED'; row.resize(1800, 10); row.counterAxisSizingMode = 'AUTO'; row.itemSpacing = 32; row.counterAxisSpacing = 32; root.appendChild(row); }
async function loadTextFonts(node) {
  const names = new Set();
  for (const t of node.findAll((n) => n.type === 'TEXT')) {
    if (t.fontName === figma.mixed) { for (const f of t.getRangeAllFontNames(0, t.characters.length)) names.add(JSON.stringify(f)); } else names.add(JSON.stringify(t.fontName));
  }
  for (const s of names) await figma.loadFontAsync(JSON.parse(s));
}
function state(inst) {
  const props = {}; for (const [k, v] of Object.entries(inst.componentProperties)) props[k.replace(/#.*$/, '')] = { type: v.type, value: v.value };
  const texts = inst.findAll((n) => n.type === 'TEXT').map((t) => [t.name, t.characters]);
  const hidden = inst.findAll((n) => !n.visible).map((n) => n.name);
  return { props, texts, hidden, w: Math.round(inst.width), h: Math.round(inst.height) };
}
const out = [];
for (const p of ARGS.pairs) {
  const a = await figma.getNodeByIdAsync(p.fromNodeId), b = await figma.getNodeByIdAsync(p.toNodeId);
  if (!a || !b) { out.push({ from: p.fromName, to: p.toName, error: 'staged node missing' }); continue; }
  const fromMain = await a.getMainComponentAsync(), toMain = await b.getMainComponentAsync();
  const inst = fromMain.createInstance();
  row.appendChild(inst); // temporary parent so the instance lives on the page
  await loadTextFonts(inst);
  const applied = [];
  const tk = Object.entries(inst.componentProperties).find(([, v]) => v.type === 'TEXT');
  if (tk) { inst.setProperties({ [tk[0]]: 'Swap override text' }); applied.push('text prop ' + tk[0].replace(/#.*$/, '')); }
  else { const t = inst.findOne((n) => n.type === 'TEXT' && n.characters.length > 0); if (t) { t.characters = 'Swap override text'; applied.push('text layer ' + t.name); } }
  const bk = Object.entries(inst.componentProperties).find(([, v]) => v.type === 'BOOLEAN');
  if (bk) { inst.setProperties({ [bk[0]]: !bk[1].value }); applied.push('boolean ' + bk[0].replace(/#.*$/, '')); }
  const before = state(inst);
  let swapErr = null;
  try { inst.swapComponent(toMain); } catch (e) { swapErr = String(e).slice(0, 160); }
  await loadTextFonts(inst).catch(() => {});
  const after = state(inst);
  const keptText = before.texts.filter(([n, c]) => c === 'Swap override text' && after.texts.some(([n2, c2]) => n2 === n && c2 === c)).length;
  const textOverridesBefore = before.texts.filter(([, c]) => c === 'Swap override text').length;
  const keptProps = Object.entries(before.props).filter(([k, v]) => after.props[k] && after.props[k].value === v.value).length;
  const fname = 'swap/' + p.fromName + '/' + p.toName;
  inst.name = fname; inst.setSharedPluginData('sandbox', 'sbType', 'component-swap'); inst.setSharedPluginData('sandbox', 'sbFrom', p.fromName); inst.setSharedPluginData('sandbox', 'sbTo', p.toName);
  const cell = autoFrame('VERTICAL'); cell.itemSpacing = 6; cell.name = 'cell / ' + fname; cell.appendChild(text(fname, 10, false)); row.appendChild(cell); cell.appendChild(inst);
  const mc = await inst.getMainComponentAsync();
  out.push({ from: p.fromName, to: p.toName, id: inst.id, swapErr, applied, mainAfter: mc ? mc.name : null, textOverridesBefore, textOverridesKept: keptText, propsBefore: Object.keys(before.props).length, propsSameValueAfter: keptProps, before, after });
}
return JSON.stringify(out);
