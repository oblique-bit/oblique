#!/usr/bin/env node
/**
 * dimension.js — Dimension docs builder, Figma-variables-only.
 *
 * Reads dimension variables from the live Figma file and rebuilds the 6 tables
 * on the "📐 Dimension: Spacing & Sizing" page (3 categories × static|dynamic).
 *
 * Source-of-truth contract:
 *   - Static dims:  `ob/s/dimension/static/<category>/...` in the `semantic` collection
 *   - Dynamic dims: `ob/s/dimension/dynamic/<category>/...` in the per-category
 *                   collection (density, ui_scale, typography_context)
 *   - Per-token description: `variable.description`
 *
 * Usage:
 *   node dimension.js                       # build everything + validate
 *   node dimension.js --table <id>          # one table only (e.g. --table density-static)
 *   node dimension.js --page <name>         # override target Figma page
 *   node dimension.js --validate            # validate only, no writes (exit 1 on errors)
 */
'use strict';

// 30-minute eval ceiling. Full-build dimension runs on a fresh timestamped
// page can take >10 min because each row is detached + has its preview bar
// swapped, and there are 180 rows. The previous 10-min cap was leaving
// partial pages whenever a from-scratch build was triggered.
process.env.FIG_EVAL_TIMEOUT_MS = process.env.FIG_EVAL_TIMEOUT_MS || '1800000';

const fs            = require('fs');
const os            = require('os');
const path          = require('path');
const { spawnSync } = require('child_process');

const CLI         = process.env.FIG_CLI || 'figma-ds-cli';
const HERE        = __dirname;
const REGISTRY    = path.join(HERE, 'registry.json');
const FIG_CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(name);
  return (i >= 0 && i + 1 < args.length) ? args[i + 1] : def;
}
const TABLE_FILTER = getArg('--table', null);
const PAGE_OVER    = getArg('--page', null);
const VALIDATE_ONLY = args.includes('--validate');

