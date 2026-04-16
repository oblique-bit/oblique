#!/usr/bin/env node
/**
 * generate-interaction-data.js
 *
 * Reads source token JSONs + resolved-tokens-multi.json and generates
 * updated per-table-data JSON files for:
 *   - s1-interaction.json (2-mode, S1 tier)
 *   - s2-interaction.json (4-mode, S2 tier)
 *   - s3-interaction.json (4-mode, S3 tier — uses ob.s. prefix)
 *
 * Usage:  node generate-interaction-data.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

// ── paths ───────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '../../..');
const THEMES = path.join(ROOT, 'src/lib/themes/03_semantic/color');
const RESOLVED = path.join(ROOT, '_private/resolved-tokens-multi.json');
const OUT = path.join(__dirname, 'per-table-data');

// ── helpers ─────────────────────────────────────────────────────────────
function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function dig(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => o && o[k], obj);
}

/** Walk a Tokens Studio JSON node and collect leaf tokens (those with $value). */
function collectTokens(obj, prefix = '') {
  const result = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$') || key === 'token_family_docs') continue;
    const p = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && val.$value !== undefined) {
      result.push({ path: p, $value: val.$value, $description: val.$description || '' });
    } else if (val && typeof val === 'object') {
      result.push(...collectTokens(val, p));
    }
  }
  return result;
}

/** Build reference string from $value, stripping Tokens Studio {…} already present. */
function refStr(val) {
  if (typeof val === 'string' && val.startsWith('{')) return val;
  return `{${val}}`;
}

// ── load resolved hex values ────────────────────────────────────────────
const resolved = readJson(RESOLVED).tokens; // key → { type, modes: { light-high, … } }

function hexFor(tokenPath) {
  const r = resolved[tokenPath];
  if (!r) return { 'light-high': '?', 'light-low': '?', 'dark-high': '?', 'dark-low': '?' };
  return r.modes;
}

// ═══════════════════════════════════════════════════════════════════════
// S2 INTERACTION
// ═══════════════════════════════════════════════════════════════════════
function generateS2() {
  const high = readJson(path.join(THEMES, 's2-emphasis/high.json'));
  const low  = readJson(path.join(THEMES, 's2-emphasis/low.json'));

  const hiInter = dig(high, 'ob.s2.color.interaction');
  const loInter = dig(low,  'ob.s2.color.interaction');

  function buildGroup(title, description, subPath, component) {
    // component is 'fg', 'bg' or 'border'
    const hiTokens = collectTokens(dig(hiInter, subPath + '.' + component) || {});
    const loTokens = collectTokens(dig(loInter, subPath + '.' + component) || {});

    // Build lookup: last two segments (e.g. "enabled.inversity_normal") → token data
    const loMap = {};
    for (const t of loTokens) loMap[t.path] = t;

    const tokens = hiTokens.map(t => {
      const fullName = `ob.s2.color.interaction.${subPath}.${component}.${t.path}`;
      const loToken = loMap[t.path];
      return {
        name: fullName,
        references: {
          high: refStr(t.$value),
          low: loToken ? refStr(loToken.$value) : refStr(t.$value)
        },
        hex: hexFor(fullName),
        description: t.$description,
        semanticAssigned: true
      };
    });
    return { title, description, tokens };
  }

  const groups = [
    buildGroup('Standard States: Foreground (fg)', 'Foreground color tokens for interaction standard states', 'standard_states', 'fg'),
    buildGroup('Standard States: Background (bg)', 'Background color tokens for interaction standard states', 'standard_states', 'bg'),
    buildGroup('Contrast Levels: Foreground (fg)', 'Foreground tokens for interaction contrast levels', 'contrast_levels', 'fg'),
    buildGroup('Contrast Levels: Background (bg)', 'Background tokens for interaction contrast levels', 'contrast_levels', 'bg'),
    buildGroup('Contrast Levels: Border', 'Border tokens for interaction contrast levels', 'contrast_levels', 'border'),
  ];

  const tokenCount = groups.reduce((s, g) => s + g.tokens.length, 0);

  return {
    tier: 's2',
    heading: 'S2 Color: Interaction',
    component: '4-mode',
    role: true,
    groups,
    tokenCount
  };
}

