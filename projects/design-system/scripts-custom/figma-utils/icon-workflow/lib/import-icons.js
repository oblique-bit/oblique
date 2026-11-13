(async () => {
  /**
   * import-icons.js — write icon SVGs from Git into the icon components of a Figma page
   * ----------------------------------------------------------------------------
   * WHY: the SVG files in Git are the source of the icon set. This script moves
   * the geometry of changed icons into Figma and creates the icons that Figma
   * does not have yet, without touching the rest of the page.
   *
   * WHAT IT DOES per icon of INPUT.icons:
   *   action "update"  the component exists: its vector gets the new geometry.
   *                    The component, its instances, name, description and the
   *                    fill binding stay.
   *   action "create"  no component yet: a new component (24x24, one vector, fill
   *                    bound like the existing icons) and its label go to the next
   *                    free place of the grid; the section grows when it needs room.
   *                    On a page with text labels (the Icons builder and the OB Library
   *                    make one) the new component goes to the start of the block of the
   *                    icons and its text label to the start of the block of the labels,
   *                    so a label is never listed next to its icon in the layers panel.
   * It never deletes. Icons that exist only in Figma are not in INPUT.
   *
   * HOW TO RUN: not by hand. icons.mjs fills INPUT between the markers below
   * and runs the result with `figma-ds-cli eval -f`. Mode `scan` writes nothing
   * and checks that every update target exists and has one vector. Mode `apply`
   * saves a restore point first, then writes.
   * ----------------------------------------------------------------------------
   */

  const INPUT = /*__INPUT__*/ { mode: 'scan', fileKeyGuard: null, pageName: 'Icons', namePrefix: 'icon/', restorePoint: false, icons: {} } /*__END__*/;

  const results = [];
  const finish = (extra) => JSON.stringify({ ok: true, mode: INPUT.mode, file: figma.root.name, fileKey: figma.fileKey, results, ...extra });

  if (INPUT.mode === 'apply' && INPUT.fileKeyGuard !== figma.fileKey) {
    return JSON.stringify({ ok: false, reason: 'FILE KEY GUARD — refusing to write', expected: INPUT.fileKeyGuard, open: { fileKey: figma.fileKey, name: figma.root.name } });
  }

  // the pages are listed without loading them; setCurrentPageAsync below loads the icon page only
  // (loadAllPagesAsync() on a large design system file takes minutes)
  const pages = figma.root.children.filter((p) => p.name.includes(INPUT.pageName));
  if (pages.length !== 1) return JSON.stringify({ ok: false, reason: `${pages.length} pages contain "${INPUT.pageName}"`, pages: pages.map((p) => p.name) });
  const page = pages[0];
  await figma.setCurrentPageAsync(page);

  const prefix = INPUT.namePrefix;
  const prefixLower = prefix.toLowerCase();
  const comps = page.findAll((n) => n.type === 'COMPONENT' && n.name.toLowerCase().startsWith(prefixLower));
  const byName = new Map(comps.map((c) => [c.name.slice(prefix.length).toLowerCase(), c]));
  if (!comps.length) return JSON.stringify({ ok: false, reason: `no component with the prefix "${prefix}" on the page` });
  const section = comps[0].parent;
  const refComp = comps[0];
  const refVector = refComp.children[0];

  // ---- helpers
  const relative = (node, root) => [node.absoluteTransform[0][2] - root.absoluteTransform[0][2], node.absoluteTransform[1][2] - root.absoluteTransform[1][2]];

  // Import one SVG and return { frame, vector }: the vector is one node, flattened when the SVG has several paths.
  const importSvg = (svg) => {
    const frame = figma.createNodeFromSvg(svg);
    let vectors = frame.findAll((n) => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
    if (!vectors.length) { frame.remove(); throw new Error('the SVG has no shape'); }
    let vector = vectors[0];
    if (vectors.length > 1) vector = figma.flatten(vectors, frame);
    return { frame, vector };
  };

  // Next free place of the grid: the grid columns and rows come from the existing components.
  // the label of an icon is a text beside it, or an instance of the label building block of the Icons builder
  const labels = section.children.filter((n) => n.type === 'TEXT' || n.type === 'INSTANCE');
  const refLabel = labels.find((t) => Math.abs(t.x - (refComp.x + 32)) <= 1.5 && Math.abs(t.y - refComp.y) <= 12);
  const cols = [...new Set(comps.map((c) => Math.round(c.x)))].sort((a, b) => a - b);
  const rows = [...new Set(comps.map((c) => Math.round(c.y)))].sort((a, b) => a - b);
  const rowGap = rows.length > 1 ? rows[rows.length - 1] - rows[rows.length - 2] : 72;
  let nextCol = comps.filter((c) => Math.round(c.y) === rows[rows.length - 1]).length;
  let nextRowY = rows[rows.length - 1];
  const slot = () => {
    if (nextCol >= cols.length) { nextCol = 0; nextRowY += rowGap; }
    const s = { x: cols[nextCol], y: nextRowY };
    nextCol++;
    return s;
  };
  const bottomMargin = section.height - Math.max(...section.children.map((c) => c.y + c.height));

  // Layer order on a page with text labels: one block of labels above one block of icons. A new icon goes to the start of the
  // icon block and a new text label to the start of the label block (the layers panel lists the last child first). A page with
  // instance labels (an earlier version of the Icons builder) keeps the old behaviour: a new layer goes on top.
  const hasTextLabels = section.children.some((n) => n.type === 'TEXT');
  const isIconComponent = (n) => n.type === 'COMPONENT' && n.name.toLowerCase().startsWith(prefixLower);
  const putIcon = (node) => { const i = section.children.findIndex(isIconComponent); if (hasTextLabels && i >= 0) section.insertChild(i, node); else section.appendChild(node); };
  const putLabel = (node) => { const j = section.children.findIndex((n) => n.type === 'TEXT'); if (hasTextLabels && node.type === 'TEXT' && j >= 0) section.insertChild(j, node); else section.appendChild(node); };

  if (INPUT.mode === 'apply' && INPUT.restorePoint) {
    await figma.saveVersionHistoryAsync('Before icon sync', 'Restore point before the icon geometry is updated from Git');
  }

  for (const [name, item] of Object.entries(INPUT.icons)) {
    const entry = { name, action: item.action };
    try {
      const existing = byName.get(name.toLowerCase());
      if (item.action === 'update') {
        if (!existing) throw new Error('no component with this name');
        if (existing.children.length !== 1 || existing.children[0].type !== 'VECTOR') throw new Error(`the component holds ${existing.children.map((c) => c.type).join(', ') || 'nothing'}, expected one VECTOR`);
        if (INPUT.mode === 'scan') { entry.status = 'would update'; results.push(entry); continue; }
        const { frame, vector } = importSvg(item.svg);
        try {
          const v = existing.children[0];
          const [dx, dy] = relative(vector, frame);
          v.vectorPaths = vector.vectorPaths;
          v.x = dx;
          v.y = dy;
          entry.status = 'updated';
          entry.size = [Math.round(v.width * 100) / 100, Math.round(v.height * 100) / 100];
        } finally { frame.remove(); }
      } else if (item.action === 'create') {
        if (existing) throw new Error('a component with this name exists already');
        if (!refVector || !refVector.fills[0] || !refVector.fills[0].boundVariables || !refVector.fills[0].boundVariables.color) throw new Error('the first icon has no bound fill to copy');
        if (INPUT.mode === 'scan') { entry.status = 'would create'; results.push(entry); continue; }
        const variable = await figma.variables.getVariableByIdAsync(refVector.fills[0].boundVariables.color.id);
        const { frame, vector } = importSvg(item.svg);
        try {
          const [dx, dy] = relative(vector, frame);
          const c = figma.createComponent();
          c.name = prefix + name;
          c.resize(24, 24);
          c.fills = [];
          c.clipsContent = true;
          putIcon(c);
          const s = slot();
          c.x = s.x;
          c.y = s.y;
          c.appendChild(vector);
          vector.name = refVector.name;
          vector.x = dx;
          vector.y = dy;
          vector.strokes = [];
          const r = variable.resolveForConsumer(vector).value;
          vector.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: r.r, g: r.g, b: r.b }, opacity: r.a === undefined ? 1 : r.a, visible: true, blendMode: 'NORMAL' }, 'color', variable)];
          if (refLabel) {
            const label = refLabel.clone();
            putLabel(label);
            if (refLabel.type === 'TEXT') {
              for (const f of refLabel.getRangeAllFontNames(0, refLabel.characters.length)) await figma.loadFontAsync(f);
              label.characters = name;
            } else {
              // an instance: its text property holds the text
              const key = Object.keys(label.componentProperties).find((k) => k.startsWith('name#'));
              if (key) label.setProperties({ [key]: name });
              label.name = name;
            }
            label.x = c.x + (refLabel.x - refComp.x);
            label.y = c.y + (refLabel.y - refComp.y);
          }
          const need = c.y + c.height + bottomMargin;
          if (need > section.height) section.resizeWithoutConstraints(section.width, need);
          entry.status = 'created';
          entry.at = [c.x, c.y];
          byName.set(name.toLowerCase(), c);
        } finally { frame.remove(); }
      } else throw new Error(`unknown action ${item.action}`);
    } catch (e) {
      entry.status = 'error';
      entry.reason = String(e.message || e);
    }
    results.push(entry);
  }

  if (INPUT.mode === 'apply') await new Promise((r) => setTimeout(r, 1500));
  return finish({ page: page.name, requested: Object.keys(INPUT.icons).length });
})()
