(async () => {
  /**
   * export-icon-set.js — dump every icon component of a page with its SVG, for validate-icon-set.mjs
   * ----------------------------------------------------------------------------
   * WHY: the validator checks the icons inside their SVG and in Figma (names,
   * labels, fill binding). The SVG is what the developers receive, so the check
   * runs on the exported string, not on the Figma vector.
   *
   * WHAT IT DOES (read only, changes nothing): finds every COMPONENT whose name
   * starts with CONFIG.namePrefix on the page whose name contains CONFIG.pageName,
   * exports each one as an SVG string and records its Figma facts: size, parent,
   * description, applied styles, children with fills (bound variable, resolved and
   * written color), strokes, effects, bounding box and the label text next to it.
   * It also lists the nodes beside the components that carry the prefix but are
   * not a component (a frame, an instance, a component set): `strays`.
   *
   * HOW TO RUN (from the figma-cli folder, Figma frontmost):
   *   figma-ds-cli eval -f <path>/export-icon-set.js > icon-set.json
   *   node validate-icon-set.mjs icon-set.json
   * Open the file and the page first. Run `figma-ds-cli daemon reconnect` after
   * switching files, so the daemon talks to the right tab.
   * ----------------------------------------------------------------------------
   */

  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // Safety: refuse to run unless the open file has this key. null = any file.
    fileKeyGuard: null,

    // The page whose name contains this text holds the icons.
    pageName: 'Icons',

    // Components whose name starts with this prefix are icons. The match ignores
    // the case, so a name with the wrong case is found and reported, not missed.
    namePrefix: 'icon/',

    // The label is the text node beside the icon: its x is the icon x plus
    // labelOffsetX (tolerance labelTolerance), its y is within labelMaxDy of the icon y.
    labelOffsetX: 32,
    labelTolerance: 1.5,
    labelMaxDy: 12,

    // false = skip the SVG export (fast, Figma checks only).
    includeSvg: true,
  };
  // ==========================================================================

  // icons.mjs fills this block to override CONFIG; empty when the script runs by hand.
  const INPUT = /*__INPUT__*/ {} /*__END__*/;
  Object.assign(CONFIG, INPUT);

  if (CONFIG.fileKeyGuard && figma.fileKey !== CONFIG.fileKeyGuard) {
    return JSON.stringify({
      ok: false,
      reason: 'FILE KEY GUARD — refusing to run',
      expected: CONFIG.fileKeyGuard,
      open: { fileKey: figma.fileKey, name: figma.root.name },
    }, null, 2);
  }

  // exportAsync draws each icon, and Figma does not draw a tab in the background: the export would wait for ever
  if (CONFIG.includeSvg && typeof document !== 'undefined' && document.visibilityState === 'hidden') {
    return JSON.stringify({ ok: false, reason: 'the Figma tab is in the background: click the tab so that Figma draws it, then run the command again' }, null, 2);
  }

  // only the icon page is loaded: loadAllPagesAsync() on a large design system file takes minutes
  const pages = figma.root.children.filter((p) => p.name.includes(CONFIG.pageName));
  if (pages.length !== 1) {
    return JSON.stringify({ ok: false, reason: `${pages.length} pages contain "${CONFIG.pageName}"`, pages: pages.map((p) => p.name) }, null, 2);
  }
  const page = pages[0];
  await page.loadAsync();

  const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const round = (n) => Math.round(n * 100) / 100;
  const variableCache = {};
  const variableName = async (id) => {
    if (!(id in variableCache)) {
      const v = await figma.variables.getVariableByIdAsync(id);
      variableCache[id] = v ? { name: v.name, remote: v.remote, variable: v } : null;
    }
    return variableCache[id];
  };

  const describePaints = async (node, paints) => {
    const out = [];
    for (const p of paints) {
      const entry = { type: p.type, visible: p.visible !== false, opacity: p.opacity === undefined ? 1 : p.opacity };
      if (p.type === 'SOLID') {
        entry.writtenHex = hex(p.color);
        const bound = p.boundVariables && p.boundVariables.color;
        if (bound) {
          const info = await variableName(bound.id);
          entry.boundVariable = info ? info.name : null;
          entry.variableRemote = info ? info.remote : null;
          if (info) {
            try { entry.resolvedHex = hex(info.variable.resolveForConsumer(node).value); } catch (e) { entry.resolvedHex = null; }
          }
        } else {
          entry.boundVariable = null;
        }
      }
      out.push(entry);
    }
    return out;
  };

  const prefixLower = CONFIG.namePrefix.toLowerCase();
  const hasPrefix = (n) => n.name.toLowerCase().startsWith(prefixLower);
  const components = page.findAll((n) => n.type === 'COMPONENT' && hasPrefix(n));

  // styles applied to a layer, by name (a variable binding is not a style)
  const styleNames = async (n, keys) => {
    const out = {};
    for (const k of keys) {
      const v = n[k];
      if (!v) continue;
      if (v === figma.mixed) { out[k] = 'mixed'; continue; }
      const st = await figma.getStyleByIdAsync(v);
      out[k] = st ? st.name : v;
    }
    return out;
  };
  const texts = page.findAll((n) => n.type === 'TEXT');
  const icons = [];

  for (const c of components) {
    const origin = c.absoluteTransform;
    const children = [];
    for (const k of c.children) {
      const box = k.absoluteBoundingBox;
      children.push({
        type: k.type,
        name: k.name,
        visible: k.visible,
        opacity: k.opacity,
        rotation: k.rotation,
        fills: k.fills === figma.mixed ? 'mixed' : await describePaints(k, k.fills),
        strokes: k.strokes ? k.strokes.length : 0,
        effects: k.effects ? k.effects.length : 0,
        styles: await styleNames(k, ['fillStyleId', 'strokeStyleId', 'effectStyleId']),
        bbox: box ? [round(box.x - origin[0][2]), round(box.y - origin[1][2]), round(box.width), round(box.height)] : null,
      });
    }

    const label = texts.find((t) => t.parent === c.parent
      && Math.abs(t.x - (c.x + CONFIG.labelOffsetX)) <= CONFIG.labelTolerance
      && Math.abs(t.y - c.y) <= CONFIG.labelMaxDy);

    icons.push({
      id: c.id,
      name: c.name,
      parentType: c.parent ? c.parent.type : null,
      parentName: c.parent ? c.parent.name : null,
      width: c.width,
      height: c.height,
      visible: c.visible,
      opacity: c.opacity,
      description: c.description,
      componentProperties: Object.keys(c.componentPropertyDefinitions || {}),
      fills: c.fills === figma.mixed ? 'mixed' : c.fills.length,
      strokes: c.strokes.length,
      effects: c.effects.length,
      explicitModes: Object.keys(c.explicitVariableModes || {}).length,
      styles: await styleNames(c, ['fillStyleId', 'strokeStyleId', 'effectStyleId', 'gridStyleId']),
      children,
      label: label ? label.characters : null,
      svg: CONFIG.includeSvg ? await c.exportAsync({ format: 'SVG_STRING' }) : null,
    });
  }

  // nodes beside the icons that carry the prefix but are no component
  const parents = new Set(components.map((c) => c.parent));
  const strays = [];
  for (const parent of parents) {
    for (const k of parent.children) if (k.type !== 'COMPONENT' && hasPrefix(k)) strays.push({ id: k.id, type: k.type, name: k.name });
  }

  return JSON.stringify({
    ok: true,
    source: { fileKey: figma.fileKey, file: figma.root.name, page: page.name, exportedAt: new Date().toISOString() },
    config: { namePrefix: CONFIG.namePrefix },
    count: icons.length,
    strays,
    icons,
  });
})()
