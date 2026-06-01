// Recreates the Oblique `button_vd1` master as a self-contained COMPONENT using
// plain hex values instead of variable bindings, so it can be dropped into ANY
// Figma design file with no dependency on the Oblique variable collections.
//
// Usage (open the target Figma design file first, then):
//   figma-ds-cli connect
//   figma-ds-cli eval -f projects/design-system/scripts-custom/figma-utils/create-button-vd1-hex.js
//
// Structure (1:1 with the source master, minus the variable bindings):
//   COMPONENT button_vd1   props: label-text (TEXT), icon-left (BOOL), icon-right (BOOL)
//   ├─ icon_left      placeholder 16×16 slot, hidden  (toggled by icon-left)
//   ├─ label_system   "Bereit", hidden               (token-driven label in the source)
//   ├─ label_designer "Button", visible              (driven by label-text prop)
//   ├─ icon_right     placeholder 16×16 slot, hidden  (toggled by icon-right)
//   └─ focus_ring     3px #8B5CF6 outline, hidden, absolute overlay
//
// Source resolved values: fill #2379A4 · radius 2 · pad 6/12 · gap 6 · minHeight 36
//   · Noto Sans Medium 16 #FFFFFF · stroke #000000 @ opacity 0 (invisible, kept for fidelity)
//   · two DROP_SHADOWs that resolve to 0/0/0 in the default mode (no-op, kept for fidelity)

(async () => {
  if (figma.editorType !== 'figma') {
    return JSON.stringify({ ok: false, error: 'Open a Figma design file (not FigJam) before running.' });
  }

  // ---- helpers ----
  const hexRgb = (hex) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
    };
  };
  const solid = (hex, opacity = 1) => [{ type: 'SOLID', color: hexRgb(hex), opacity, visible: true }];

  // ---- font: Noto Sans Medium, with graceful fallback ----
  const fontCandidates = [
    { family: 'Noto Sans', style: 'Medium' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Roboto', style: 'Medium' },
    { family: 'Inter', style: 'Regular' },
  ];
  let FONT = null;
  for (const f of fontCandidates) {
    try { await figma.loadFontAsync(f); FONT = f; break; } catch (e) { /* try next */ }
  }
  if (!FONT) return JSON.stringify({ ok: false, error: 'No usable font found (tried Noto Sans / Inter / Roboto).' });

  // ---- root component ----
  const c = figma.createComponent();
  c.name = 'button_vd1';
  c.layoutMode = 'HORIZONTAL';
  c.primaryAxisSizingMode = 'AUTO';   // hug width
  c.counterAxisSizingMode = 'AUTO';   // hug height (minHeight forces ≥ 36)
  c.primaryAxisAlignItems = 'CENTER';
  c.counterAxisAlignItems = 'CENTER';
  c.itemSpacing = 6;
  c.paddingTop = 6; c.paddingBottom = 6; c.paddingLeft = 12; c.paddingRight = 12;
  c.cornerRadius = 2;
  c.minHeight = 36;
  c.strokeWeight = 1;
  c.strokeAlign = 'INSIDE';
  c.fills = solid('#2379A4');
  c.strokes = solid('#000000', 0); // invisible in default mode; delete if you don't want it
  c.effects = [
    { type: 'DROP_SHADOW', color: { r: 0.0745, g: 0.1059, b: 0.1333, a: 0.05 }, offset: { x: 0, y: 0 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL', showShadowBehindNode: true },
    { type: 'DROP_SHADOW', color: { r: 0.0745, g: 0.1059, b: 0.1333, a: 0.10 }, offset: { x: 0, y: 0 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL', showShadowBehindNode: true },
  ];

  // placeholder icon slot (16×16 frame + 12×12 white glyph), hidden by default
  const makeIcon = (name) => {
    const f = figma.createFrame();
    f.name = name;
    f.resize(16, 16);
    f.fills = [];
    f.clipsContent = true;
    const glyph = figma.createRectangle();
    glyph.resize(12, 12);
    glyph.cornerRadius = 2;
    glyph.fills = solid('#FFFFFF');
    f.appendChild(glyph);
    glyph.x = 2; glyph.y = 2;
    f.visible = false;
    return f;
  };

  // label text node
  const makeLabel = (name, chars, visible) => {
    const t = figma.createText();
    t.name = name;
    t.fontName = FONT;
    t.characters = chars;
    t.fontSize = 16;
    t.lineHeight = { unit: 'PIXELS', value: 16 };
    t.letterSpacing = { unit: 'PIXELS', value: 0 };
    t.fills = solid('#FFFFFF');
    t.textAlignHorizontal = 'LEFT';
    t.textAlignVertical = 'TOP';
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.visible = visible;
    return t;
  };

  // ---- children, in auto-layout order ----
  const iconLeft = makeIcon('icon_left');
  const labelSystem = makeLabel('label_system', 'Bereit', false);
  const labelDesigner = makeLabel('label_designer', 'Button', true);
  const iconRight = makeIcon('icon_right');
  c.appendChild(iconLeft);
  c.appendChild(labelSystem);
  c.appendChild(labelDesigner);
  c.appendChild(iconRight);

  // ---- focus ring: absolute overlay, hidden, 3px outset on every side ----
  const ring = figma.createRectangle();
  ring.name = 'focus_ring';
  ring.fills = [];
  ring.cornerRadius = 2;
  ring.strokes = solid('#8B5CF6');
  ring.strokeWeight = 3;
  ring.strokeAlign = 'OUTSIDE';
  ring.visible = false;
  c.appendChild(ring);
  ring.layoutPositioning = 'ABSOLUTE';
  ring.resize(c.width + 6, c.height + 6);
  ring.x = -3; ring.y = -3;

  // ---- component properties ----
  const pLabel = c.addComponentProperty('label-text', 'TEXT', 'Button');
  const pIconL = c.addComponentProperty('icon-left', 'BOOLEAN', false);
  const pIconR = c.addComponentProperty('icon-right', 'BOOLEAN', false);
  labelDesigner.componentPropertyReferences = { characters: pLabel };
  iconLeft.componentPropertyReferences = { visible: pIconL };
  iconRight.componentPropertyReferences = { visible: pIconR };

  // ---- place in viewport, select, frame ----
  c.x = Math.round(figma.viewport.center.x - c.width / 2);
  c.y = Math.round(figma.viewport.center.y - c.height / 2);
  figma.currentPage.appendChild(c);
  figma.currentPage.selection = [c];
  figma.viewport.scrollAndZoomIntoView([c]);

  return JSON.stringify({
    ok: true,
    id: c.id,
    name: c.name,
    size: [c.width, c.height],
    font: FONT,
    props: Object.keys(c.componentPropertyDefinitions),
  }, null, 2);
})()
