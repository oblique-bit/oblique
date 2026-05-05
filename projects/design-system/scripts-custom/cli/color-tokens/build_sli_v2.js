#!/usr/bin/env node
/**
 * build_sli_v2.js — Color documentation builder, Figma-variables-only.
 *
 * v2 successor to build_sli_v1.js_. Drops the JSON-source dependency: every
 * color token (primitive, s1, s2, s3) and every family-doc string is read
 * from Figma variables in a single eval. Eval payload contains only the
 * registry (~5 KB) instead of v1's ~232 KB JSON snapshot.
 *
 * Source-of-truth contract:
 *   - Primitives: `static` Figma collection, vars matching `^ob/p/color/...`
 *   - s1:         `s1_lightness` collection (modes: light, dark)
 *   - s2:         `s2_emphasis`  collection (modes: high, low)
 *   - s3:         `semantic`     collection (single mode; resolves both
 *                                                lightness and emphasis)
 *   - Family docs: STRING vars at `<family>/_docs/token_family_info` in the
 *                  same collection as the family's leaves. Build script
 *                  filters out any var path containing `/_docs/`.
 *   - Per-leaf descriptions: `variable.description`.
 *
 * Usage (mirrors v1):
 *   node build_sli_v2.js                 # build all tables
 *   node build_sli_v2.js --table <id>    # build one table (e.g. --table s1-status)
 *   node build_sli_v2.js --tier <name>   # build all tables in a tier (s1|s2|s3|primitive)
 *   node build_sli_v2.js --page <name>   # override target Figma page
 *   node build_sli_v2.js --validate      # build nothing, only run validation pass
 */
'use strict';

process.env.FIG_EVAL_TIMEOUT_MS = process.env.FIG_EVAL_TIMEOUT_MS || '600000';

const fs            = require('fs');
const os            = require('os');
const path          = require('path');
const { spawnSync } = require('child_process');

const CLI         = process.env.FIG_CLI || 'figma-ds-cli';
const HERE        = __dirname;
const REGISTRY    = path.join(HERE, 'registry.json');
// figma-ds-cli's `run` shim uses `process.cwd() + /src/figma-client.js` to import
// its client; without this cwd it ENOENTs against the design-system tree.
const FIG_CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');
// Discovery cache — components/collections by id, keyed by Figma file name.
// First run does the slow walk; subsequent runs hydrate via getNodeByIdAsync.
const CACHE_DIR   = path.resolve(HERE, '..', '..', '..', '_private', '.cache');
const CACHE_FILE  = path.join(CACHE_DIR, 'v2-discovery.json');

function readCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch { return null; }
}
function writeCache(data) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (e) { /* best-effort */ }
}

// ─── figma-ds-cli wrapper ───────────────────────────────────────────────────

