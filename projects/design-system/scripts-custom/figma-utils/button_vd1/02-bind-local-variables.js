/**
 * 02-bind-local-variables.js — bind every part of button_vd1 to LOCAL variables
 * ----------------------------------------------------------------------------------
 * Phase 2 of 2. Run after 01-build-structure.js. Looks up every variable BY NAME
 * in the file's local collections and binds each property.
 *
 * Because it only ever resolves LOCAL variables by name, it is structurally
 * impossible to introduce a remote/ghost variable mode. If a variable is missing
 * the script throws with its name — no silent remote fallback.
 *
 * RUN (figma-ds-cli, from the ds-cli package dir):
 *   figma-ds-cli eval --file <path>/02-bind-local-variables.js
 * ----------------------------------------------------------------------------------
 */

await figma.loadAllPagesAsync();
await figma.loadFontAsync({ family: 'Noto Sans', style: 'Medium' });

const comp = figma.root.findAll(n => n.type === 'COMPONENT' && n.name === 'button_vd1')[0];
if (!comp) throw new Error('button_vd1 component not found — run 01-build-structure.js first.');

// ---- local variable lookup (by name) ----------------------------------------
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = {};
allVars.forEach(v => { byName[v.name] = v; });
const V = (name) => {
  const v = byName[name];
  if (!v) throw new Error('Missing LOCAL variable: ' + name);
  if (v.remote) throw new Error('Variable is REMOTE, refusing to bind: ' + name);
  return v;
};

// ---- helpers ----------------------------------------------------------------
const bindPaint = (node, prop, varName) => {
  const paints = node[prop];
  if (!Array.isArray(paints) || !paints.length) throw new Error(prop + ' empty on ' + node.name);
  const next = paints.map(p => p);
  next[0] = figma.variables.setBoundVariableForPaint(next[0], 'color', V(varName));
  node[prop] = next;
};

// ============================ component frame ===============================
comp.setBoundVariable('paddingTop', V('ob/h/button_vd1/layout/padding/vertical'));
comp.setBoundVariable('paddingBottom', V('ob/h/button_vd1/layout/padding/vertical'));
comp.setBoundVariable('paddingLeft', V('ob/h/button_vd1/layout/padding/horizontal'));
comp.setBoundVariable('paddingRight', V('ob/h/button_vd1/layout/padding/horizontal'));
comp.setBoundVariable('itemSpacing', V('ob/h/button_vd1/layout/gap'));
comp.setBoundVariable('minHeight', V('ob/h/button_vd1/layout/min_height'));
['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
  .forEach(f => comp.setBoundVariable(f, V('ob/h/button_vd1/layout/border_radius')));
['strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight']
  .forEach(f => comp.setBoundVariable(f, V('ob/h/button_vd1/layout/border_width')));
comp.setBoundVariable('opacity', V('ob/h/button_vd1/opacity'));
bindPaint(comp, 'fills', 'ob/h/button_vd1/color/bg');
bindPaint(comp, 'strokes', 'ob/h/button_vd1/color/border');

// ---- effects (two drop shadows) ---------------------------------------------
let eff = comp.effects.map(e => e);
const bindEffect = (i, layer) => {
  eff[i] = figma.variables.setBoundVariableForEffect(eff[i], 'color', V('ob/h/button_vd1/shadow/' + layer + '/color'));
  eff[i] = figma.variables.setBoundVariableForEffect(eff[i], 'offsetX', V('ob/h/button_vd1/shadow/' + layer + '/x'));
  eff[i] = figma.variables.setBoundVariableForEffect(eff[i], 'offsetY', V('ob/h/button_vd1/shadow/' + layer + '/y'));
  eff[i] = figma.variables.setBoundVariableForEffect(eff[i], 'radius', V('ob/h/button_vd1/shadow/' + layer + '/blur'));
  eff[i] = figma.variables.setBoundVariableForEffect(eff[i], 'spread', V('ob/h/button_vd1/shadow/' + layer + '/spread'));
};
bindEffect(0, 'layer_1');
bindEffect(1, 'layer_2');
comp.effects = eff;

// ============================ children =======================================
const kid = (name) => comp.children.find(c => c.name === name);
const iconLeft = kid('icon_left');
const labelSystem = kid('label_system');
const labelDesigner = kid('label_designer');
const iconRight = kid('icon_right');
const ring = kid('focus_ring');

const bindTypography = (t) => {
  t.setBoundVariable('fontFamily', V('ob/h/button_vd1/typography/text_label/font_family'));
  t.setBoundVariable('fontSize', V('ob/h/button_vd1/typography/text_label/font_size'));
  t.setBoundVariable('fontWeight', V('ob/h/button_vd1/typography/text_label/font_weight'));
  t.setBoundVariable('lineHeight', V('ob/h/button_vd1/typography/text_label/line_height'));
  t.setBoundVariable('letterSpacing', V('ob/h/button_vd1/typography/text_label/letter_spacing'));
  bindPaint(t, 'fills', 'ob/h/button_vd1/color/fg');
};

// ---- label_system: variable-driven label + visibility -----------------------
labelSystem.setBoundVariable('visible', V('ob/h/button_vd1/show/system_label'));
labelSystem.setBoundVariable('characters', V('ob/h/button_vd1/label'));
bindTypography(labelSystem);

// ---- label_designer: designer text (label-text prop), variable visibility ---
labelDesigner.setBoundVariable('visible', V('ob/h/button_vd1/show/designer_label'));
bindTypography(labelDesigner);

// ---- icons: glyph fill follows fg (visible stays on the component property) -
[iconLeft, iconRight].forEach(ic => {
  ic.findAll(n => ('fills' in n) && Array.isArray(n.fills) && n.fills.length > 0).forEach(v => {
    const next = v.fills.map(p => p);
    next[0] = figma.variables.setBoundVariableForPaint(next[0], 'color', V('ob/h/button_vd1/color/fg'));
    v.fills = next;
  });
});

// ---- focus_ring -------------------------------------------------------------
ring.setBoundVariable('visible', V('ob/h/button_vd1/focus_ring/visible'));
['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
  .forEach(f => ring.setBoundVariable(f, V('ob/h/button_vd1/focus_ring/radius')));
['strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight']
  .forEach(f => ring.setBoundVariable(f, V('ob/h/button_vd1/focus_ring/width')));
bindPaint(ring, 'strokes', 'ob/h/button_vd1/focus_ring/color');

return { bound: true, component: comp.id, note: 'All parts bound to local variables only.' };
