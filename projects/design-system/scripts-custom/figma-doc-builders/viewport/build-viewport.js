#!/usr/bin/env node
/**
 * build-viewport.js — Responsiveness / Viewport docs builder.
 *
 * Reads viewport tokens from src/lib/themes/ JSON files (ob.g.* globals don't
 * land in Figma variables, so we go to the source) and rebuilds the 5 tables
 * on the "📱 Responsiveness" page:
 *
 *   1. Breakpoints                  (ob.g.mode_collection.viewport.breakpoint.<tier>)
 *   2. Ranges                       (ob.g.mode_collection.viewport.range.<tier>.{from,to})
 *   3. CSS Selectors                (ob.g.mode_collection.viewport.css_selector.<tier>)
 *   4. Page Container Widths        (ob.s.dimension.viewport.{min_width,max_width})
 *   5. Header Variant               (ob.c.header.variant)
 *
 * Reference figma page: Iteration 03 in section 12380:53968 of file V9.7.
 *
 * Usage:
 *   node build-viewport.js                      # build everything + validate
 *   node build-viewport.js --table <id>         # one table only
 *   node build-viewport.js --page <name>        # override target Figma page
 *   node build-viewport.js --validate           # validate only, no writes
 */
'use strict';

process.env.FIG_EVAL_TIMEOUT_MS = process.env.FIG_EVAL_TIMEOUT_MS || '900000';

const fs            = require('fs');
const os            = require('os');
const path          = require('path');
const { spawnSync } = require('child_process');

const CLI         = process.env.FIG_CLI || 'figma-ds-cli';
const HERE        = __dirname;
const REGISTRY    = path.join(HERE, 'registry.json');
const FIG_CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');
const REPO_ROOT   = path.resolve(HERE, '..', '..', '..');

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(name);
  return (i >= 0 && i + 1 < args.length) ? args[i + 1] : def;
}
const TABLE_FILTER   = getArg('--table', null);
const PAGE_OVER      = getArg('--page', null);
const VALIDATE_ONLY  = args.includes('--validate');

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));

// ── JSON token loading + resolution ───────────────────────────────────────────

const _loadedJson = {};
function loadJson(rel) {
  if (_loadedJson[rel]) return _loadedJson[rel];
  const full = path.join(REPO_ROOT, rel);
  _loadedJson[rel] = JSON.parse(fs.readFileSync(full, 'utf8'));
  return _loadedJson[rel];
}
function getByPath(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o == null ? null : o[k]), obj);
}

// Build one merged view of viewport.json so range refs resolve to breakpoints.
function buildResolveLookup() {
  const viewport = loadJson('src/lib/themes/01_global/mode_collection/viewport.json');
  return function lookup(dotted) {
    return getByPath(viewport, dotted);
  };
}
function parsePxNumber(v) {
  if (typeof v !== 'string') return null;
  const m = /^(-?\d+(?:\.\d+)?)\s*px$/.exec(v.trim());
  return m ? Number(m[1]) : null;
}
// Resolve a token leaf's $value into a final string. Handles literals, `{ref}`,
// `{ref} - 1`, `{ref} + N`. Recurses through aliases up to 8 levels deep.
function resolveValue(raw, lookup, depth = 0) {
  if (depth > 8 || raw == null) return null;
  if (typeof raw !== 'string') return raw;
  const mathRx = /^\s*\{([^}]+)\}\s*([+\-])\s*(\d+(?:\.\d+)?)\s*$/;
  const mm = mathRx.exec(raw);
  if (mm) {
    const [, ref, op, num] = mm;
    const inner = lookup(ref);
    if (!inner) return null;
    const innerResolved = resolveValue(inner.$value, lookup, depth + 1);
    const innerNum = parsePxNumber(innerResolved);
    if (innerNum == null) return innerResolved;
    const result = op === '+' ? innerNum + Number(num) : innerNum - Number(num);
    return result + 'px';
  }
  const refRx = /^\s*\{([^}]+)\}\s*$/;
  const rm = refRx.exec(raw);
  if (rm) {
    const inner = lookup(rm[1]);
    if (!inner) return null;
    return resolveValue(inner.$value, lookup, depth + 1);
  }
  return raw;
}