function runEval(scriptText) {
  const tmp = path.join(os.tmpdir(), `build-color-v2-${process.pid}-${Date.now()}.js`);
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

function extractJson(stdout) {
  const i = stdout.search(/[{[]/);
  if (i < 0) return null;
  for (let end = stdout.length; end > i; end--) {
    try { return JSON.parse(stdout.slice(i, end)); } catch {}
  }
  return null;
}

// ─── In-Figma plugin code (assembled as a string) ───────────────────────────
// PAYLOAD = { registry, tableFilter, validateOnly, pageOverride }
// Everything else (docs, primitives, descriptions) is read from Figma variables.

const PLUGIN_CODE = `
const { registry, tableFilter, validateOnly, pageOverride } = PAYLOAD;
const log = [];
const results = [];

function L(msg) { log.push(msg); }
function titleCase(s) { return s.replace(/(^|_)([a-z])/g, (_, p, c) => (p ? ' ' : '') + c.toUpperCase()); }
const ROLE_LABELS = {
  bg: 'Background', fg: 'Foreground', border: 'Border', shadow: 'Shadow',
  focus_ring: 'Focus Ring', no_color: 'No Color',
  bg_base: 'Background Base', fg_base: 'Foreground Base',
  bg_disabled: 'Background Disabled', fg_disabled: 'Foreground Disabled'
};
function prettifyGroup(key) { return ROLE_LABELS[key] || titleCase(key); }
function tokenPathToVarName(p) { return p.replace(/\\./g, '/'); }

// ─── Discover ──────────────────────────────────────────────────────────────
async function loadFonts() {
  // Daemon/sandbox limit: 7 sequential loadFontAsync calls hangs the eval (1ms
  // each individually, but queue stalls at the 7th). 5 reliably works. We pick
  // the most-used Noto Sans styles for body text. Section-bar text loads its
  // specific font on-demand inside customizeSectionBar.
  for (const style of ['Regular','Medium','SemiBold','Bold','ExtraBold']) {
    try { await figma.loadFontAsync({ family: 'Noto Sans', style }); } catch {}
  }
}

async function discoverComponents() {
  const cn = registry.componentNames;
  const targetNames = [
    cn.rowSet['2-mode'], cn.rowSet['4-mode'], cn.rowSet.rowLow, cn.rowSet.primitive,
    cn.headerSet['2-mode'], cn.headerSet['4-mode'], cn.headerSet.primitive,
    cn.groupHeaderSet, cn.separatorComponent, cn.setHeadingComponent, cn.swatchSet,
    '_Section Bar'
  ].filter(Boolean);
  const targetSet = new Set(targetNames);
  const found = {};
  function walkPage(page) {
    function walk(node) {
      if (!node) return;
      if ((node.type === 'COMPONENT_SET' || node.type === 'COMPONENT') && targetSet.has(node.name)) {
        if (node.type === 'COMPONENT' && node.parent && node.parent.type === 'COMPONENT_SET') {
          // skip — handled via set
        } else {
          if (!found[node.name]) found[node.name] = node;
        }
      }
      if (node.type === 'COMPONENT_SET') return;
      if (node.children) for (const c of node.children) walk(c);
    }
    walk(page);
  }
  const pages = [...figma.root.children];
  pages.sort((a, b) => (a.name === registry.page ? -1 : (b.name === registry.page ? 1 : 0)));
  for (const page of pages) {
    await page.loadAsync();
    walkPage(page);
    if (Object.keys(found).length >= targetNames.length) break;
  }

  function setOrComp(name) { return found[name] || null; }
  return {
    rowSet: {
      '2-mode':   setOrComp(cn.rowSet['2-mode']),
      '4-mode':   setOrComp(cn.rowSet['4-mode']),
      rowLow:     setOrComp(cn.rowSet.rowLow),
      primitive:  setOrComp(cn.rowSet.primitive)
    },
    headerSet: {
      '2-mode':   setOrComp(cn.headerSet['2-mode']),
      '4-mode':   setOrComp(cn.headerSet['4-mode']),
      primitive:  setOrComp(cn.headerSet.primitive)
    },
    groupHeaderSet:  setOrComp(cn.groupHeaderSet),
    separator:       setOrComp(cn.separatorComponent),
    setHeading:      setOrComp(cn.setHeadingComponent),
    swatchSet:       setOrComp(cn.swatchSet),
    sectionBar: setOrComp('_Section Bar')
  };
}

async function discoverCollections() {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const map = {};
  for (const c of cols) {
    map[c.name] = { id: c.id, modes: {}, node: c, defaultModeId: c.defaultModeId };
    for (const m of c.modes) map[c.name].modes[m.name] = m.modeId;
  }
  const aliases = {
    'static':       map['static']       || null,
    's1-lightness': map['s1-lightness'] || map['s1_lightness'] || map['Lightness'] || null,
    's2-emphasis':  map['s2-emphasis']  || map['s2_emphasis']  || map['Emphasis']  || null,
    'semantic':     map['semantic']     || map['Semantic']     || null
  };
  return { all: map, aliases };
}

// Discover both COLOR and STRING vars. Build:
//   varMap.byName / byId / list — color vars only (used for swatch binding)
//   docMap.byPath               — family-doc string vars: stripped path → text
async function discoverVariables(collections) {
  const colorVars  = await figma.variables.getLocalVariablesAsync('COLOR');
  const stringVars = await figma.variables.getLocalVariablesAsync('STRING');

  const byName = {}, byId = {};
  const list = [];
  for (const v of colorVars) {
    // Skip metadata namespace
    if (v.name.includes('/_docs/')) continue;
    byName[v.name] = v; byId[v.id] = v; list.push(v);
  }

  // Build family-doc map. Var name pattern: <family-path>/_docs/token_family_info.
  // Read the value from the variable's own collection's default mode (text is identical across modes).
  const docMap = {};
  for (const v of stringVars) {
    if (!v.name.endsWith('/_docs/token_family_info')) continue;
    const familyPath = v.name.slice(0, -('/_docs/token_family_info'.length));
    const dotPath = familyPath.replace(/\\//g, '.');
    let modeId;
    const ownCol = collections.all && Object.values(collections.all).find(c => c.id === v.variableCollectionId);
    if (ownCol) modeId = ownCol.defaultModeId || Object.values(ownCol.modes)[0];
    else modeId = Object.keys(v.valuesByMode)[0];
    const val = v.valuesByMode[modeId];
    if (typeof val === 'string') docMap[dotPath] = val;
  }

  return { byName, byId, list, docMap, colorCount: colorVars.length, stringCount: stringVars.length };
}

function descAt(p, varMap) { return (varMap.docMap && varMap.docMap[p]) || ''; }

// ─── Page + structure (unchanged from v1) ──────────────────────────────────
async function ensurePage(name) {
  let page = figma.root.children.find(p => p.name === name);
  if (page) { await page.loadAsync(); return page; }
  page = figma.createPage();
  page.name = name;
  return page;
}

function findFrameByName(parent, name) {
  if (!parent || !parent.children) return null;
  return parent.children.find(c => c.type === 'FRAME' && c.name === name) || null;
}

const TIER_SECTIONS = {
  primitive: { name: 'Section: Primitive Colors', tablesLayout: 'VERTICAL'   },
  s1:        { name: 'Section: Semantic S1 — Lightness', tablesLayout: 'HORIZONTAL', tablesName: 'S1 Tables' },
  s2:        { name: 'Section: Semantic S2 — Emphasis',  tablesLayout: 'HORIZONTAL', tablesName: 'S2 Tables' },
  s3:        { name: 'Section: Semantic S3 — Compiled',  tablesLayout: 'HORIZONTAL', tablesName: 'S3 Tables' }
};

// Component now bakes in tierLetter, __sectionTitle, badges, and breadcrumb per
// variant (tier = p | s1 | s2 | s). Script only fills $description and only
// switches the variant when *creating* a new instance — existing instances keep
// whatever variant the user picked manually. Description text comes from the
// tier-root _docs/token_family_info STRING variable (default-mode value).
const TIER_BAR = {
  primitive: { instanceName: 'Section Bar: Tier P',  variant: 'p',  docPath: 'ob.p.color'  },
  s1:        { instanceName: 'Section Bar: Tier S1', variant: 's1', docPath: 'ob.s1.color' },
  s2:        { instanceName: 'Section Bar: Tier S2', variant: 's2', docPath: 'ob.s2.color' },
  s3:        { instanceName: 'Section Bar: Tier S3', variant: 's',  docPath: 'ob.s.color'  }
};

async function customizeSectionBar(instance, tier, varMap) {
  const meta = TIER_BAR[tier];
  if (!meta) return;
  instance.name = meta.instanceName;
  try { instance.layoutSizingHorizontal = 'FILL'; } catch {}
  function findText(node, name) {
    if (node.type === 'TEXT' && node.name === name) return node;
    if (node.children) for (const c of node.children) { const t = findText(c, name); if (t) return t; }
    return null;
  }
  const t = findText(instance, '$description');
  const desc = descAt(meta.docPath, varMap);
  if (t && desc) {
    try {
      const fn = t.fontName;
      if (fn && fn !== figma.mixed) await figma.loadFontAsync(fn);
      t.characters = String(desc);
    } catch {}
  }
}

const WRAPPER_BG_VAR_NAME = 'ob/s/color/neutral/bg/contrast_highest/inversity_normal';
const WRAPPER_BG_FALLBACK_HEX = '#FFFFFF';

function applyWrapperBg(node, varMap) {
  try {
    const v = varMap && varMap.byName && varMap.byName[WRAPPER_BG_VAR_NAME];
    const paint = figma.util.solidPaint(WRAPPER_BG_FALLBACK_HEX);
    if (v) {
      node.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', v)];
    } else {
      node.fills = [paint];
    }
  } catch {}
}

async function ensurePageStructure(page, components, varMap) {
  for (const c of [...page.children]) {
    if (c.type !== 'FRAME') continue;
    if (c.name === 'Color Tokens') continue;
    if (/^Token Set:/.test(c.name) || /^Section: /.test(c.name) || /^Token Table/.test(c.name)) {
      c.remove();
    }
  }

  let container = page.children.find(c => c.type === 'FRAME' && c.name === 'Color Tokens');
  if (!container) {
    container = figma.createFrame();
    container.name = 'Color Tokens';
    container.layoutMode = 'HORIZONTAL';
    container.itemSpacing = 256;
    container.paddingTop = 32; container.paddingBottom = 32;
    container.paddingLeft = 32; container.paddingRight = 32;
    container.layoutSizingHorizontal = 'HUG';
    container.layoutSizingVertical = 'HUG';
    container.fills = [];
    page.appendChild(container);
  }

  const tierSections = {};
  const tablesContainers = {};
  for (const [tier, spec] of Object.entries(TIER_SECTIONS)) {
    let section = container.children.find(c => c.type === 'FRAME' && c.name === spec.name);
    if (!section) {
      section = figma.createFrame();
      section.name = spec.name;
      section.layoutMode = 'VERTICAL';
      section.itemSpacing = 24;
      section.layoutSizingHorizontal = 'HUG';
      section.layoutSizingVertical = 'HUG';
      section.fills = [];
      container.appendChild(section);
    }
    tierSections[tier] = section;

    const sbComp = components.sectionBar;
    const expectedName = TIER_BAR[tier]?.instanceName;
    if (sbComp && expectedName) {
      let inst = section.children.find(c => c.type === 'INSTANCE' && c.name === expectedName);
      if (!inst) {
        let variantComp = sbComp;
        if (sbComp.type === 'COMPONENT_SET') {
          const v = TIER_BAR[tier]?.variant;
          variantComp = (v && sbComp.children.find(c => c.type === 'COMPONENT' && c.name === 'tier=' + v)) || sbComp.defaultVariant;
        }
        inst = variantComp.createInstance();
        section.insertChild(0, inst);
      }
      await customizeSectionBar(inst, tier, varMap);
    }

    if (spec.tablesLayout === 'HORIZONTAL') {
      let tables = section.children.find(c => c.type === 'FRAME' && c.name === spec.tablesName);
      if (!tables) {
        tables = figma.createFrame();
        tables.name = spec.tablesName;
        tables.layoutMode = 'HORIZONTAL';
        tables.itemSpacing = 32;
        tables.layoutSizingHorizontal = 'HUG';
        tables.layoutSizingVertical = 'HUG';
        tables.fills = [];
        section.appendChild(tables);
      }
      tablesContainers[tier] = tables;
    } else {
      tablesContainers[tier] = section;
    }
  }

  return { container, tierSections, tablesContainers };
}

function ensureWrapper(parent, wrapperName, tier, varMap) {
  // Direct-child lookup only. Wrappers are always direct children of their
  // tablesContainer; recursion through accumulated rebuilds (114k+ nodes seen
  // in practice) caused 10-min hangs.
  let wrapper = (parent.children || []).find(c => c.type === 'FRAME' && c.name === wrapperName) || null;
  if (!wrapper) {
    wrapper = figma.createFrame();
    wrapper.name = wrapperName;
    wrapper.layoutMode = 'VERTICAL';
    wrapper.itemSpacing = 16;
    wrapper.paddingLeft = 24; wrapper.paddingRight = 24;
    wrapper.paddingTop = 24; wrapper.paddingBottom = 24;
    wrapper.layoutSizingHorizontal = 'HUG';
    wrapper.layoutSizingVertical = 'HUG';
    parent.appendChild(wrapper);
  }
  applyWrapperBg(wrapper, varMap);
  return { wrapper, created: true };
}

function ensureTableFrame(wrapper, tableFrameName, tierWidth) {
  let frame = findFrameByName(wrapper, tableFrameName);
  if (!frame) {
    frame = findFrameByName(wrapper, 'Token Table Left') || findFrameByName(wrapper, 'Token Table');
    if (frame) frame.name = tableFrameName;
  }
  if (!frame) {
    frame = figma.createFrame();
    frame.name = tableFrameName;
    frame.layoutMode = 'VERTICAL';
    frame.layoutSizingHorizontal = 'FIXED';
    frame.layoutSizingVertical = 'HUG';
    frame.fills = [];
    frame.resize(tierWidth, 1);
    wrapper.appendChild(frame);
  } else {
    if (Math.abs(frame.width - tierWidth) > 0.5) frame.resize(tierWidth, frame.height);
    if (frame.layoutSizingHorizontal !== 'FIXED') frame.layoutSizingHorizontal = 'FIXED';
    if (frame.layoutSizingVertical !== 'HUG') frame.layoutSizingVertical = 'HUG';
  }
  return frame;
}

function parseFamilyDoc(text) {
  if (!text) return { intro: '', recommended: '', notRecommended: '' };
  const doIdx = text.search(/(?:^|\\s)Do:\\s/);
  const avoidIdx = text.search(/(?:^|\\s)Avoid:\\s/);
  let intro = text;
  let recommended = '';
  let notRecommended = '';
  if (doIdx >= 0) {
    intro = text.slice(0, doIdx).trim();
    const doStart = text.slice(doIdx).replace(/^\\s*Do:\\s*/, '');
    if (avoidIdx > doIdx) {
      recommended = text.slice(doIdx, avoidIdx).replace(/^\\s*Do:\\s*/, '').trim();
      notRecommended = text.slice(avoidIdx).replace(/^\\s*Avoid:\\s*/, '').trim();
    } else {
      recommended = doStart.trim();
    }
  } else if (avoidIdx >= 0) {
    intro = text.slice(0, avoidIdx).trim();
    notRecommended = text.slice(avoidIdx).replace(/^\\s*Avoid:\\s*/, '').trim();
  }
  return { intro, recommended, notRecommended };
}

function deriveReadableName(wrapperName) {
  const path = wrapperName.replace(/^Token Set: /, '');
  const segs = path.split('.');
  const tail = segs.slice(3);
  if (tail.length === 0) return 'Primitive Color';
  return tail.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

function ensureSetHeading(wrapper, components, tierWidth, info) {
  let heading = wrapper.children.find(c => c.type === 'INSTANCE' && c.name === '_Set Heading');
  if (!heading && components.setHeading) {
    heading = components.setHeading.createInstance();
    wrapper.insertChild(0, heading);
  }
  if (!heading) return null;
  if (Math.abs(heading.width - tierWidth) > 0.5) heading.resize(tierWidth, heading.height);
  if (heading.layoutSizingHorizontal !== 'FIXED') heading.layoutSizingHorizontal = 'FIXED';

  function findText(node, name) {
    if (node.type === 'TEXT' && node.name === name) return node;
    if (node.children) for (const c of node.children) { const t = findText(c, name); if (t) return t; }
    return null;
  }
  const setIf = (n, v) => {
    const t = findText(heading, n);
    if (t && v != null && v !== '') try { t.characters = String(v); } catch {}
  };
  setIf('__readableName', info.readableName);
  setIf('__token_path', info.tokenPath);
  setIf('__page_intro', info.intro || info.description);
  setIf('__recommended', info.recommended);
  setIf('__not_recommended', info.notRecommended);
  if (info.tokenCount != null) setIf('__tokenCount', info.tokenCount + ' tokens');
  return heading;
}

// ─── Cell helpers ──────────────────────────────────────────────────────────
function findChild(node, name) { return (node && node.children) ? node.children.find(c => c.name === name) || null : null; }
function findFirstText(node) {
  if (!node) return null;
  if (node.type === 'TEXT') return node;
  if (node.children) for (const c of node.children) { const t = findFirstText(c); if (t) return t; }
  return null;
}
function findAllByType(node, type) {
  const out = [];
  function w(n) { if (!n) return; if (n.type === type) out.push(n); if (n.children) for (const c of n.children) w(c); }
  w(node);
  return out;
}
function setText(textNode, value) {
  if (!textNode || textNode.type !== 'TEXT') return false;
  try { textNode.characters = String(value == null ? '' : value); return true; } catch { return false; }
}

async function bindSwatchToVariable(rect, variable) {
  if (!rect || rect.type !== 'RECTANGLE' || !variable) return false;
  try {
    const currentPaint = (rect.fills && rect.fills[0]) || figma.util.solidPaint('#808080');
    const bound = figma.variables.setBoundVariableForPaint(currentPaint, 'color', variable);
    rect.fills = [bound];
    return true;
  } catch { return false; }
}

function setSolidFill(rect, hex) {
  if (!rect || rect.type !== 'RECTANGLE') return false;
  try {
    const paint = figma.util.solidPaint(hex || '#808080');
    rect.fills = [paint];
    return true;
  } catch { return false; }
}

function applyModeOverrides(swatchInst, modeMap, collectionsByAlias) {
  if (!swatchInst || swatchInst.type !== 'INSTANCE' || !modeMap) return;
  for (const [alias, modeName] of Object.entries(modeMap)) {
    const col = collectionsByAlias[alias];
    if (!col) continue;
    const modeId = col.modes[modeName];
    if (!modeId) continue;
    try { swatchInst.setExplicitVariableModeForCollection(col.node, modeId); } catch {}
  }
}

function alphaVariantFor(tokenName) {
  if (!tokenName) return 'None';
  if (tokenName.includes('white_alpha')) return 'Dark';
  if (tokenName.includes('_alpha')) return 'Light';
  return 'None';
}

function setAlphaVariant(swatchInst, tokenName) {
  if (!swatchInst || swatchInst.type !== 'INSTANCE') return;
  try { swatchInst.setProperties({ Alpha: alphaVariantFor(tokenName) }); } catch {}
}

function getRoleSegment(tokenName) {
  const parts = tokenName.split(/[./]/);
  const ROLE_PARTS = ['bg','fg','border','shadow','focus_ring','no_color','bg_base','fg_base','bg_disabled','fg_disabled'];
  return parts.find(p => ROLE_PARTS.includes(p)) || '';
}

function deriveGroups(tokens, prefixSegmentCount) {
  const groups = new Map();
  for (const t of tokens) {
    const segs = t.dotPath.split('.');
    const groupKey = segs[prefixSegmentCount] || '_';
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(t);
  }
  return groups;
}

// ─── Hex resolution ─────────────────────────────────────────────────────────
function rgbaToHex(c) {
  const r = Math.round((c.r || 0) * 255);
  const g = Math.round((c.g || 0) * 255);
  const b = Math.round((c.b || 0) * 255);
  const hex = '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
  if (c.a !== undefined && c.a < 1) {
    const a = Math.round(c.a * 255).toString(16).padStart(2, '0');
    return hex + a;
  }
  return hex;
}

async function resolveValueForVariable(variable, modeId, varMap) {
  if (!variable) return null;
  let val = variable.valuesByMode[modeId];
  if (val === undefined) {
    const collection = await getCollectionByIdCached(variable.variableCollectionId);
    if (collection && collection.defaultModeId) val = variable.valuesByMode[collection.defaultModeId];
  }
  while (val && val.type === 'VARIABLE_ALIAS') {
    const next = await getVariableByIdCached(val.id, varMap);
    if (!next) return null;
    val = next.valuesByMode[modeId];
    if (val === undefined) {
      const collection = await getCollectionByIdCached(next.variableCollectionId);
      if (collection && collection.defaultModeId) val = next.valuesByMode[collection.defaultModeId];
    }
  }
  return val;
}

async function resolveHexForVariable(variable, collectionAlias, modeName, collectionsByAlias, varMap) {
  if (!variable) return '';
  const col = collectionsByAlias[collectionAlias];
  if (!col) return '';
  const modeId = col.modes[modeName];
  if (!modeId) return '';
  const v = await resolveValueForVariable(variable, modeId, varMap);
  if (v && typeof v === 'object' && 'r' in v) return rgbaToHex(v);
  return '';
}

async function resolveHexFor4Mode(variable, lightMode, emphasisMode, collectionsByAlias, varMap) {
  if (!variable) return '';
  const lightCol = collectionsByAlias['s1-lightness'];
  const emphCol  = collectionsByAlias['s2-emphasis'];
  if (!lightCol || !emphCol) return '';
  let cur = variable;
  let modeId;
  for (let depth = 0; depth < 10; depth++) {
    const colId = cur.variableCollectionId;
    if (colId === lightCol.id) modeId = lightCol.modes[lightMode];
    else if (colId === emphCol.id) modeId = emphCol.modes[emphasisMode];
    else {
      const col = await getCollectionByIdCached(colId);
      modeId = col ? col.defaultModeId : null;
    }
    let val = cur.valuesByMode[modeId];
    if (val === undefined) val = cur.valuesByMode[Object.keys(cur.valuesByMode)[0]];
    if (val && val.type === 'VARIABLE_ALIAS') {
      const next = await getVariableByIdCached(val.id, varMap);
      if (!next) return '';
      cur = next;
      continue;
    }
    if (val && typeof val === 'object' && 'r' in val) return rgbaToHex(val);
    return '';
  }
  return '';
}

// Cross-file alias resolver — varMap.byId only has local vars; SHA-prefixed
// ids need async getVariableByIdAsync fallback. Two caches:
//   aliasNameCache  — id → name (used by reference text builders)
//   aliasVarCache   — id → Variable object (used by hex resolvers)
//   collCache       — id → Collection (avoids re-fetching collections per alias hop)
const aliasNameCache = new Map();
const aliasVarCache  = new Map();
const collCache      = new Map();

async function getVariableByIdCached(id, varMap) {
  if (aliasVarCache.has(id)) return aliasVarCache.get(id);
  let v = (varMap && varMap.byId && varMap.byId[id]) || null;
  if (!v) {
    try { v = await figma.variables.getVariableByIdAsync(id); } catch { v = null; }
  }
  aliasVarCache.set(id, v);
  return v;
}

async function getCollectionByIdCached(id) {
  if (collCache.has(id)) return collCache.get(id);
  let c = null;
  try { c = await figma.variables.getVariableCollectionByIdAsync(id); } catch { c = null; }
  collCache.set(id, c);
  return c;
}

async function aliasIdToName(id, varMap) {
  if (aliasNameCache.has(id)) return aliasNameCache.get(id);
  const v = await getVariableByIdCached(id, varMap);
  const name = v ? v.name : '';
  aliasNameCache.set(id, name);
  return name;
}

async function refTokenForVariable(variable, collectionAlias, modeName, collectionsByAlias, varMap) {
  if (!variable) return '';
  const col = collectionsByAlias[collectionAlias];
  if (!col) return '';
  let modeId;
  if (variable.variableCollectionId === col.id) {
    modeId = col.modes[modeName];
  } else {
    const ownCol = await getCollectionByIdCached(variable.variableCollectionId);
    modeId = ownCol ? ownCol.defaultModeId : null;
  }
  if (!modeId) return '';
  const val = variable.valuesByMode[modeId];
  if (val && val.type === 'VARIABLE_ALIAS') {
    const name = await aliasIdToName(val.id, varMap);
    if (name) return '{' + name.replace(/\\//g, '.') + '}';
  }
  return '';
}

async function refTokenFor4Mode(variable, emphasisMode, collectionsByAlias, varMap) {
  if (!variable) return '';
  const emphCol = collectionsByAlias['s2-emphasis'];
  if (!emphCol) return '';
  const colId = variable.variableCollectionId;
  let modeId;
  if (colId === emphCol.id) {
    modeId = emphCol.modes[emphasisMode];
  } else {
    const col = await getCollectionByIdCached(colId);
    modeId = col ? col.defaultModeId : null;
  }
  if (!modeId) return '';
  const val = variable.valuesByMode[modeId];
  if (val && val.type === 'VARIABLE_ALIAS') {
    const name = await aliasIdToName(val.id, varMap);
    if (name) return '{' + name.replace(/\\//g, '.') + '}';
  }
  return '';
}

// ─── Row builders ──────────────────────────────────────────────────────────
function populateReferences(row, lightRef, darkRef) {
  const refCell = findChild(row, 'Cell: Reference');
  if (!refCell) return;
  const lightLine = findChild(refCell, 'refLine-light');
  const darkLine = findChild(refCell, 'refLine-dark');
  function setLine(line, refText) {
    if (!line) return;
    const t = line.children?.find(c => c.name === 'tokenReference' && c.type === 'TEXT');
    if (t) setText(t, refText || '');
  }
  setLine(lightLine, lightRef || '');
  setLine(darkLine,  darkRef  || '');
}

async function build2ModeRow(table, token, components, varMap, collectionsByAlias) {
  const rowSet = components.rowSet['2-mode'];
  if (!rowSet) return { error: 'no 2-mode row set' };
  const variant = rowSet.children.find(c => c.name === 'Role=' + (table.showRoleColumn ? 'true' : 'false'))
    || rowSet.defaultVariant;
  const row = variant.createInstance();
  return { row, populate: async () => {
    row.layoutSizingHorizontal = 'FILL';
    const nameCell = findChild(row, 'Cell: Name');
    if (nameCell) setText(findFirstText(nameCell), token.dotPath);
    if (table.showRoleColumn) {
      const roleCell = findChild(row, 'Cell: Role');
      if (roleCell) setText(findFirstText(roleCell), getRoleSegment(token.dotPath));
    }
    const descCell = findChild(row, 'Cell: $description') || findChild(row, 'Cell: Description');
    if (descCell) setText(findFirstText(descCell), token.description || '');
    populateReferences(row, token.referenceLight, token.referenceDark);

    for (const mode of ['light','dark']) {
      const cellName = mode === 'light' ? 'Cell: Light' : 'Cell: Dark';
      const cell = findChild(row, cellName);
      if (!cell) continue;
      const swInst = cell.children.find(c => c.type === 'INSTANCE') || null;
      const swRect = swInst ? findChild(swInst, 'swatch') : null;
      const hexNode = findChild(cell, 'hex' + (mode === 'light' ? 'Light' : 'Dark'))
        || findAllByType(cell, 'TEXT').find(t => /hex/i.test(t.name));

      if (token.kind === 'figma-var') {
        const v = varMap.byName[token.varName];
        if (v) await bindSwatchToVariable(swRect, v);
        applyModeOverrides(swInst, { [table.modeCollection]: mode }, collectionsByAlias);
        if (hexNode) {
          const hex = await resolveHexForVariable(v, table.modeCollection, mode, collectionsByAlias, varMap);
          setText(hexNode, hex || '');
        }
      } else {
        // primitive — use Figma var if available; fall back to plain hex
        const v = token.varName ? varMap.byName[token.varName] : null;
        if (v) {
          await bindSwatchToVariable(swRect, v);
        } else {
          setSolidFill(swRect, token.value);
        }
        if (hexNode) setText(hexNode, token.value || '');
      }
      setAlphaVariant(swInst, token.dotPath);
    }
  } };
}

async function build4ModeRows(table, token, components, varMap, collectionsByAlias) {
  const rowSet  = components.rowSet['4-mode'];
  const lowSet  = components.rowSet.rowLow;
  if (!rowSet) return { error: 'no 4-mode row set' };
  const variantName = 'Role=' + (table.showRoleColumn ? 'true' : 'false');
  const highVariant = rowSet.children.find(c => c.name === variantName) || rowSet.defaultVariant;
  const lowVariant  = lowSet ? (lowSet.children.find(c => c.name === variantName) || lowSet.defaultVariant) : null;

  const high = highVariant.createInstance();
  const low  = lowVariant ? lowVariant.createInstance() : null;
  return { rows: [high, low].filter(Boolean), populate: async () => {
    for (const [row, emphasis] of [[high,'high'], [low,'low']]) {
      if (!row) continue;
      row.layoutSizingHorizontal = 'FILL';
      const nameCell = findChild(row, 'Cell: Name');
      if (nameCell) setText(findFirstText(nameCell), token.dotPath);
      if (table.showRoleColumn) {
        const roleCell = findChild(row, 'Cell: Role');
        if (roleCell) setText(findFirstText(roleCell), getRoleSegment(token.dotPath));
      }
      const emCell = findChild(row, 'Cell: Emphasis');
      if (emCell) setText(findFirstText(emCell), emphasis);
      const descCell = findChild(row, 'Cell: $description') || findChild(row, 'Cell: Description');
      if (descCell) setText(findFirstText(descCell), token.description || '');
      const refForRow = emphasis === 'high' ? token.referenceHigh : token.referenceLow;
      populateReferences(row, refForRow, refForRow);

      for (const lightMode of ['light','dark']) {
        const cellName = 'Cell: ' + (lightMode === 'light' ? 'Light' : 'Dark') + '/' + (emphasis === 'high' ? 'High' : 'Low');
        const cell = findChild(row, cellName);
        if (!cell) continue;
        const swInst = cell.children.find(c => c.type === 'INSTANCE');
        const swRect = swInst ? findChild(swInst, 'swatch') : null;
        if (token.kind === 'figma-var') {
          const v = varMap.byName[token.varName];
          if (v) await bindSwatchToVariable(swRect, v);
          applyModeOverrides(swInst, {
            's1-lightness': lightMode,
            's2-emphasis':  emphasis
          }, collectionsByAlias);
        } else {
          setSolidFill(swRect, token.value);
        }
        setAlphaVariant(swInst, token.dotPath);
        const hexNode = findAllByType(cell, 'TEXT').find(t => /hex/i.test(t.name));
        if (hexNode && token.kind === 'figma-var') {
          const v = varMap.byName[token.varName];
          const hex = await resolveHexFor4Mode(v, lightMode, emphasis, collectionsByAlias, varMap);
          if (hex) setText(hexNode, hex);
        } else if (hexNode) {
          setText(hexNode, token.value);
        }
      }
    }
  } };
}

async function buildPrimitiveRow(table, token, components, varMap) {
  const comp = components.rowSet.primitive;
  if (!comp) return { error: 'no primitive row component' };
  const row = comp.createInstance();
  return { row, populate: async () => {
    row.layoutSizingHorizontal = 'FILL';
    const nameCell = findChild(row, 'Cell: Name') || findChild(row, 'Cell: Token Name');
    if (nameCell) setText(findFirstText(nameCell), token.dotPath);
    const cell = findChild(row, 'Cell: Swatch');
    let swInst = null, swRect = null, hexNode = null;
    if (cell) {
      const wrapper = findChild(cell, 'Swatch Wrapper');
      swInst = wrapper ? (wrapper.children.find(c => c.type === 'INSTANCE') || null) : (cell.children.find(c => c.type === 'INSTANCE') || null);
      swRect = swInst ? findChild(swInst, 'swatch') : findAllByType(cell, 'RECTANGLE')[0];
      hexNode = findAllByType(cell, 'TEXT').find(t => /hex/i.test(t.name)) || findAllByType(cell, 'TEXT').pop();
    }
    // Match v1: primitives are solid-filled (not bound). Var-binding could be
    // a future optimization to track palette changes, but parity with v1 wins
    // for the A/B test.
    setSolidFill(swRect, token.value);
    setAlphaVariant(swInst, token.dotPath);
    if (hexNode) setText(hexNode, token.value || '');
    const descCell = findChild(row, 'Cell: $description') || findChild(row, 'Cell: Description');
    if (descCell) setText(findFirstText(descCell), token.description || '');
  } };
}

// ─── Build a single table ──────────────────────────────────────────────────
async function buildTable(spec, ctx) {
  const t0 = Date.now();
  const out = { id: spec.id, ok: false, info: {}, issues: [] };

  const page = await ensurePage(pageOverride || registry.page);
  const tierWidth = registry.tableWidths[spec.tier] || 1500;
  const tablesContainer = ctx.structure.tablesContainers[spec.tier] || page;
  const { wrapper } = ensureWrapper(tablesContainer, spec.wrapperName, spec.tier, ctx.varMap);
  const tableFrame = ensureTableFrame(wrapper, spec.tableFrameName, tierWidth);

  // Drop any "Token Table Right" siblings (legacy left/right split)
  const oldRight = wrapper.children.find(c => c.type === 'FRAME' && /Token Table Right|Token Table: .* right/i.test(c.name));
  if (oldRight) { oldRight.remove(); out.info.removedRight = true; }

  // Gather tokens
  const tokens = [];
  const isPrimitiveTable = spec.source === 'primitive-json' || spec.tier === 'primitive';

  if (isPrimitiveTable) {
    // v2: primitives sourced from Figma vars in the static collection,
    // filtered by family path. Family list comes from registry.
    const fams = spec.primitiveFamilies || [];
    for (const fam of fams) {
      const prefix = 'ob/p/color/' + fam + '/';
      for (const v of ctx.varMap.list) {
        if (!v.name.startsWith(prefix)) continue;
        // Each primitive family lives flat under its name (e.g. ob/p/color/red/50)
        const dotPath = v.name.replace(/\\//g, '.');
        // Resolve hex via default mode of the variable's own collection (static is single-mode)
        const ownCol = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
        const modeId = ownCol ? ownCol.defaultModeId : Object.keys(v.valuesByMode)[0];
        const val = v.valuesByMode[modeId];
        const hex = (val && typeof val === 'object' && 'r' in val) ? rgbaToHex(val) : '';
        tokens.push({
          kind: 'primitive',
          dotPath,
          varName: v.name,
          value: hex,
          description: v.description || '',
          variable: v
        });
      }
    }
  } else if (spec.source === 'figma-vars') {
    const filterRe = new RegExp(spec.matches);
    for (const v of ctx.varMap.list) {
      if (!filterRe.test(v.name)) continue;
      const dotPath = v.name.replace(/\\//g, '.');
      tokens.push({
        kind: 'figma-var',
        varName: v.name,
        dotPath,
        description: v.description || '',
        variable: v
      });
    }
    if (spec.rowComponent === '2-mode') {
      await Promise.all(tokens.map(async t => {
        const [light, dark] = await Promise.all([
          refTokenForVariable(t.variable, spec.modeCollection, 'light', ctx.collections.aliases, ctx.varMap),
          refTokenForVariable(t.variable, spec.modeCollection, 'dark',  ctx.collections.aliases, ctx.varMap)
        ]);
        t.referenceLight = light;
        t.referenceDark  = dark;
      }));
    } else if (spec.rowComponent === '4-mode') {
      await Promise.all(tokens.map(async t => {
        const [high, low] = await Promise.all([
          refTokenFor4Mode(t.variable, 'high', ctx.collections.aliases, ctx.varMap),
          refTokenFor4Mode(t.variable, 'low',  ctx.collections.aliases, ctx.varMap)
        ]);
        t.referenceHigh = high;
        t.referenceLow  = low;
      }));
    }
  }
  out.info.tokenCount = tokens.length;

  // Heading
  const wrapperPath = spec.wrapperName.replace(/^Token Set: /, '');
  const fullDesc = descAt(wrapperPath, ctx.varMap) || descAt('ob.' + spec.tier + '.color', ctx.varMap) || '';
  const parsedDoc = parseFamilyDoc(fullDesc);
  ensureSetHeading(wrapper, ctx.components, tierWidth, {
    description: fullDesc,
    intro: parsedDoc.intro,
    recommended: parsedDoc.recommended,
    notRecommended: parsedDoc.notRecommended,
    readableName: deriveReadableName(spec.wrapperName),
    tokenPath: wrapperPath,
    tokenCount: tokens.length
  });

  // Group tokens by the segment after the prefix.
  let prefixSegments;
  if (spec.matches) {
    prefixSegments = spec.matches.replace(/^\\^/, '').split('/').length - 1;
  } else {
    prefixSegments = 3;
  }
  const groups = deriveGroups(tokens, prefixSegments);

  // Wipe existing children of the table frame
  for (const c of [...tableFrame.children]) c.remove();

  // Header
  const headerComp = ctx.components.headerSet[spec.rowComponent];
  if (headerComp) {
    let headerInst;
    if (headerComp.type === 'COMPONENT_SET') {
      const v = headerComp.children.find(c => c.name === 'Role=' + (spec.showRoleColumn ? 'true' : 'false')) || headerComp.defaultVariant;
      headerInst = v.createInstance();
    } else {
      headerInst = headerComp.createInstance();
    }
    tableFrame.appendChild(headerInst);
    headerInst.layoutSizingHorizontal = 'FILL';
  }

  // Group iteration (preserve insertion order)
  let bindCount = 0, bindFail = 0;
  for (const [groupKey, groupTokens] of groups) {
    if (ctx.components.groupHeaderSet) {
      const ghComp = ctx.components.groupHeaderSet;
      const ghInst = (ghComp.type === 'COMPONENT_SET' ? ghComp.defaultVariant : ghComp).createInstance();
      tableFrame.appendChild(ghInst);
      ghInst.layoutSizingHorizontal = 'FILL';
      function findNamedText(node, name) {
        if (node.type === 'TEXT' && node.name === name) return node;
        if (node.children) for (const c of node.children) { const t = findNamedText(c, name); if (t) return t; }
        return null;
      }
      const txts = findAllByType(ghInst, 'TEXT');
      const titleNode = findNamedText(ghInst, 'groupTitle') || txts[0];
      const descNode  = findNamedText(ghInst, 'groupDescription') || txts[1];
      if (titleNode) setText(titleNode, prettifyGroup(groupKey));
      const groupDescPath = (groupTokens[0].dotPath.split('.').slice(0, prefixSegments + 1).join('.'));
      const groupDesc = descAt(groupDescPath, ctx.varMap);
      if (descNode) setText(descNode, groupDesc);
    }

    for (let i = 0; i < groupTokens.length; i++) {
      const tok = groupTokens[i];
      try {
        if (spec.rowComponent === '2-mode') {
          const r = await build2ModeRow(spec, tok, ctx.components, ctx.varMap, ctx.collections.aliases);
          if (r.error) throw new Error(r.error);
          tableFrame.appendChild(r.row);
          await r.populate();
          if (tok.kind === 'figma-var') bindCount += 2;
        } else if (spec.rowComponent === '4-mode') {
          const r = await build4ModeRows(spec, tok, ctx.components, ctx.varMap, ctx.collections.aliases);
          if (r.error) throw new Error(r.error);
          for (const row of r.rows) tableFrame.appendChild(row);
          await r.populate();
          if (tok.kind === 'figma-var') bindCount += 4;
          if (ctx.components.separator && i < groupTokens.length - 1) {
            const sep = ctx.components.separator.createInstance();
            tableFrame.appendChild(sep);
            sep.layoutSizingHorizontal = 'FILL';
          }
        } else if (spec.rowComponent === 'primitive') {
          const r = await buildPrimitiveRow(spec, tok, ctx.components, ctx.varMap);
          if (r.error) throw new Error(r.error);
          tableFrame.appendChild(r.row);
          await r.populate();
        }
      } catch (e) {
        bindFail++;
        out.issues.push('row error for ' + tok.dotPath + ': ' + e.message);
      }
    }
  }
  out.info.bindCount = bindCount;
  out.info.bindFail = bindFail;
  out.info.elapsedMs = Date.now() - t0;

  const v = validateTableFrame(tableFrame, tierWidth);
  out.validation = v;
  if (v.repaired.length) out.info.repaired = v.repaired;
  out.ok = bindFail === 0 && v.errors.length === 0;
  return out;
}

function validateTableFrame(frame, tierWidth) {
  const errors = [], warnings = [], repaired = [];
  if (!frame) { errors.push('table frame missing'); return { errors, warnings, repaired }; }
  if (Math.abs(frame.width - tierWidth) > 0.5) {
    try { frame.resize(tierWidth, frame.height); repaired.push('width to ' + tierWidth); } catch (e) { errors.push('cannot resize: ' + e.message); }
  }
  if (frame.layoutSizingHorizontal !== 'FIXED') { try { frame.layoutSizingHorizontal = 'FIXED'; repaired.push('lsH=FIXED'); } catch {} }
  if (frame.layoutSizingVertical !== 'HUG') { try { frame.layoutSizingVertical = 'HUG'; repaired.push('lsV=HUG'); } catch {} }
  if (frame.height > 80000) errors.push('table height ' + frame.height + ' looks runaway');
  if (frame.children.length === 0) warnings.push('empty table frame');
  for (const c of frame.children) {
    if (c.layoutSizingHorizontal !== 'FILL') {
      try { c.layoutSizingHorizontal = 'FILL'; repaired.push('child lsH=FILL on ' + c.name); } catch {}
    }
  }
  return { errors, warnings, repaired };
}

async function main() {
  const phases = {};
  let t = Date.now();
  await loadFonts();                           phases.loadFonts          = Date.now() - t; t = Date.now();
  const components  = await discoverComponents();   phases.discoverComponents = Date.now() - t; t = Date.now();
  const collections = await discoverCollections();  phases.discoverCollections= Date.now() - t; t = Date.now();
  const varMap      = await discoverVariables(collections); phases.discoverVariables = Date.now() - t; t = Date.now();
  const ctx = { components, collections, varMap };

  const req = [['rowSet 2-mode', components.rowSet['2-mode']], ['headerSet 2-mode', components.headerSet['2-mode']]];
  const missing = req.filter(([_, c]) => !c).map(([n]) => n);
  if (missing.length) return { error: 'missing components: ' + missing.join(', ') };

  const targetPage = await ensurePage(pageOverride || registry.page);
  ctx.structure = await ensurePageStructure(targetPage, components, varMap);
  phases.ensureStructure = Date.now() - t; t = Date.now();

  const tablesToBuild = registry.tables.filter(t => !tableFilter || tableFilter.includes(t.id) || tableFilter.includes(t.tier));
  for (const spec of tablesToBuild) {
    try {
      const res = await buildTable(spec, ctx);
      results.push(res);
    } catch (e) {
      results.push({ id: spec.id, ok: false, error: e.message, stack: e.stack });
    }
  }
  phases.buildAllTables = Date.now() - t;

  return {
    components: Object.fromEntries(Object.entries(components).map(([k, v]) => [k, v ? (Array.isArray(v) ? v.length : (v.id || '?')) : null])),
    collections: Object.keys(collections.aliases).filter(k => collections.aliases[k]),
    variableCount: varMap.list.length,
    docCount: Object.keys(varMap.docMap || {}).length,
    stringVarCount: varMap.stringCount || 0,
    cacheStats: { aliasName: aliasNameCache.size, aliasVar: aliasVarCache.size, coll: collCache.size },
    phases,
    results,
    log
  };
}

return await main();
`;

// ─── Node-side runner ───────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  let tableFilter = null;
  let validateOnly = false;
  let pageOverride = null;
  let useCache = true;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--table' || a === '-t') tableFilter = [args[++i]];
    else if (a === '--tier') tableFilter = [args[++i]];
    else if (a === '--validate') validateOnly = true;
    else if (a === '--page' || a === '-p') pageOverride = args[++i];
    else if (a === '--no-cache') useCache = false;
  }

  console.log(`\n  Loading registry...`);
  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  const cache = useCache ? readCache() : null;
  const cachedComponentIds = (cache && cache.componentIds) || null;
  if (cachedComponentIds) console.log(`  Discovery cache: ${Object.keys(cachedComponentIds).length} component ids`);
  console.log(`  ${registry.tables.length} tables. (No JSON theme load — sourcing from Figma vars.)`);

  const payload = { registry, tableFilter, validateOnly, pageOverride };
  if (pageOverride) console.log(`  Page override: ${pageOverride}`);
  const script = `(async () => {
const PAYLOAD = ${JSON.stringify(payload)};
${PLUGIN_CODE}
})()`;

  const sizeKB = (Buffer.byteLength(script) / 1024).toFixed(1);
  console.log(`  Sending ${sizeKB} KB to Figma...`);

  const t0 = Date.now();
  const { stdout, stderr } = runEval(script);
  const data = extractJson(stdout);
  const elapsed = Date.now() - t0;

  if (!data) {
    console.error(`  Build failed (${elapsed}ms).`);
    if (stderr.trim()) console.error('  stderr:', stderr.trim().slice(0, 1000));
    if (stdout.trim()) console.error('  stdout:', stdout.trim().slice(0, 1000));
    process.exit(1);
  }
  if (data.error) {
    console.error(`  ${data.error}`);
    process.exit(1);
  }

  console.log(`\n  Build complete in ${(elapsed / 1000).toFixed(1)}s.\n`);
  console.log(`  Components found:    ${Object.values(data.components).filter(Boolean).length}/${Object.keys(data.components).length}`);
  console.log(`  Collections:         ${data.collections.join(', ')}`);
  console.log(`  Color vars:          ${data.variableCount}`);
  console.log(`  String vars:         ${data.stringVarCount}`);
  console.log(`  Family docs found:   ${data.docCount}`);
  if (data.phases) {
    const ph = data.phases;
    console.log(`  Phases (ms):         loadFonts=${ph.loadFonts || 0}  discoverComponents=${ph.discoverComponents || 0}  discoverCollections=${ph.discoverCollections || 0}  discoverVariables=${ph.discoverVariables || 0}  ensureStructure=${ph.ensureStructure || 0}  buildAllTables=${ph.buildAllTables || 0}`);
  }
  if (data.cacheStats) {
    console.log(`  Cache hits:          aliasName=${data.cacheStats.aliasName}  aliasVar=${data.cacheStats.aliasVar}  coll=${data.cacheStats.coll}`);
  }
  console.log('');

  let okCount = 0, failCount = 0, warnCount = 0;
  for (const r of data.results) {
    const status = r.ok ? '✓' : (r.error ? '✗' : '!');
    const counts = r.info ? `${r.info.tokenCount || 0} tokens, ${r.info.bindCount || 0} binds, ${r.info.bindFail || 0} fail` : '';
    const elap = r.info?.elapsedMs ? `, ${r.info.elapsedMs}ms` : '';
    console.log(`  ${status} ${r.id.padEnd(18)}  ${counts}${elap}`);
    if (r.validation?.errors?.length) {
      for (const e of r.validation.errors) console.log(`      ERR: ${e}`);
    }
    if (r.validation?.repaired?.length) {
      for (const x of r.validation.repaired) console.log(`      fixed: ${x}`);
    }
    if (r.error) console.log(`      ERROR: ${r.error}`);
    if (r.ok) okCount++;
    else if (r.error || r.validation?.errors?.length) failCount++;
    else warnCount++;
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`  ${okCount} ok, ${warnCount} with warnings, ${failCount} failed (of ${data.results.length})`);
  console.log('─'.repeat(60) + '\n');
  if (failCount > 0) process.exit(1);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