function runEval(scriptText) {
  const tmp = path.join(os.tmpdir(), `dim-${process.pid}-${Date.now()}.js`);
  fs.writeFileSync(tmp, scriptText);
  try {
    const res = spawnSync(CLI, ['run', tmp], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      cwd: FIG_CLI_DIR,
      env: { ...process.env, FIG_EVAL_TIMEOUT_MS: process.env.FIG_EVAL_TIMEOUT_MS }
    });
    if (res.error) throw res.error;
    return { status: res.status, stdout: res.stdout || '', stderr: res.stderr || '' };
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

function extractResult(stdout) {
  const i = stdout.search(/[{[]/);
  if (i < 0) return null;
  for (let end = stdout.length; end > i; end--) {
    try { return JSON.parse(stdout.slice(i, end)); } catch {}
  }
  return null;
}

const PLUGIN_CODE = `
const { registry, tableFilter, pageOverride, validateOnly, provenance } = PAYLOAD;
const log = [];
function L(msg) { log.push(String(msg)); }
const _startTime = Date.now();

// ── helpers (font-aware setText, find utils) ───────────────────────────────
const _pendingTextWrites = [];
function setText(textNode, value) {
  if (!textNode || textNode.type !== 'TEXT') return false;
  const p = (async () => {
    try {
      if (textNode.fontName && textNode.fontName !== figma.mixed) {
        await figma.loadFontAsync(textNode.fontName);
      }
      textNode.characters = String(value == null ? '' : value);
      return true;
    } catch { return false; }
  })();
  _pendingTextWrites.push(p);
  return p;
}
async function flushTextWrites() {
  if (!_pendingTextWrites.length) return;
  await Promise.all(_pendingTextWrites);
  _pendingTextWrites.length = 0;
}
function findChild(node, name) { return (node && node.children) ? node.children.find(c => c.name === name) || null : null; }
function findFirstText(node) {
  if (!node) return null;
  if (node.type === 'TEXT') return node;
  if (node.children) for (const c of node.children) { const t = findFirstText(c); if (t) return t; }
  return null;
}

// ── component discovery (by name from registry) ────────────────────────────
const components = {};
async function discoverComponents() {
  // Figma now requires explicit page loading before accessing children of
  // non-current pages. loadAllPagesAsync() is the documented one-shot.
  try { await figma.loadAllPagesAsync(); } catch (e) { L('loadAllPagesAsync failed: ' + e.message); }
  const wanted = new Set(Object.values(registry.componentNames));
  (function walk(n) {
    if ((n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && wanted.has(n.name)) {
      for (const [key, val] of Object.entries(registry.componentNames)) {
        if (val === n.name) components[key] = n;
      }
    }
    if (n.children) for (const c of n.children) walk(c);
  })(figma.root);
  L('components: ' + Object.keys(components).join(','));
}

// ── variable discovery ─────────────────────────────────────────────────────
let allVars = null;
let collMap = null;
async function discoverVariables() {
  allVars = await figma.variables.getLocalVariablesAsync();
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  collMap = Object.fromEntries(cols.map(c => [c.id, c]));
  L('vars: ' + allVars.length);
}

// Size-rank for the t-shirt scale used across dimension tokens. Base sizes get
// ranks 0..4; numeric N-xl sizes get rank 4+N (so 2xl=6, 11xl=15). 'none' is
// special — placed at the very end (rank 999) since it represents a deliberate
// no-spacing token, not a step in the scale.
const _BASE_SIZE_RANKS = { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 };
function rankSize(size) {
  if (size == null) return 999;
  if (size === 'none') return 998;
  if (_BASE_SIZE_RANKS[size] != null) return _BASE_SIZE_RANKS[size];
  const m = /^(\\d+)xl$/.exec(size);
  if (m) return 4 + Number(m[1]);
  return 997;
}

// Parse a token name into { category, size, unit } regardless of which family
// it belongs to. Token paths vary by table:
//   density:            .../density/<size>/<unit>
//   ui_scale flat:      .../ui_scale/<size>/<unit>            (e.g. none/px)
//   ui_scale category:  .../ui_scale/<category>/<size>/<unit>
//   typography_context: .../typography_context/<size>         (no unit segment)
function parseTokenName(varName, prefix) {
  const rest = varName.slice(prefix.length); // drop the table prefix
  const parts = rest.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  const hasUnit = last === 'px' || last === 'rem';
  if (hasUnit) {
    const unit = last;
    if (parts.length >= 3) return { category: parts[0], size: parts[parts.length - 2], unit };
    return { category: null, size: parts[parts.length - 2], unit };
  }
  return { category: null, size: last, unit: '' };
}

// Category ranks for ui_scale, derived from actual token px-ranges in the file:
// micro 1-3 < element 4-12 < spacing 16-32 < container 36-64 < layout 80-192
// < macro 256+. Top-level tokens (null category, size='none', 0px) come first.
// Unknown categories fall through to alphabetical at the end so the build
// never silently drops a category that gets added later.
const _CATEGORY_RANK = {
  micro:     1,
  element:   2,
  spacing:   3,
  container: 4,
  layout:    5,
  macro:     6
};

// Sort comparator: by category rank (null first → micro → … → macro), then
// size-rank, then unit (px before rem). Keeps related tokens grouped and
// ordered by real magnitude rather than alphabetically.
function compareTokens(a, b, prefix) {
  const ka = parseTokenName(a.name, prefix);
  const kb = parseTokenName(b.name, prefix);
  if (ka.category !== kb.category) {
    if (ka.category == null) return -1;
    if (kb.category == null) return 1;
    const rca = _CATEGORY_RANK[ka.category];
    const rcb = _CATEGORY_RANK[kb.category];
    if (rca != null && rcb != null) return rca - rcb;
    if (rca != null) return -1; // known categories come before unknowns
    if (rcb != null) return 1;
    return ka.category.localeCompare(kb.category);
  }
  const ra = rankSize(ka.size), rb = rankSize(kb.size);
  if (ra !== rb) return ra - rb;
  const ua = ka.unit === 'px' ? 0 : 1;
  const ub = kb.unit === 'px' ? 0 : 1;
  if (ua !== ub) return ua - ub;
  return a.name.localeCompare(b.name);
}

function varsForTable(spec) {
  if (!allVars) return [];
  const col = Object.values(collMap).find(c => c.name === spec.collection);
  if (!col) return [];
  return allVars
    .filter(v => v.variableCollectionId === col.id && v.name.startsWith(spec.prefix))
    .filter(v => !/\\/_docs\\//.test(v.name)) // skip family-doc vars
    .sort((a, b) => compareTokens(a, b, spec.prefix));
}

// Group key for a token, per the table's declared 'grouping' scheme.
//   'size_class' → 'base' (xs..xl) or 'extended' (Nxl). 'none' goes 'extended'.
//   'category'   → the category segment from the path, or 'direct' if absent.
//   'none' / undefined → null (no grouping).
function groupKeyForToken(v, spec) {
  const scheme = spec.grouping || 'none';
  if (scheme === 'none') return null;
  const k = parseTokenName(v.name, spec.prefix);
  if (scheme === 'size_class') {
    return rankSize(k.size) < 5 ? 'base' : 'extended';
  }
  if (scheme === 'category') {
    return k.category || 'direct';
  }
  return null;
}

const _GROUP_LABELS = {
  base:     { title: 'Base scale',     description: 'T-shirt sizes (xs → xl)' },
  extended: { title: 'Extended scale', description: 'Numeric sizes (2xl → 11xl)' },
  direct:   { title: 'None',           description: 'Top-level tokens (size = none)' }
};
function groupLabel(key) {
  if (_GROUP_LABELS[key]) return _GROUP_LABELS[key];
  // Category names: capitalize first letter for the title.
  return { title: key.charAt(0).toUpperCase() + key.slice(1), description: '' };
}

function modeIdFor(col, modeName) {
  const m = col.modes.find(x => x.name === modeName);
  return m ? m.modeId : col.defaultModeId;
}

function isRemVariable(v) { return v && (/\\/rem$/.test(v.name) || /\\.rem$/.test(v.name)); }

// Clamp float drift: 22.39999... → '22.4', 1.4000000000000001 → '1.4'.
// Avoids JS toString rendering all 17 digits when the value has IEEE-754 noise.
function formatNumber(num) {
  if (typeof num !== 'number' || !isFinite(num)) return String(num);
  // 4 decimals is enough for both px (whole numbers) and rem (e.g. 1.875).
  const rounded = Math.round(num * 10000) / 10000;
  return String(rounded);
}

// Convention in this design system: a .px variant stores a px number and a
// .rem variant stores its own rem number (e.g. 0.31). Each variant is shown
// in its own unit, no conversion.
function formatValue(v, val) {
  if (val == null) return '';
  if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') return '<alias>';
  const num = (typeof val === 'number') ? val : (val && typeof val.value === 'number' ? val.value : null);
  if (num == null) return String(val);
  if (isRemVariable(v)) return formatNumber(num) + 'rem';
  return formatNumber(num) + 'px';
}

// Px-equivalent for preview-bar sizing. A .rem variant stores rem, so multiply
// by the 16px root font size; a .px variant is already px.
function pxFromValue(v, val) {
  if (val == null) return 0;
  const num = (typeof val === 'number') ? val : (val && typeof val.value === 'number' ? val.value : null);
  if (num == null) return 0;
  return isRemVariable(v) ? num * 16 : num;
}

const PREVIEW_BAR_MAX = 240; // visual cap so big tokens don't overflow the cell

function setPreviewBar(cell, pxValue) {
  if (!cell || !cell.findOne) return;
  const bar = cell.findOne(n => n.type === 'RECTANGLE' && /preview/i.test(n.name));
  if (!bar) return;
  const w = Math.max(1, Math.min(PREVIEW_BAR_MAX, Math.round(pxValue)));
  try { bar.layoutSizingHorizontal = 'FIXED'; } catch {}
  try { bar.resize(w, bar.height || 4); } catch (e) { L('preview resize failed: ' + e.message); }
}

// Replace any RECTANGLE bar in the cell with an INSTANCE of the centralised
// preview_bar component (so color/corner styling is editable in one place).
// Only call after the row has been detached — the cell must be writable.
function swapToPreviewBarComponent(cell, pxValue) {
  if (!cell || !components.previewBar || !cell.findOne) return;
  const w = Math.max(1, Math.min(PREVIEW_BAR_MAX, Math.round(pxValue)));
  const existingBar = cell.findOne(n => (n.type === 'RECTANGLE' || n.type === 'INSTANCE') && /preview/i.test(n.name));
  // If there's already an INSTANCE of our component, just resize it.
  if (existingBar && existingBar.type === 'INSTANCE') {
    try { existingBar.layoutSizingHorizontal = 'FIXED'; } catch {}
    try { existingBar.resize(w, existingBar.height || 4); } catch (e) { L('preview inst resize failed: ' + e.message); }
    return;
  }
  // Otherwise replace the rectangle with a fresh instance.
  const inst = components.previewBar.createInstance();
  // Always use the literal name — preserves master-default unless the existing
  // bar has a usable string name. Coerce defensively because Figma can hand
  // back figma.mixed (symbol) for some node properties.
  const existingName = existingBar && typeof existingBar.name === 'string' ? existingBar.name : null;
  inst.name = existingName || 'preview_bar';
  // Position in same slot — find the index of the existing bar to preserve layout order.
  const parentChildren = cell.children || [];
  const idx = existingBar ? parentChildren.indexOf(existingBar) : parentChildren.length;
  if (existingBar) { try { existingBar.remove(); } catch {} }
  cell.insertChild(idx < 0 ? parentChildren.length : idx, inst);
  try { inst.layoutSizingHorizontal = 'FIXED'; } catch {}
  try { inst.resize(w, inst.height || 4); } catch (e) { L('preview inst resize failed: ' + e.message); }
}

async function resolveDim(variable, modeName) {
  let cur = variable;
  for (let depth = 0; depth < 8; depth++) {
    const col = collMap[cur.variableCollectionId];
    if (!col) return null;
    const modeId = modeName ? modeIdFor(col, modeName) : col.defaultModeId;
    const val = cur.valuesByMode[modeId];
    if (val == null) return null;
    if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
      cur = await figma.variables.getVariableByIdAsync(val.id);
      if (!cur) return null;
      continue;
    }
    return val;
  }
  return null;
}

// ── page + section management ──────────────────────────────────────────────
// Canvas (page background) color for newly-created builder output pages.
// Hex F0F4F7 = light cool-grey — matches the user's design choice.
const _PAGE_BG = { type: 'SOLID', color: { r: 0xF0/255, g: 0xF4/255, b: 0xF7/255 } };

async function ensurePage() {
  // Explicit --page override wins and skips the timestamp/create flow.
  if (pageOverride) {
    const p = figma.root.children.find(x => x.name === pageOverride);
    if (!p) throw new Error('target page not found: ' + pageOverride);
    await figma.setCurrentPageAsync(p);
    return p;
  }
  // Otherwise: target page name = '<base> YYYY-MM-DD HH:MM' (timestamp from
  // provenance, so it matches the header). Reuse if a page with the exact
  // name exists (idempotent within a minute); create new otherwise. New
  // pages get the canvas color set.
  const ts = (provenance && provenance.pageTs) ? provenance.pageTs : '';
  const name = ts ? (registry.page + ' ' + ts) : registry.page;
  let p = figma.root.children.find(x => x.name === name);
  if (!p) {
    p = figma.createPage();
    p.name = name;
    try { p.backgrounds = [_PAGE_BG]; } catch (e) { L('canvas bg set failed: ' + e.message); }
  }
  await figma.setCurrentPageAsync(p);
  return p;
}

const TABLE_WIDTH = 1580; // matches the section bar / row natural width
const WRAPPER_NAME = 'Dimension Tables';
const WRAPPER_GAP  = 96;
const BG_VAR_NAME  = 'ob/s1/color/neutral/bg/contrast_highest/inversity_normal';

let _bgVar = undefined; // undefined = not searched yet, null = searched + missing
function getBgVar() {
  if (_bgVar !== undefined) return _bgVar;
  _bgVar = allVars.find(v => v.name === BG_VAR_NAME) || null;
  if (!_bgVar) L('warn: bg variable not found: ' + BG_VAR_NAME);
  return _bgVar;
}

function whiteBgFill() {
  const v = getBgVar();
  let fill = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
  if (v) {
    try { fill = figma.variables.setBoundVariableForPaint(fill, 'color', v); }
    catch (e) { L('bind bg var failed: ' + e.message); }
  }
  return fill;
}

// Horizontal-autolayout wrapper with two vertical sub-columns. Static tables go
// in the Left column, dynamic tables in the Right column — matches the manual
// layout the user arranged in the V9.7 file.
const COL_LEFT_NAME  = 'Tables Wrapper Left';
const COL_RIGHT_NAME = 'Tables Wrapper Right';

function configureColumn(col) {
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = WRAPPER_GAP;
  col.primaryAxisSizingMode = 'AUTO';
  col.counterAxisSizingMode = 'AUTO';
  col.primaryAxisAlignItems = 'MIN';
  col.counterAxisAlignItems = 'MIN';
  col.paddingLeft = col.paddingRight = col.paddingTop = col.paddingBottom = 0;
  col.fills = [];
  col.opacity = 1;
}

// Foundation bar: instance of _building_blocks/shared/foundation_bar pinned
// at the top of the build page. Holds the page identity (foundation name) +
// per-page description + the provenance meta string ($build_generation_meta).
// Replaces the older standalone __build_header TEXT.
const OUTER_NAME = 'Dimension Output';
const FOUNDATION_BAR_INSTANCE_NAME = '__foundation_bar';
const FOUNDATION_NAME = 'Dimension';

// Foundation description comes from PAYLOAD.foundationDescription (read
// Node-side from density/static.json's token_family_docs umbrella, since that
// node has export:false and isn't pushed to Figma variables by Tokens Studio).
function getFoundationDescription() {
  return (typeof PAYLOAD !== 'undefined' && PAYLOAD.foundationDescription) || null;
}

// Find the SemiBold-styled __sectionTitle (the "Name of Foundation" slot —
// the ExtraLight one carries the fixed 'Oblique Foundations' branding).
function findFoundationNameNode(inst) {
  if (!inst) return null;
  const titles = inst.findAll(n => n.type === 'TEXT' && n.name === '__sectionTitle');
  for (const t of titles) {
    const fn = t.fontName;
    if (fn && fn !== figma.mixed && /SemiBold/i.test(fn.style)) return t;
  }
  // Fallback: take the last __sectionTitle if styles aren't introspectable.
  return titles.length ? titles[titles.length - 1] : null;
}

async function ensureHeaderAndOuter(page, wrapper, metaText) {
  // Outer VERTICAL frame that hosts [foundation_bar, wrapper] as siblings.
  let outer = page.children.find(c => c.type === 'FRAME' && c.name === OUTER_NAME);
  if (!outer) {
    outer = figma.createFrame();
    outer.name = OUTER_NAME;
    page.appendChild(outer);
  }
  outer.layoutMode = 'VERTICAL';
  outer.itemSpacing = 24;
  outer.primaryAxisSizingMode = 'AUTO';
  outer.counterAxisSizingMode = 'AUTO';
  outer.primaryAxisAlignItems = 'MIN';
  outer.counterAxisAlignItems = 'MIN';
  outer.paddingLeft = outer.paddingRight = outer.paddingTop = outer.paddingBottom = 0;
  outer.fills = [];
  outer.opacity = 1;
  try { outer.x = 0; outer.y = 0; } catch {}

  // Move the HORIZONTAL wrapper inside outer (skip if already child of outer).
  if (wrapper && wrapper.parent !== outer) { try { outer.appendChild(wrapper); } catch {} }

  // Drop the legacy standalone __build_header TEXT node from prior runs.
  for (const c of [...outer.children]) {
    if (c.type === 'TEXT' && c.name === '__build_header') { try { c.remove(); } catch {} }
  }

  // Foundation bar instance: find existing or create.
  let bar = outer.children.find(c => c.type === 'INSTANCE' && c.name === FOUNDATION_BAR_INSTANCE_NAME);
  if (!bar) {
    if (!components.foundationBar) { L('foundationBar component missing — skipping header'); return outer; }
    try { bar = components.foundationBar.createInstance(); }
    catch (e) { L('foundationBar createInstance failed: ' + e.message); return outer; }
    bar.name = FOUNDATION_BAR_INSTANCE_NAME;
    outer.insertChild(0, bar);
  } else {
    try { outer.insertChild(0, bar); } catch {}
  }
  // Always fill the page width.
  try { bar.layoutSizingHorizontal = 'FILL'; } catch (e) { L('foundation_bar FILL failed: ' + e.message); }
  try { bar.layoutAlign = 'STRETCH'; } catch {}

  // Populate the SemiBold __sectionTitle ("Name of Foundation" slot), the
  // $foundation_description (umbrella family-doc description from JSON), and
  // $build_generation_meta. ExtraLight __sectionTitle ("Oblique Foundations")
  // stays at master default.
  const nameNode = findFoundationNameNode(bar);
  if (nameNode) await setText(nameNode, FOUNDATION_NAME);
  const descNode = bar.findOne(n => n.type === 'TEXT' && n.name === '$foundation_description');
  const descText = getFoundationDescription();
  if (descNode && descText) await setText(descNode, descText);
  const metaNode = bar.findOne(n => n.type === 'TEXT' && n.name === '$build_generation_meta');
  if (metaNode) await setText(metaNode, metaText);
  return outer;
}

async function ensureWrapper(page) {
  // findOne (not children.find) so the wrapper is located even when it's
  // already nested inside the outer 'Dimension Output' frame from a prior run.
  let wrapper = page.findOne(c => c.type === 'FRAME' && c.name === WRAPPER_NAME);
  if (!wrapper) {
    wrapper = figma.createFrame();
    wrapper.name = WRAPPER_NAME;
    page.appendChild(wrapper);
  }
  wrapper.layoutMode          = 'HORIZONTAL';
  wrapper.itemSpacing         = WRAPPER_GAP;
  wrapper.primaryAxisSizingMode = 'AUTO';
  wrapper.counterAxisSizingMode = 'AUTO';
  wrapper.primaryAxisAlignItems = 'MIN';
  wrapper.counterAxisAlignItems = 'MIN';
  wrapper.paddingLeft = wrapper.paddingRight = wrapper.paddingTop = wrapper.paddingBottom = 0;
  wrapper.fills = [];
  wrapper.opacity = 1;
  try { wrapper.x = 0; wrapper.y = 0; } catch {}

  // Find/create the two sub-columns inside the wrapper. Look anywhere on the
  // page first (in case prior builds left them at page level), then move them
  // into the wrapper.
  function ensureColumn(name) {
    let col = page.findOne(n => n.type === 'FRAME' && n.name === name);
    if (col && col.parent !== wrapper) { try { wrapper.appendChild(col); } catch {} }
    if (!col) {
      col = figma.createFrame();
      col.name = name;
      wrapper.appendChild(col);
    }
    configureColumn(col);
    return col;
  }
  const left  = ensureColumn(COL_LEFT_NAME);
  const right = ensureColumn(COL_RIGHT_NAME);
  // Enforce order: Left then Right
  try { wrapper.insertChild(0, left); } catch {}
  try { wrapper.insertChild(1, right); } catch {}
  return { wrapper, left, right };
}

// Tables live at PAGE level during the build (NOT inside the wrapper) — putting
// them inside the HORIZONTAL autolayout wrapper while building causes Figma to
// reflow every sibling on each row append, which slows the build ~10×. Tables
// are batch-migrated into the wrapper at the end of main().
// Each table gets a white bg fill bound to the variable
// ob/s1/color/neutral/bg/contrast_highest/inversity_normal.
async function ensureTableFrame(page, tableName) {
  let table = page.findOne(n => n.type === 'FRAME' && n.name === tableName);
  if (table && table.parent !== page) {
    const oldParent = table.parent;
    page.appendChild(table);
    if (oldParent && oldParent.type === 'SECTION' && (!oldParent.children || oldParent.children.length === 0)) {
      try { oldParent.remove(); } catch {}
    }
  }
  if (!table) {
    table = figma.createFrame();
    table.name = tableName;
    page.appendChild(table);
  }
  table.layoutMode = 'VERTICAL';
  table.itemSpacing = 0;
  table.primaryAxisSizingMode = 'AUTO';
  table.counterAxisSizingMode = 'FIXED';
  table.opacity = 1; // reset any stale washed-out state
  table.fills = [whiteBgFill()];
  try { table.resize(TABLE_WIDTH, table.height || 100); } catch {}
  return table;
}

// Reduce existing duplicates inside the table to a single canonical instance.
// Used to make rebuilds idempotent without nuking working rows on crash.
function dedupeBy(table, predicate) {
  const found = table.children.filter(predicate);
  if (found.length <= 1) return found[0] || null;
  for (let i = 1; i < found.length; i++) { try { found[i].remove(); } catch {} }
  return found[0];
}

function stretch(node) {
  if (!node) return;
  // Two APIs, two failure modes — try both. Modern: layoutSizingHorizontal=FILL.
  // Legacy: layoutAlign=STRETCH. Some component instances accept only one of
  // them depending on master config, and Figma silently no-ops the other.
  let setFill = false, setStretch = false;
  try { node.layoutSizingHorizontal = 'FILL'; setFill = true; } catch (e) { L('stretch FILL failed on ' + node.name + ': ' + e.message); }
  try { node.layoutAlign = 'STRETCH'; setStretch = true; } catch (e) { L('stretch STRETCH failed on ' + node.name + ': ' + e.message); }
  if (!setFill && !setStretch) L('stretch: both APIs failed on ' + node.name);
}

async function buildSectionBar(spec) {
  if (!components.sectionBar) return null;
  const inst = components.sectionBar.createInstance();
  inst.name = '_docs/dimension/section_bar';
  await applySectionBarContent(inst, spec);
  return inst;
}

// Set / re-set the title, subtitle (variable prefix), purpose, guideline, and
// hide the tier letter. Safe to call on both freshly-created and existing
// section_bar instances — idempotent.
async function applySectionBarContent(inst, spec) {
  if (!inst) return;
  // Hide the giant tier letter on every build. Dimension page is all-semantic;
  // the 'S' adds visual noise without information. Tier-letter boolean prop
  // exists in the master but isn't wired to visibility, so override the node.
  const tier = inst.findOne(n => n.type === 'TEXT' && n.name === 'tierLetter');
  if (tier) { try { tier.visible = false; } catch {} }

  // Force the inner layout chain to FILL so the section bar's content fills
  // the full table width. The master's 'Layout' frame is FIXED at 794px;
  // without overrides each instance would render at that fixed width and
  // leave the right side blank.
  for (const name of ['Section Content', 'Layout', 'Content', 'Title Row', 'Section Info', 'Description Group']) {
    const node = inst.findOne(n => (n.type === 'FRAME' || n.type === 'INSTANCE') && n.name === name);
    if (!node) continue;
    try { node.layoutSizingHorizontal = 'FILL'; } catch (e) { L('FILL failed on ' + name + ': ' + e.message); }
    try { node.layoutAlign = 'STRETCH'; } catch {}
  }

  // Variable prefix as dotted path for the subtitle line:
  // "ob/s/dimension/static/density/" → "ob.s.dimension.static.density"
  const variablePrefix = (spec.prefix || '').replace(/\\//g, '.').replace(/\\.+$/, '');

  const want = {
    tierLetter: spec.section.tier || 'S',
    title: spec.section.title,
    subtitle: variablePrefix,
    purpose: spec.section.purpose || '',
    guideline: spec.section.guideline || ''
  };
  const props = inst.componentProperties || {};
  const updates = {};
  for (const [bare, val] of Object.entries(want)) {
    const key = Object.keys(props).find(k => k === bare || k.split('#')[0] === bare);
    if (key) updates[key] = String(val);
  }
  if (Object.keys(updates).length) { try { inst.setProperties(updates); } catch (e) { L('section bar setProperties failed: ' + e.message); } }

  // Fallback text writes for fields without a property binding. The subtitle
  // node (__sectionSubTitle) was added to the master manually and isn't yet
  // wired to a TEXT prop, so it always falls through here.
  const map = {
    tierLetter: ['tierLetter'],
    title: ['__sectionTitle', 'title'],
    subtitle: ['__sectionSubTitle', 'subtitle'],
    purpose: ['description', 'purpose'],
    guideline: ['guideline']
  };
  for (const [bare, val] of Object.entries(want)) {
    const key = Object.keys(props).find(k => k === bare || k.split('#')[0] === bare);
    if (key) continue;
    if (val === undefined || val === null || val === '') continue;
    for (const nodeName of map[bare]) {
      const node = inst.findOne(n => n.type === 'TEXT' && n.name === nodeName);
      if (node) { await setText(node, bare === 'purpose' ? 'Purpose: ' + val : String(val)); break; }
    }
  }
}

async function buildStaticHeader() {
  if (!components.headerRow) return null;
  return components.headerRow.createInstance();
}

async function buildModeHeader(modes) {
  const comp = modes.length === 2 ? components.headerRow2mode : components.headerRow3mode;
  if (!comp) return null;
  const inst = comp.createInstance();
  // Header cell naming differs between 2-mode and 3-mode masters:
  //   2-mode: cell_mode_N (FRAME)
  //   3-mode: Header: Mode N (FRAME)
  modes.forEach((m, idx) => {
    const candidates = [
      'Header: Mode ' + (idx + 1),
      'Header: ' + m,
      'cell_mode_' + (idx + 1)
    ];
    for (const cn of candidates) {
      const cell = findChild(inst, cn);
      if (cell) { const t = findFirstText(cell); if (t) { setText(t, m); break; } }
    }
  });
  return inst;
}

function findRowNameNode(inst) {
  // 3-mode + single-mode use 'Cell: Token Name' / 'Cell: Name' frames.
  let node = findFirstText(findChild(inst, 'Cell: Token Name') || findChild(inst, 'Cell: Name'));
  if (node) return node;
  // 2-mode uses '$token.name' as a direct TEXT child.
  return (inst.children || []).find(c => c.type === 'TEXT' && /^\\$?token\\.?name$/.test(c.name)) || null;
}

async function buildStaticRow(v) {
  if (!components.row) return null;
  const inst = components.row.createInstance();
  const nameNode = findFirstText(findChild(inst, 'Cell: Token Name'));
  const descNode = findFirstText(findChild(inst, 'Cell: Description'));
  const valNode  = findFirstText(findChild(inst, 'Cell: Value'));
  const tokenPath = v.name.replace(/\\//g, '.');
  setText(nameNode, tokenPath);
  setText(descNode, v.description || '');
  const val = await resolveDim(v);
  setText(valNode, formatValue(v, val));
  return { instance: inst, v, tokenPath, value: val };
}

async function buildModeRow(v, spec) {
  const comp = spec.modes.length === 2 ? components.row2mode : components.row3mode;
  if (!comp) return null;
  const inst = comp.createInstance();
  const nameNode = findRowNameNode(inst);
  const tokenPath = v.name.replace(/\\//g, '.');
  setText(nameNode, tokenPath);
  const values = {};
  for (let i = 0; i < spec.modes.length; i++) {
    const m = spec.modes[i];
    const val = await resolveDim(v, m);
    values[m] = val;
    const cell = findChild(inst, 'Cell: Mode ' + (i + 1))
              || findChild(inst, 'Cell: ' + m)
              || findChild(inst, 'mode_cell_' + (i + 1));
    if (cell) {
      const t = findFirstText(cell);
      if (t) setText(t, formatValue(v, val));
    }
  }
  return { instance: inst, v, tokenPath, values, modes: spec.modes };
}

// After append + populate, detach the row so we can swap each preview rectangle
// for an instance of the centralised _docs/dimension/preview_bar component
// (instance-internal RECTANGLE widths are read-only in Figma; once detached, the
// cell is writable and we can drop in a top-level instance whose width we own).
async function detachAndSizePreview(rowBuilt, isMode) {
  const inst = rowBuilt.instance;
  let node = inst;
  try { if (typeof inst.detachInstance === 'function') node = inst.detachInstance(); }
  catch (e) { L('detach failed: ' + e.message); }
  if (!isMode) {
    const cell = findChild(node, 'Cell: Preview');
    // Static row master has Cell: Preview at 192px while the header at 352px —
    // align by widening the cell so columns line up under the header.
    if (cell) { try { cell.layoutSizingHorizontal = 'FIXED'; cell.resize(352, cell.height); } catch {} }
    swapToPreviewBarComponent(cell, pxFromValue(rowBuilt.v, rowBuilt.value));
  } else {
    for (let i = 0; i < rowBuilt.modes.length; i++) {
      const m = rowBuilt.modes[i];
      const cell = findChild(node, 'Cell: Mode ' + (i + 1))
                || findChild(node, 'Cell: ' + m)
                || findChild(node, 'mode_cell_' + (i + 1));
      if (cell) swapToPreviewBarComponent(cell, pxFromValue(rowBuilt.v, rowBuilt.values[m]));
    }
  }
  return node;
}

// Group header instance for a given key ('base' | 'extended' | category name).
// Reuses the shared _docs/shared/group_header COMPONENT_SET (variants H3, H4)
// by setting the Size variant to H4 and the title/description TEXT props.
async function buildGroupHeader(key) {
  if (!components.groupHeader) return null;
  // group_header is a COMPONENT_SET (variants Size=H3 | Size=H4). createInstance
  // only lives on individual COMPONENT variants — pick the default (or first).
  const comp = components.groupHeader;
  let inst;
  try {
    if (comp.type === 'COMPONENT_SET') {
      const variant = comp.defaultVariant || (comp.children || []).find(c => c.type === 'COMPONENT');
      if (!variant) { L('groupHeader: COMPONENT_SET has no variants'); return null; }
      inst = variant.createInstance();
    } else {
      inst = comp.createInstance();
    }
  } catch (e) { L('groupHeader createInstance failed: ' + e.message); return null; }
  const lbl = groupLabel(key);
  const want = { Size: 'H4', groupTitle: lbl.title, groupDescription: lbl.description };
  const props = inst.componentProperties || {};
  const updates = {};
  for (const [bare, val] of Object.entries(want)) {
    const k = Object.keys(props).find(pk => pk === bare || pk.split('#')[0] === bare);
    if (k) updates[k] = String(val);
  }
  if (Object.keys(updates).length) {
    try { inst.setProperties(updates); } catch (e) { L('groupHeader setProperties failed: ' + e.message); }
  }
  // Fallback: write TEXT contents directly for any field without a prop binding.
  const fallback = { groupTitle: lbl.title, groupDescription: lbl.description };
  for (const [bare, val] of Object.entries(fallback)) {
    const k = Object.keys(props).find(pk => pk === bare || pk.split('#')[0] === bare);
    if (k) continue;
    const node = inst.findOne(n => n.type === 'TEXT' && n.name === bare);
    if (node) await setText(node, val);
  }
  inst.name = '__group_' + key;
  return inst;
}

// ── build one table ────────────────────────────────────────────────────────
// Additive: don't nuke existing rows. Read what's already in the table, dedupe
// the section bar/header, and only build rows for tokens not yet present
// (matched by token-name TEXT content). Makes rebuilds safe to interrupt —
// partial state is preserved between runs.
async function buildTable(page, spec) {
  const table = await ensureTableFrame(page, spec.tableName);
  const tokens = varsForTable(spec);
  const result = { id: spec.id, ok: true, info: { tokenCount: tokens.length, rowsBuilt: 0, rowsKept: 0 } };

  // Section bar: keep canonical or build a new one. Always re-apply content so
  // existing section bars pick up new overrides (hide tier letter, multi-line
  // title with variable prefix, etc.).
  let sb = dedupeBy(table, c => c.type === 'INSTANCE' && /section_bar$/.test(c.name));
  if (!sb) {
    sb = await buildSectionBar(spec);
    if (sb) { table.insertChild(0, sb); stretch(sb); }
  } else {
    await applySectionBarContent(sb, spec);
    try { table.insertChild(0, sb); } catch {}
    stretch(sb);
  }

  // Header row: keep canonical or build a new one
  let header = dedupeBy(table, c => c.type === 'INSTANCE' && /header_row(_2mode|_3mode)?$/.test(c.name));
  if (!header) {
    header = spec.kind === 'static'
      ? await buildStaticHeader()
      : await buildModeHeader(spec.modes);
    if (header) { table.insertChild(1, header); stretch(header); }
  } else {
    try { table.insertChild(1, header); } catch {}
    stretch(header);
  }

  // Map token-name → existing row node (by reading the name TEXT content).
  // Anything that looks like a row but has no name is a stale half-built leftover
  // from a crashed run — drop it.
  const existing = new Map();
  for (const c of [...table.children]) {
    if (c === sb || c === header) continue;
    // Slash prefix excludes header_row — its component name is _docs/dimension/header_row,
    // which ends with "/header_row", not "/row".
    if (!/\\/row(_2mode|_3mode)?$/.test(c.name)) continue;
    const nameNode = findRowNameNode(c);
    const txt = nameNode ? String(nameNode.characters || '').trim() : '';
    // Skip the master-default placeholder string the build leaves on unset rows
    // and any row that hasn't had its name written yet — both are stale.
    if (!txt || txt === '$token.name') { try { c.remove(); } catch {} continue; }
    if (existing.has(txt)) { try { c.remove(); } catch {} continue; } // dedupe by token name
    existing.set(txt, c);
  }
  result.info.rowsKept = existing.size;

  // Only build rows for tokens we don't already have. Track the resulting
  // table-child node per tokenPath so the reorder step at the end can look
  // them up in sorted order regardless of when they were added.
  const rowByPath = new Map(existing);
  let rowsBuilt = 0;
  for (const v of tokens) {
    const tokenPath = v.name.replace(/\\//g, '.');
    if (existing.has(tokenPath)) continue;
    const r = spec.kind === 'static' ? await buildStaticRow(v) : await buildModeRow(v, spec);
    if (r && r.instance) {
      table.appendChild(r.instance);
      stretch(r.instance);
      await flushTextWrites(); // ensure text writes settle before detach
      const detached = await detachAndSizePreview(r, spec.kind !== 'static');
      stretch(detached);
      rowByPath.set(tokenPath, detached);
      rowsBuilt++;
    }
  }
  result.info.rowsBuilt = rowsBuilt;

  // Bucket sorted tokens by their group key. tokens is already in compareTokens
  // order, so each group's rows come out in the desired order.
  const groupOrder = []; // unique groupKeys in first-seen order
  const groupRows = new Map(); // groupKey → row nodes (in sorted order)
  for (const v of tokens) {
    const key = groupKeyForToken(v, spec);
    const tokenPath = v.name.replace(/\\//g, '.');
    const row = rowByPath.get(tokenPath);
    if (!row) continue;
    const bucket = key == null ? '__nogroup__' : key;
    if (!groupRows.has(bucket)) { groupRows.set(bucket, []); groupOrder.push(bucket); }
    groupRows.get(bucket).push(row);
  }

  // Decide whether to render group headers:
  //   - spec.grouping === 'none' → never
  //   - 1 group → skip (single header above all rows is redundant)
  //   - 2+ groups → render one header per group
  const showHeaders = spec.grouping && spec.grouping !== 'none' && groupOrder.length >= 2;

  // Ensure / dedupe per-group header instances. Headers we no longer need (group
  // empty, or grouping turned off) get removed so the table doesn't leak stale
  // headers from prior runs with a different grouping scheme.
  const wantedHeaderNames = new Set();
  if (showHeaders) for (const key of groupOrder) wantedHeaderNames.add('__group_' + key);
  for (const c of [...table.children]) {
    if (c.type !== 'INSTANCE') continue;
    if (!/^__group_/.test(c.name)) continue;
    if (!wantedHeaderNames.has(c.name)) { try { c.remove(); } catch {} }
  }
  const headerByKey = new Map();
  if (showHeaders) {
    for (const key of groupOrder) {
      const wanted = '__group_' + key;
      let gh = table.children.find(c => c.type === 'INSTANCE' && c.name === wanted);
      if (!gh) {
        gh = await buildGroupHeader(key);
        if (gh) table.appendChild(gh);
      }
      if (gh) { stretch(gh); headerByKey.set(key, gh); }
    }
  }

  // Final reorder: [sectionBar, headerRow, (groupHeader, ...rows)+]
  await flushTextWrites();
  const ordered = [];
  if (sb) ordered.push(sb);
  if (header) ordered.push(header);
  for (const key of groupOrder) {
    if (showHeaders && headerByKey.has(key)) ordered.push(headerByKey.get(key));
    for (const r of groupRows.get(key) || []) ordered.push(r);
  }
  for (let i = 0; i < ordered.length; i++) {
    try { table.insertChild(i, ordered[i]); } catch (e) { L('reorder fail at ' + i + ': ' + e.message); }
  }

  return result;
}

// ── validation ─────────────────────────────────────────────────────────────
const DEFAULTS = ['Tier title', 'Purpose: Description text', 'Guideline: Description text'];

async function validatePage(page) {
  const errors = [];
  const warnings = [];
  const stats = { totalRows: 0, byTable: {} };
  for (const spec of registry.tables) {
    if (tableFilter && tableFilter !== spec.id) continue;
    // Tables live inside the HORIZONTAL wrapper frame on the page; findAll
    // tolerates either nesting state (wrapper-child or page-child) and the
    // count check still catches duplication.
    const tableFrames = page.findAll(c => c.name === spec.tableName && c.type === 'FRAME');
    if (tableFrames.length !== 1) {
      errors.push({ code: 'DUP', id: spec.id, msg: 'expected 1 table frame on page, got ' + tableFrames.length });
      continue;
    }
    const table = tableFrames[0];
    const sectionBars = table.children.filter(c => c.type === 'INSTANCE' && (c.name === registry.componentNames.sectionBar || /section_bar/.test(c.name)));
    if (sectionBars.length !== 1) errors.push({ code: 'DUP', id: spec.id, msg: 'expected 1 section bar, got ' + sectionBars.length });
    if (sectionBars[0]) {
      const sb = sectionBars[0];
      for (const tn of ['__sectionTitle', 'description']) {
        const node = sb.findOne(n => n.type === 'TEXT' && n.name === tn);
        const txt = node ? String(node.characters || '').trim() : '';
        if (!txt) errors.push({ code: 'SECTBAR', id: spec.id, msg: tn + ' empty' });
        else if (DEFAULTS.indexOf(txt) >= 0) errors.push({ code: 'SECTBAR', id: spec.id, msg: tn + ' is default placeholder' });
      }
    }
    const expected = varsForTable(spec).length;
    // Rows may be INSTANCE (un-detached) or FRAME (detached after preview-bar resize).
    const rowInstances = table.children.filter(c =>
      (c.type === 'INSTANCE' || c.type === 'FRAME') &&
      /\\/row(_2mode|_3mode)?$/.test(c.name)
    );
    stats.byTable[spec.id] = { rows: rowInstances.length, expected };
    stats.totalRows += rowInstances.length;
    if (rowInstances.length !== expected) errors.push({ code: 'COUNT', id: spec.id, msg: 'rows: got ' + rowInstances.length + ', expected ' + expected });
    // Per-row content checks
    for (const row of rowInstances) {
      const nameNode = findRowNameNode(row);
      const descCell = findChild(row, 'Cell: Description');
      const descNode = findFirstText(descCell);
      const nameText = nameNode ? String(nameNode.characters || '').trim() : '';
      const descText = descNode ? String(descNode.characters || '').trim() : '';
      if (!nameText) { errors.push({ code: 'EMPTY', id: spec.id, msg: 'row token name empty' }); continue; }
      const varName = nameText.replace(/\\./g, '/');
      const v = allVars.find(x => x.name === varName);
      if (!v) { warnings.push({ code: 'TOKEN', id: spec.id, token: nameText, msg: 'no matching variable' }); continue; }
      if (descCell && descText !== (v.description || '')) {
        errors.push({ code: 'DESC', id: spec.id, token: nameText, msg: 'description mismatch (page: "' + descText.slice(0, 40) + '" vs var: "' + (v.description || '').slice(0, 40) + '")' });
      }
    }
  }
  return { errors, warnings, stats };
}

// ── main ───────────────────────────────────────────────────────────────────
async function main() {
  // Safety gate: refuse to run unless the connected file is in the allowed list.
  // figma-ds-cli silently follows whichever file is focused in Figma Desktop, so
  // without this guard a script can clobber an unrelated file (e.g. Tokens-Preview).
  const currentFile = figma.root.name;
  if (registry.allowedFiles && registry.allowedFiles.length && !registry.allowedFiles.includes(currentFile)) {
    return { error: 'refusing to run on file "' + currentFile + '"; allowed: ' + registry.allowedFiles.join(', ') };
  }
  await discoverComponents();
  await discoverVariables();
  const page = await ensurePage();

  if (validateOnly) {
    const validate = await validatePage(page);
    return { mode: 'validate', validate, log };
  }

  // Move tables out of the wrapper / columns before building so row appends
  // don't trigger autolayout reflow on every sibling. Tables are batch-
  // migrated back into the two columns at the end of main().
  for (const colName of [WRAPPER_NAME, COL_LEFT_NAME, COL_RIGHT_NAME]) {
    const ex = page.findOne(c => c.type === 'FRAME' && c.name === colName);
    if (!ex) continue;
    for (const c of [...ex.children]) {
      if (c.type === 'FRAME' && /^Table: /.test(c.name)) page.appendChild(c);
    }
  }

  const results = [];
  for (const spec of registry.tables) {
    if (tableFilter && tableFilter !== spec.id) continue;
    try {
      const res = await buildTable(page, spec);
      results.push(res);
    } catch (e) { results.push({ id: spec.id, ok: false, error: e.message }); }
  }
  await flushTextWrites();

  // After build: create/configure wrapper + 2 columns, then migrate each table
  // into the correct column based on spec.kind (static → Left, dynamic → Right)
  // in registry order. Done once at the end to avoid per-row reflow.
  const { wrapper, left, right } = await ensureWrapper(page);
  for (const spec of registry.tables) {
    const t = page.findOne(c => c.type === 'FRAME' && c.name === spec.tableName);
    if (!t) continue;
    const target = spec.kind === 'static' ? left : right;
    try { target.appendChild(t); } catch {}
  }

  const validate = await validatePage(page);

  // Build the provenance header text and wrap [header, wrapper] in an outer
  // VERTICAL frame. Records date, script@sha, source file, totals, duration.
  const totalRows = (validate && validate.stats && typeof validate.stats.totalRows === 'number') ? validate.stats.totalRows : 0;
  const errCount  = (validate && validate.errors) ? validate.errors.length : 0;
  const durSec    = ((Date.now() - _startTime) / 1000).toFixed(1);
  const prov      = provenance || {};
  const scriptTag = prov.scriptName + (prov.gitSha ? '@' + prov.gitSha : '');
  const parts = [];
  if (prov.generatedAt) parts.push('Generated ' + prov.generatedAt);
  parts.push(scriptTag);
  parts.push('Source: ' + figma.root.name);
  parts.push(totalRows + ' rows');
  parts.push(errCount + ' error' + (errCount === 1 ? '' : 's'));
  parts.push(durSec + 's');
  const headerText = parts.join(' · ');
  const outer = await ensureHeaderAndOuter(page, wrapper, headerText);
  // Pin the outer frame at origin (replaces the previous wrapper pin).
  try { outer.x = 0; outer.y = 0; } catch {}

  return { results, validate, log };
}

return await main();
`;

// ── Node-side runner ───────────────────────────────────────────────────────
function main() {
  console.log(`\n  Loading registry...`);
  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  console.log(`  ${registry.tables.length} tables on page '${PAGE_OVER || registry.page}'.`);
  if (TABLE_FILTER) console.log(`  Filtering to: ${TABLE_FILTER}`);
  if (VALIDATE_ONLY) console.log('  Mode: validate (no writes)');

  // Provenance for the page header — git SHA, ISO-ish timestamp w/ TZ, script
  // relative to repo root. Soft failures: header still renders without git
  // info if not in a repo.
  let gitSha = null;
  try {
    gitSha = require('child_process').execSync('git rev-parse --short HEAD', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {}
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const tzPart = new Intl.DateTimeFormat('en', { timeZoneName: 'short' }).formatToParts(now).find(p => p.type === 'timeZoneName');
  const generatedAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}${tzPart ? ' ' + tzPart.value : ''}`;
  // Same minute-precision timestamp used to suffix the build page name. No TZ
  // marker here — keeps Figma page names short.
  const pageTs = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const scriptRel = 'scripts-custom/figma-doc-builders/dimension/dimension.js';

  // Foundation description — umbrella family-doc text from
  // src/lib/themes/03_semantic/dimension/density/static.json. Tokens Studio
  // doesn't push family-docs to Figma variables (export:false), so we read the
  // JSON directly and pass the string in PAYLOAD.
  let foundationDescription = null;
  try {
    const repoRoot = path.resolve(HERE, '..', '..', '..');
    const tokJson = path.join(repoRoot, 'src', 'lib', 'themes', '03_semantic', 'dimension', 'density', 'static.json');
    const tokens = JSON.parse(fs.readFileSync(tokJson, 'utf8'));
    const desc = tokens && tokens.ob && tokens.ob.s && tokens.ob.s.dimension
      && tokens.ob.s.dimension.token_family_docs
      && tokens.ob.s.dimension.token_family_docs.$description
      && tokens.ob.s.dimension.token_family_docs.$description.$value;
    if (typeof desc === 'string' && desc.trim()) foundationDescription = desc.trim();
  } catch (e) { /* leave null — bar keeps master default */ }

  const payload = { registry, tableFilter: TABLE_FILTER, pageOverride: PAGE_OVER, validateOnly: VALIDATE_ONLY, foundationDescription, provenance: { gitSha, generatedAt, pageTs, scriptRel, scriptName: 'dimension.js' } };
  const script = `(async () => {\nconst PAYLOAD = ${JSON.stringify(payload)};\n${PLUGIN_CODE}\n})()`;

  const t0 = Date.now();
  const { stdout, stderr } = runEval(script);
  const data = extractResult(stdout);
  const elapsed = Date.now() - t0;

  if (!data) {
    console.error(`  Build failed (${elapsed}ms).`);
    if (stderr.trim()) console.error('  stderr:', stderr.trim().slice(0, 1000));
    if (stdout.trim()) console.error('  stdout:', stdout.trim().slice(0, 2000));
    process.exit(1);
  }
  if (data.error) { console.error('  ' + data.error); process.exit(1); }

  console.log(`\n  ${data.mode === 'validate' ? 'Validate' : 'Build'} complete in ${(elapsed / 1000).toFixed(1)}s.\n`);

  if (data.log) for (const l of data.log) console.log('  ' + l);

  if (data.results) {
    for (const r of data.results) {
      const status = r.ok ? '✓' : '✗';
      const info = r.info ? `${r.info.tokenCount || 0} tokens, ${r.info.rowsBuilt || 0} rows` : '';
      console.log(`  ${status} ${r.id.padEnd(28)} ${info}`);
      if (r.error) console.log(`      ERROR: ${r.error}`);
    }
  }

  // Validation output
  let validateFailed = false;
  if (data.validate) {
    const v = data.validate;
    const errCount = v.errors ? v.errors.length : 0;
    const warnCount = v.warnings ? v.warnings.length : 0;
    console.log('\nValidation:');
    if (v.stats && v.stats.byTable) {
      for (const [id, s] of Object.entries(v.stats.byTable)) {
        const flag = s.rows === s.expected ? 'ok' : 'MISMATCH';
        console.log('  ' + id.padEnd(28) + ' ' + s.rows + '/' + s.expected + '  ' + flag);
      }
    }
    console.log('  Errors:   ' + errCount);
    console.log('  Warnings: ' + warnCount);
    const cap = 25;
    if (errCount) {
      console.log('\n  -- errors (first ' + Math.min(errCount, cap) + ') --');
      for (const e of v.errors.slice(0, cap)) console.log('  [' + (e.code || '?') + '] ' + (e.id || '') + (e.token ? ' / ' + e.token : '') + ': ' + e.msg);
    }
    if (warnCount) {
      console.log('\n  -- warnings (first ' + Math.min(warnCount, cap) + ') --');
      for (const w of v.warnings.slice(0, cap)) console.log('  [' + (w.code || '?') + '] ' + (w.id || '') + (w.token ? ' / ' + w.token : '') + ': ' + w.msg);
    }
    if (errCount === 0) console.log('\n  Validation OK.\n');
    else { console.error('\nFAIL: ' + errCount + ' validation error(s)\n'); validateFailed = true; }
  }

  if (validateFailed) process.exit(1);
}

main();
