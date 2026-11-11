(async () => {
  /**
   * read-source.js — read the icons of a source Figma file (read only)
   * ----------------------------------------------------------------------------
   * WHY: the Icons page builder (build-icons.js) takes the icons from a source: a Figma file or branch
   * that the user names every time. This script runs in the SOURCE tab and returns everything the builder
   * needs to make the icons again: name, description, the shape of the single vector layer and the label text
   * that sits beside the icon. It changes nothing.
   *
   * It looks at the whole page of the URL (or at the section or frame the URL points to), in every section and
   * frame. It finds the icons by their names. A component is an icon when its name starts with "icon" or "icons"
   * (any case) and a separator: / \ _ - . : or a space. So icon/arrow, Icon/arrow, Icons/arrow, icons/arrow,
   * icon_arrow, Icon - arrow and icon arrow are icons. The part after the prefix is the name of the icon.
   * Other components are counted and ignored. A component that is not 24 x 24 or has not exactly one vector
   * is listed in `problems` and skipped.
   *
   * It only works in a file that scripts may read: a file the user can edit. In a view-only file Figma gives
   * a script no access at all and build-icons.js stops before this script runs.
   *
   * HOW TO RUN: not by hand. build-icons.js fills INPUT between the markers below and runs the result with
   * `figma-ds-cli eval -f`. The last line it prints is one JSON object.
   *
   * INPUT.nodeId    the node of the source URL (a page, section or frame that holds the icons), or null
   * INPUT.pageName  without a node: the one page whose name contains this text (any case)
   * ----------------------------------------------------------------------------
   */

  const INPUT = /*__INPUT__*/ { nodeId: null, pageName: 'icon', labelOffsetX: 32, labelTolerance: 1.5, labelMaxDy: 12 } /*__END__*/;

  // "icon" or "icons", a separator (/ \ _ - . : or a space), then the name, which starts with a letter, a digit or the like
  const ICON_NAME = /^icons?(?:\s*[\/\\_.:-]+\s*|\s+)([^\s\/\\_.:-].*)$/i;
  const parse = (n) => {
    const full = n.name.trim();
    const m = ICON_NAME.exec(full);
    if (!m) return null;
    return { name: m[1].trim(), prefix: full.slice(0, full.length - m[1].length).trim() };
  };

  const problems = [];
  let scope = null;
  if (INPUT.nodeId) {
    scope = await figma.getNodeByIdAsync(INPUT.nodeId);
    if (!scope) return JSON.stringify({ ok: false, reason: `the node ${INPUT.nodeId} of the URL does not exist in the file "${figma.root.name}"`, pages: figma.root.children.map((p) => p.name) });
    let page = scope; while (page && page.type !== 'PAGE') page = page.parent;
    if (page) await page.loadAsync();
  } else {
    const pages = figma.root.children.filter((p) => p.name.toLowerCase().includes(INPUT.pageName.toLowerCase()));
    if (pages.length !== 1) return JSON.stringify({ ok: false, reason: `${pages.length} pages of "${figma.root.name}" have "${INPUT.pageName}" in their name: use the URL of the page with the icons (open the page, click an empty spot so that nothing is selected and copy the URL)`, pages: pages.map((p) => p.name) });
    scope = pages[0];
    await scope.loadAsync();
  }
  if (!('findAll' in scope)) return JSON.stringify({ ok: false, reason: `the node ${scope.name} (${scope.type}) cannot hold icons` });

  const all = scope.findAll((n) => n.type === 'COMPONENT');
  const comps = all.filter((n) => parse(n));
  const others = all.filter((n) => !parse(n));
  if (!comps.length) {
    // other pages of the file with "icon" in their name: build-icons.js offers them
    const iconPages = figma.root.children.filter((p) => p.id !== scope.id && p.name.toLowerCase().includes(INPUT.pageName.toLowerCase())).map((p) => ({ id: p.id, name: p.name }));
    return JSON.stringify({
      ok: false,
      noIcons: true,
      pages: iconPages,
      reason: `no component whose name starts with "icon" or "icons" under "${scope.name}" (${scope.type}) in "${figma.root.name}": ${all.length} components there${all.length ? `, for example ${others.slice(0, 4).map((n) => `"${n.name}"`).join(', ')}` : ''}${iconPages.length ? `. Pages with "${INPUT.pageName}" in their name: ${iconPages.map((p) => `"${p.name}"`).join(', ')}` : ''}`,
    });
  }

  const abs = (n) => { const t = n.absoluteTransform; return [t[0][2], t[1][2]]; };
  const texts = scope.findAll((n) => n.type === 'TEXT');
  const labelOf = (c) => {
    const [cx, cy] = abs(c);
    return texts.find((t) => { const [tx, ty] = abs(t); return Math.abs(tx - (cx + INPUT.labelOffsetX)) <= INPUT.labelTolerance && Math.abs(ty - cy) <= INPUT.labelMaxDy; });
  };

  // a component set (variants) is not copied
  for (const s of scope.findAll((n) => n.type === 'COMPONENT_SET')) { const p = parse(s); if (p) problems.push(`${p.name}: a component set with variants is not copied`); }

  const icons = [];
  const seen = new Set();
  const prefixes = {};
  for (const c of comps) {
    const { name, prefix } = parse(c);
    if (seen.has(name.toLowerCase())) { problems.push(`${name}: two components with this name`); continue; }
    seen.add(name.toLowerCase());
    if (Math.abs(c.width - 24) > 0.01 || Math.abs(c.height - 24) > 0.01) { problems.push(`${name}: size ${c.width} x ${c.height} instead of 24 x 24`); continue; }
    if (c.children.length !== 1 || c.children[0].type !== 'VECTOR') { problems.push(`${name}: ${c.children.length} layers (${c.children.map((k) => k.type).join(', ') || 'none'}) instead of one vector`); continue; }
    const v = c.children[0];
    if (!v.vectorPaths || !v.vectorPaths.length) { problems.push(`${name}: the vector has no path`); continue; }
    if (v.rotation) { problems.push(`${name}: the vector is rotated by ${v.rotation} degrees`); continue; }
    const label = labelOf(c);
    prefixes[prefix] = (prefixes[prefix] || 0) + 1;
    icons.push({ name, description: c.description || '', vector: { x: v.x, y: v.y, paths: v.vectorPaths.map((p) => ({ windingRule: p.windingRule, data: p.data })) }, label: label ? label.characters : null });
  }

  return JSON.stringify({
    ok: true,
    source: { file: figma.root.name, fileKey: figma.fileKey, container: { id: scope.id, type: scope.type, name: scope.name } },
    found: comps.length,
    prefixes,
    otherComponents: { count: others.length, samples: others.slice(0, 6).map((n) => n.name) },
    icons,
    problems,
  });
})()
