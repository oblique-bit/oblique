/**
 * 01-build-structure.js — build the button_vd1 component, STATIC values, NO variables
 * ----------------------------------------------------------------------------------
 * Phase 1 of 2. Creates the button_vd1 component from scratch with hardcoded
 * static values and zero variable bindings. Run 02-bind-local-variables.js next
 * to bind every part to the file's LOCAL variables.
 *
 * Two-phase build (structure first, bind second) guarantees no ghost variable
 * modes: nothing remote is ever referenced.
 *
 * RUN (figma-ds-cli, from the ds-cli package dir):
 *   figma-ds-cli eval --file <path>/01-build-structure.js
 *
 * Target: the page named "button" (falls back to current page).
 * Icons: instantiated from a local icon component (ICON_NAME below).
 * ----------------------------------------------------------------------------------
 */

await figma.loadAllPagesAsync();
await figma.loadFontAsync({ family: 'Noto Sans', style: 'Medium' });

// ---- config -----------------------------------------------------------------
const ICON_NAME = 'icon/download'; // local icon component used for icon_left / icon_right

// ---- locate a local icon component ------------------------------------------
const iconComp =
  figma.root.findAll(n => n.type === 'COMPONENT' && n.name === ICON_NAME)[0] ||
  figma.root.findAll(n => n.type === 'COMPONENT' && n.name.indexOf('icon/') === 0)[0];
if (!iconComp) throw new Error('No local icon component found (looked for ' + ICON_NAME + ').');

// ---- target page ------------------------------------------------------------
const page = figma.root.children.find(p => p.name === 'button') || figma.currentPage;
page.children.filter(n => n.name === 'button_vd1' && n.type === 'COMPONENT').forEach(n => n.remove());

// ---- component frame --------------------------------------------------------
const comp = figma.createComponent();
comp.name = 'button_vd1';
page.appendChild(comp);
comp.x = 100; comp.y = 100;
comp.layoutMode = 'HORIZONTAL';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.counterAxisAlignItems = 'CENTER';
comp.paddingTop = 6; comp.paddingBottom = 6; comp.paddingLeft = 12; comp.paddingRight = 12;
comp.itemSpacing = 6;
comp.cornerRadius = 2;
comp.minHeight = 36;
comp.clipsContent = false;
comp.fills = [{ type: 'SOLID', color: { r: 0.13725, g: 0.47451, b: 0.64314 } }];      // primary bg
comp.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];          // border (transparent)
comp.strokeWeight = 1;
comp.strokeAlign = 'INSIDE';
comp.effects = [
  { type: 'DROP_SHADOW', color: { r: 0.07451, g: 0.10588, b: 0.13333, a: 0.05 }, offset: { x: 0, y: 0 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' },
  { type: 'DROP_SHADOW', color: { r: 0.07451, g: 0.10588, b: 0.13333, a: 0.10 }, offset: { x: 0, y: 0 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }
];

// ---- icon_left --------------------------------------------------------------
const iconLeft = iconComp.createInstance();
iconLeft.name = 'icon_left';
comp.appendChild(iconLeft);
iconLeft.visible = false;

// ---- label_system (variable-driven state label) -----------------------------
const labelSystem = figma.createText();
labelSystem.name = 'label_system';
comp.appendChild(labelSystem);
labelSystem.fontName = { family: 'Noto Sans', style: 'Medium' };
labelSystem.fontSize = 16;
labelSystem.lineHeight = { unit: 'PIXELS', value: 16 };
labelSystem.letterSpacing = { unit: 'PIXELS', value: 0 };
labelSystem.textAlignHorizontal = 'LEFT';
labelSystem.characters = 'System';
labelSystem.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
labelSystem.visible = false;

// ---- label_designer (designer's text, label-text property) ------------------
const labelDesigner = figma.createText();
labelDesigner.name = 'label_designer';
comp.appendChild(labelDesigner);
labelDesigner.fontName = { family: 'Noto Sans', style: 'Medium' };
labelDesigner.fontSize = 16;
labelDesigner.lineHeight = { unit: 'PIXELS', value: 16 };
labelDesigner.letterSpacing = { unit: 'PIXELS', value: 0 };
labelDesigner.textAlignHorizontal = 'LEFT';
labelDesigner.characters = 'Button';
labelDesigner.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
labelDesigner.visible = true;

// ---- icon_right -------------------------------------------------------------
const iconRight = iconComp.createInstance();
iconRight.name = 'icon_right';
comp.appendChild(iconRight);
iconRight.visible = false;

// ---- focus_ring (absolute, overflows the button) ----------------------------
const ring = figma.createRectangle();
ring.name = 'focus_ring';
comp.appendChild(ring);
ring.fills = [];
ring.strokes = [{ type: 'SOLID', color: { r: 0.54510, g: 0.36078, b: 0.96471 } }];
ring.strokeWeight = 3;
ring.strokeAlign = 'OUTSIDE';
ring.cornerRadius = 2;
ring.layoutPositioning = 'ABSOLUTE';
ring.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
ring.x = -3; ring.y = -3;
ring.resize(comp.width + 6, comp.height + 6);
ring.visible = false;

// ---- component properties ---------------------------------------------------
const pLabel = comp.addComponentProperty('label-text', 'TEXT', 'Button');
const pLeft = comp.addComponentProperty('icon-left', 'BOOLEAN', false);
const pRight = comp.addComponentProperty('icon-right', 'BOOLEAN', false);
labelDesigner.componentPropertyReferences = { characters: pLabel };
iconLeft.componentPropertyReferences = { visible: pLeft };
iconRight.componentPropertyReferences = { visible: pRight };

return {
  componentId: comp.id,
  page: page.name,
  iconUsed: iconComp.name,
  children: comp.children.map(c => c.name),
  note: 'Structure built with static values. Run 02-bind-local-variables.js to bind.'
};
