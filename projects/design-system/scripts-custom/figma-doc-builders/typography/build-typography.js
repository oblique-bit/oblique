#!/usr/bin/env node
/**
 * build-typography.js — Typography docs builder, Figma-text-styles-only.
 *
 * Reads every local text style from the connected Figma file and rebuilds
 * the tables on the "🔤 Typography – Styles & Specimens" page. One row per
 * text style, with the row's "Specimen" cell rendered using that style and
 * containing the style's own path as its sample text.
 *
 * Source of truth:
 *   - figma.getLocalTextStylesAsync()
 *   - style.fontName / fontSize / lineHeight / letterSpacing / paragraphSpacing
 *   - style.description for the description cell
 *
 * Tables are declared in registry.json. Each table filters the style universe
 * by `stylePrefix` and optionally groups by `size_class` or `component`.
 *
 * Usage:
 *   node build-typography.js                       # build everything + validate
 *   node build-typography.js --table <id>          # one table only (e.g. --table html-heading)
 *   node build-typography.js --page <name>         # override target Figma page
 *   node build-typography.js --validate            # validate only, no writes (exit 1 on errors)
 */
'use strict';

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
const TABLE_FILTER  = getArg('--table', null);
const PAGE_OVER     = getArg('--page', null);
const VALIDATE_ONLY = args.includes('--validate');

function runEval(scriptText) {
  const tmp = path.join(os.tmpdir(), `typo-${process.pid}-${Date.now()}.js`);
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
const { registry, tableFilter, pageOverride, validateOnly, provenance, foundationDescription } = PAYLOAD;
const log = [];
function L(msg) { log.push(String(msg)); }
const _startTime = Date.now();

// ── helpers ────────────────────────────────────────────────────────────────
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
    } catch (e) { L('setText fail: ' + (e && e.message)); return false; }
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

