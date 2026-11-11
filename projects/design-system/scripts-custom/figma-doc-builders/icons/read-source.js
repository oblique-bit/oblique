(async () => {
  /**
   * read-source.js — read the icons of a source Figma file (read only)
   * ----------------------------------------------------------------------------
   * WHY: the Icons page builder (build-icons.js) takes the icons from a source: a Figma file or branch
   * that the user names every time. This script runs in the SOURCE tab and returns everything the builder
   * needs to make the icons again: name, description, the shape of the single vector layer and the label text
   * that sits beside the icon. It changes nothing.
   *
   * It only works in a file that scripts may read: a file the user can edit. In a view-only file Figma gives
   * a script no access at all and build-icons.js stops before this script runs.
   *
   * HOW TO RUN: not by hand. build-icons.js fills INPUT between the markers below and runs the result with
   * `figma-ds-cli eval -f`. The last line it prints is one JSON object.
   *
   * INPUT.nodeId    the node of the source URL (a page, section or frame that holds the icons), or null
   * INPUT.pageName  without a node: the one page whose name contains this text
   * ----------------------------------------------------------------------------
   */

  const INPUT = /*__INPUT__*/ { nodeId: null, pageName: 'Icons', prefixes: ['icon/'], labelOffsetX: 32, labelTolerance: 1.5, labelMaxDy: 12 } /*__END__*/;

  const problems = [];
  let scope = null;
  if (INPUT.nodeId) {
    scope = await figma.getNodeByIdAsync(INPUT.nodeId);
    if (!scope) return JSON.stringify({ ok: false, reason: `the node ${INPUT.nodeId} of the URL does not exist in the file "${figma.root.name}"` });
    let page = scope; while (page && page.type !== 'PAGE') page = page.parent;
    if (page) await page.loadAsync();
  } else {
    const pages = figma.root.children.filter((p) => p.name.includes(INPUT.pageName));
    if (pages.length !== 1) return JSON.stringify({ ok: false, reason: `${pages.length} pages of "${figma.root.name}" contain "${INPUT.pageName}": add the node-id of the icons to the URL`, pages: pages.map((p) => p.name) });
    scope = pages[0];
    await scope.loadAsync();
  }
  if (!('findAll' in scope)) return JSON.stringify({ ok: false, reason: `the node ${scope.name} (${scope.type}) cannot hold icons` });

  const isIcon = (n) => n.type === 'COMPONENT' && INPUT.prefixes.some((p) => n.name.toLowerCase().startsWith(p.toLowerCase()));
  const comps = scope.findAll(isIcon);
  if (!comps.length) return JSON.stringify({ ok: false, reason: `no component named ${INPUT.prefixes.map((p) => `"${p}…"`).join(' or ')} under "${scope.name}" (${scope.type}) in "${figma.root.name}"` });

  const abs = (n) => { const t = n.absoluteTransform; return [t[0][2], t[1][2]]; };
  const texts = scope.findAll((n) => n.type === 'TEXT');
  const labelOf = (c) => {
    const [cx, cy] = abs(c);
    return texts.find((t) => { const [tx, ty] = abs(t); return Math.abs(tx - (cx + INPUT.labelOffsetX)) <= INPUT.labelTolerance && Math.abs(ty - cy) <= INPUT.labelMaxDy; });
  };

  const icons = [];
  const seen = new Set();
  for (const c of comps) {
    const prefix = INPUT.prefixes.find((p) => c.name.toLowerCase().startsWith(p.toLowerCase()));
    const name = c.name.slice(prefix.length);
    if (seen.has(name.toLowerCase())) { problems.push(`${name}: two components with this name`); continue; }
    seen.add(name.toLowerCase());
    if (Math.abs(c.width - 24) > 0.01 || Math.abs(c.height - 24) > 0.01) { problems.push(`${name}: size ${c.width} x ${c.height} instead of 24 x 24`); continue; }
    if (c.children.length !== 1 || c.children[0].type !== 'VECTOR') { problems.push(`${name}: ${c.children.length} layers (${c.children.map((k) => k.type).join(', ') || 'none'}) instead of one vector`); continue; }
    const v = c.children[0];
    if (!v.vectorPaths || !v.vectorPaths.length) { problems.push(`${name}: the vector has no path`); continue; }
    if (v.rotation) { problems.push(`${name}: the vector is rotated by ${v.rotation} degrees`); continue; }
    const label = labelOf(c);
    icons.push({ name, description: c.description || '', vector: { x: v.x, y: v.y, paths: v.vectorPaths.map((p) => ({ windingRule: p.windingRule, data: p.data })) }, label: label ? label.characters : null });
  }

  return JSON.stringify({
    ok: true,
    source: { file: figma.root.name, fileKey: figma.fileKey, container: { id: scope.id, type: scope.type, name: scope.name } },
    found: comps.length,
    icons,
    problems,
  });
})()
