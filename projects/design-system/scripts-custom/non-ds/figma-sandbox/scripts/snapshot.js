// read only: state of every fixture and swap instance on the pages "Components" and "Swaps"
const rows = [];
const r3 = (x) => Math.round(x * 10) / 10;
const paints = (arr) => (Array.isArray(arr) ? arr.slice(0, 3).map((f) => f.type === 'SOLID' ? ['S', f.color.r.toFixed(3), f.color.g.toFixed(3), f.color.b.toFixed(3), f.opacity === undefined ? 1 : +f.opacity.toFixed(2), f.visible !== false ? 1 : 0] : [f.type, f.visible !== false ? 1 : 0]) : 'mixed');
const sym = (x) => (typeof x === 'symbol' ? 'mixed' : x);
function look(d) {
  const o = [];
  if ('fills' in d) o.push(['fills', paints(d.fills)]);
  if ('strokes' in d) o.push(['strokes', paints(d.strokes), sym(d.strokeWeight)]);
  if ('effects' in d && d.effects.length) o.push(['effects', d.effects.map((e) => [e.type, e.visible !== false ? 1 : 0, e.radius])]);
  if ('opacity' in d && d.opacity !== 1) o.push(['opacity', +d.opacity.toFixed(2)]);
  if ('cornerRadius' in d) o.push(['radius', sym(d.cornerRadius)]);
  if (d.type === 'TEXT') o.push(['font', sym(d.fontSize), d.fontName === figma.mixed ? 'mixed' : d.fontName.family + ' ' + d.fontName.style, sym(d.letterSpacing && d.letterSpacing.value), d.lineHeight === figma.mixed ? 'mixed' : (d.lineHeight.value === undefined ? 'auto' : d.lineHeight.value)]);
  return o;
}
for (const pn of ['Components', 'Swaps']) {
  const page = figma.root.children.find((p) => p.name === pn);
  await page.loadAsync();
  const insts = page.findAllWithCriteria({ types: ['INSTANCE'] }).filter((n) => n.getSharedPluginData('sandbox', 'sbType'));
  for (const n of insts) {
    const mc = await n.getMainComponentAsync();
    const props = {}; for (const [k, v] of Object.entries(n.componentProperties)) props[k] = [v.type, v.value];
    const desc = [];
    for (const d of n.findAll(() => true)) {
      const r = [d.name, d.type, d.visible ? 1 : 0, r3(d.width), r3(d.height)];
      if (d.type === 'TEXT') r.push(d.characters);
      if (d.type === 'INSTANCE') { const m = await d.getMainComponentAsync(); r.push(m ? m.key : null); }
      r.push(look(d));
      desc.push(r);
    }
    rows.push({ id: n.id, page: pn, name: n.name, sbType: n.getSharedPluginData('sandbox', 'sbType'), main: mc ? [mc.key, mc.name, mc.remote] : null, props, w: r3(n.width), h: r3(n.height), visible: n.visible, root: look(n), sizing: [n.layoutSizingHorizontal, n.layoutSizingVertical], desc });
  }
}
return JSON.stringify(rows);
