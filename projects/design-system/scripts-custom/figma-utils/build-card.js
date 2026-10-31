(async () => {
  /**
   * build-card.js — build the Card component set on the Components page
   * ----------------------------------------------------------------------------
   * WHY: One variant per valid combination of type (link, checkbox, radio),
   * interaction, availability, selection and focus, bound to the ob/c/card/*
   * variables and the c/card/* text and effect styles. The slots are boolean
   * properties, the texts are text properties. The set gets the elevation
   * level0 mode and its bound paints are refreshed at the end (see
   * refresh-bound-paints.js).
   *
   * Needs the Card tokens exported to Figma first, plus the Button, Infobox and
   * icon components of the same file. The c/card/* styles are created when they
   * are missing and updated when they exist.
   *
   * HOW TO RUN: figma-ds-cli eval -f build-card.js (the last expression is the
   * output). Start with mode scan, it lists what is missing and builds nothing.
   * Apply refuses to run when a set with the same name is already on the page.
   * Keep "(async () => {" as the first line of this file. figma-ds-cli passes
   * only a file that starts with "(async" through unchanged; it wraps any other
   * file that contains "; return" and then prints nothing (see _readme.md).
   * ----------------------------------------------------------------------------
   */

  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'  -> check the prerequisites, build nothing (run this first)
    // 'apply' -> build the set
    mode: 'scan',
    // The page whose name contains this text
    page: 'Components',
    setName: 'card',
    x: 6200,
    y: 0,
    cardWidth: 326,
    // Existing components used inside the card, found by name on any page
    components: {
      buttonSet: 'button/button_standard',
      infoboxSet: 'infobox',
      alertVariant: 'status=info',
      headerIcon: 'icon/info_circle',
      checkIcon: 'icon/checkmark_bold',
    },
    // Explicit mode on the set, otherwise the surface follows the default level
    elevation: { collection: 'elevation', mode: 'level0' },
    // Semantic variable for the image placeholder fill
    placeholderFill: 'ob/s/color/neutral/bg/contrast_low',
  };
  // ==========================================================================

  const CARD_VARS = [
    'spacing/padding_top', 'spacing/padding_right', 'spacing/padding_bottom', 'spacing/padding_left',
    'spacing/row_gap', 'spacing/header/col_gap', 'spacing/footer/col_gap', 'spacing/buttons_container/col_gap',
    'size/image/height', 'size/avatar/width',
    'color/bg', 'color/bg_hover', 'color/bg_active', 'color/bg_disabled',
    'color/border', 'color/border_hover', 'color/border_active', 'color/border_selected',
    'color/border_focus', 'color/border_disabled',
    'color/fg', 'color/fg_subtle', 'color/fg_disabled',
    'border_radius', 'border_width/default', 'border_width/selected', 'border_width/focus',
    'indicator/size/width', 'indicator/size/icon', 'indicator/size/dot', 'indicator/spacing/inset',
    'indicator/border_radius/checkbox', 'indicator/border_radius/radio', 'indicator/border_width',
    'indicator/color/bg', 'indicator/color/bg_selected', 'indicator/color/fg_selected',
    'indicator/color/border', 'indicator/color/border_disabled',
  ].map((n) => 'ob/c/card/' + n).concat(CONFIG.placeholderFill);

  // Style name -> the style it is copied from
  const TEXT_STYLES = { title: 'sm/strong', subtitle: 'xs/normal', text: 'sm/normal', footer: 'xs/normal' };
  const EFFECT_STYLES = { default: 's/shadow/sm', hover: 's/shadow/md' };

  const previousPage = figma.currentPage;
  const page = figma.root.children.find((p) => p.name.includes(CONFIG.page));
  if (!page) return JSON.stringify({ ok: false, error: 'page not found: ' + CONFIG.page });
  await page.loadAsync();

  const vars = await figma.variables.getLocalVariablesAsync();
  const V = Object.fromEntries(vars.map((v) => [v.name, v]));
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();

  const findByName = async (type, name) => {
    for (const p of [page, ...figma.root.children.filter((x) => x !== page)]) {
      await p.loadAsync();
      const hit = p.findAllWithCriteria({ types: [type] }).find((n) => n.name === name);
      if (hit) return hit;
    }
    return null;
  };
  const buttonSet = await findByName('COMPONENT_SET', CONFIG.components.buttonSet);
  const infoboxSet = await findByName('COMPONENT_SET', CONFIG.components.infoboxSet);
  const alertComp = infoboxSet && infoboxSet.children.find((c) => c.name === CONFIG.components.alertVariant);
  const iconComp = await findByName('COMPONENT', CONFIG.components.headerIcon);
  const checkComp = await findByName('COMPONENT', CONFIG.components.checkIcon);
  const buttonVariant = (priority) => buttonSet && buttonSet.children.find(
    (c) => c.name === 'priority=' + priority + ', interaction=rest, availability=enabled, inverse=false'
  );
  const elevation = collections.find((c) => c.name === CONFIG.elevation.collection);
  const elevationMode = elevation && elevation.modes.find((m) => m.name === CONFIG.elevation.mode);

  // ---- prerequisites --------------------------------------------------------
  const missing = [];
  CARD_VARS.forEach((n) => { if (!V[n]) missing.push('variable ' + n); });
  Object.values(TEXT_STYLES).forEach((s) => {
    if (!textStyles.find((t) => t.name === 's/typography/authoring/dynamic/' + s)) missing.push('text style s/typography/authoring/dynamic/' + s);
  });
  Object.values(EFFECT_STYLES).forEach((s) => {
    if (!effectStyles.find((e) => e.name === s)) missing.push('effect style ' + s);
  });
  if (!buttonVariant('primary')) missing.push('button variant priority=primary');
  if (!buttonVariant('secondary')) missing.push('button variant priority=secondary');
  if (!alertComp) missing.push('infobox variant ' + CONFIG.components.alertVariant);
  if (!iconComp) missing.push('component ' + CONFIG.components.headerIcon);
  if (!checkComp) missing.push('component ' + CONFIG.components.checkIcon);
  if (!elevationMode) missing.push('mode ' + CONFIG.elevation.collection + '/' + CONFIG.elevation.mode);
  const existing = page.children.find((n) => n.type === 'COMPONENT_SET' && n.name === CONFIG.setName);

  if (CONFIG.mode !== 'apply' || missing.length || existing) {
    return JSON.stringify({ ok: !missing.length && !existing, mode: CONFIG.mode, missing, existingSetId: existing ? existing.id : null });
  }

  // ---- helpers --------------------------------------------------------------
  await figma.setCurrentPageAsync(page);
  const log = [];
  const C = (n) => V['ob/c/card/' + n];
  const paint = (variable) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', variable);
  const SIDES = ['Top', 'Right', 'Bottom', 'Left'];
  const bindRadius = (node, variable) => ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].forEach((k) => node.setBoundVariable(k + 'Radius', variable));
  const bindStroke = (node, variable) => SIDES.forEach((s) => node.setBoundVariable('stroke' + s + 'Weight', variable));
  const propKey = (props, name) => Object.keys(props).find((k) => k.startsWith(name + '#'));
  const frame = (name, layoutMode) => {
    const f = figma.createFrame();
    f.name = name;
    f.fills = [];
    if (layoutMode) f.layoutMode = layoutMode;
    return f;
  };

  // ---- styles ---------------------------------------------------------------
  const TS = {};
  for (const [key, source] of Object.entries(TEXT_STYLES)) {
    const from = textStyles.find((s) => s.name === 's/typography/authoring/dynamic/' + source);
    const style = textStyles.find((s) => s.name === 'c/card/typography/' + key) || figma.createTextStyle();
    style.name = 'c/card/typography/' + key;
    await figma.loadFontAsync(from.fontName);
    style.fontName = from.fontName;
    style.fontSize = from.fontSize;
    style.lineHeight = from.lineHeight;
    style.letterSpacing = from.letterSpacing;
    style.paragraphSpacing = from.paragraphSpacing;
    for (const [field, alias] of Object.entries(from.boundVariables || {})) {
      const bound = await figma.variables.getVariableByIdAsync(alias.id);
      if (bound) style.setBoundVariable(field, bound);
    }
    TS[key] = style;
  }
  const ES = {};
  for (const [key, source] of Object.entries(EFFECT_STYLES)) {
    const from = effectStyles.find((e) => e.name === source);
    const style = effectStyles.find((e) => e.name === 'c/card/shadow/' + key) || figma.createEffectStyle();
    style.name = 'c/card/shadow/' + key;
    style.effects = from.effects;
    ES[key] = style;
  }

  const text = async (name, chars, style, colorVar) => {
    const t = figma.createText();
    t.name = name;
    await figma.loadFontAsync(style.fontName);
    await t.setTextStyleIdAsync(style.id);
    t.characters = chars;
    t.fills = [paint(colorVar)];
    return t;
  };

  // ---- variant matrix: a disabled card is neither hovered, pressed nor focused,
  // and only the checkbox and radio types can be selected
  const rows = [];
  for (const type of ['link', 'checkbox', 'radio']) {
    const selections = type === 'link' ? ['unselected'] : ['unselected', 'selected'];
    for (const selection of selections) {
      rows.push({ type, selection, availability: 'disabled', interaction: 'rest', focus: 'unfocused' });
      for (const interaction of ['rest', 'hover', 'active']) {
        for (const focus of ['unfocused', 'focused']) rows.push({ type, selection, availability: 'enabled', interaction, focus });
      }
    }
  }

  const stateTokens = (r) => {
    let bg = 'color/bg';
    let border = 'color/border';
    let weight = 'border_width/default';
    if (r.interaction === 'hover') { bg = 'color/bg_hover'; border = 'color/border_hover'; }
    if (r.interaction === 'active') { bg = 'color/bg_active'; border = 'color/border_active'; }
    if (r.selection === 'selected') { border = 'color/border_selected'; weight = 'border_width/selected'; }
    if (r.availability === 'disabled') { bg = 'color/bg_disabled'; border = 'color/border_disabled'; }
    if (r.focus === 'focused') { border = 'color/border_focus'; weight = 'border_width/focus'; }
    return { bg, border, weight };
  };

  // The layers that get a component property, kept per variant so they are not
  // looked up by name later (an instance can hold a layer with the same name)
  const parts = [];

  const buildVariant = async (r) => {
    const disabled = r.availability === 'disabled';
    const selected = r.selection === 'selected';
    const t = stateTokens(r);

    const card = figma.createComponent();
    card.name = 'type=' + r.type + ', interaction=' + r.interaction + ', availability=' + r.availability + ', selection=' + r.selection + ', focus=' + r.focus;
    card.layoutMode = 'VERTICAL';
    card.primaryAxisSizingMode = 'AUTO';
    card.counterAxisSizingMode = 'FIXED';
    card.resize(CONFIG.cardWidth, 100);
    card.itemSpacing = 0;
    card.clipsContent = true;
    card.paddingTop = card.paddingRight = card.paddingBottom = card.paddingLeft = 0;
    bindRadius(card, C('border_radius'));
    card.fills = [paint(C(t.bg))];
    card.strokes = [paint(C(t.border))];
    card.strokeAlign = 'INSIDE';
    bindStroke(card, C(t.weight));
    if (!disabled) await card.setEffectStyleIdAsync((r.interaction === 'hover' ? ES.hover : ES.default).id);

    const fg = disabled ? C('color/fg_disabled') : C('color/fg');
    const fgSubtle = disabled ? C('color/fg_disabled') : C('color/fg_subtle');

    // image
    const image = frame('image');
    image.fills = [paint(V[CONFIG.placeholderFill])];
    card.appendChild(image);
    image.resize(CONFIG.cardWidth, 192);
    image.layoutSizingHorizontal = 'FILL';
    image.layoutSizingVertical = 'FIXED';
    image.setBoundVariable('height', C('size/image/height'));

    // content
    const content = frame('content', 'VERTICAL');
    card.appendChild(content);
    content.layoutSizingHorizontal = 'FILL';
    content.layoutSizingVertical = 'HUG';
    SIDES.forEach((s) => content.setBoundVariable('padding' + s, C('spacing/padding_' + s.toLowerCase())));
    content.setBoundVariable('itemSpacing', C('spacing/row_gap'));

    // alert: the infobox with only its message, so the empty title bar goes too
    const alert = alertComp.createInstance();
    alert.name = 'alert';
    content.appendChild(alert);
    try {
      const k = (n) => propKey(alert.componentProperties, n);
      alert.setProperties({ [k('title')]: false, [k('action-buttons')]: false, [k('dismissible')]: false, [k('message-text')]: 'Alert message' });
    } catch (e) { log.push('alert properties: ' + e.message); }
    const titleBar = alert.findOne((x) => x.name === 'title-bar');
    if (titleBar) titleBar.visible = false;
    alert.layoutSizingHorizontal = 'FILL';

    // header: icon, title and subtitle
    const header = frame('header', 'HORIZONTAL');
    header.counterAxisAlignItems = 'CENTER';
    content.appendChild(header);
    header.layoutSizingHorizontal = 'FILL';
    header.layoutSizingVertical = 'HUG';
    header.setBoundVariable('itemSpacing', C('spacing/header/col_gap'));
    const avatar = frame('header-icon', 'HORIZONTAL');
    avatar.primaryAxisAlignItems = 'CENTER';
    avatar.counterAxisAlignItems = 'CENTER';
    header.appendChild(avatar);
    avatar.layoutSizingHorizontal = 'FIXED';
    avatar.layoutSizingVertical = 'FIXED';
    avatar.resize(48, 48);
    avatar.setBoundVariable('width', C('size/avatar/width'));
    avatar.setBoundVariable('height', C('size/avatar/width'));
    const icon = iconComp.createInstance();
    icon.name = 'icon';
    avatar.appendChild(icon);
    const titles = frame('text-container', 'VERTICAL');
    header.appendChild(titles);
    titles.layoutSizingHorizontal = 'FILL';
    titles.layoutSizingVertical = 'HUG';
    const title = await text('title', 'Headline', TS.title, fg);
    const subtitle = await text('subtitle', 'Secondary text', TS.subtitle, fgSubtle);
    titles.appendChild(title);
    titles.appendChild(subtitle);
    title.layoutSizingHorizontal = 'FILL';
    subtitle.layoutSizingHorizontal = 'FILL';

    // text
    const body = await text('text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', TS.text, fg);
    content.appendChild(body);
    body.layoutSizingHorizontal = 'FILL';

    // footer
    const footer = frame('footer', 'HORIZONTAL');
    footer.primaryAxisAlignItems = 'SPACE_BETWEEN';
    content.appendChild(footer);
    footer.layoutSizingHorizontal = 'FILL';
    footer.layoutSizingVertical = 'HUG';
    footer.setBoundVariable('itemSpacing', C('spacing/footer/col_gap'));
    const left = await text('footer-left', 'Footer left', TS.footer, fgSubtle);
    const right = await text('footer-right', 'Footer right', TS.footer, fgSubtle);
    footer.appendChild(left);
    footer.appendChild(right);
    left.layoutSizingHorizontal = 'HUG';
    right.layoutSizingHorizontal = 'HUG';

    // buttons
    const buttons = frame('buttons', 'HORIZONTAL');
    content.appendChild(buttons);
    buttons.layoutSizingHorizontal = 'FILL';
    buttons.layoutSizingVertical = 'HUG';
    buttons.setBoundVariable('itemSpacing', C('spacing/buttons_container/col_gap'));
    for (const [priority, label] of [['primary', 'Primary'], ['secondary', 'Secondary']]) {
      const button = buttonVariant(priority).createInstance();
      button.name = 'button-' + priority;
      buttons.appendChild(button);
      try {
        const k = (n) => propKey(button.componentProperties, n);
        const props = { [k('label-text')]: label, [k('icon-left')]: false, [k('icon-right')]: false };
        if (disabled) props.availability = 'disabled';
        button.setProperties(props);
      } catch (e) { log.push('button properties: ' + e.message); }
    }

    // selection indicator of the checkbox and radio types, on top of the image
    if (r.type !== 'link') {
      const indicator = frame('selection-indicator', 'HORIZONTAL');
      card.appendChild(indicator);
      indicator.layoutPositioning = 'ABSOLUTE';
      indicator.constraints = { horizontal: 'MAX', vertical: 'MIN' };
      indicator.primaryAxisAlignItems = 'CENTER';
      indicator.counterAxisAlignItems = 'CENTER';
      indicator.primaryAxisSizingMode = 'FIXED';
      indicator.counterAxisSizingMode = 'FIXED';
      indicator.setBoundVariable('width', C('indicator/size/width'));
      indicator.setBoundVariable('height', C('indicator/size/width'));
      bindRadius(indicator, C('indicator/border_radius/' + r.type));
      indicator.fills = [paint(C(selected ? 'indicator/color/bg_selected' : 'indicator/color/bg'))];
      indicator.strokes = [paint(C(disabled ? 'indicator/color/border_disabled' : 'indicator/color/border'))];
      bindStroke(indicator, C('indicator/border_width'));
      // A position cannot be bound, so the inset is read from its variable
      const inset = C('indicator/spacing/inset').resolveForConsumer(card).value;
      indicator.x = card.width - indicator.width - inset;
      indicator.y = inset;
      if (selected && r.type === 'checkbox') {
        const check = checkComp.createInstance();
        check.name = 'checkmark';
        indicator.appendChild(check);
        check.setBoundVariable('width', C('indicator/size/icon'));
        check.setBoundVariable('height', C('indicator/size/icon'));
        check.findAll((v) => 'fills' in v && v.type !== 'INSTANCE' && v.type !== 'FRAME').forEach((v) => {
          v.fills = [paint(C('indicator/color/fg_selected'))];
        });
      }
      if (selected && r.type === 'radio') {
        const dot = figma.createEllipse();
        dot.name = 'dot';
        indicator.appendChild(dot);
        dot.setBoundVariable('width', C('indicator/size/dot'));
        dot.setBoundVariable('height', C('indicator/size/dot'));
        dot.fills = [paint(C('indicator/color/fg_selected'))];
      }
    }
    parts.push({ image, alert, header, footer, buttons, body, title, subtitle });
    return card;
  };

  const comps = [];
  for (const r of rows) comps.push(await buildVariant(r));

  // ---- the set --------------------------------------------------------------
  const set = figma.combineAsVariants(comps, page);
  set.name = CONFIG.setName;
  set.fills = [];
  const columns = 7;
  const gap = 40;
  const cellHeight = Math.max(...comps.map((c) => c.height));
  comps.forEach((c, i) => {
    c.x = (i % columns) * (CONFIG.cardWidth + gap);
    c.y = Math.floor(i / columns) * (cellHeight + gap);
  });
  set.resizeWithoutConstraints(
    columns * (CONFIG.cardWidth + gap) - gap,
    Math.ceil(comps.length / columns) * (cellHeight + gap) - gap
  );
  set.x = CONFIG.x;
  set.y = CONFIG.y;
  set.setExplicitVariableModeForCollection(elevation, elevationMode.modeId);

  // ---- component properties -------------------------------------------------
  const P = {};
  for (const slot of ['image', 'alert', 'header', 'text', 'footer', 'buttons']) P[slot] = set.addComponentProperty(slot, 'BOOLEAN', true);
  P.title = set.addComponentProperty('title', 'TEXT', 'Headline');
  P.subtitle = set.addComponentProperty('subtitle', 'TEXT', 'Secondary text');
  P.body = set.addComponentProperty('text-content', 'TEXT', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.');
  for (const part of parts) {
    for (const slot of ['image', 'alert', 'header', 'footer', 'buttons']) {
      part[slot].componentPropertyReferences = { visible: P[slot] };
    }
    part.body.componentPropertyReferences = { visible: P.text, characters: P.body };
    part.title.componentPropertyReferences = { characters: P.title };
    part.subtitle.componentPropertyReferences = { characters: P.subtitle };
  }

  // ---- write the resolved colors back into the bound paints -----------------
  let refreshed = 0;
  for (const node of [set, ...set.findAll(() => true)]) {
    let inInstance = false;
    for (let p = node.parent; p && p !== set; p = p.parent) {
      if (p.type === 'INSTANCE') { inInstance = true; break; }
    }
    if (inInstance) continue;
    for (const prop of ['fills', 'strokes']) {
      const paints = node[prop];
      if (!Array.isArray(paints) || !paints.length) continue;
      let changed = false;
      const next = [];
      for (const p of paints) {
        const alias = p.type === 'SOLID' && p.boundVariables && p.boundVariables.color;
        const variable = alias ? await figma.variables.getVariableByIdAsync(alias.id) : null;
        let value = null;
        if (variable) { try { value = variable.resolveForConsumer(node).value; } catch (e) { value = null; } }
        if (!value || value.r === undefined) { next.push(p); continue; }
        changed = true;
        next.push(figma.variables.setBoundVariableForPaint(
          { ...p, color: { r: value.r, g: value.g, b: value.b }, opacity: value.a !== undefined ? value.a : 1 }, 'color', variable
        ));
      }
      if (changed) { node[prop] = next; refreshed++; }
    }
  }

  // A same-tick batch of synchronous mutations can be lost before the bridge
  // flushes it, so wait before returning (see _readme.md).
  await new Promise((r) => setTimeout(r, 1500));
  await figma.setCurrentPageAsync(previousPage);
  return JSON.stringify({ ok: true, mode: 'apply', id: set.id, variants: comps.length, properties: Object.keys(set.componentPropertyDefinitions), refreshedPaints: refreshed, log });
})()