// ═══════════════════════════════════════════════════════════════════════
// S3 INTERACTION   (prefix: ob.s.color.interaction)
// ═══════════════════════════════════════════════════════════════════════
function generateS3() {
  const compiled = readJson(path.join(THEMES, 'compiled.json'));

  // Navigate to the interaction node — could be under ob.s3 or ob.s
  let inter = dig(compiled, 'ob.s3.color.interaction') || dig(compiled, 'ob.s.color.interaction');
  // Determine prefix used in resolved tokens
  const prefix = resolved['ob.s.color.interaction.focus_ring.inversity_normal'] ? 'ob.s.color.interaction' : 'ob.s3.color.interaction';

  function buildGroupS3(title, description, subPath, component) {
    const node = dig(inter, subPath + '.' + component);
    if (!node) return null;
    const leafs = collectTokens(node);
    const tokens = leafs.map(t => {
      const fullName = `${prefix}.${subPath}.${component}.${t.path}`;
      return {
        name: fullName,
        references: {
          high: refStr(t.$value),
          low: refStr(t.$value) // S3 references S2 — same ref for high/low (emphasis resolved in S2)
        },
        hex: hexFor(fullName),
        description: t.$description,
        semanticAssigned: true
      };
    });
    return { title, description, tokens };
  }

  // focus_ring — special: references S1 directly
  const frNode = dig(inter, 'focus_ring');
  const frTokens = collectTokens(frNode);
  const focusRingGroup = {
    title: 'Focus Ring',
    description: 'Focus ring indicator colors (references S1 directly)',
    tokens: frTokens.map(t => {
      const fullName = `${prefix}.focus_ring.${t.path}`;
      return {
        name: fullName,
        references: {
          high: refStr(t.$value),
          low: refStr(t.$value)
        },
        hex: hexFor(fullName),
        description: t.$description,
        semanticAssigned: true
      };
    })
  };

  const groups = [
    focusRingGroup,
    buildGroupS3('Standard States: Foreground (fg)', 'Foreground color tokens for compiled interaction standard states', 'standard_states', 'fg'),
    buildGroupS3('Standard States: Background (bg)', 'Background color tokens for compiled interaction standard states', 'standard_states', 'bg'),
    buildGroupS3('Contrast Levels: Foreground (fg)', 'Foreground tokens for compiled interaction contrast levels', 'contrast_levels', 'fg'),
    buildGroupS3('Contrast Levels: Background (bg)', 'Background tokens for compiled interaction contrast levels', 'contrast_levels', 'bg'),
    buildGroupS3('Contrast Levels: Border', 'Border tokens for compiled interaction contrast levels', 'contrast_levels', 'border'),
  ].filter(Boolean);

  const tokenCount = groups.reduce((s, g) => s + g.tokens.length, 0);

  return {
    tier: 's3',
    heading: 'S3 Color: Interaction',
    component: '4-mode',
    role: true,
    groups,
    tokenCount
  };
}

