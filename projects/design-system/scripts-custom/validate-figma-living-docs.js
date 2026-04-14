#!/usr/bin/env node
/**
 * Unified Figma Living Docs Content Validation
 *
 * Validates that ALL text content in the Figma "🎨 Colors – Tokens" tables
 * traces back to the token JSON source files in src/lib/themes/.
 *
 * Usage:
 *   node scripts-custom/validate-figma-living-docs.js
 *
 * Prerequisites:
 *   Extracted Figma data files in /tmp/figma_*.json (via figma_execute MCP calls).
 *   See EXTRACTION section below for the required files.
 *
 * EXTRACTION — required files and their Figma source containers:
 *   Primitive:  /tmp/figma_prim_brand_left.json, /tmp/figma_prim_brand_right.json
 *   S1:         /tmp/figma_s1_interaction.json, /tmp/figma_s1_neutral.json,
 *               /tmp/figma_s1_status.json, /tmp/figma_s1_free_left.json, /tmp/figma_s1_free_right.json
 *   S2:         /tmp/figma_s2_interaction.json
 *   S3:         /tmp/figma_s3_neutral.json, /tmp/figma_s3_interaction.json,
 *               /tmp/figma_s3_status_left.json, /tmp/figma_s3_status_right.json,
 *               /tmp/figma_s3_free_left.json, /tmp/figma_s3_free_right.json
 */

const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '../src/lib/themes');

// ─────────────────────────────────────────────
// RESULTS ACCUMULATOR
// ─────────────────────────────────────────────
const results = { matches: 0, discrepancies: [] };

function addMatch() { results.matches++; }

function addDisc(tier, table, category, details) {
  results.discrepancies.push({ tier, table, category, ...details });
}

function matchField(tier, table, tokenName, field, expected, actual) {
  const e = norm(expected), a = norm(actual);
  if (e === a) { addMatch(); }
  else { addDisc(tier, table, `${field}_MISMATCH`, { tokenName, expected, actual }); }
}

function norm(s) { return (s || '').trim().replace(/\s+/g, ' '); }

// ─────────────────────────────────────────────
// GROUND TRUTH — built directly from JSON files
// ─────────────────────────────────────────────
function extractTokens(obj, prefix, mode, out) {
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'token_family_docs') continue;
    if (v && v['$value'] !== undefined) {
      const p = `${prefix}.${k}`;
      if (mode) {
        if (!out[p]) out[p] = {};
        out[p][mode] = { value: v['$value'], desc: v['$description'] || '' };
      } else {
        out[p] = { value: v['$value'], desc: v['$description'] || '' };
      }
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      extractTokens(v, `${prefix}.${k}`, mode, out);
    }
  }
}

function extractFamilyDocs(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'token_family_docs') {
      out[prefix] = { docs: v['$description'] || '' };
      continue;
    }
    if (v && typeof v === 'object' && !Array.isArray(v) && v['$value'] === undefined) {
      extractFamilyDocs(v, `${prefix}.${k}`, out);
    }
  }
}

function buildTruth() {
  const prim = {};
  const primJson = require(`${BASE}/02_primitive/color.json`);
  extractTokens(primJson.ob.p.color, 'ob.p.color', null, prim);

  const s1 = {};
  const s1L = require(`${BASE}/03_semantic/color/s1_lightness/light.json`);
  const s1D = require(`${BASE}/03_semantic/color/s1_lightness/dark.json`);
  extractTokens(s1L.ob.s1.color, 'ob.s1.color', 'light', s1);
  extractTokens(s1D.ob.s1.color, 'ob.s1.color', 'dark', s1);

  const s2 = {};
  const s2H = require(`${BASE}/03_semantic/color/s2_emphasis/high.json`);
  const s2Lo = require(`${BASE}/03_semantic/color/s2_emphasis/low.json`);
  extractTokens(s2H.ob.s2.color, 'ob.s2.color', 'high', s2);
  extractTokens(s2Lo.ob.s2.color, 'ob.s2.color', 'low', s2);

  const s3 = {};
  const s3Families = {};
  const compiled = require(`${BASE}/03_semantic/color/compiled.json`);
  // compiled.json nests as ob.s.color (not ob.s3.color), but token names use ob.s3.color
  extractTokens(compiled.ob.s.color, 'ob.s3.color', null, s3);
  extractFamilyDocs(compiled.ob.s.color, 'ob.s3.color', s3Families);

  return { primitive: prim, s1, s2, s3, s3Families };
}