// ── Row materialization (one row per table item) ──────────────────────────────

function materializeTable(spec) {
  const src = spec.source;
  if (src.type === 'json-tree')        return materializeJsonTree(src);
  if (src.type === 'json-tree-leaves') return materializeJsonTreeLeaves(src);
  if (src.type === 'json-per-mode')    return materializeJsonPerMode(src);
  throw new Error('unknown source.type: ' + src.type);
}

// Single token per tier — e.g. breakpoint.<tier>, css_selector.<tier>.
function materializeJsonTree(src) {
  const tree = loadJson(src.file);
  const root = getByPath(tree, src.rootPath);
  if (!root) throw new Error('rootPath not found: ' + src.rootPath);
  const lookup = buildResolveLookup();
  const rows = [];
  for (const tier of src.tierKeys) {
    const node = root[tier];
    if (!node || node.$value === undefined) continue;
    rows.push({
      tokenName:   src.tokenNameTemplate.replace('<tier>', tier),
      description: node.$description || '',
      value:       resolveValue(node.$value, lookup) ?? node.$value
    });
  }
  return { kind: 'single', rows };
}

// Two leaves per tier — e.g. range.<tier>.{from,to}. 2xl skips `to`.
function materializeJsonTreeLeaves(src) {
  const tree = loadJson(src.file);
  const root = getByPath(tree, src.rootPath);
  if (!root) throw new Error('rootPath not found: ' + src.rootPath);
  const lookup = buildResolveLookup();
  const rows = [];
  for (const tier of src.tierKeys) {
    const tierNode = root[tier];
    if (!tierNode) continue;
    for (const leaf of src.leafKeys) {
      const node = tierNode[leaf];
      if (!node || node.$value === undefined) continue;
      rows.push({
        tokenName:   src.tokenNameTemplate.replace('<tier>', tier).replace('<leaf>', leaf),
        description: node.$description || '',
        value:       resolveValue(node.$value, lookup) ?? node.$value
      });
    }
  }
  return { kind: 'single', rows };
}

// One row per leaf, value resolved per mode (xs/sm/md/lg/xl/2xl) from per-tier
// JSON files. Multi-value table.
function materializeJsonPerMode(src) {
  const modeValues = {}; // { modeName: { leafName: { $value, $description } } }
  for (const [mode, file] of Object.entries(src.modeFiles)) {
    const tree = loadJson(path.join(src.dir, file));
    const root = getByPath(tree, src.rootPath);
    if (!root) { modeValues[mode] = {}; continue; }
    modeValues[mode] = root;
  }
  const lookup = buildResolveLookup();
  const rows = [];
  for (const leaf of src.leafKeys) {
    const valuesByMode = {};
    let description = '';
    for (const mode of src.modeOrder) {
      const node = modeValues[mode] && modeValues[mode][leaf];
      if (!node) { valuesByMode[mode] = ''; continue; }
      const resolved = resolveValue(node.$value, lookup);
      valuesByMode[mode] = resolved ?? node.$value ?? '';
      if (!description && node.$description) description = node.$description;
    }
    rows.push({
      tokenName:   src.tokenNameTemplate.replace('<leaf>', leaf),
      description,
      valuesByMode,
      modeOrder:   src.modeOrder.slice()
    });
  }
  return { kind: 'multi', rows, modeOrder: src.modeOrder.slice() };
}

// ── eval driver ───────────────────────────────────────────────────────────────