// ═══════════════════════════════════════════════════════════════════════
// S1 INTERACTION   (2-mode: light / dark references)
// ═══════════════════════════════════════════════════════════════════════
function generateS1() {
  const lightJson = readJson(path.join(THEMES, 's1-lightness/light.json'));
  const darkJson  = readJson(path.join(THEMES, 's1-lightness/dark.json'));

  const lightInter = dig(lightJson, 'ob.s1.color.interaction');
  const darkInter  = dig(darkJson,  'ob.s1.color.interaction');

  // Gather all unique token paths from light (light is the canonical source)
  // Group structure:
  //   emphasis_high.bg_base  → "Background Base"
  //   emphasis_low.bg_base   → appended to same group
  //   emphasis_high.border_base → "Border Base"  (NEW)
  //   emphasis_low.border_base  → appended
  //   emphasis_high.fg_base  → "Foreground Base"
  //   emphasis_low.fg_base   → appended
  //   emphasis_high.bg_disabled → "Background Disabled"
  //   emphasis_low.bg_disabled  → appended
  //   emphasis_high.fg_disabled → "Foreground Disabled"
  //   emphasis_low.fg_disabled  → appended
  //   emphasis_high.fg_visited → "Foreground Visited"
  //   emphasis_low.fg_visited  → appended
  //   focus_ring → "Focus Ring"

  const groupDefs = [
    { key: 'bg_base',      title: 'Background Base',     desc: 'Base background colors for interaction states' },
    { key: 'bg_disabled',   title: 'Background Disabled', desc: 'Disabled background colors for interaction states' },
    { key: 'border_base',   title: 'Border Base',         desc: 'Base border colors for interaction states' },
    { key: 'fg_base',       title: 'Foreground Base',     desc: 'Base foreground colors for interaction states' },
    { key: 'fg_disabled',   title: 'Foreground Disabled', desc: 'Disabled foreground colors for interaction states' },
    { key: 'fg_visited',    title: 'Foreground Visited',  desc: 'Visited foreground colors for interaction states' },
  ];

  const groups = [];

  for (const gd of groupDefs) {
    const tokens = [];
    for (const emphasis of ['emphasis_high', 'emphasis_low']) {
      const lightNode = dig(lightInter, `${emphasis}.${gd.key}`);
      const darkNode  = dig(darkInter,  `${emphasis}.${gd.key}`);
      if (!lightNode) continue;

      const lightLeafs = collectTokens(lightNode);
      const darkLeafs  = collectTokens(darkNode || {});
      const darkMap = {};
      for (const t of darkLeafs) darkMap[t.path] = t;

      for (const lt of lightLeafs) {
        const fullName = `ob.s1.color.interaction.${emphasis}.${gd.key}.${lt.path}`;
        const dt = darkMap[lt.path];
        tokens.push({
          name: fullName,
          references: {
            light: refStr(lt.$value),
            dark: dt ? refStr(dt.$value) : refStr(lt.$value)
          },
          hex: hexFor(fullName),
          description: lt.$description,
          semanticAssigned: true
        });
      }
    }
    if (tokens.length) {
      groups.push({ title: gd.title, description: gd.desc, tokens });
    }
  }

  // Focus Ring
  const frLight = dig(lightInter, 'focus_ring');
  const frDark  = dig(darkInter,  'focus_ring');
  if (frLight) {
    const lightLeafs = collectTokens(frLight);
    const darkLeafs  = collectTokens(frDark || {});
    const darkMap = {};
    for (const t of darkLeafs) darkMap[t.path] = t;

    groups.push({
      title: 'Focus Ring',
      description: 'Focus ring indicator colors',
      tokens: lightLeafs.map(lt => {
        const fullName = `ob.s1.color.interaction.focus_ring.${lt.path}`;
        const dt = darkMap[lt.path];
        return {
          name: fullName,
          references: {
            light: refStr(lt.$value),
            dark: dt ? refStr(dt.$value) : refStr(lt.$value)
          },
          hex: hexFor(fullName),
          description: lt.$description,
          semanticAssigned: true
        };
      })
    });
  }

  const tokenCount = groups.reduce((s, g) => s + g.tokens.length, 0);

  return {
    tier: 's1',
    heading: 'S1 Color: Interaction',
    component: '2-mode',
    role: true,
    groups,
    tokenCount
  };
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════
const tables = {
  's1-interaction': generateS1,
  's2-interaction': generateS2,
  's3-interaction': generateS3,
};

for (const [name, fn] of Object.entries(tables)) {
  const data = fn();
  const outPath = path.join(OUT, `${name}.json`);
  if (DRY_RUN) {
    console.log(`[DRY-RUN] ${name}: ${data.tokenCount} tokens across ${data.groups.length} groups`);
    for (const g of data.groups) {
      console.log(`  ${g.title}: ${g.tokens.length} tokens`);
    }
  } else {
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ ${name}.json: ${data.tokenCount} tokens (${data.groups.length} groups)`);
  }
}
