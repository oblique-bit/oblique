(async () => {
  /**
   * build-page.js — build the Icons page of the design system file (Figma side of build-icons.js)
   * ----------------------------------------------------------------------------
   * WHY: Case 0 of the icon workflow creates a new icon set. The icons come from a source file (read-source.js),
   * everything around them comes from building blocks: components in the section `_building_blocks/icons` of the page
   * "Authoring Utilities" (the header is the existing `_building_blocks/shared/foundation_bar`). This script makes the
   * page the way the design system file has it today.
   *
   *   page "🧷 Icons"            background colour of the registry
   *   └ section (no name)        white, 1637 px wide, grows with the rows
   *       __foundation_bar       instance of the foundation bar, title "Icons", the info part hidden
   *       Single-purpose icons   instance of `_building_blocks/icons/purpose_box`, purpose=single
   *       Multi-purpose icons    instance of `_building_blocks/icons/purpose_box`, purpose=multi
   *       icon/<name> × N        components 24 x 24, one vector, fill bound to the icon variable, aspect ratio locked
   *       label × N              instance of `_building_blocks/icons/label`, text property = the label text
   *
   * It never deletes or replaces an icon component (the Figma component ID of an icon never changes). Icons that exist
   * stay as they are; icons that are missing are created in the first free slot of the grid. The header and the two boxes
   * are drawn again on every run. Building blocks that exist are not changed.
   *
   * HOW TO RUN: not by hand. build-icons.js fills INPUT between the markers below and runs the result with
   * `figma-ds-cli eval -f`, once per phase:
   *   prepare   checks, restore point, building blocks, page, section, header, boxes
   *   icons     one batch of icons and their labels (batches keep a call short)
   *   finish    size of the section and the check of the whole page
   * Mode `scan` writes nothing and reports what exists and what would be made.
   * ----------------------------------------------------------------------------
   */

  const INPUT = /*__INPUT__*/ { mode: 'scan', phase: 'prepare', fileKeyGuard: null, registry: {}, restorePoint: true, label: 'Before icons builder', batch: [], expected: {}, total: 0 } /*__END__*/;

  const R = INPUT.registry;
  const apply = INPUT.mode === 'apply';
  const t0 = Date.now();
  const notes = [];
  const note = (s) => notes.push(s);
  const done = (extra) => JSON.stringify({ ok: true, mode: INPUT.mode, phase: INPUT.phase, file: figma.root.name, fileKey: figma.fileKey, notes, ms: Date.now() - t0, ...extra });
  const stop = (reason, extra) => JSON.stringify({ ok: false, phase: INPUT.phase, reason, notes, ...extra });

  if (apply && INPUT.fileKeyGuard !== figma.fileKey) {
    return stop('FILE KEY GUARD: refusing to write', { expected: INPUT.fileKeyGuard, open: { fileKey: figma.fileKey, name: figma.root.name } });
  }

  // ---------------------------------------------------------------- lookups
  const prefix = R.namePrefix;
  const isIcon = (n) => n.type === 'COMPONENT' && n.name.toLowerCase().startsWith(prefix.toLowerCase());
  const pageByName = (name) => figma.root.children.find((p) => p.name === name);
  const absX = (n) => n.absoluteTransform[0][2];
  const absY = (n) => n.absoluteTransform[1][2];
  const G = R.grid;
  const slotXY = (col, row) => ({ x: G.originX + col * G.pitchX, y: G.originY + row * G.pitchY });

  const util = figma.root.children.find((p) => p.name.includes(R.utilitiesPage));
  if (!util) return stop(`the file has no page "${R.utilitiesPage}": the destination must be a branch or a copy of the design system file`);
  await util.loadAsync();
  const findBlock = (name) => util.findAll((n) => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === name)[0] || null;
  const foundationBar = findBlock(R.components.foundationBar);
  if (!foundationBar) return stop(`the component ${R.components.foundationBar} does not exist on "${R.utilitiesPage}": the destination must be a branch or a copy of the design system file`);

  // variables by name
  const localVars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map(localVars.map((v) => [v.name, v]));
  const needed = [...new Set([...Object.values(R.variables), ...R.boxes.map((b) => b.chip.variable)])];
  const missingVars = needed.filter((n) => !varByName.has(n));
  if (missingVars.length) return stop(`the file lacks ${missingVars.length} variables the page is bound to`, { missingVariables: missingVars });
  try { await figma.loadFontAsync(R.font); } catch (e) { return stop(`the font ${R.font.family} ${R.font.style} cannot be loaded: ${e.message}`); }

  // paints bound to a variable; the resolved colour is written back so that an export does not draw the black placeholder
  const boundPaint = (variable, node) => {
    let paint = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', variable);
    try {
      const v = variable.resolveForConsumer(node).value;
      paint = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: v.r, g: v.g, b: v.b }, opacity: v.a === undefined ? 1 : v.a }, 'color', variable);
    } catch (e) { note(`resolved colour of ${variable.name} not written back: ${e.message}`); }
    return paint;
  };

  // ---------------------------------------------------------------- the state of the file
  const blocksSection = util.children.find((c) => c.type === 'SECTION' && c.name === R.blocksSection) || null;
  const labelBlock = findBlock(R.components.label);
  const boxBlock = findBlock(R.components.purposeBox);
  const iconsPage = pageByName(R.page) || null;
  if (iconsPage) await iconsPage.loadAsync();
  const holder = iconsPage ? (iconsPage.children.filter((n) => n.type === 'SECTION').find((s) => s.findAll(isIcon).length) || iconsPage.children.find((n) => n.type === 'SECTION') || null) : null;
  const existing = new Map();
  if (iconsPage) for (const c of iconsPage.findAll(isIcon)) existing.set(c.name.slice(prefix.length), c);
  const state = { blocksSection: !!blocksSection, labelBlock: !!labelBlock, purposeBox: !!boxBlock, page: !!iconsPage, section: !!holder, existingIcons: existing.size };

  if (INPUT.mode === 'scan' && INPUT.phase !== 'icons') {
    return done({ state, wouldMake: { blocksSection: !blocksSection, labelBlock: !labelBlock, purposeBox: !boxBlock, page: !iconsPage, section: !holder, header: true, boxes: R.boxes.length }, requirementsOk: true });
  }

  // ================================================================ phase prepare
  const textOf = async (parent, props) => { const t = figma.createText(); parent.appendChild(t); Object.assign(t, props); return t; };

  const makeLabelBlock = async (section) => {
    const c = figma.createComponent();
    c.name = R.components.label;
    c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO';
    c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 0; c.itemSpacing = 0;
    c.fills = []; c.clipsContent = false;
    const t = figma.createText();
    c.appendChild(t);
    t.name = 'name';
    t.fontName = R.font; t.fontSize = R.label.size;
    t.lineHeight = { unit: 'PIXELS', value: R.label.lineHeightPx };
    t.letterSpacing = { unit: 'PERCENT', value: R.label.letterSpacingPercent };
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.characters = 'label';
    t.fills = [{ type: 'SOLID', color: R.label.color }];
    const key = c.addComponentProperty('name', 'TEXT', 'label');
    t.componentPropertyReferences = { characters: key };
    section.appendChild(c);
    return c;
  };

  const makeBoxVariant = async (box) => {
    const B = R.box;
    const c = figma.createComponent();
    c.name = `purpose=${box.purpose}`;
    c.layoutMode = 'VERTICAL'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED';
    c.primaryAxisAlignItems = 'MIN'; c.counterAxisAlignItems = 'MIN';
    c.itemSpacing = B.gap; c.paddingTop = c.paddingRight = c.paddingBottom = c.paddingLeft = B.padding;
    c.resizeWithoutConstraints(B.width, B.height);
    c.clipsContent = true; c.cornerRadius = 0;
    c.fills = [{ type: 'SOLID', color: { r: B.fill.r, g: B.fill.g, b: B.fill.b }, opacity: B.fill.opacity }];
    // the chip
    const chip = figma.createFrame();
    c.appendChild(chip);
    chip.name = 'chip';
    chip.layoutMode = 'HORIZONTAL'; chip.primaryAxisSizingMode = 'AUTO'; chip.counterAxisSizingMode = 'FIXED';
    chip.primaryAxisAlignItems = 'MIN'; chip.counterAxisAlignItems = 'CENTER';
    chip.itemSpacing = B.chip.gap; chip.paddingTop = chip.paddingBottom = B.chip.paddingY; chip.paddingLeft = chip.paddingRight = B.chip.paddingX;
    chip.resizeWithoutConstraints(chip.width, B.chip.height);
    chip.cornerRadius = B.chip.radius; chip.clipsContent = true;
    chip.fills = [boundPaint(varByName.get(box.chip.variable), chip)];
    const ct = figma.createText();
    chip.appendChild(ct);
    ct.name = box.chip.text;
    ct.fontName = R.font; ct.fontSize = B.chip.textSize;
    ct.lineHeight = { unit: 'PIXELS', value: B.chip.lineHeightPx };
    ct.letterSpacing = { unit: 'PERCENT', value: B.chip.letterSpacingPercent };
    ct.textAlignVertical = 'CENTER'; ct.textAutoResize = 'WIDTH_AND_HEIGHT';
    ct.characters = box.chip.text;
    ct.fills = [boundPaint(varByName.get(R.variables.chipText), ct)];
    // the text with the link
    const body = figma.createText();
    c.appendChild(body);
    body.name = 'Link';
    body.fontName = R.font; body.fontSize = B.body.size;
    body.lineHeight = { unit: 'PIXELS', value: B.body.lineHeightPx };
    body.letterSpacing = { unit: 'PERCENT', value: B.body.letterSpacingPercent };
    body.characters = box.segments.map((s) => s.text).join('');
    body.layoutAlign = 'STRETCH';
    body.textAutoResize = 'HEIGHT';
    let at = 0;
    for (const s of box.segments) {
      const end = at + s.text.length;
      body.setRangeFills(at, end, [boundPaint(varByName.get(s.variable), body)]);
      if (s.hyperlink) body.setRangeHyperlink(at, end, { type: 'URL', value: s.hyperlink });
      if (s.underline) body.setRangeTextDecoration(at, end, 'UNDERLINE');
      at = end;
    }
    return c;
  };

  const ensureBlocks = async () => {
    await figma.setCurrentPageAsync(util);
    const made = [];
    let sec = blocksSection;
    if (!sec) {
      sec = figma.createSection();
      sec.name = R.blocksSection;
      const sections = util.children.filter((c) => c.type === 'SECTION' && c !== sec);
      const refName = R.blockLayout.sectionFillFrom;
      const ref = sections.find((s) => s.name === refName) || sections[0];
      sec.fills = ref ? JSON.parse(JSON.stringify(ref.fills)) : [{ type: 'SOLID', color: { r: 0.67, g: 0.71, b: 0.74 } }];
      sec.x = sections.length ? Math.max(...sections.map((s) => s.x + s.width)) + R.blockLayout.gapBetweenSections : 0;
      sec.y = sections.length ? Math.min(...sections.map((s) => s.y)) : 0;
      sec.resizeWithoutConstraints(1000, 800);
      made.push(`section ${R.blocksSection}`);
    }
    const L = R.blockLayout;
    let y = L.paddingTop;
    let lb = labelBlock;
    if (!lb) { lb = await makeLabelBlock(sec); lb.x = L.paddingX; lb.y = y; made.push(R.components.label); }
    y = lb.y + lb.height + L.gapBetweenBlocks;
    let bb = boxBlock;
    if (!bb) {
      const variants = [];
      for (const box of R.boxes) variants.push(await makeBoxVariant(box));
      bb = figma.combineAsVariants(variants, sec);
      bb.name = R.components.purposeBox;
      // the variants are all made at the same spot: stack them with padding and gap, as the other component sets of the page do
      let vy = L.setPadding;
      for (const box of R.boxes) {
        const v = bb.children.find((c) => c.name === `purpose=${box.purpose}`);
        if (!v) continue;
        v.x = L.setPadding; v.y = vy;
        vy += v.height + L.setGap;
      }
      bb.resizeWithoutConstraints(Math.max(...bb.children.map((v) => v.width)) + 2 * L.setPadding, vy - L.setGap + L.setPadding);
      // the purple dashed border Figma gives a component set made in the editor (a set made by a script has none)
      bb.strokes = [{ type: 'SOLID', color: L.setStroke }];
      bb.strokeWeight = 1; bb.dashPattern = [10, 5]; bb.cornerRadius = 5;
      bb.x = L.paddingX; bb.y = y;
      made.push(R.components.purposeBox);
    }
    // the section is as large as its blocks
    const kids = sec.children;
    sec.resizeWithoutConstraints(Math.max(...kids.map((k) => k.x + k.width)) + L.paddingX, Math.max(...kids.map((k) => k.y + k.height)) + L.paddingX);
    return { sec, lb, bb, made };
  };

  const clearChrome = (section) => {
    const chromeNames = new Set([R.header.instanceName, ...R.boxes.map((b) => b.name)]);
    const removed = [];
    for (const n of [...section.children]) if (chromeNames.has(n.name) && !isIcon(n)) { removed.push(n.name); n.remove(); }
    return removed;
  };

  // the building blocks must exist and the variants of a block must not lie on top of each other
  const blockProblems = () => {
    const problems = [];
    for (const name of [R.components.label, R.components.purposeBox]) if (!findBlock(name)) problems.push(`the building block ${name} does not exist`);
    const blockSet = findBlock(R.components.purposeBox);
    if (blockSet && blockSet.type === 'COMPONENT_SET') {
      const vs = blockSet.children;
      for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) {
        const a = vs[i], b = vs[j];
        if (a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height) problems.push(`${R.components.purposeBox}: the variants "${a.name}" and "${b.name}" overlap`);
      }
    }
    return problems;
  };

  // ================================================================ phase blocks: only the building blocks, no page and no icons
  if (INPUT.phase === 'blocks') {
    const missing = !(state.blocksSection && state.labelBlock && state.purposeBox);
    if (missing && INPUT.restorePoint) await figma.saveVersionHistoryAsync(INPUT.label, 'Restore point before the icons builder makes the building blocks');
    const blocks = await ensureBlocks();
    return done({ state, made: { blocks: blocks.made }, problems: blockProblems() });
  }

  if (INPUT.phase === 'prepare') {
    if (INPUT.restorePoint) await figma.saveVersionHistoryAsync(INPUT.label, 'Restore point before the icons builder writes the Icons page and its building blocks');
    const blocks = await ensureBlocks();
    // the page
    let page = iconsPage, pageMade = false;
    if (!page) { page = figma.createPage(); page.name = R.page; pageMade = true; }
    await page.loadAsync();
    await figma.setCurrentPageAsync(page);
    page.backgrounds = [{ type: 'SOLID', color: R.pageBackground, opacity: 1 }];
    // the section
    let sec = holder, secMade = false;
    if (!sec) {
      sec = figma.createSection();
      sec.x = R.section.x; sec.y = R.section.y;
      secMade = true;
    }
    sec.name = R.section.name;
    sec.fills = [{ type: 'SOLID', color: R.section.fill, opacity: 1 }];
    try { sec.strokes = [{ type: 'SOLID', color: { r: R.section.stroke.r, g: R.section.stroke.g, b: R.section.stroke.b }, opacity: R.section.stroke.opacity }]; } catch (e) { note(`the border of the section was not set: ${e.message}`); }
    if (secMade) sec.resizeWithoutConstraints(R.section.width, 1000);
    // the header and the boxes are drawn again
    const removed = clearChrome(sec);
    const header = foundationBar.createInstance();
    sec.appendChild(header);
    header.name = R.header.instanceName;
    header.x = 0; header.y = 0;
    header.resize(R.section.width, header.height);
    const titles = header.findAll((n) => n.type === 'TEXT' && n.name === '__sectionTitle');
    const titleNode = titles.find((t) => /semi/i.test(String(t.fontName && t.fontName.style))) || titles[titles.length - 1];
    if (titleNode) { await figma.loadFontAsync(titleNode.fontName); titleNode.characters = R.header.title; } else note('the header has no __sectionTitle text: the title was not set');
    // the info part of the bar is not used on this page: its texts are empty and everything in it is hidden
    for (const t of header.findAll((x) => x.type === 'TEXT' && (R.header.empty || []).includes(x.name))) { await figma.loadFontAsync(t.fontName); t.characters = ''; }
    for (const n of header.findAll((x) => R.header.hide.includes(x.name))) n.visible = false;
    const boxSet = blocks.bb;
    for (const box of R.boxes) {
      const variant = boxSet.children.find((v) => v.name === `purpose=${box.purpose}`);
      if (!variant) { note(`no variant purpose=${box.purpose} in ${boxSet.name}`); continue; }
      const inst = variant.createInstance();
      sec.appendChild(inst);
      inst.name = box.name; inst.x = box.x; inst.y = box.y;
    }
    return done({ state, made: { blocks: blocks.made, page: pageMade, section: secMade }, removedChrome: removed, header: { w: header.width, h: header.height, title: titleNode ? titleNode.characters : null }, sectionId: sec.id, labelPropertyKey: Object.keys(blocks.lb.componentPropertyDefinitions).find((k) => k.startsWith('name#')) });
  }

  // ================================================================ phase icons
  if (INPUT.phase === 'icons' && !apply) {
    const kept = INPUT.batch.filter((it) => existing.has(it.name)).length;
    return done({ created: INPUT.batch.length - kept, kept, failed: [] });
  }
  if (!iconsPage || !holder) return stop('the Icons page and its section do not exist yet: run the phase prepare first');
  const section = holder;
  const lb = labelBlock;
  if (!lb) return stop(`the building block ${R.components.label} does not exist`);
  const propKey = Object.keys(lb.componentPropertyDefinitions).find((k) => k.startsWith('name#'));
  if (!propKey) return stop(`${R.components.label} has no text property "name"`);
  const iconVar = varByName.get(R.variables.iconFill);
  const occupied = new Set();
  for (const c of existing.values()) occupied.add(`${Math.round((absX(c) - absX(section) - G.originX) / G.pitchX)},${Math.round((absY(c) - absY(section) - G.originY) / G.pitchY)}`);
  const nextSlot = () => { for (let i = 0; ; i++) { const col = i % G.columns, row = Math.floor(i / G.columns); const k = `${col},${row}`; if (!occupied.has(k)) { occupied.add(k); return { col, row, ...slotXY(col, row) }; } } };

  // An icon from a Git SVG file: the SVG is imported (one vector, flattened when it has several shapes) and the vector moves into the component.
  const importSvg = (svg) => {
    const frame = figma.createNodeFromSvg(svg);
    const vectors = frame.findAll((n) => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
    if (!vectors.length) { frame.remove(); throw new Error('the SVG has no shape'); }
    let vector = vectors[0];
    if (vectors.length > 1) vector = figma.flatten(vectors, frame);
    return { frame, vector };
  };

  if (INPUT.phase === 'icons') {
    await figma.setCurrentPageAsync(iconsPage);
    const created = [], kept = [], failed = [];
    for (const it of INPUT.batch) {
      if (existing.has(it.name)) { kept.push(it.name); continue; }
      if (!apply) { created.push(it.name); continue; }
      let svgFrame = null;
      try {
        const slot = nextSlot();
        const c = figma.createComponent();
        c.name = prefix + it.name;
        c.resizeWithoutConstraints(G.iconSize, G.iconSize);
        c.clipsContent = true;
        c.fills = [];
        c.description = it.description || '';
        let v;
        if (it.svg) {
          const imported = importSvg(it.svg);
          svgFrame = imported.frame;
          v = imported.vector;
          const dx = absX(v) - absX(svgFrame), dy = absY(v) - absY(svgFrame);
          c.appendChild(v);
          v.x = dx; v.y = dy;
        } else {
          v = figma.createVector();
          c.appendChild(v);
          v.vectorPaths = it.vector.paths.map((p) => ({ windingRule: p.windingRule, data: p.data }));
          v.x = it.vector.x; v.y = it.vector.y;
        }
        v.name = R.icon.layerName;
        v.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
        v.strokes = [];
        v.fills = [boundPaint(iconVar, v)];
        section.appendChild(c);
        c.x = slot.x; c.y = slot.y;
        c.lockAspectRatio();
        const text = it.label !== null && it.label !== undefined ? it.label : it.name;
        const li = lb.createInstance();
        section.appendChild(li);
        li.name = text;
        li.setProperties({ [propKey]: text });
        li.x = slot.x + G.labelOffsetX; li.y = slot.y;
        created.push(it.name);
      } catch (e) { failed.push(`${it.name}: ${e.message}`); }
      finally { if (svgFrame) { try { svgFrame.remove(); } catch (e) { /* already gone */ } } }
    }
    return done({ created: created.length, kept: kept.length, failed, createdNames: created.slice(0, 5) });
  }

  // ================================================================ phase finish
  if (INPUT.phase === 'finish') {
    const comps = iconsPage.findAll(isIcon);
    let maxRow = 0;
    for (const c of comps) maxRow = Math.max(maxRow, Math.round((absY(c) - absY(section) - G.originY) / G.pitchY));
    const height = G.originY + maxRow * G.pitchY + G.iconSize + R.section.bottomMargin;
    if (apply) { section.resizeWithoutConstraints(R.section.width, height); section.x = R.section.x; section.y = R.section.y; }

    // the check of the whole page
    const problems = [];
    const labelBy = (c) => iconsPage.findAll((n) => (n.type === 'TEXT' || n.type === 'INSTANCE') && Math.abs(absX(n) - (absX(c) + G.labelOffsetX)) <= 1.5 && Math.abs(absY(n) - absY(c)) <= 12 && (n.type === 'INSTANCE' ? n.name !== R.header.instanceName : true))[0];
    let labelsOk = 0, bound = 0, locked = 0;
    for (const c of comps) {
      const short = c.name.slice(prefix.length);
      if (Math.abs(c.width - G.iconSize) > 0.01 || Math.abs(c.height - G.iconSize) > 0.01) problems.push(`${short}: size ${c.width} x ${c.height}`);
      const vs = c.children;
      if (vs.length !== 1 || vs[0].type !== 'VECTOR' || vs[0].name !== R.icon.layerName) { problems.push(`${short}: layers ${vs.map((k) => `${k.type}:${k.name}`).join(', ')}`); continue; }
      const f = vs[0].fills[0];
      if (f && f.boundVariables && f.boundVariables.color) bound++; else problems.push(`${short}: the fill is not bound to a variable`);
      if (c.targetAspectRatio) locked++; else problems.push(`${short}: the aspect ratio is not locked`);
      const l = labelBy(c);
      const text = l ? (l.type === 'TEXT' ? l.characters : (l.findAll((n) => n.type === 'TEXT')[0] || {}).characters) : null;
      const want = INPUT.expected[short] !== undefined && INPUT.expected[short] !== null ? INPUT.expected[short] : short;
      if (text === want) labelsOk++; else problems.push(`${short}: label ${JSON.stringify(text)} instead of ${JSON.stringify(want)}`);
    }
    const header = section.children.find((n) => n.type === 'INSTANCE' && n.name === R.header.instanceName);
    if (!header) problems.push('the header instance is missing');
    for (const box of R.boxes) if (!section.children.find((n) => n.type === 'INSTANCE' && n.name === box.name)) problems.push(`the box "${box.name}" is missing`);
    problems.push(...blockProblems());
    if (INPUT.total && comps.length !== INPUT.total) problems.push(`${comps.length} icon components on the page, the source has ${INPUT.total}`);
    return done({ icons: comps.length, rows: maxRow + 1, sectionHeight: Math.round(section.height), sectionName: section.name, boundFills: bound, lockedAspect: locked, labelsOk, header: header ? { w: header.width, h: header.height } : null, problems: problems.slice(0, 40), problemCount: problems.length });
  }

  return stop(`unknown phase ${INPUT.phase}`);
})()