function runEval(scriptText) {
  const tmp = path.join(os.tmpdir(), `viewport-${process.pid}-${Date.now()}.js`);
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

// ── plugin code (runs inside Figma) ───────────────────────────────────────────

const PLUGIN_CODE = `
const { registry, tables, tableFilter, pageOverride, validateOnly } = PAYLOAD;
const log = [];
function L(m) { log.push(String(m)); }

const _pendingTextWrites = [];
function setText(node, value) {
  if (!node || node.type !== 'TEXT') return;
  const p = (async () => {
    try {
      if (node.fontName && node.fontName !== figma.mixed) {
        await figma.loadFontAsync(node.fontName);
      }
      node.characters = String(value == null ? '' : value);
    } catch (e) { L('setText failed: ' + e.message); }
  })();
  _pendingTextWrites.push(p);
}
async function flushTextWrites() {
  if (!_pendingTextWrites.length) return;
  await Promise.all(_pendingTextWrites);
  _pendingTextWrites.length = 0;
}
function findChild(node, name) {
  return (node && node.children) ? node.children.find(c => c.name === name) || null : null;
}
function findAllChildren(node, name) {
  return (node && node.children) ? node.children.filter(c => c.name === name) : [];
}
function findFirstText(node) {
  if (!node) return null;
  if (node.type === 'TEXT') return node;
  if (node.children) for (const c of node.children) {
    const t = findFirstText(c);
    if (t) return t;
  }
  return null;
}

// ── component discovery ──────────────────────────────────────────────────────
const components = {};
async function discoverComponents() {
  try { await figma.loadAllPagesAsync(); } catch (e) { L('loadAllPagesAsync failed: ' + e.message); }
  const wanted = new Map();
  for (const [key, name] of Object.entries(registry.componentNames)) wanted.set(name, key);
  (function walk(n) {
    if ((n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && wanted.has(n.name)) {
      components[wanted.get(n.name)] = n;
    }
    if (n.children) for (const c of n.children) walk(c);
  })(figma.root);
  // For COMPONENT_SETs, pick variants by role. The viewport row + headerRow sets
  // have two variants — typically 'type=single_value' and 'type=muliti_value'
  // (the master has the typo). Match single by name; multi = "any other variant".
  for (const key of ['row', 'headerRow']) {
    const c = components[key];
    if (c && c.type === 'COMPONENT_SET') {
      const variants = (c.children || []).filter(v => v.type === 'COMPONENT');
      const single = variants.find(v => /single/.test(v.name));
      const multi  = variants.find(v => v !== single);
      components[key + '_single'] = single || null;
      components[key + '_multi']  = multi  || null;
    } else if (c && c.type === 'COMPONENT') {
      // Single component — best effort: assume single variant.
      components[key + '_single'] = c;
    }
  }
  L('components: ' + Object.keys(components).filter(k => components[k]).join(','));
}

// ── page management ──────────────────────────────────────────────────────────
const PAGE_BG = { type: 'SOLID', color: { r: 0xF0/255, g: 0xF4/255, b: 0xF7/255 } };

async function ensurePage() {
  const name = pageOverride || registry.page;
  let p = figma.root.children.find(x => x.name === name);
  if (!p) {
    p = figma.createPage();
    p.name = name;
    try { p.backgrounds = [PAGE_BG]; } catch (e) { L('page bg set failed: ' + e.message); }
  }
  await figma.setCurrentPageAsync(p);
  return p;
}

const TABLE_WIDTH = 1580;
// Horizontal gap between tier columns / single-table tiers; also the vertical
// gap between the tier-header bar and tables inside a column. Matches the
// hand-built "reference for build" layout.
const WRAPPER_GAP = 64;
const COLUMN_GAP  = 64;
const BG_VAR_NAME = 'ob/s1/color/neutral/bg/contrast_highest/inversity_normal';

let _bgVar = undefined;
async function getBgVar() {
  if (_bgVar !== undefined) return _bgVar;
  try {
    const all = await figma.variables.getLocalVariablesAsync();
    _bgVar = all.find(v => v.name === BG_VAR_NAME) || null;
  } catch (e) { L('bg var lookup failed: ' + e.message); _bgVar = null; }
  if (!_bgVar) L('warn: bg variable not found: ' + BG_VAR_NAME);
  return _bgVar;
}
async function whiteBgFill() {
  const v = await getBgVar();
  let fill = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
  if (v) {
    try { fill = figma.variables.setBoundVariableForPaint(fill, 'color', v); }
    catch (e) { L('bind bg failed: ' + e.message); }
  }
  return fill;
}

// The builder owns an outer "Viewport Output" frame (a direct page child) that
// holds the "Viewport Tables" wrapper. The wrapper is looked up ONLY inside that
// outer frame, so it can never collide with a "Viewport Tables" frame in a
// hand-built reference elsewhere on the page.
async function ensureWrapper(page) {
  const outerName   = registry.outerName || 'Viewport Output';
  const wrapperName = registry.wrapperName;

  let outer = page.children.find(c => c.type === 'FRAME' && c.name === outerName);
  const outerIsNew = !outer;
  if (!outer) {
    outer = figma.createFrame();
    outer.name = outerName;
    page.appendChild(outer);
  }
  outer.layoutMode = 'VERTICAL';
  outer.itemSpacing = 0;
  outer.primaryAxisSizingMode = 'AUTO';
  outer.counterAxisSizingMode = 'AUTO';
  outer.paddingLeft = outer.paddingRight = outer.paddingTop = outer.paddingBottom = 0;
  outer.fills = [];
  if (outerIsNew) {
    // Place a fresh output area below all existing top-level page content,
    // so it never overlaps a hand-built reference frame.
    let maxBottom = 0;
    for (const c of page.children) {
      if (c === outer) continue;
      if (typeof c.y === 'number' && typeof c.height === 'number') {
        maxBottom = Math.max(maxBottom, c.y + c.height);
      }
    }
    try { outer.x = 0; outer.y = maxBottom + 200; } catch {}
  }

  let wrapper = outer.children.find(c => c.type === 'FRAME' && c.name === wrapperName);
  if (!wrapper) {
    wrapper = figma.createFrame();
    wrapper.name = wrapperName;
    outer.appendChild(wrapper);
  }
  // Horizontal: tier columns + single-table tiers sit side by side, top-aligned.
  wrapper.layoutMode          = 'HORIZONTAL';
  wrapper.itemSpacing         = WRAPPER_GAP;
  wrapper.primaryAxisSizingMode = 'AUTO';
  wrapper.counterAxisSizingMode = 'AUTO';
  wrapper.primaryAxisAlignItems = 'MIN';
  wrapper.counterAxisAlignItems = 'MIN';
  wrapper.paddingLeft = wrapper.paddingRight = wrapper.paddingTop = wrapper.paddingBottom = 0;
  wrapper.fills = [];
  wrapper.opacity = 1;
  return wrapper;
}

// ── section bar ──────────────────────────────────────────────────────────────
// opts.suppressTier — hide the big tier letter. Used for per-table bars inside a
// tier column, where the column header already carries the letter.
async function applySectionBarContent(inst, spec, opts) {
  if (!inst) return;
  opts = opts || {};
  // Force inner layout chain to FILL so content reaches full table width.
  for (const fname of ['Section Content', 'Layout', 'Content', 'Title Row', 'Section Header', 'Section Info', 'Description Group']) {
    const node = inst.findOne(n => (n.type === 'FRAME' || n.type === 'INSTANCE') && n.name === fname);
    if (!node) continue;
    try { node.layoutSizingHorizontal = 'FILL'; } catch {}
    try { node.layoutAlign = 'STRETCH'; } catch {}
  }
  // __sectionSubTitle: wrap if needed (textAutoResize=HEIGHT lets parent FILL govern width).
  const sub = inst.findOne(n => n.type === 'TEXT' && n.name === '__sectionSubTitle');
  if (sub) {
    try { sub.textAutoResize = 'HEIGHT'; } catch {}
    try { sub.layoutSizingHorizontal = 'FILL'; } catch {}
  }
  const title = inst.findOne(n => n.type === 'TEXT' && n.name === '__sectionTitle');
  if (title) {
    try { title.textAutoResize = 'HEIGHT'; } catch {}
    try { title.layoutSizingHorizontal = 'FILL'; } catch {}
  }

  // Text content. tierLetter + __sectionTitle + __sectionSubTitle + description.
  const want = {
    tierLetter:        spec.section.tier || 'G',
    __sectionTitle:    spec.section.title || '',
    __sectionSubTitle: spec.section.subtitle || '',
    description:       spec.section.purpose || ''
  };
  for (const [nodeName, value] of Object.entries(want)) {
    const node = inst.findOne(n => n.type === 'TEXT' && n.name === nodeName);
    if (!node) continue;
    if (nodeName === 'tierLetter' && opts.suppressTier) {
      try { node.visible = false; } catch {}
      continue;
    }
    try { node.visible = true; } catch {}
    setText(node, value);
  }
}

async function buildSectionBar(spec, opts) {
  if (!components.sectionBar) return null;
  const main = components.sectionBar.type === 'COMPONENT_SET'
    ? (components.sectionBar.defaultVariant || components.sectionBar.children[0])
    : components.sectionBar;
  const inst = main.createInstance();
  inst.name = registry.componentNames.sectionBar;
  await applySectionBarContent(inst, spec, opts);
  return inst;
}

// ── header rows ──────────────────────────────────────────────────────────────
async function buildHeaderRow(kind, modeOrder) {
  const comp = kind === 'multi' ? components.headerRow_multi : components.headerRow_single;
  if (!comp) { L('no headerRow component for kind=' + kind); return null; }
  const inst = comp.createInstance();
  if (kind === 'multi' && modeOrder && modeOrder.length) {
    // Multi-value header row has a 'Header: Value' frame with N 'mode' subframes.
    // Each 'mode' frame should contain a TEXT — populate with the mode label.
    const valueHeader = findChild(inst, 'Header: Value');
    if (valueHeader) {
      const modeCells = (valueHeader.children || []).filter(c => /mode/i.test(c.name) || /value/i.test(c.name));
      for (let i = 0; i < modeOrder.length && i < modeCells.length; i++) {
        const t = findFirstText(modeCells[i]);
        if (t) setText(t, modeOrder[i]);
      }
    } else {
      // Fallback: directly find N TEXT/FRAME children of 'Header: Value'-like names.
      const allModeCells = inst.findAll(n => /^(mode|Header: Value)$/.test(n.name));
      for (let i = 0; i < modeOrder.length && i < allModeCells.length; i++) {
        const t = findFirstText(allModeCells[i]);
        if (t) setText(t, modeOrder[i]);
      }
    }
  }
  return inst;
}

// ── data rows ────────────────────────────────────────────────────────────────
async function buildSingleRow(row) {
  if (!components.row_single) return null;
  const inst = components.row_single.createInstance();
  const nameNode = findFirstText(findChild(inst, 'Cell: Token Name'));
  const descNode = findFirstText(findChild(inst, 'Cell: Description'));
  const valNode  = findFirstText(findChild(inst, 'Cell: Value'));
  setText(nameNode, row.tokenName);
  setText(descNode, row.description || '');
  setText(valNode,  row.value || '');
  return inst;
}

async function buildMultiRow(row) {
  if (!components.row_multi) return null;
  const inst = components.row_multi.createInstance();
  const nameNode = findFirstText(findChild(inst, 'Cell: Token Name'));
  const descNode = findFirstText(findChild(inst, 'Cell: Description'));
  setText(nameNode, row.tokenName);
  setText(descNode, row.description || '');
  const valueCells = findAllChildren(inst, 'Cell: Value');
  for (let i = 0; i < row.modeOrder.length && i < valueCells.length; i++) {
    const t = findFirstText(valueCells[i]);
    if (t) setText(t, String(row.valuesByMode[row.modeOrder[i]] || ''));
  }
  return inst;
}

// ── per-table build ──────────────────────────────────────────────────────────
const BOX_OUTER_W = 1628;

async function buildTableBox(wrapper, spec, materialized, opts) {
  // One outer box-frame per table: white bg, no border, no radius, padding 22/0/24/0.
  // Children: section_bar (1580 wide), then inner table frame containing header + rows.
  // opts.suppressTier — hide the section bar's tier letter (table is inside a column).
  const box = figma.createFrame();
  box.name = spec.tableName;
  box.layoutMode = 'VERTICAL';
  box.itemSpacing = 14;
  box.paddingTop = 22; box.paddingBottom = 24;
  box.paddingLeft = 0; box.paddingRight = 0;
  box.cornerRadius = 0;
  box.strokes = [];
  box.fills = [await whiteBgFill()];
  box.primaryAxisSizingMode = 'AUTO';
  box.counterAxisSizingMode = 'FIXED';
  box.counterAxisAlignItems = 'CENTER';
  box.resize(BOX_OUTER_W, 100);
  wrapper.appendChild(box);

  // Section bar on top.
  const sb = await buildSectionBar(spec, opts);
  if (sb) {
    box.appendChild(sb);
    try { sb.resize(TABLE_WIDTH, sb.height); } catch {}
  }

  // Inner table: header row + data rows.
  const table = figma.createFrame();
  table.name = 'Table';
  table.layoutMode = 'VERTICAL';
  table.itemSpacing = 0;
  table.fills = [];
  table.resize(TABLE_WIDTH, 100);
  table.primaryAxisSizingMode = 'AUTO';
  table.counterAxisSizingMode = 'FIXED';
  box.appendChild(table);

  const hr = await buildHeaderRow(materialized.kind, materialized.modeOrder);
  if (hr) table.appendChild(hr);

  for (const row of materialized.rows) {
    const r = materialized.kind === 'multi' ? await buildMultiRow(row) : await buildSingleRow(row);
    if (r) table.appendChild(r);
  }

  await flushTextWrites();
  return box;
}

// ── tier grouping ────────────────────────────────────────────────────────────
// Tables are grouped by section.tier. A tier with more than one table becomes a
// vertical column: a tier-header bar on top, then each table box. A tier with a
// single table needs no column — the box sits directly in the wrapper and its
// own section bar carries the tier letter. Reproduces the hand-built
// "reference for build" layout (G column of 3 tables, S and C standalone).
const TIER_SEQUENCE = ['G', 'S', 'C'];
const TIER_SUBTITLE = { G: 'Global Tokens', S: 'Semantic Tokens', C: 'Component Tokens' };

async function buildTierColumn(wrapper, tier, specs) {
  const col = figma.createFrame();
  col.name = 'Column: ' + tier;
  col.layoutMode = 'VERTICAL';
  col.itemSpacing = COLUMN_GAP;
  col.primaryAxisSizingMode = 'AUTO';
  col.counterAxisSizingMode = 'FIXED';
  col.primaryAxisAlignItems = 'MIN';
  col.counterAxisAlignItems = 'MIN';
  col.paddingLeft = col.paddingRight = col.paddingTop = col.paddingBottom = 0;
  col.fills = [];
  wrapper.appendChild(col);
  try { col.resize(BOX_OUTER_W, col.height); } catch {}

  // Tier-header bar — full column width, not wrapped in a table box.
  const headerBar = await buildSectionBar({
    section: {
      tier,
      title:    registry.foundationName || '',
      subtitle: TIER_SUBTITLE[tier] || '',
      purpose:  ''
    }
  });
  if (headerBar) {
    col.appendChild(headerBar);
    try { headerBar.resize(BOX_OUTER_W, headerBar.height); } catch {}
  }

  for (const spec of specs) {
    // Per-table bars inside a column omit the tier letter — the column header has it.
    await buildTableBox(col, spec, spec._materialized, { suppressTier: true });
  }
  return col;
}

// Full rebuild: clear the wrapper, then lay tiers out G → S → C. Multi-table
// tiers become columns; single-table tiers sit directly in the wrapper.
async function buildAllTiers(wrapper, specs) {
  for (const ch of [...wrapper.children]) { try { ch.remove(); } catch {} }
  const byTier = {};
  for (const spec of specs) {
    const tier = String((spec.section && spec.section.tier) || 'G').toUpperCase();
    (byTier[tier] = byTier[tier] || []).push(spec);
  }
  const order = [...TIER_SEQUENCE, ...Object.keys(byTier).filter(t => !TIER_SEQUENCE.includes(t))];
  const built = [];
  const seen = new Set();
  for (const tier of order) {
    const group = byTier[tier];
    if (!group || !group.length || seen.has(tier)) continue;
    seen.add(tier);
    try {
      if (group.length > 1) await buildTierColumn(wrapper, tier, group);
      else                  await buildTableBox(wrapper, group[0], group[0]._materialized);
      for (const s of group) built.push({ id: s.id, ok: true, rows: s._materialized.rows.length });
    } catch (e) {
      for (const s of group) built.push({ id: s.id, ok: false, err: e.message });
    }
  }
  return built;
}

// Single-table refresh (--table <id>): replace just that box in place, wherever
// it sits — directly in the wrapper or inside a tier column.
async function replaceOneTable(wrapper, spec) {
  const existing = wrapper.findOne(c => c.name === spec.tableName);
  const parent = existing ? existing.parent : wrapper;
  const idx = existing ? parent.children.indexOf(existing) : -1;
  const inColumn = !!(parent && /^Column:/.test(parent.name || ''));
  if (existing) { try { existing.remove(); } catch {} }
  const fresh = await buildTableBox(parent, spec, spec._materialized, { suppressTier: inColumn });
  if (idx >= 0) { try { parent.insertChild(idx, fresh); } catch {} }
  return fresh;
}

// ── validation ───────────────────────────────────────────────────────────────
function validatePage(page, wrapper) {
  const errors = [];
  const warns  = [];

  for (const spec of tables) {
    if (tableFilter && spec.id !== tableFilter) continue;
    const box = wrapper.findOne(c => c.name === spec.tableName);
    if (!box) { errors.push({ code: 'STRUCT', id: spec.id, msg: 'box missing: ' + spec.tableName }); continue; }

    // Exactly one section bar
    const sbs = (box.children || []).filter(c => c.type === 'INSTANCE' && /section_bar/.test(c.name));
    if (sbs.length !== 1) errors.push({ code: 'DUP', id: spec.id, msg: 'expected 1 section_bar, found ' + sbs.length });

    // Section bar content non-empty
    const sb = sbs[0];
    if (sb) {
      const title = sb.findOne(n => n.type === 'TEXT' && n.name === '__sectionTitle');
      if (!title || !String(title.characters || '').trim()) errors.push({ code: 'SECTBAR', id: spec.id, msg: '__sectionTitle empty' });
    }

    // Row count
    const table = (box.children || []).find(c => c.type === 'FRAME' && c.name === 'Table');
    if (!table) { errors.push({ code: 'STRUCT', id: spec.id, msg: 'inner Table frame missing' }); continue; }
    const dataRows = (table.children || []).filter(c => c.type === 'INSTANCE' && /\\/row(_\\w+)?$/.test(c.name));
    const expected = spec._expectedRowCount;
    if (expected != null && dataRows.length !== expected) {
      errors.push({ code: 'COUNT', id: spec.id, msg: 'rows ' + dataRows.length + ' != expected ' + expected });
    }

    // Token-name non-empty per row
    for (const r of dataRows) {
      const nameCell = findChild(r, 'Cell: Token Name');
      const t = findFirstText(nameCell);
      if (!t || !String(t.characters || '').trim()) {
        errors.push({ code: 'EMPTY', id: spec.id, msg: 'row token name empty' });
        break;
      }
    }
  }
  return { errors, warns };
}

// ── orchestrate ──────────────────────────────────────────────────────────────
await discoverComponents();
try { await figma.loadFontAsync({ family: 'Noto Sans', style: 'ExtraBold' }); } catch (e) {}
try { await figma.loadFontAsync({ family: 'Noto Sans', style: 'Medium' }); } catch (e) {}
try { await figma.loadFontAsync({ family: 'Noto Sans', style: 'Regular' }); } catch (e) {}

const page = await ensurePage();
const wrapper = await ensureWrapper(page);

let result;
if (validateOnly) {
  const v = validatePage(page, wrapper);
  result = { ok: v.errors.length === 0, errors: v.errors, warns: v.warns, log };
} else {
  let built;
  if (tableFilter) {
    // Single-table refresh — leave the rest of the tier layout intact.
    const spec = tables.find(s => s.id === tableFilter);
    if (!spec) {
      built = [{ id: tableFilter, ok: false, err: 'unknown table id' }];
    } else {
      try {
        await replaceOneTable(wrapper, spec);
        built = [{ id: spec.id, ok: true, rows: spec._materialized.rows.length }];
      } catch (e) {
        built = [{ id: spec.id, ok: false, err: e.message }];
      }
    }
  } else {
    // Full rebuild — tier-grouped layout (G column, S and C standalone).
    built = await buildAllTiers(wrapper, tables);
  }
  await flushTextWrites();
  const v = validatePage(page, wrapper);
  result = { ok: built.every(b => b.ok) && v.errors.length === 0, built, errors: v.errors, warns: v.warns, log };
}
return JSON.stringify(result);
`;

// ── orchestrator ─────────────────────────────────────────────────────────────

function main() {
  // Build materialized data Node-side so the plugin code receives flat row arrays.
  const tables = registry.tables.map(spec => {
    const mat = materializeTable(spec);
    return Object.assign({}, spec, {
      _materialized: mat,
      _expectedRowCount: mat.rows.length
    });
  });

  if (!VALIDATE_ONLY) {
    console.log('Source rows per table:');
    for (const t of tables) {
      if (TABLE_FILTER && t.id !== TABLE_FILTER) continue;
      console.log(`  ${t.id}: ${t._materialized.rows.length} rows (${t._materialized.kind})`);
    }
  }

  const payload = {
    registry,
    tables,
    tableFilter: TABLE_FILTER,
    pageOverride: PAGE_OVER,
    validateOnly: VALIDATE_ONLY
  };
  const script = '(async () => {\nconst PAYLOAD = ' + JSON.stringify(payload) + ';\n' + PLUGIN_CODE + '\n})()';
  const r = runEval(script);

  if (r.stderr) process.stderr.write(r.stderr);
  const parsed = extractResult(r.stdout);
  if (!parsed) {
    console.error('FAILED: could not parse plugin result');
    console.error('stdout (first 2000):', r.stdout.slice(0, 2000));
    process.exit(2);
  }

  if (parsed.log && parsed.log.length) {
    for (const line of parsed.log) console.log('  [plugin] ' + line);
  }
  if (parsed.built) {
    console.log('Built tables:');
    for (const b of parsed.built) console.log(`  ${b.id}: ${b.ok ? 'ok (' + b.rows + ' rows)' : 'FAIL — ' + b.err}`);
  }
  if (parsed.errors && parsed.errors.length) {
    console.log('Validation errors:');
    for (const e of parsed.errors) console.log(`  [${e.code}] ${e.id}: ${e.msg}`);
  }
  if (parsed.warns && parsed.warns.length) {
    console.log('Validation warnings:');
    for (const w of parsed.warns) console.log(`  [${w.code}] ${w.id}: ${w.msg}`);
  }

  process.exit(parsed.ok ? 0 : 1);
}

main();
