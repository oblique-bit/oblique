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

process.env.FIG_EVAL_TIMEOUT_MS = process.env.FIG_EVAL_TIMEOUT_MS || '600000';

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
const { registry, tableFilter, pageOverride, validateOnly } = PAYLOAD;
const log = [];
function L(msg) { log.push(String(msg)); }

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

function varsForTable(spec) {
  if (!allVars) return [];
  const col = Object.values(collMap).find(c => c.name === spec.collection);
  if (!col) return [];
  return allVars
    .filter(v => v.variableCollectionId === col.id && v.name.startsWith(spec.prefix))
    .filter(v => !/\\/_docs\\//.test(v.name)) // skip family-doc vars
    .sort((a, b) => a.name.localeCompare(b.name));
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

// Convention in this design system: both .px and .rem variants of a token
// store the same numeric value (the px-equivalent). For .rem display we divide
// by 16; the underlying px stays the same.
function formatValue(v, val) {
  if (val == null) return '';
  if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') return '<alias>';
  const num = (typeof val === 'number') ? val : (val && typeof val.value === 'number' ? val.value : null);
  if (num == null) return String(val);
  if (isRemVariable(v)) return formatNumber(num / 16) + 'rem';
  return formatNumber(num) + 'px';
}

// Px-equivalent for preview-bar sizing — same for both .px and .rem variants.
function pxFromValue(v, val) {
  if (val == null) return 0;
  const num = (typeof val === 'number') ? val : (val && typeof val.value === 'number' ? val.value : null);
  return num == null ? 0 : num;
}

const PREVIEW_BAR_MAX = 240; // visual cap so big tokens don't overflow the cell

function setPreviewBar(cell, pxValue) {
  if (!cell || !cell.findOne) return;
  const bar = cell.findOne(n => n.type === 'RECTANGLE' && /preview/i.test(n.name));
  if (!bar) return;
  const w = Math.max(1, Math.min(PREVIEW_BAR_MAX, Math.round(pxValue)));
  // The rectangle inherits auto-layout sizing from the master (likely FILL).
  // Force FIXED width before resize, otherwise the resize is silently overridden.
  try { bar.layoutSizingHorizontal = 'FIXED'; } catch {}
  try { bar.resize(w, bar.height || 4); } catch (e) { L('preview resize failed: ' + e.message); }
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
async function ensurePage() {
  const name = pageOverride || registry.page;
  let p = figma.root.children.find(x => x.name === name);
  if (!p) throw new Error('target page not found: ' + name);
  await figma.setCurrentPageAsync(p);
  return p;
}

function findSection(page, sectionName) {
  return page.children.find(c => c.name === sectionName && (c.type === 'SECTION' || c.type === 'FRAME')) || null;
}

const TABLE_WIDTH = 1580; // matches the section bar / row natural width

async function ensureTableFrame(section, tableName) {
  // SAFETY: only manage the Table frame we own. Never touch other section
  // children — the user may have manual content alongside the script-owned
  // table, and bulk-deletion violates the "never wipe Figma pages" memory rule.
  let table = section.children && section.children.find(c => c.name === tableName && c.type === 'FRAME');
  if (!table) {
    table = figma.createFrame();
    table.name = tableName;
    section.appendChild(table);
  }
  table.layoutMode = 'VERTICAL';
  table.itemSpacing = 0;
  table.primaryAxisSizingMode = 'AUTO';
  table.counterAxisSizingMode = 'FIXED';
  table.fills = [];
  try { table.resize(TABLE_WIDTH, table.height || 100); } catch {}
  // Clear stale children
  for (const c of [...table.children]) { try { c.remove(); } catch {} }
  return table;
}

function stretch(node) {
  try { node.layoutSizingHorizontal = 'FILL'; } catch {}
}

async function buildSectionBar(spec) {
  if (!components.sectionBar) return null;
  const inst = components.sectionBar.createInstance();
  inst.name = '_docs/dimension/section_bar';
  // setProperties for each TEXT prop, fallback to direct text writes
  const want = {
    tierLetter: spec.section.tier || 'S',
    title: spec.section.title,
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
  // Fallback text writes for fields without a property binding
  const map = {
    tierLetter: ['tierLetter'],
    title: ['__sectionTitle', 'title'],
    purpose: ['description', 'purpose'],
    guideline: ['guideline']
  };
  for (const [bare, val] of Object.entries(want)) {
    const key = Object.keys(props).find(k => k === bare || k.split('#')[0] === bare);
    if (key) continue;
    if (!val) continue;
    for (const nodeName of map[bare]) {
      const node = inst.findOne(n => n.type === 'TEXT' && n.name === nodeName);
      if (node) { await setText(node, bare === 'purpose' ? 'Purpose: ' + val : String(val)); break; }
    }
  }
  return inst;
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

// After append + populate, detach the row so we can resize the preview rectangles
// (instance-internal RECTANGLE widths are read-only in Figma).
async function detachAndSizePreview(rowBuilt, isMode) {
  const inst = rowBuilt.instance;
  let node = inst;
  try { if (typeof inst.detachInstance === 'function') node = inst.detachInstance(); }
  catch (e) { L('detach failed: ' + e.message); }
  if (!isMode) {
    const cell = findChild(node, 'Cell: Preview');
    setPreviewBar(cell, pxFromValue(rowBuilt.v, rowBuilt.value));
  } else {
    for (let i = 0; i < rowBuilt.modes.length; i++) {
      const m = rowBuilt.modes[i];
      const cell = findChild(node, 'Cell: Mode ' + (i + 1))
                || findChild(node, 'Cell: ' + m)
                || findChild(node, 'mode_cell_' + (i + 1));
      if (cell) setPreviewBar(cell, pxFromValue(rowBuilt.v, rowBuilt.values[m]));
    }
  }
  return node;
}

// ── build one table ────────────────────────────────────────────────────────
async function buildTable(page, spec) {
  const section = findSection(page, spec.sectionName);
  if (!section) return { id: spec.id, ok: false, error: 'section not found: ' + spec.sectionName };
  const table = await ensureTableFrame(section, spec.tableName);
  const tokens = varsForTable(spec);
  let rowsBuilt = 0;
  const result = { id: spec.id, ok: true, info: { tokenCount: tokens.length, rowsBuilt: 0 } };
  const sb = await buildSectionBar(spec);
  if (sb) { table.appendChild(sb); stretch(sb); }
  const header = spec.kind === 'static'
    ? await buildStaticHeader()
    : await buildModeHeader(spec.modes);
  if (header) { table.appendChild(header); stretch(header); }
  for (const v of tokens) {
    const r = spec.kind === 'static' ? await buildStaticRow(v) : await buildModeRow(v, spec);
    if (r && r.instance) {
      table.appendChild(r.instance);
      stretch(r.instance);
      // Detach to gain control over internal RECTANGLE widths (preview bars),
      // then size each preview rectangle to the px-equivalent of its value.
      await flushTextWrites(); // ensure text writes settle before detach
      const detached = await detachAndSizePreview(r, spec.kind !== 'static');
      stretch(detached);
      rowsBuilt++;
    }
  }
  result.info.rowsBuilt = rowsBuilt;
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
    const section = findSection(page, spec.sectionName);
    if (!section) { errors.push({ code: 'STRUCT', id: spec.id, msg: 'section not found' }); continue; }
    const tableFrames = section.children.filter(c => c.name === spec.tableName && c.type === 'FRAME');
    if (tableFrames.length !== 1) {
      errors.push({ code: 'DUP', id: spec.id, msg: 'expected 1 table frame, got ' + tableFrames.length });
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

  const results = [];
  for (const spec of registry.tables) {
    if (tableFilter && tableFilter !== spec.id) continue;
    try { results.push(await buildTable(page, spec)); }
    catch (e) { results.push({ id: spec.id, ok: false, error: e.message }); }
  }
  await flushTextWrites();
  const validate = await validatePage(page);
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

  const payload = { registry, tableFilter: TABLE_FILTER, pageOverride: PAGE_OVER, validateOnly: VALIDATE_ONLY };
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