// ─────────────────────────────────────────────
// FILE LOADING — normalizes both data formats
// ─────────────────────────────────────────────
function loadFigma(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rows = raw.result ? raw.result.rows : raw.rows;
  if (!rows) return null;
  // Normalize: ensure every row has .n and .t
  return rows.map(r => ({
    n: r.n || r.name || '',
    t: r.t || r.texts || {}
  }));
}

// ─────────────────────────────────────────────
// PRIMITIVE VALIDATION
// ─────────────────────────────────────────────
function validatePrimitive(truth) {
  const figmaNames = new Set();

  // Brand files (JSON format: rows with Cell: Name, Cell: $description, Cell: Swatch)
  for (const [file, label] of [
    ['/tmp/figma_prim_brand_left.json', 'brand_left'],
    ['/tmp/figma_prim_brand_right.json', 'brand_right'],
  ]) {
    const rows = loadFigma(file);
    if (!rows) { console.log(`  SKIP: ${file}`); continue; }
    for (const row of rows) {
      if (row.n === '_Primitive Color Row') {
        const tokenName = (row.t['Cell: Name'] || [])[0];
        if (!tokenName) continue;
        figmaNames.add(tokenName);
        const tt = truth.primitive[tokenName];
        if (!tt) { addDisc('Primitive', label, 'TOKEN_NOT_IN_JSON', { tokenName }); continue; }
        matchField('Primitive', label, tokenName, 'description', tt.desc, (row.t['Cell: $description'] || [])[0] || '');
        matchField('Primitive', label, tokenName, 'hex_value', tt.value, (row.t['Cell: Swatch'] || [])[0] || '');
      } else if (row.n === '_Color Token Group Header') {
        const vals = row.t['_Color Token Group Header'] || [];
        addDisc('Primitive', label, 'GROUP_HEADER', { groupName: vals[0] || '', groupDesc: vals[1] || '' });
      }
    }
  }

  // Oblique data (hardcoded — these tables use a different component structure)
  const obliqueData = {
    oblique_left: [
      { n: 'Steelblue', d: 'Interaction color palette (links, buttons, hover/focus states)' },
      { token: 'ob.p.color.steelblue.50', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#F3F4F5' },
      { token: 'ob.p.color.steelblue.100', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#D3DEE9' },
      { token: 'ob.p.color.steelblue.200', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#AACAE6' },
      { token: 'ob.p.color.steelblue.300', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#6EB8E9' },
      { token: 'ob.p.color.steelblue.400', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#48A4D7' },
      { token: 'ob.p.color.steelblue.500', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#2E8FBF' },
      { token: 'ob.p.color.steelblue.600', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#2379A4' },
      { token: 'ob.p.color.steelblue.700', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#236487' },
      { token: 'ob.p.color.steelblue.800', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#255069' },
      { token: 'ob.p.color.steelblue.900', desc: 'Role: Shared. Used in emphasis_high interactive components (buttons, links) and neutral semantic tokens.', hex: '#233C4D' },
      { n: 'Basic', d: 'Core utility colors' },
      { token: 'ob.p.color.basic.bundesrot', desc: 'Role: Shared. Brand color mandated by Federal Chancellery. Used in navigation and brand components.', hex: '#ff0000' },
      { token: 'ob.p.color.basic.transparent', desc: 'Role: Shared. Fully transparent color. CSS transparent keyword for optimal browser compatibility and semantic clarity.', hex: 'transparent' },
      { token: 'ob.p.color.basic.white', desc: 'Role: Shared. Base white reference. Used in background and inversity contexts.', hex: '#ffffff' },
    ],
    oblique_right: [
      { n: 'Cobalt Alpha', d: 'Cobalt with alpha transparency' },
      { token: 'ob.p.color.cobalt_alpha.50', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.100', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.200', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.300', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.400', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.500', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.600', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.700', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.800', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { token: 'ob.p.color.cobalt_alpha.900', desc: 'Role: Shared. Used for disabled states and transparent overlays in emphasis_low contexts.', hex: '#131b22' },
      { n: 'White Alpha', d: 'White with alpha transparency' },
      { token: 'ob.p.color.white_alpha.50', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.100', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.200', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.300', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.400', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.500', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.600', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.700', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.800', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
      { token: 'ob.p.color.white_alpha.900', desc: 'Role: Shared. Used for disabled states and transparent white overlays.', hex: '#ffffff' },
    ]
  };

  for (const [tableName, items] of Object.entries(obliqueData)) {
    for (const item of items) {
      if (item.n) {
        addDisc('Primitive', tableName, 'GROUP_HEADER', { groupName: item.n, groupDesc: item.d });
      } else {
        figmaNames.add(item.token);
        const tt = truth.primitive[item.token];
        if (!tt) { addDisc('Primitive', tableName, 'TOKEN_NOT_IN_JSON', { tokenName: item.token }); continue; }
        matchField('Primitive', tableName, item.token, 'description', tt.desc, item.desc);
        matchField('Primitive', tableName, item.token, 'hex_value', tt.value, item.hex);
      }
    }
  }

  // Tokens in JSON missing from Figma
  for (const t of Object.keys(truth.primitive)) {
    if (!figmaNames.has(t)) addDisc('Primitive', 'ALL', 'TOKEN_MISSING_FROM_FIGMA', { tokenName: t });
  }
}

// ─────────────────────────────────────────────
// S1 VALIDATION
// ─────────────────────────────────────────────
function validateS1(truth) {
  const figmaNames = new Set();
  const tables = [
    ['/tmp/figma_s1_interaction.json', 's1_interaction'],
    ['/tmp/figma_s1_neutral.json', 's1_neutral'],
    ['/tmp/figma_s1_status.json', 's1_status'],
    ['/tmp/figma_s1_free_left.json', 's1_free_left'],
    ['/tmp/figma_s1_free_right.json', 's1_free_right'],
  ];

  for (const [file, label] of tables) {
    const rows = loadFigma(file);
    if (!rows) { console.log(`  SKIP: ${file}`); continue; }
    for (const row of rows) {
      if (row.n === '_Color Token Row / 2-Mode') {
        const tokenName = (row.t['Cell: Name'] || [])[0];
        if (!tokenName) continue;
        figmaNames.add(tokenName);
        const tt = truth.s1[tokenName];
        if (!tt) { addDisc('S1', label, 'TOKEN_NOT_IN_JSON', { tokenName }); continue; }
        matchField('S1', label, tokenName, 'ref_light', tt.light.value, (row.t['refLine-light'] || [])[0] || '');
        matchField('S1', label, tokenName, 'ref_dark', tt.dark.value, (row.t['refLine-dark'] || [])[0] || '');
      } else if (row.n === '_Color Token Group Header') {
        const vals = row.t['_Color Token Group Header'] || [];
        addDisc('S1', label, 'GROUP_HEADER', { groupName: vals[0] || '', groupDesc: vals[1] || '' });
      }
    }
  }

  for (const t of Object.keys(truth.s1)) {
    if (!figmaNames.has(t)) addDisc('S1', 'ALL', 'TOKEN_MISSING_FROM_FIGMA', { tokenName: t });
  }
}

// ─────────────────────────────────────────────
// S2 VALIDATION
// ─────────────────────────────────────────────
function validateS2(truth) {
  const figmaNames = new Set();
  const rows = loadFigma('/tmp/figma_s2_interaction.json');
  if (!rows) { console.log('  SKIP: /tmp/figma_s2_interaction.json'); return; }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.n === '_Color Token Row / 4-Mode') {
      const tokenName = (row.t['Cell: Name'] || [])[0];
      if (!tokenName) continue;
      figmaNames.add(tokenName);
      const tt = truth.s2[tokenName];
      if (!tt) { addDisc('S2', 's2_interaction', 'TOKEN_NOT_IN_JSON', { tokenName }); continue; }

      // High refs
      matchField('S2', 's2_interaction', tokenName, 'ref_high_light', tt.high.value, (row.t['refLine-light'] || [])[0] || '');
      matchField('S2', 's2_interaction', tokenName, 'ref_high_dark', tt.high.value, (row.t['refLine-dark'] || [])[0] || '');

      // Find paired Low row (may be separated by a _Separator)
      let lowRow = null;
      for (let j = i + 1; j < Math.min(i + 3, rows.length); j++) {
        if (rows[j].n === '_Color Token Row / 4-Mode-Low') { lowRow = rows[j]; break; }
        if (rows[j].n === '_Color Token Row / 4-Mode' || rows[j].n === '_Color Token Group Header') break;
      }
      if (lowRow) {
        matchField('S2', 's2_interaction', tokenName, 'ref_low_light', tt.low.value, (lowRow.t['refLine-light'] || [])[0] || '');
        matchField('S2', 's2_interaction', tokenName, 'ref_low_dark', tt.low.value, (lowRow.t['refLine-dark'] || [])[0] || '');
      } else {
        addDisc('S2', 's2_interaction', 'MISSING_LOW_ROW', { tokenName });
      }
    } else if (row.n === '_Color Token Group Header') {
      const vals = row.t['_Color Token Group Header'] || [];
      addDisc('S2', 's2_interaction', 'GROUP_HEADER', { groupName: vals[0] || '', groupDesc: vals[1] || '' });
    }
  }

  for (const t of Object.keys(truth.s2)) {
    if (!figmaNames.has(t)) addDisc('S2', 'ALL', 'TOKEN_MISSING_FROM_FIGMA', { tokenName: t });
  }
}

// ─────────────────────────────────────────────
// S3 VALIDATION
// ─────────────────────────────────────────────
function validateS3(truth) {
  const figmaNames = new Set();

  // Brand table (hardcoded — only 1 row)
  const brandRows = [
    { n: '_Color Token Group Header', t: { '': ['Bundesrot', 'Official federal red — primary brand identifier'] } },
    { n: '_Color Token Row / 2-Mode', t: {
      'Cell: Name': ['ob.s3.color.brand'],
      'Cell: $description': ['Federal identity color. Use for Bundesrot brand accent in navigation active states and primary brand elements.'],
      'Cell: Reference': ['light', '{ob.p.color.basic.bundesrot}', 'dark', '{ob.p.color.basic.bundesrot}'],
      'Cell: Light': ['#ff0000'], 'Cell: Dark': ['#ff0000']
    }}
  ];

  const tableFiles = {
    neutral: '/tmp/figma_s3_neutral.json',
    interaction: '/tmp/figma_s3_interaction.json',
    status_left: '/tmp/figma_s3_status_left.json',
    status_right: '/tmp/figma_s3_status_right.json',
    free_left: '/tmp/figma_s3_free_left.json',
    free_right: '/tmp/figma_s3_free_right.json'
  };

  const allTables = { brand: brandRows };
  for (const [name, file] of Object.entries(tableFiles)) {
    const rows = loadFigma(file);
    if (rows) allTables[name] = rows;
    else console.log(`  SKIP: ${file}`);
  }

  let lastTokenName = '';
  for (const [tableName, rows] of Object.entries(allTables)) {
    for (const row of rows) {
      // Skip headers
      if (row.n.includes('Header Row')) continue;
      // Skip separators
      if (row.n.includes('Separator')) continue;

      // Group headers
      if (row.n.includes('Group Header') || row.n.includes('_Set Heading')) {
        const allTexts = Object.values(row.t).flat();
        let foundInDocs = false;
        for (const [, famData] of Object.entries(truth.s3Families)) {
          if (famData.docs && allTexts.some(t => famData.docs.toLowerCase().includes(t.toLowerCase()))) {
            foundInDocs = true;
            break;
          }
        }
        if (!foundInDocs) addDisc('S3', tableName, 'GROUP_HEADER_NOT_IN_JSON', { texts: allTexts });
        continue;
      }

      // Token rows
      if (!row.n.includes('Token Row')) continue;

      const nameCell = row.t['Cell: Name'] || [];
      const descCell = row.t['Cell: $description'] || [];
      const refCell = row.t['Cell: Reference'] || [];
      const tokenName = nameCell[0] || '';
      if (tokenName) { lastTokenName = tokenName; figmaNames.add(tokenName); }
      const effectiveName = tokenName || lastTokenName;
      if (!effectiveName) continue;

      const tt = truth.s3[effectiveName];
      if (!tt) {
        if (tokenName) addDisc('S3', tableName, 'TOKEN_NOT_IN_JSON', { tokenName: effectiveName });
        continue;
      }

      // Description
      if (descCell[0]) matchField('S3', tableName, effectiveName, 'description', tt.desc, descCell[0]);

      // References
      const figmaRefs = refCell.filter(t => t.startsWith('{'));
      if (figmaRefs.length > 0) {
        const wrongRefs = figmaRefs.filter(ref => ref !== tt.value);
        if (wrongRefs.length > 0) {
          addDisc('S3', tableName, 'REF_MISMATCH', { tokenName: effectiveName, expected: tt.value, actual: figmaRefs });
        } else {
          addMatch();
        }
      }
    }
  }

  for (const t of Object.keys(truth.s3)) {
    if (!figmaNames.has(t)) addDisc('S3', 'ALL', 'TOKEN_MISSING_FROM_FIGMA', { tokenName: t });
  }
}

// ─────────────────────────────────────────────
// REPORT
// ─────────────────────────────────────────────
function printReport() {
  const sep = '═'.repeat(70);
  console.log(`\n${sep}`);
  console.log(`FIGMA LIVING DOCS VALIDATION — ALL TIERS`);
  console.log(`${sep}`);
  console.log(`✓ Matches: ${results.matches}`);
  console.log(`✗ Discrepancies: ${results.discrepancies.length}`);

  // By category
  const cats = {};
  for (const d of results.discrepancies) {
    const cat = d.category;
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(d);
  }

  console.log(`\n─── By Category ───`);
  for (const [cat, items] of Object.entries(cats).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${cat}: ${items.length}`);
  }

  // By tier
  const tiers = {};
  for (const d of results.discrepancies) {
    if (!tiers[d.tier]) tiers[d.tier] = { total: 0, cats: {} };
    tiers[d.tier].total++;
    tiers[d.tier].cats[d.category] = (tiers[d.tier].cats[d.category] || 0) + 1;
  }

  console.log(`\n─── By Tier ───`);
  for (const [tier, info] of Object.entries(tiers).sort()) {
    console.log(`  ${tier}: ${info.total} discrepancies`);
    for (const [cat, count] of Object.entries(info.cats).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${cat}: ${count}`);
    }
  }

  // Detailed discrepancies (skip GROUP_HEADER to reduce noise)
  const real = results.discrepancies.filter(d => d.category !== 'GROUP_HEADER' && d.category !== 'GROUP_HEADER_NOT_IN_JSON');
  if (real.length > 0) {
    console.log(`\n─── Real Discrepancies (${real.length}, excl. group headers) ───`);
    for (const d of real) {
      const loc = `[${d.tier}/${d.table}]`;
      if (d.category === 'TOKEN_NOT_IN_JSON' || d.category === 'TOKEN_MISSING_FROM_FIGMA') {
        console.log(`  ${loc} ${d.category}: ${d.tokenName}`);
      } else if (d.category === 'MISSING_LOW_ROW') {
        console.log(`  ${loc} MISSING_LOW_ROW: ${d.tokenName}`);
      } else if (d.category === 'REF_MISMATCH') {
        console.log(`  ${loc} REF_MISMATCH: ${d.tokenName}`);
        console.log(`    expected: ${d.expected}`);
        console.log(`    actual:   ${Array.isArray(d.actual) ? d.actual.join(', ') : d.actual}`);
      } else if (d.category.endsWith('_MISMATCH')) {
        console.log(`  ${loc} ${d.category}: ${d.tokenName}`);
        console.log(`    expected: ${d.expected}`);
        console.log(`    actual:   ${d.actual}`);
      } else {
        console.log(`  ${loc} ${d.category}: ${JSON.stringify(d)}`);
      }
    }
  }

  // S3 REF_MISMATCH pattern analysis
  const refMismatches = results.discrepancies.filter(d => d.category === 'REF_MISMATCH');
  if (refMismatches.length > 0) {
    console.log(`\n─── S3 REF_MISMATCH Pattern Analysis (${refMismatches.length}) ───`);
    const patterns = {};
    for (const d of refMismatches) {
      const figRef = (Array.isArray(d.actual) ? d.actual[0] : d.actual) || '';
      const jsonRef = d.expected || '';
      const figFam = figRef.match(/\{ob\.(?:s[12]|p)\.color\.([^.]+)/)?.[1] || '?';
      const jsonFam = jsonRef.match(/\{ob\.(?:s[12]|p)\.color\.([^.]+)/)?.[1] || '?';
      const key = `figma=${figFam} → json=${jsonFam}`;
      if (!patterns[key]) patterns[key] = [];
      patterns[key].push(d.tokenName);
    }
    for (const [pat, tokens] of Object.entries(patterns).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${pat} (${tokens.length})`);
      tokens.slice(0, 2).forEach(t => console.log(`    ${t}`));
      if (tokens.length > 2) console.log(`    ... +${tokens.length - 2} more`);
    }
  }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
const t0 = Date.now();
console.log('Building ground truth from token JSON...');
const truth = buildTruth();
console.log(`  Primitive: ${Object.keys(truth.primitive).length}, S1: ${Object.keys(truth.s1).length}, S2: ${Object.keys(truth.s2).length}, S3: ${Object.keys(truth.s3).length}`);

console.log('Validating Primitive...');
validatePrimitive(truth);
console.log('Validating S1...');
validateS1(truth);
console.log('Validating S2...');
validateS2(truth);
console.log('Validating S3...');
validateS3(truth);

printReport();
console.log(`\nCompleted in ${Date.now() - t0}ms`);
