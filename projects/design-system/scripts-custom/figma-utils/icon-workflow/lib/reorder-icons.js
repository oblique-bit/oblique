(async () => {
  /**
   * reorder-icons.js — put every icon of the icon page on its place in the grid, in the order of the names
   * ----------------------------------------------------------------------------
   * WHY: the icon page lists the icons by name, row by row (checked in the OB Library on 2026-11-20:
   * all 284 icons in this order, 6 columns). A new icon is created at the end of the grid. This
   * script moves the icons after it one place on, so that the new icon stands at its place.
   *
   * WHAT IT DOES:
   *   - reads the grid from the icon components: the columns are the x values that at least two
   *     icons share, the row gap is the most common gap between the rows, the first row is the
   *     smallest y of an icon in a column;
   *   - sorts the icons by name in plain code point order, as the Icons builder ("-" before "_");
   *   - gives every icon the place of its rank and moves the label beside it by the same distance;
   *   - in the layers panel the block of the icons reads a to z from the top (only when the icons
   *     are one block of layers; otherwise the layer order stays and the result says so);
   *   - grows the section when the rows need more room. It never makes it smaller.
   * It only changes x, y and the layer order of nodes that exist. It never creates, copies or deletes
   * a node, so no component ID and no component key changes. Mode `apply` checks that afterwards.
   *
   * It stops without writing when the icons are in more than one section or frame, or when it
   * cannot read a grid. An icon without a label is moved and listed.
   *
   * HOW TO RUN: not by hand. icons.mjs fills INPUT between the markers below and runs it with
   * `figma-ds-cli eval -f`. Mode `scan` writes nothing and returns the moves. Mode `apply` checks
   * the file key, saves the restore point "Before icon reorder", moves and checks again.
   * ----------------------------------------------------------------------------
   */

  const INPUT = /*__INPUT__*/ { mode: 'scan', fileKeyGuard: null, pageName: 'Icons', namePrefix: 'icon/', labelOffsetX: 32, labelTolerance: 1.5, labelMaxDy: 12 } /*__END__*/;

  const fail = (reason, extra) => JSON.stringify({ ok: false, mode: INPUT.mode, reason, ...extra });
  if (INPUT.mode !== 'scan' && INPUT.mode !== 'apply') return fail(`unknown mode ${INPUT.mode}`);
  if (INPUT.mode === 'apply' && INPUT.fileKeyGuard !== figma.fileKey) {
    return fail('FILE KEY GUARD — refusing to write', { expected: INPUT.fileKeyGuard, open: { fileKey: figma.fileKey, name: figma.root.name } });
  }

  const pages = figma.root.children.filter((p) => p.name.includes(INPUT.pageName));
  if (pages.length !== 1) return fail(`${pages.length} pages contain "${INPUT.pageName}"`, { pages: pages.map((p) => p.name) });
  const page = pages[0];
  await figma.setCurrentPageAsync(page);

  const prefixLower = INPUT.namePrefix.toLowerCase();
  const isIcon = (n) => n.type === 'COMPONENT' && n.name.toLowerCase().startsWith(prefixLower);
  const comps = page.findAll(isIcon);
  if (!comps.length) return fail(`no component with the prefix "${INPUT.namePrefix}" on the page`);
  const parents = [...new Set(comps.map((c) => c.parent))];
  if (parents.length !== 1) return fail(`the icons are in ${parents.length} sections or frames; the grid needs one`, { parents: parents.map((p) => `${p.type} "${p.name}" ${p.id}`) });
  const section = parents[0];

  const short = (c) => c.name.slice(INPUT.namePrefix.length);
  const r2 = (v) => Math.round(v * 100) / 100;

  // ---- the grid, read from the icons
  const countBy = (values) => { const m = new Map(); for (const v of values) m.set(v, (m.get(v) || 0) + 1); return m; };
  const cols = [...countBy(comps.map((c) => Math.round(c.x)))].filter(([, n]) => n >= 2).map(([x]) => x).sort((a, b) => a - b);
  if (cols.length < 2) return fail('cannot read the grid: fewer than two columns are shared by two icons');
  const inCol = comps.filter((c) => cols.includes(Math.round(c.x)));
  const ys = [...new Set(inCol.map((c) => Math.round(c.y)))].sort((a, b) => a - b);
  const gaps = [...countBy(ys.slice(1).map((y, i) => y - ys[i]).filter((g) => g > 0))].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  if (!gaps.length) return fail('cannot read the grid: the icons are in one row');
  const pitchY = gaps[0][0];
  const originY = ys[0];
  const grid = { columns: cols, originY, pitchY };

  // ---- the label beside every icon (a text, or an instance of the label building block of the Icons builder)
  const labelNodes = section.children.filter((n) => n.type === 'TEXT' || n.type === 'INSTANCE');
  const taken = new Set();
  const pairs = comps.map((c) => {
    const label = labelNodes.find((t) => !taken.has(t.id) && Math.abs(t.x - (c.x + INPUT.labelOffsetX)) <= INPUT.labelTolerance && Math.abs(t.y - c.y) <= INPUT.labelMaxDy);
    if (label) taken.add(label.id);
    return { c, name: short(c), label, dx: label ? label.x - c.x : null, dy: label ? label.y - c.y : null };
  });

  // ---- the place of every icon
  const order = [...pairs].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const dupes = order.filter((p, i) => i && p.name === order[i - 1].name).map((p) => p.name);
  if (dupes.length) return fail('two icons have the same name', { names: dupes });
  order.forEach((p, i) => { p.to = { x: cols[i % cols.length], y: originY + Math.floor(i / cols.length) * pitchY }; });
  const moves = order.filter((p) => Math.abs(p.c.x - p.to.x) > 0.01 || Math.abs(p.c.y - p.to.y) > 0.01)
    .map((p) => ({ name: p.name, id: p.c.id, from: [r2(p.c.x), r2(p.c.y)], to: [p.to.x, p.to.y], label: p.label ? p.label.id : null }));
  const noLabel = pairs.filter((p) => !p.label).map((p) => p.name);

  // ---- the layer order of the icon block: a to z from the top of the layers panel (the panel lists the last child first)
  const kids = section.children;
  const idx = comps.map((c) => kids.indexOf(c)).sort((a, b) => a - b);
  const contiguous = idx[idx.length - 1] - idx[0] + 1 === idx.length;
  const layerWanted = [...order].reverse().map((p) => p.c); // bottom (lowest index) = z
  const layerMoves = contiguous ? layerWanted.filter((c, k) => kids[idx[0] + k] !== c).length : 0;

  // ---- the section height: the rows need this much room (the space under the last row stays as it is)
  const bottomOf = (n) => n.y + n.height;
  const bottomMargin = section.height - Math.max(...section.children.map(bottomOf));
  const lastIconBottom = Math.max(...order.map((p) => p.to.y + p.c.height));
  const lastLabelBottom = Math.max(...order.filter((p) => p.label).map((p) => p.to.y + p.dy + p.label.height));
  const others = section.children.filter((n) => !comps.includes(n) && !taken.has(n.id));
  const need = Math.max(lastIconBottom, lastLabelBottom, ...others.map(bottomOf)) + bottomMargin;
  const grow = need > section.height + 0.01 ? r2(need) : null;

  const report = {
    ok: true, mode: INPUT.mode, file: figma.root.name, fileKey: figma.fileKey, page: page.name,
    section: { id: section.id, type: section.type, name: section.name, height: r2(section.height) },
    grid, count: comps.length, moves: moves.length, moved: moves, noLabel,
    layers: contiguous ? { block: true, moves: layerMoves } : { block: false, moves: 0, note: 'the icons are not one block of layers: the layer order stays' },
    growSectionTo: grow,
  };
  if (INPUT.mode === 'scan' || (!moves.length && !layerMoves && !grow)) return JSON.stringify(report);

  // ================================================================ apply
  const before = new Map(comps.map((c) => [c.id, { name: c.name, key: c.key }]));
  await figma.saveVersionHistoryAsync('Before icon reorder', 'Restore point before the icons are put in the order of their names');
  if (grow) section.resizeWithoutConstraints(section.width, need);
  for (const p of order) {
    if (Math.abs(p.c.x - p.to.x) > 0.01 || Math.abs(p.c.y - p.to.y) > 0.01) { p.c.x = p.to.x; p.c.y = p.to.y; }
    if (p.label && (Math.abs(p.label.x - (p.to.x + p.dx)) > 0.01 || Math.abs(p.label.y - (p.to.y + p.dy)) > 0.01)) { p.label.x = p.to.x + p.dx; p.label.y = p.to.y + p.dy; }
  }
  // every move goes from a higher index to the lower index idx[0] + k, so only icons not placed yet shift
  if (contiguous) layerWanted.forEach((c, k) => { if (section.children[idx[0] + k] !== c) section.insertChild(idx[0] + k, c); });

  // ---- check: the same components, the same keys and names, every icon and label at its place
  const after = page.findAll(isIcon);
  const afterById = new Map(after.map((c) => [c.id, c]));
  const problems = [];
  for (const [id, b] of before) {
    const c = afterById.get(id);
    if (!c) { problems.push(`${b.name}: the component ${id} is gone`); continue; }
    if (c.key !== b.key) problems.push(`${b.name}: the key changed`);
    if (c.name !== b.name) problems.push(`${b.name}: the name changed to ${c.name}`);
  }
  if (after.length !== before.size) problems.push(`${before.size} icons before, ${after.length} after`);
  for (const p of order) {
    if (Math.abs(p.c.x - p.to.x) > 0.01 || Math.abs(p.c.y - p.to.y) > 0.01) problems.push(`${p.name}: not at its place`);
    if (p.label && (Math.abs(p.label.x - (p.c.x + p.dx)) > 0.01 || Math.abs(p.label.y - (p.c.y + p.dy)) > 0.01)) problems.push(`${p.name}: the label is not beside the icon`);
  }
  if (contiguous) {
    const now = [...section.children].filter(isIcon).map(short).reverse();
    if (now.join('|') !== order.map((p) => p.name).join('|')) problems.push('the layer order of the icons is not a to z');
  }
  await new Promise((r) => setTimeout(r, 1500));
  return JSON.stringify({ ...report, applied: true, sectionHeight: r2(section.height), check: { ids: before.size, problems } });
})()
