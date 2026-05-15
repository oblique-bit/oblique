#!/usr/bin/env node
/**
 * _setup-building-blocks.js — one-shot setup script.
 *
 * Creates / updates the `_building_blocks/typography` section on the
 * `🔧 Utilities` page of DesignSystem@Tokens V9.7, with:
 *
 *   - `_docs/typography/section_bar` (cloned from the dimension equivalent)
 *   - `_docs/typography/header_row`  (8 columns)
 *   - `_docs/typography/row`         (matching cell structure)
 *
 * Both row + header_row bind every TEXT fill to the neutral-fg color
 * variables (no hardcoded hex), specimen + description cells wrap at the
 * cell width.
 *
 * Idempotent: re-runs safely. Used only when bootstrapping the file or
 * when the masters drift from the script's expectations.
 *
 * Usage:
 *   node _setup-building-blocks.js
 */
'use strict';

process.env.FIG_EVAL_TIMEOUT_MS = process.env.FIG_EVAL_TIMEOUT_MS || '1800000';

const fs            = require('fs');
const os            = require('os');
const path          = require('path');
const { spawnSync } = require('child_process');

const CLI         = process.env.FIG_CLI || 'figma-ds-cli';
const FIG_CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');

function runEval(scriptText) {
  const tmp = path.join(os.tmpdir(), `typo-setup-${process.pid}-${Date.now()}.js`);
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

const PLUGIN_CODE = `
(async () => {
  await figma.loadAllPagesAsync();

  await Promise.all([
    figma.loadFontAsync({ family: 'Noto Sans', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Noto Sans', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Noto Sans', style: 'ExtraBold' })
  ]);

  const allVars = await figma.variables.getLocalVariablesAsync();
  function findVar(name) {
    const v = allVars.find(x => x.name === name);
    if (!v) throw new Error('variable not found: ' + name);
    return v;
  }
  const fgHighest = findVar('ob/s1/color/neutral/fg/contrast_highest/inversity_normal');
  const fgHigh    = findVar('ob/s1/color/neutral/fg/contrast_high/inversity_normal');
  const fgMedium  = findVar('ob/s1/color/neutral/fg/contrast_medium/inversity_normal');
  const fgLow     = findVar('ob/s1/color/neutral/fg/contrast_low/inversity_normal');

  function bindFill(textNode, variable) {
    if (!textNode || textNode.type !== 'TEXT') return;
    let fill = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
    try { fill = figma.variables.setBoundVariableForPaint(fill, 'color', variable); }
    catch (e) { console.warn('bind failed for ' + textNode.name + ': ' + e.message); }
    textNode.fills = [fill];
  }

  // Columns layout (total = 1980)
  const COLS = [
    { name: 'Token Name',     width: 260, fg: 'highest' },
    { name: 'Specimen',       width: 760, fg: 'highest', wrap: true },
    { name: 'Family',         width: 110, fg: 'high'    },
    { name: 'Weight',         width: 100, fg: 'high'    },
    { name: 'Size',           width: 70,  fg: 'high'    },
    { name: 'Line Height',    width: 80,  fg: 'high'    },
    { name: 'Letter Spacing', width: 100, fg: 'high'    },
    { name: 'Description',    width: 500, fg: 'low',    wrap: true }
  ];
  const FG = { highest: fgHighest, high: fgHigh, medium: fgMedium, low: fgLow };

  // 1) Locate or create section
  const SECTION_NAME = '_building_blocks/typography';
  let section = null;
  (function walk(n) {
    if (section) return;
    if (n.type === 'SECTION' && n.name === SECTION_NAME) section = n;
    if (n.children) for (const c of n.children) walk(c);
  })(figma.root);
  if (!section) {
    // utilities page name search; fall back to current page
    const utilsPage = figma.root.children.find(p => /Utilities/.test(p.name)) || figma.currentPage;
    await figma.setCurrentPageAsync(utilsPage);
    section = figma.createSection();
    section.name = SECTION_NAME;
    utilsPage.appendChild(section);
    section.x = 9000;
    section.y = -610;
    section.resizeWithoutConstraints(2200, 1400);
  } else {
    await figma.setCurrentPageAsync(section.parent);
  }

  // 2) section_bar — clone from dimension if missing
  const TARGET_SB = '_docs/typography/section_bar';
  let typoSB = section.findOne(n => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === TARGET_SB);
  if (!typoSB) {
    let src = null;
    (function w(n) {
      if (src) return;
      if ((n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === '_docs/dimension/section_bar') src = n;
      if (n.children) for (const c of n.children) w(c);
    })(figma.root);
    if (!src) throw new Error('_docs/dimension/section_bar not found');
    typoSB = src.clone();
    typoSB.name = TARGET_SB;
    section.appendChild(typoSB);
    typoSB.x = 0;
    typoSB.y = 0;
  }

  // helper: remove any existing master (anywhere in file) so we can rebuild fresh
  function dropExisting(name) {
    (function walk(n) {
      if (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') {
        if (n.name === name) { try { n.remove(); } catch {} return; }
      }
      if (n.children) for (const c of [...n.children]) walk(c);
    })(figma.root);
  }
  // Header + row are rebuilt every run — quick, and stays in sync with the
  // declared COLS layout.
  dropExisting('_docs/typography/header_row');
  dropExisting('_docs/typography/row');

  // 3) header_row
  const header = figma.createComponent();
  header.name = '_docs/typography/header_row';
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisSizingMode = 'FIXED';
  header.counterAxisSizingMode = 'AUTO';
  header.itemSpacing = 0;
  header.paddingTop = 10;
  header.paddingBottom = 10;
  header.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.95, b: 0.97 } }];
  header.strokes = [{ type: 'SOLID', color: { r: 0.85, g: 0.87, b: 0.89 } }];
  header.strokeBottomWeight = 1;
  header.strokeTopWeight = 0;
  header.strokeLeftWeight = 0;
  header.strokeRightWeight = 0;
  header.strokeAlign = 'INSIDE';
  for (const col of COLS) {
    const cell = figma.createFrame();
    cell.name = 'Header: ' + col.name;
    cell.layoutMode = 'HORIZONTAL';
    cell.primaryAxisSizingMode = 'FIXED';
    cell.counterAxisSizingMode = 'AUTO';
    cell.paddingLeft = 12;
    cell.paddingRight = 12;
    cell.fills = [];
    cell.resizeWithoutConstraints(col.width, 16);
    cell.counterAxisAlignItems = 'CENTER';
    const t = figma.createText();
    t.fontName = { family: 'Noto Sans', style: 'ExtraBold' };
    t.fontSize = 11;
    t.characters = col.name.toUpperCase();
    bindFill(t, fgMedium);
    cell.appendChild(t);
    header.appendChild(cell);
  }
  header.resizeWithoutConstraints(1980, header.height);
  section.appendChild(header);
  header.x = 0;
  header.y = 360;

  // 4) row
  const row = figma.createComponent();
  row.name = '_docs/typography/row';
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.itemSpacing = 0;
  row.paddingTop = 12;
  row.paddingBottom = 12;
  row.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  row.strokes = [{ type: 'SOLID', color: { r: 0.92, g: 0.93, b: 0.94 } }];
  row.strokeBottomWeight = 1;
  row.strokeTopWeight = 0;
  row.strokeLeftWeight = 0;
  row.strokeRightWeight = 0;
  row.strokeAlign = 'INSIDE';

  for (const col of COLS) {
    const cell = figma.createFrame();
    cell.name = 'Cell: ' + col.name;
    cell.layoutMode = 'VERTICAL';
    cell.primaryAxisSizingMode = 'AUTO';
    cell.counterAxisSizingMode = 'FIXED';
    cell.paddingLeft = 12;
    cell.paddingRight = 12;
    cell.fills = [];
    cell.itemSpacing = 4;
    cell.resizeWithoutConstraints(col.width, 32);
    cell.counterAxisAlignItems = 'MIN';
    const t = figma.createText();
    const nameLower = col.name === 'Token Name' ? '$token.name' :
                       col.name === 'Specimen'   ? '$specimen' :
                       col.name === 'Description' ? '$description' :
                       '$' + col.name.replace(/\\s+/g, '_').toLowerCase();
    t.name = nameLower;
    if (col.name === 'Specimen') {
      t.fontName = { family: 'Noto Sans', style: 'Medium' };
      t.fontSize = 16;
      t.characters = 'Specimen';
    } else if (col.name === 'Token Name') {
      t.fontName = { family: 'Noto Sans', style: 'Medium' };
      t.fontSize = 11;
      t.characters = '$token.name';
    } else if (col.name === 'Description') {
      t.fontName = { family: 'Noto Sans', style: 'Regular' };
      t.fontSize = 11;
      t.characters = '';
    } else {
      t.fontName = { family: 'Noto Sans', style: 'Medium' };
      t.fontSize = 11;
      t.characters = nameLower;
    }
    bindFill(t, FG[col.fg]);
    if (col.wrap) {
      try { t.textAutoResize = 'HEIGHT'; } catch {}
      try { t.layoutSizingHorizontal = 'FILL'; } catch {}
      try { t.layoutAlign = 'STRETCH'; } catch {}
      try { t.resize(col.width - 24, t.height); } catch {}
    } else {
      try { t.textAutoResize = 'WIDTH_AND_HEIGHT'; } catch {}
    }
    cell.appendChild(t);
    row.appendChild(cell);
  }

  row.resizeWithoutConstraints(1980, row.height);
  section.appendChild(row);
  row.x = 0;
  row.y = 420;

  return {
    section: { id: section.id, name: section.name },
    sectionBar: { id: typoSB.id, name: typoSB.name },
    header: { id: header.id, name: header.name, w: header.width, cells: header.children.map(c => c.name) },
    row: { id: row.id, name: row.name, w: row.width, cells: row.children.map(c => c.name) }
  };
})();
`;

function main() {
  console.log('  Setting up _building_blocks/typography...');
  const t0 = Date.now();
  const { stdout, stderr } = runEval(PLUGIN_CODE);
  const elapsed = Date.now() - t0;
  const i = stdout.search(/[{[]/);
  let data = null;
  if (i >= 0) {
    for (let end = stdout.length; end > i; end--) {
      try { data = JSON.parse(stdout.slice(i, end)); break; } catch {}
    }
  }
  if (!data) {
    console.error(`  Setup failed (${elapsed}ms).`);
    if (stderr.trim()) console.error('  stderr:', stderr.trim().slice(0, 1000));
    if (stdout.trim()) console.error('  stdout:', stdout.trim().slice(0, 2000));
    process.exit(1);
  }
  console.log(`  Setup OK in ${(elapsed / 1000).toFixed(1)}s.`);
  console.log('  Section:    ', data.section.name);
  console.log('  Section bar:', data.sectionBar.name);
  console.log('  Header row: ', data.header.name, `(${data.header.w}px, cells: ${data.header.cells.join(', ')})`);
  console.log('  Row:        ', data.row.name,    `(${data.row.w}px, cells: ${data.row.cells.join(', ')})`);
}

main();