// ── component + style discovery ───────────────────────────────────────────
const components = {};
async function discoverComponents() {
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

let allStyles = null;
async function discoverStyles() {
  allStyles = await figma.getLocalTextStylesAsync();
  L('styles: ' + allStyles.length);
}

// Preload every distinct fontName used across the styles. Without this each
// per-row setText / setTextStyleIdAsync serially triggers a load and the
// build runs at ~60s/row instead of ~1s/row.
async function preloadFonts() {
  if (!allStyles) return;
  const seen = new Set();
  const fonts = [];
  for (const s of allStyles) {
    const fn = s.fontName;
    if (!fn || fn === figma.mixed) continue;
    const key = (fn.family || '') + '\\u0000' + (fn.style || '');
    if (seen.has(key)) continue;
    seen.add(key);
    fonts.push(fn);
  }
  // Row component's own text nodes use these — pre-load too.
  const extras = [
    { family: 'Noto Sans', style: 'Regular' },
    { family: 'Noto Sans', style: 'Medium' },
    { family: 'Noto Sans', style: 'SemiBold' },
    { family: 'Noto Sans', style: 'ExtraBold' },
    { family: 'Noto Sans', style: 'Light' }
  ];
  for (const fn of extras) {
    const key = fn.family + '\\u0000' + fn.style;
    if (!seen.has(key)) { seen.add(key); fonts.push(fn); }
  }
  await Promise.all(fonts.map(fn => figma.loadFontAsync(fn).catch(e => L('font load fail ' + fn.family + ' ' + fn.style + ': ' + e.message))));
  L('preloaded fonts: ' + fonts.length);
}

// Filter to a specific table's prefix. Excludes anything inside a deeper
// "_docs/" segment (mirrors the var-side filter) — currently none exist for
// styles but cheap insurance.
function stylesForTable(spec) {
  if (!allStyles) return [];
  return allStyles
    .filter(s => s.name.startsWith(spec.stylePrefix))
    .filter(s => !/\\/_docs\\//.test(s.name))
    .sort((a, b) => compareStyleNames(a.name, b.name, spec));
}

// ── ranking / grouping ─────────────────────────────────────────────────────
const _BASE_SIZE_RANKS = { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 };
function rankSize(size) {
  if (size == null) return 999;
  if (size === 'none') return 998;
  if (_BASE_SIZE_RANKS[size] != null) return _BASE_SIZE_RANKS[size];
  const m = /^(\\d+)xl$/.exec(size);
  if (m) return 4 + Number(m[1]);
  return 997;
}
function rankWeightLeaf(leaf) {
  const map = { normal: 0, strong: 1, link: 2, lead: 3 };
  return map[leaf] != null ? map[leaf] : 50;
}

function parseStyleName(styleName, spec) {
  // strip the prefix
  const rest = styleName.slice(spec.stylePrefix.length);
  const parts = rest.split('/').filter(Boolean);
  // 'grouped' tables: parts = [<size>, <leaf>] e.g. ['md', 'normal']
  if (spec.id === 'grouped-static' || spec.id === 'grouped-dynamic') {
    return { size: parts[0], leaf: parts[1] || '', component: null };
  }
  // 'component' table: parts = [<component>, 'typography', <leafName>]
  if (spec.id === 'component') {
    return { component: parts[0] || '', leaf: parts.slice(2).join('/') || parts[parts.length - 1] || '', size: null };
  }
  // headings, body, link-state: single leaf
  return { component: null, size: null, leaf: parts.join('/') };
}

function compareStyleNames(a, b, spec) {
  const ka = parseStyleName(a, spec);
  const kb = parseStyleName(b, spec);
  if (spec.id === 'grouped-static' || spec.id === 'grouped-dynamic') {
    const sa = rankSize(ka.size), sb = rankSize(kb.size);
    if (sa !== sb) return sa - sb;
    const la = rankWeightLeaf(ka.leaf), lb = rankWeightLeaf(kb.leaf);
    if (la !== lb) return la - lb;
  }
  if (spec.id === 'component') {
    if (ka.component !== kb.component) return ka.component.localeCompare(kb.component);
  }
  return a.localeCompare(b);
}

function groupKey(styleName, spec) {
  const scheme = spec.grouping || 'none';
  if (scheme === 'none') return null;
  const k = parseStyleName(styleName, spec);
  if (scheme === 'size_class') {
    return rankSize(k.size) < 5 ? 'base' : 'extended';
  }
  if (scheme === 'component') {
    return k.component || 'direct';
  }
  return null;
}

const _GROUP_LABELS = {
  base:     { title: 'Base scale',     description: 'T-shirt sizes (xs → xl)' },
  extended: { title: 'Extended scale', description: 'Numeric sizes (2xl → 4xl)' },
  direct:   { title: 'Direct',         description: 'Top-level styles' }
};
function groupLabel(key) {
  if (_GROUP_LABELS[key]) return _GROUP_LABELS[key];
  return { title: key.charAt(0).toUpperCase() + key.slice(1), description: '' };
}

// ── formatting helpers ─────────────────────────────────────────────────────
function fmtNum(n) {
  if (typeof n !== 'number' || !isFinite(n)) return String(n);
  const r = Math.round(n * 10000) / 10000;
  return String(r);
}
function fmtFontSize(px)  { return fmtNum(px) + 'px'; }
function fmtLineHeight(lh) {
  if (!lh || lh === figma.mixed) return '—';
  if (lh.unit === 'PIXELS')  return fmtNum(lh.value) + 'px';
  if (lh.unit === 'PERCENT') return fmtNum(lh.value) + '%';
  if (lh.unit === 'AUTO')    return 'auto';
  return '—';
}
function fmtLetterSpacing(ls) {
  if (!ls || ls === figma.mixed) return '—';
  if (ls.unit === 'PIXELS')  return fmtNum(ls.value) + 'px';
  if (ls.unit === 'PERCENT') return fmtNum(ls.value) + '%';
  return '—';
}
function fmtFamily(fn) {
  if (!fn || fn === figma.mixed) return '—';
  return fn.family || '—';
}
function fmtWeight(fn) {
  if (!fn || fn === figma.mixed) return '—';
  return fn.style || '—';
}

// ── page management ────────────────────────────────────────────────────────
const _PAGE_BG = { type: 'SOLID', color: { r: 0xF0/255, g: 0xF4/255, b: 0xF7/255 } };

async function ensurePage() {
  if (pageOverride) {
    const p = figma.root.children.find(x => x.name === pageOverride);
    if (!p) throw new Error('target page not found: ' + pageOverride);
    await figma.setCurrentPageAsync(p);
    return p;
  }
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

const TABLE_WIDTH = 2280;
const WRAPPER_NAME = 'Typography Tables';
const WRAPPER_GAP  = 96;
const BG_VAR_NAME  = 'ob/s1/color/neutral/bg/contrast_highest/inversity_normal';

let _bgVar = undefined;
async function getBgVar() {
  if (_bgVar !== undefined) return _bgVar;
  const all = await figma.variables.getLocalVariablesAsync();
  _bgVar = all.find(v => v.name === BG_VAR_NAME) || null;
  if (!_bgVar) L('warn: bg variable not found: ' + BG_VAR_NAME);
  return _bgVar;
}
async function whiteBgFill() {
  const v = await getBgVar();
  let fill = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
  if (v) {
    try { fill = figma.variables.setBoundVariableForPaint(fill, 'color', v); }
    catch (e) { L('bind bg var failed: ' + e.message); }
  }
  return fill;
}

// Foundation bar (shared component) — same pattern as build-dimension.js
const OUTER_NAME = 'Typography Output';
const FOUNDATION_BAR_INSTANCE_NAME = '__foundation_bar';

function findFoundationNameNode(inst) {
  if (!inst) return null;
  const titles = inst.findAll(n => n.type === 'TEXT' && n.name === '__sectionTitle');
  for (const t of titles) {
    const fn = t.fontName;
    if (fn && fn !== figma.mixed && /SemiBold/i.test(fn.style)) return t;
  }
  return titles.length ? titles[titles.length - 1] : null;
}

async function ensureHeaderAndOuter(page, wrapper, metaText) {
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

  if (wrapper && wrapper.parent !== outer) { try { outer.appendChild(wrapper); } catch {} }

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
  try { bar.layoutSizingHorizontal = 'FILL'; } catch (e) { L('foundation_bar FILL failed: ' + e.message); }
  try { bar.layoutAlign = 'STRETCH'; } catch {}

  const nameNode = findFoundationNameNode(bar);
  if (nameNode) await setText(nameNode, registry.foundationName || 'Typography');
  const descNode = bar.findOne(n => n.type === 'TEXT' && n.name === '$foundation_description');
  if (descNode && foundationDescription) await setText(descNode, foundationDescription);
  const metaNode = bar.findOne(n => n.type === 'TEXT' && n.name === '$build_generation_meta');
  if (metaNode) await setText(metaNode, metaText);
  return outer;
}

async function ensureWrapper(page) {
  let wrapper = page.findOne(c => c.type === 'FRAME' && c.name === WRAPPER_NAME);
  if (!wrapper) {
    wrapper = figma.createFrame();
    wrapper.name = WRAPPER_NAME;
    page.appendChild(wrapper);
  }
  wrapper.layoutMode = 'VERTICAL';
  wrapper.itemSpacing = WRAPPER_GAP;
  wrapper.primaryAxisSizingMode = 'AUTO';
  wrapper.counterAxisSizingMode = 'AUTO';
  wrapper.primaryAxisAlignItems = 'MIN';
  wrapper.counterAxisAlignItems = 'MIN';
  wrapper.paddingLeft = wrapper.paddingRight = wrapper.paddingTop = wrapper.paddingBottom = 0;
  wrapper.fills = [];
  wrapper.opacity = 1;
  try { wrapper.x = 0; wrapper.y = 0; } catch {}
  return wrapper;
}

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
  table.opacity = 1;
  table.fills = [await whiteBgFill()];
  try { table.resize(TABLE_WIDTH, table.height || 100); } catch {}
  return table;
}


function dedupeBy(table, predicate) {
  const found = table.children.filter(predicate);
  if (found.length <= 1) return found[0] || null;
  for (let i = 1; i < found.length; i++) { try { found[i].remove(); } catch {} }
  return found[0];
}

function stretch(node) {
  if (!node) return;
  try { node.layoutSizingHorizontal = 'FILL'; } catch {}
  try { node.layoutAlign = 'STRETCH'; } catch {}
}

// ── section bar ────────────────────────────────────────────────────────────
async function buildSectionBar(spec) {
  if (!components.sectionBar) return null;
  const inst = components.sectionBar.createInstance();
  inst.name = '_docs/typography/section_bar';
  await applySectionBarContent(inst, spec);
  return inst;
}

async function applySectionBarContent(inst, spec) {
  if (!inst) return;
  const tier = inst.findOne(n => n.type === 'TEXT' && n.name === 'tierLetter');
  if (tier) {
    // Hide the tier letter — typography pages carry no tier letter.
    try { tier.visible = false; } catch {}
  }
  for (const name of ['Section Content', 'Layout', 'Content', 'Title Row', 'Section Info', 'Description Group']) {
    const node = inst.findOne(n => (n.type === 'FRAME' || n.type === 'INSTANCE') && n.name === name);
    if (!node) continue;
    try { node.layoutSizingHorizontal = 'FILL'; } catch {}
    try { node.layoutAlign = 'STRETCH'; } catch {}
  }
  const want = {
    tierLetter: spec.section.tier || 'S',
    title: spec.section.title,
    subtitle: spec.subtitle || '',
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

  // Mode badge — shown + labelled with the variable mode the table renders in
  // (spec.mode, e.g. "md"); hidden when the table has no mode. Columned
  // subgroups (html) override it per column via applyTableModeBadge.
  await applyModeBadge(inst, spec.mode || '');
}

// The mode badge inside a _docs/typography/section_bar instance — the Badge
// instance that wraps the __mode TEXT node.
function findModeBadge(sbInst) {
  if (!sbInst) return { badge: null, text: null };
  const text = sbInst.findOne(n => n.type === 'TEXT' && n.name === '__mode');
  if (!text) return { badge: null, text: null };
  let badge = text.parent;
  while (badge && badge !== sbInst && badge.type !== 'INSTANCE') badge = badge.parent;
  if (!badge || badge === sbInst) badge = null;
  return { badge, text };
}

// Show + label the mode badge on a section bar with the mode the table
// renders in (md / interface / prose …); pass a falsy mode to hide it.
async function applyModeBadge(sbInst, modeName) {
  const mb = findModeBadge(sbInst);
  if (!mb.badge && !mb.text) return;
  if (modeName) {
    if (mb.badge) { try { mb.badge.visible = true; } catch {} }
    if (mb.text)  await setText(mb.text, String(modeName));
  } else if (mb.badge) {
    try { mb.badge.visible = false; } catch {}
  }
}

// Set (or hide) the mode badge on a table frame's section bar.
async function applyTableModeBadge(tableFrame, modeName) {
  if (!tableFrame) return;
  const sb = (tableFrame.children || []).find(c => c.type === 'INSTANCE' && /section_bar$/.test(c.name));
  if (sb) await applyModeBadge(sb, modeName);
}

async function buildHeader() {
  if (!components.headerRow) return null;
  return components.headerRow.createInstance();
}

// ── row building ───────────────────────────────────────────────────────────
async function buildRow(style) {
  if (!components.row) return null;
  const inst = components.row.createInstance();
  const tokenPath = style.name.replace(/\\//g, '.');
  const nameNode = findFirstText(findChild(inst, 'Cell: Token Name'));
  const familyNode = findFirstText(findChild(inst, 'Cell: Family'));
  const weightNode = findFirstText(findChild(inst, 'Cell: Weight'));
  const sizeNode = findFirstText(findChild(inst, 'Cell: Size'));
  const lhNode = findFirstText(findChild(inst, 'Cell: Line Height'));
  const lsNode = findFirstText(findChild(inst, 'Cell: Letter Spacing'));
  const descNode = findFirstText(findChild(inst, 'Cell: Description'));
  const specimenNode = findFirstText(findChild(inst, 'Cell: Specimen'));

  if (nameNode)   await setText(nameNode, tokenPath);
  if (familyNode) await setText(familyNode, fmtFamily(style.fontName));
  if (weightNode) await setText(weightNode, fmtWeight(style.fontName));
  if (sizeNode)   await setText(sizeNode, fmtFontSize(style.fontSize));
  if (lhNode)     await setText(lhNode, fmtLineHeight(style.lineHeight));
  if (lsNode)     await setText(lsNode, fmtLetterSpacing(style.letterSpacing));
  if (descNode)  await setText(descNode, style.description || '');

  // Specimen: load font, then apply the text style + set sample text = style name
  if (specimenNode && style.fontName && style.fontName !== figma.mixed) {
    try {
      await figma.loadFontAsync(style.fontName);
    } catch (e) { L('font load failed for ' + style.name + ': ' + e.message); }
    try {
      specimenNode.characters = style.name;
      await specimenNode.setTextStyleIdAsync(style.id);
    } catch (e) {
      // Fallback: explicitly mirror the style props onto the specimen
      try {
        specimenNode.fontName = style.fontName;
        specimenNode.fontSize = style.fontSize;
        if (style.lineHeight && style.lineHeight !== figma.mixed) specimenNode.lineHeight = style.lineHeight;
        if (style.letterSpacing && style.letterSpacing !== figma.mixed) specimenNode.letterSpacing = style.letterSpacing;
        specimenNode.characters = style.name;
      } catch (e2) { L('specimen fallback failed for ' + style.name + ': ' + e2.message); }
    }
  }
  return { instance: inst, style, tokenPath };
}

// ── group header ───────────────────────────────────────────────────────────
async function buildGroupHeader(key) {
  if (!components.groupHeader) return null;
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

// ── per-table build ────────────────────────────────────────────────────────
async function buildTable(page, spec) {
  const table = await ensureTableFrame(page, spec.tableName);
  const styles = stylesForTable(spec);
  const result = { id: spec.id, ok: true, info: { styleCount: styles.length, rowsBuilt: 0, rowsKept: 0 } };

  // Section bar
  let sb = dedupeBy(table, c => c.type === 'INSTANCE' && /section_bar$/.test(c.name));
  if (!sb) {
    sb = await buildSectionBar(spec);
    if (sb) { table.insertChild(0, sb); stretch(sb); }
  } else {
    await applySectionBarContent(sb, spec);
    try { table.insertChild(0, sb); } catch {}
    stretch(sb);
  }

  // Header row
  let header = dedupeBy(table, c => c.type === 'INSTANCE' && /typography\\/header_row$/.test(c.name));
  if (!header) {
    header = await buildHeader();
    if (header) { table.insertChild(1, header); stretch(header); }
  } else {
    try { table.insertChild(1, header); } catch {}
    stretch(header);
  }

  // Existing rows: read each row's token name TEXT, map → node
  const existing = new Map();
  for (const c of [...table.children]) {
    if (c === sb || c === header) continue;
    if (!/\\/row$/.test(c.name) && !/typography\\/row/.test(c.name)) continue;
    const nameNode = findFirstText(findChild(c, 'Cell: Token Name'));
    const txt = nameNode ? String(nameNode.characters || '').trim() : '';
    if (!txt || txt === '$token.name') { try { c.remove(); } catch {} continue; }
    if (existing.has(txt)) { try { c.remove(); } catch {} continue; }
    existing.set(txt, c);
  }
  result.info.rowsKept = existing.size;

  const rowByPath = new Map(existing);
  let rowsBuilt = 0;
  for (const s of styles) {
    const tokenPath = s.name.replace(/\\//g, '.');
    if (existing.has(tokenPath)) continue;
    const r = await buildRow(s);
    if (r && r.instance) {
      table.appendChild(r.instance);
      stretch(r.instance);
      await flushTextWrites();
      rowByPath.set(tokenPath, r.instance);
      rowsBuilt++;
    }
  }
  result.info.rowsBuilt = rowsBuilt;

  // Grouping
  const groupOrder = [];
  const groupRows = new Map();
  for (const s of styles) {
    const key = groupKey(s.name, spec);
    const tokenPath = s.name.replace(/\\//g, '.');
    const row = rowByPath.get(tokenPath);
    if (!row) continue;
    const bucket = key == null ? '__nogroup__' : key;
    if (!groupRows.has(bucket)) { groupRows.set(bucket, []); groupOrder.push(bucket); }
    groupRows.get(bucket).push(row);
  }
  const showHeaders = spec.grouping && spec.grouping !== 'none' && groupOrder.length >= 2;

  // Remove stale group headers
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

  // Post-build dedupe: walk current children, keep first occurrence of each
  // token name; drop the rest. Defends against subtle double-append paths.
  await flushTextWrites();
  const seenTokens = new Set();
  for (const c of [...table.children]) {
    if (c === sb || c === header) continue;
    if (!/\\/row$/.test(c.name)) continue;
    const nameNode = findFirstText(findChild(c, 'Cell: Token Name'));
    const txt = nameNode ? String(nameNode.characters || '').trim() : '';
    if (!txt) { try { c.remove(); } catch {} continue; }
    if (seenTokens.has(txt)) { try { c.remove(); } catch {} continue; }
    seenTokens.add(txt);
  }
  // Rebuild rowByPath from the cleaned table state (in case rows were
  // removed above, references in rowByPath may now be detached).
  rowByPath.clear();
  for (const c of table.children) {
    if (!/\\/row$/.test(c.name)) continue;
    const nameNode = findFirstText(findChild(c, 'Cell: Token Name'));
    const txt = nameNode ? String(nameNode.characters || '').trim() : '';
    if (txt) rowByPath.set(txt, c);
  }
  // Rebuild groupRows so the reorder step uses the post-dedupe rows.
  groupRows.clear();
  groupOrder.length = 0;
  for (const s of styles) {
    const key = groupKey(s.name, spec);
    const tokenPath = s.name.replace(/\\//g, '.');
    const row = rowByPath.get(tokenPath);
    if (!row) continue;
    const bucket = key == null ? '__nogroup__' : key;
    if (!groupRows.has(bucket)) { groupRows.set(bucket, []); groupOrder.push(bucket); }
    groupRows.get(bucket).push(row);
  }

  // Reorder
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

  // Fixed data-row height (registry spec.rowHeight). Used by the headings
  // table so its interface-mode and prose-mode copies align row-for-row even
  // though prose specimens render taller.
  if (spec.rowHeight) {
    for (const c of table.children) {
      if (c === sb || c === header) continue;
      if (!/\\/row$/.test(c.name)) continue;
      try { c.layoutSizingVertical = 'FIXED'; } catch (e) { L('rowHeight sizing fail: ' + e.message); }
      try { c.resize(c.width, spec.rowHeight); } catch (e) { L('rowHeight resize fail: ' + e.message); }
    }
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
    // A subgroup with a 'columns' list renders each of its tables once per
    // column (interface / prose), so multiple frames share the table name.
    const sgMeta = (spec.subgroup && registry.subgroups) ? registry.subgroups[spec.subgroup] : null;
    const expectedFrames = (sgMeta && Array.isArray(sgMeta.columns) && sgMeta.columns.length) ? sgMeta.columns.length : 1;
    const tableFrames = page.findAll(c => c.name === spec.tableName && c.type === 'FRAME');
    if (tableFrames.length !== expectedFrames) {
      errors.push({ code: 'DUP', id: spec.id, msg: 'expected ' + expectedFrames + ' table frame(s) on page, got ' + tableFrames.length });
      continue;
    }
    const expectedRows = stylesForTable(spec).length;
    let frameIdx = 0;
    for (const table of tableFrames) {
      frameIdx++;
      const tag = expectedFrames > 1 ? (spec.id + '#' + frameIdx) : spec.id;
      const sectionBars = table.children.filter(c => c.type === 'INSTANCE' && /section_bar$/.test(c.name));
      if (sectionBars.length !== 1) errors.push({ code: 'DUP', id: tag, msg: 'expected 1 section bar, got ' + sectionBars.length });
      if (sectionBars[0]) {
        const sb = sectionBars[0];
        for (const tn of ['__sectionTitle', 'description']) {
          const node = sb.findOne(n => n.type === 'TEXT' && n.name === tn);
          const txt = node ? String(node.characters || '').trim() : '';
          if (!txt) errors.push({ code: 'SECTBAR', id: tag, msg: tn + ' empty' });
          else if (DEFAULTS.indexOf(txt) >= 0) errors.push({ code: 'SECTBAR', id: tag, msg: tn + ' is default placeholder' });
        }
      }
      const rowInstances = table.children.filter(c =>
        (c.type === 'INSTANCE' || c.type === 'FRAME') &&
        /\\/row$/.test(c.name)
      );
      stats.byTable[tag] = { rows: rowInstances.length, expected: expectedRows };
      stats.totalRows += rowInstances.length;
      if (rowInstances.length !== expectedRows) errors.push({ code: 'COUNT', id: tag, msg: 'rows: got ' + rowInstances.length + ', expected ' + expectedRows });
      for (const row of rowInstances) {
        const nameNode = findFirstText(findChild(row, 'Cell: Token Name'));
        const descCell = findChild(row, 'Cell: Description');
        const descNode = findFirstText(descCell);
        const nameText = nameNode ? String(nameNode.characters || '').trim() : '';
        const descText = descNode ? String(descNode.characters || '').trim() : '';
        if (!nameText) { errors.push({ code: 'EMPTY', id: tag, msg: 'row token name empty' }); continue; }
        const styleName = nameText.replace(/\\./g, '/');
        const s = allStyles.find(x => x.name === styleName);
        if (!s) { warnings.push({ code: 'STYLE', id: tag, token: nameText, msg: 'no matching text style' }); continue; }
        if (descCell && descText !== (s.description || '')) {
          errors.push({ code: 'DESC', id: tag, token: nameText, msg: 'description mismatch (row: "' + descText.slice(0, 40) + '" vs style: "' + (s.description || '').slice(0, 40) + '")' });
        }
      }
    }
  }
  return { errors, warnings, stats };
}

// ── main ───────────────────────────────────────────────────────────────────
async function main() {
  const currentFile = figma.root.name;
  if (registry.allowedFiles && registry.allowedFiles.length && !registry.allowedFiles.includes(currentFile)) {
    return { error: 'refusing to run on file "' + currentFile + '"; allowed: ' + registry.allowedFiles.join(', ') };
  }
  await discoverComponents();
  await discoverStyles();
  await preloadFonts();
  const page = await ensurePage();

  if (validateOnly) {
    const validate = await validatePage(page);
    return { mode: 'validate', validate, log };
  }

  // Tables live on page level during the build.
  for (const colName of [WRAPPER_NAME]) {
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

  // Sweep stale "Table: typography/<id>" frames from prior registries (e.g.
  // html-heading / html-body / html-link-state after the html re-bucketing).
  // Skipped under --table filter so a partial run doesn't nuke siblings.
  if (!tableFilter) {
    const wantedTableNames = new Set(registry.tables.map(t => t.tableName));
    const stale = page.findAll(c => c.type === 'FRAME' && /^Table: typography\\//.test(c.name) && !wantedTableNames.has(c.name));
    for (const s of stale) { try { s.remove(); } catch {} }
    if (stale.length) L('removed ' + stale.length + ' stale tables');
  }

  // Wrapper + migrate tables into it, grouped by subgroup (Scales / HTML).
  // Each subgroup is a VERTICAL container frame holding a subgroup bar
  // (the shared section_bar) stretched across the top, and the subgroup's
  // tables underneath. A subgroup without a 'columns' list lays its tables
  // out in a single HORIZONTAL __subgroup_row_<id> (Scales). A subgroup with
  // a 'columns' list (HTML: interface / prose) instead gets a HORIZONTAL
  // __subgroup_cols_<id> frame holding one VERTICAL __subgroup_col_<id>_<mode>
  // stack of the tables per column — each column pinned to its
  // typography_context mode. Tables without a subgroup are appended to the
  // wrapper as standalone columns.
  const wrapper = await ensureWrapper(page);
  const subgroups = (registry.subgroups && typeof registry.subgroups === 'object') ? registry.subgroups : {};
  const SUBGROUP_INNER_GAP = 24;
  const SUBGROUP_TABLE_GAP = 32;

  // Maps registry meta.badges tokens → the Badge instance node names inside
  // the shared section_bar.
  const SUBGROUP_BADGE_NODES = {
    maintainer:    'Badge: Maintainer',
    consumer:      'Badge: Consumer',
    bundeskanzlei: 'Badge: Bundeskanzlei'
  };

  async function buildSubgroupBar(id, meta) {
    // Subgroup bars use the shared section_bar component — the same
    // badge-based guidance bar as the color-variables docs — so the two
    // top-level typography groups (Scales / HTML) read as distinct, guided
    // sections. The group name (meta.tierLetter — "HTML" / "Scales") is
    // written straight onto the __sectionTitle node (it is baked per variant,
    // not bound to the title property). The color-specific breadcrumb and
    // the tier-letter badge are hidden — typography pages carry no tier
    // letter. Guidance badges are toggled per-subgroup from registry
    // meta.badges by setting Badge instance visibility directly (the
    // showBadge* component properties are not reliably wired across variants).
    const comp = components.sharedSectionBar;
    if (!comp) { L('sharedSectionBar component missing — skipping subgroup bar ' + id); return null; }
    let inst;
    try {
      let variant = comp;
      if (comp.type === 'COMPONENT_SET') {
        // Variant per subgroup (registry meta.variant) — each tier carries its
        // own colour theme (tier=p is the red theme). Note tier=p and tier=s1
        // lack the Consumer badge, so a subgroup needing Consumer must use
        // tier=s / tier=s2.
        const variantName = 'tier=' + (meta.variant || 's');
        variant = (comp.children || []).find(c => c.type === 'COMPONENT' && c.name === variantName)
               || comp.defaultVariant
               || (comp.children || []).find(c => c.type === 'COMPONENT');
        if (!variant) { L('sharedSectionBar COMPONENT_SET has no variants'); return null; }
      }
      inst = variant.createInstance();
    } catch (e) { L('subgroup sharedSectionBar createInstance failed: ' + e.message); return null; }

    // Text component properties wired to visible nodes ($description).
    const want = {
      purpose:   meta.purpose   ? ('Purpose: ' + meta.purpose)     : '',
      guideline: meta.guideline ? ('Guideline: ' + meta.guideline) : ''
    };
    const props = inst.componentProperties || {};
    const updates = {};
    for (const [bare, val] of Object.entries(want)) {
      const key = Object.keys(props).find(k => k === bare || k.split('#')[0] === bare);
      if (key) updates[key] = String(val);
    }
    if (Object.keys(updates).length) {
      try { inst.setProperties(updates); }
      catch (e) { L('subgroup bar setProperties failed: ' + e.message); }
    }

    // Group name → __sectionTitle (baked per variant, so written directly).
    const titleNode = inst.findOne(n => n.type === 'TEXT' && n.name === '__sectionTitle');
    if (titleNode) await setText(titleNode, meta.tierLetter || meta.title || id);

    // Hide the color-specific breadcrumb — no typography equivalent.
    try {
      const crumbs = inst.findAll(n => /section_breadcrumb/.test(n.name));
      for (const c of crumbs) { try { c.visible = false; } catch {} }
    } catch (e) { L('subgroup breadcrumb hide failed: ' + e.message); }

    // Hide the tier-letter badge — typography pages have no tier letter; the
    // group name lives in __sectionTitle instead.
    try {
      const letters = inst.findAll(n => n.name === 'tierLetter');
      for (const n of letters) { try { n.visible = false; } catch {} }
    } catch (e) { L('subgroup tierLetter hide failed: ' + e.message); }

    // Guidance badges: show only those named in registry meta.badges.
    try {
      const badges = Array.isArray(meta.badges) ? meta.badges.map(b => String(b).toLowerCase()) : [];
      const wantNodes = new Set(badges.map(b => SUBGROUP_BADGE_NODES[b]).filter(Boolean));
      const badgeInsts = inst.findAll(n => /^Badge:/.test(n.name));
      for (const b of badgeInsts) { try { b.visible = wantNodes.has(b.name); } catch (e) { L('badge toggle ' + b.name + ': ' + e.message); } }
    } catch (e) { L('subgroup badge toggle failed: ' + e.message); }

    inst.name = '__subgroup_' + id;
    return inst;
  }

  // Group tables by subgroup, preserving registry order.
  const subgroupOrder = [];
  const tablesBySubgroup = new Map();
  const standaloneTables = [];
  for (const spec of registry.tables) {
    const t = page.findOne(c => c.type === 'FRAME' && c.name === spec.tableName)
          || wrapper.findOne(c => c.type === 'FRAME' && c.name === spec.tableName);
    if (!t) continue;
    const sg = spec.subgroup;
    if (sg && subgroups[sg]) {
      if (!tablesBySubgroup.has(sg)) { tablesBySubgroup.set(sg, []); subgroupOrder.push(sg); }
      tablesBySubgroup.get(sg).push(t);
    } else {
      standaloneTables.push(t);
    }
  }

  // typography_context collection — used to pin each html column to a mode
  // (interface / prose) so the two table stacks render side-by-side.
  let _typoCtxCol = null;
  try {
    const _cols = await figma.variables.getLocalVariableCollectionsAsync();
    _typoCtxCol = _cols.find(c => c.name === 'typography_context') || null;
    if (!_typoCtxCol) L('typography_context collection not found');
  } catch (e) { L('typography_context lookup failed: ' + e.message); }
  function setColumnMode(frame, modeName) {
    if (!_typoCtxCol || !frame || !modeName) return;
    const mode = _typoCtxCol.modes.find(m => m.name === modeName);
    if (!mode) { L('typography_context mode missing: ' + modeName); return; }
    try { frame.setExplicitVariableModeForCollection(_typoCtxCol, mode.modeId); }
    catch (e1) {
      try { frame.setExplicitVariableModeForCollection(_typoCtxCol.id, mode.modeId); }
      catch (e2) { L('set typography_context=' + modeName + ' failed: ' + e1.message); }
    }
  }

  // Configure a frame as an auto-layout container (no padding, no fill).
  function layoutFrame(frame, mode, gap) {
    frame.layoutMode = mode;
    frame.itemSpacing = gap;
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    frame.primaryAxisAlignItems = 'MIN';
    frame.counterAxisAlignItems = 'MIN';
    frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 0;
    frame.fills = [];
    frame.opacity = 1;
  }
  function ensureNamedFrame(name) {
    let f = page.findOne(c => c.type === 'FRAME' && c.name === name)
         || wrapper.findOne(c => c.type === 'FRAME' && c.name === name);
    if (!f) { f = figma.createFrame(); f.name = name; page.appendChild(f); }
    return f;
  }

  // Frame / bar names this build expects to keep — others matching the
  // subgroup patterns are swept at the end.
  const wantedFrameNames = new Set();
  const wantedBarNames = new Set();

  // Assemble each subgroup container.
  const orderedContainers = [];
  for (const sg of subgroupOrder) {
    const meta = subgroups[sg];
    const containerName = '__subgroup_container_' + sg;
    const barName = '__subgroup_' + sg;
    wantedFrameNames.add(containerName);
    wantedBarNames.add(barName);

    const container = ensureNamedFrame(containerName);
    layoutFrame(container, 'VERTICAL', SUBGROUP_INNER_GAP);

    // Bar: always rebuilt so component swaps + content edits both take effect.
    for (const b of page.findAll(c => c.type === 'INSTANCE' && c.name === barName)) { try { b.remove(); } catch {} }
    const bar = await buildSubgroupBar(sg, meta);
    if (bar) { try { container.appendChild(bar); } catch { page.appendChild(bar); } }

    const tables = tablesBySubgroup.get(sg) || [];
    const columns = Array.isArray(meta.columns) ? meta.columns : null;

    if (columns && columns.length) {
      // Multi-column: a HORIZONTAL frame holding one VERTICAL stack of the
      // subgroup's tables per typography_context mode. The first column gets
      // the original table frames; the rest get deep clones.
      const colsName = '__subgroup_cols_' + sg;
      wantedFrameNames.add(colsName);
      const colsFrame = ensureNamedFrame(colsName);
      layoutFrame(colsFrame, 'HORIZONTAL', SUBGROUP_INNER_GAP);
      try { container.appendChild(colsFrame); } catch {}

      for (let ci = 0; ci < columns.length; ci++) {
        const modeName = columns[ci];
        const colName = '__subgroup_col_' + sg + '_' + modeName;
        wantedFrameNames.add(colName);
        const colFrame = ensureNamedFrame(colName);
        layoutFrame(colFrame, 'VERTICAL', SUBGROUP_TABLE_GAP);
        try { colsFrame.appendChild(colFrame); } catch {}
        for (const t of tables) {
          const tableNode = ci === 0 ? t : t.clone();
          try { colFrame.appendChild(tableNode); } catch {}
          try { tableNode.layoutAlign = 'INHERIT'; } catch {}
          // Label this table's mode badge with the column's mode.
          await applyTableModeBadge(tableNode, modeName);
        }
        setColumnMode(colFrame, modeName);
      }
    } else {
      // Single HORIZONTAL row of the subgroup's tables (Scales).
      const rowName = '__subgroup_row_' + sg;
      wantedFrameNames.add(rowName);
      const row = ensureNamedFrame(rowName);
      layoutFrame(row, 'HORIZONTAL', SUBGROUP_TABLE_GAP);
      try { container.appendChild(row); } catch {}
      for (const t of tables) {
        try { row.appendChild(t); } catch {}
        // Tables keep their fixed counter-axis width; do not stretch.
        try { t.layoutAlign = 'INHERIT'; } catch {}
      }
    }

    // Stretch bar to the container width so it spans the tables below.
    if (bar) stretch(bar);
    orderedContainers.push(container);
  }

  // Sweep stale subgroup artifacts (frames + bars not part of this build).
  for (const c of [...wrapper.children, ...page.children]) {
    if (c.type === 'FRAME' && /^__subgroup_(container|cols|col|row)_/.test(c.name) && !wantedFrameNames.has(c.name)) {
      try { c.remove(); } catch {}
    } else if (c.type === 'INSTANCE' && /^__subgroup_/.test(c.name) && !/^__subgroup_(container|cols|col|row)_/.test(c.name) && !wantedBarNames.has(c.name)) {
      try { c.remove(); } catch {}
    }
  }

  // Append in order to wrapper.
  for (const cont of orderedContainers) { try { wrapper.appendChild(cont); } catch {} }
  for (const t of standaloneTables)     { try { wrapper.appendChild(t); } catch {} }

  const validate = await validatePage(page);

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

  let gitSha = null;
  try {
    gitSha = require('child_process').execSync('git rev-parse --short HEAD', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {}
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const tzPart = new Intl.DateTimeFormat('en', { timeZoneName: 'short' }).formatToParts(now).find(p => p.type === 'timeZoneName');
  const generatedAt = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}${tzPart ? ' ' + tzPart.value : ''}`;
  const pageTs = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const scriptRel = 'scripts-custom/figma-doc-builders/typography/build-typography.js';

  // Foundation description — read from the typography JSON's umbrella.
  let foundationDescription = null;
  try {
    const repoRoot = path.resolve(HERE, '..', '..', '..');
    const tokJson = path.join(repoRoot, 'src', 'lib', 'themes', '03_semantic', 'typography', 'single', 'static.json');
    const tokens = JSON.parse(fs.readFileSync(tokJson, 'utf8'));
    const desc = tokens && tokens.ob && tokens.ob.s && tokens.ob.s.typography
      && tokens.ob.s.typography.token_family_docs
      && tokens.ob.s.typography.token_family_docs.$description
      && tokens.ob.s.typography.token_family_docs.$description.$value;
    if (typeof desc === 'string' && desc.trim()) foundationDescription = desc.trim();
  } catch (e) { /* leave null */ }

  const payload = { registry, tableFilter: TABLE_FILTER, pageOverride: PAGE_OVER, validateOnly: VALIDATE_ONLY, foundationDescription, provenance: { gitSha, generatedAt, pageTs, scriptRel, scriptName: 'build-typography.js' } };
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
      const info = r.info ? `${r.info.styleCount || 0} styles, ${r.info.rowsBuilt || 0} rows` : '';
      console.log(`  ${status} ${r.id.padEnd(28)} ${info}`);
      if (r.error) console.log(`      ERROR: ${r.error}`);
    }
  }

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
