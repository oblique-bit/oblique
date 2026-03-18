#!/usr/bin/env node
/**
 * Token Resolver — resolves all {reference} chains to final values.
 *
 * Usage:
 *   node scripts-custom/resolve-tokens.js                   # default combo
 *   node scripts-custom/resolve-tokens.js --list            # show available themes
 *   node scripts-custom/resolve-tokens.js --combo "light,high,md,desktop,standard,interface,enabled"
 *
 * Default combo: static + light + high + semantic + md + desktop + standard + interface + enabled
 * Output: _private/resolved-tokens.json  (flat: "ob.h.button.color.bg..." → "#2379A4")
 */

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'src', 'lib', 'themes');
const OUTPUT_DIR = path.join(__dirname, '..', '_private');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'resolved-tokens.json');

// ── Load config ──────────────────────────────────────────────────────────────

const metadata = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, '$metadata.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, '$themes.json'), 'utf8'));
const tokenSetOrder = metadata.tokenSetOrder;

const REF_PATTERN = /\{([^}]+)\}/g;
const MAX_DEPTH = 20;

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--list')) {
  console.log('\nAvailable themes by group:\n');
  const groups = {};
  for (const t of themes) {
    const g = t.group || '(ungrouped)';
    if (!groups[g]) groups[g] = [];
    groups[g].push(t.name);
  }
  for (const [group, names] of Object.entries(groups)) {
    console.log(`  ${group}: ${names.join(', ')}`);
  }
  console.log('\nDefault combo: light,high,md,desktop,standard,interface,enabled');
  console.log('Usage: node scripts-custom/resolve-tokens.js --combo "light,high,md,desktop,standard,interface,enabled"\n');
  process.exit(0);
}

let comboNames = ['light', 'high', 'md', 'desktop', 'standard', 'interface', 'enabled'];
const comboIdx = args.indexOf('--combo');
if (comboIdx !== -1 && args[comboIdx + 1]) {
  comboNames = args[comboIdx + 1].split(',').map(s => s.trim());
}

// ── Multi-combo mode (generates all mode combinations in one file) ───────────

if (args.includes('--multi')) {
  const MULTI_OUTPUT = path.join(OUTPUT_DIR, 'resolved-tokens-multi.json');
  const modeCombos = [
    { label: 'light-high', combo: ['light', 'high'] },
    { label: 'light-low',  combo: ['light', 'low'] },
    { label: 'dark-high',  combo: ['dark', 'high'] },
    { label: 'dark-low',   combo: ['dark', 'low'] },
  ];
  const baseCombo = ['md', 'desktop', 'standard', 'interface', 'enabled', 'static', 'semantic'];

  const multiResult = { _meta: { generated: new Date().toISOString(), modes: {} }, tokens: {} };

  for (const { label, combo } of modeCombos) {
    const fullCombo = [...combo, ...baseCombo];
    // Collect token set states
    const setStates = {};
    for (const name of fullCombo) {
      const theme = themes.find(t => t.name === name);
      if (!theme) continue;
      for (const [sp, state] of Object.entries(theme.selectedTokenSets || {})) {
        if (state === 'enabled' || state === 'source') setStates[sp] = state;
        else if (state === 'disabled' && !setStates[sp]) setStates[sp] = 'disabled';
      }
    }
    const sets = tokenSetOrder.filter(s => setStates[s] === 'enabled' || setStates[s] === 'source');

    // Merge
    const merged = {};
    for (const sp of sets) {
      const fp = path.join(THEMES_DIR, sp + '.json');
      if (!fs.existsSync(fp)) continue;
      Object.assign(merged, flattenTokens(JSON.parse(fs.readFileSync(fp, 'utf8'))));
    }

    // Resolve (need a local resolveValue that uses this merged set)
    const localResolved = {};
    function localResolve(tp, vis = new Set()) {
      if (vis.has(tp)) return `⚠ CIRCULAR`;
      const tok = merged[tp];
      if (!tok) return undefined;
      let v = tok.$value;
      if (v && typeof v === 'object') return localResolveComposite(v, new Set(vis));
      if (typeof v !== 'string') return v;
      if (!v.includes('{')) return evalMathExpr(v);
      vis.add(tp);
      let res = v, depth = 0;
      while (res.includes('{') && depth < MAX_DEPTH) {
        depth++;
        let changed = false;
        res = res.replace(REF_PATTERN, (m, rp) => {
          const rt = merged[rp];
          if (!rt) return `⚠ UNRESOLVED: ${rp}`;
          changed = true;
          let rv = rt.$value;
          if (rv && typeof rv === 'object') return JSON.stringify(localResolveComposite(rv, new Set(vis)));
          if (typeof rv === 'string' && rv.includes('{')) rv = localResolve(rp, new Set(vis));
          return typeof rv === 'string' ? rv : JSON.stringify(rv);
        });
        if (!changed) break;
      }
      return evalMathExpr(res);
    }
    function localResolveComposite(val, vis) {
      if (Array.isArray(val)) return val.map(i => localResolveComposite(i, vis));
      if (val && typeof val === 'object') {
        const o = {};
        for (const [k, vl] of Object.entries(val)) o[k] = localResolveComposite(vl, vis);
        return o;
      }
      if (typeof val === 'string' && val.includes('{')) {
        let r = val.replace(REF_PATTERN, (m, rp) => {
          const rv = localResolve(rp, new Set(vis));
          return rv !== undefined ? (typeof rv === 'string' ? rv : JSON.stringify(rv)) : `⚠ UNRESOLVED: ${rp}`;
        });
        return evalMathExpr(r);
      }
      return typeof val === 'string' ? evalMathExpr(val) : val;
    }

    for (const [tp, tok] of Object.entries(merged)) {
      const val = localResolve(tp);
      if (!localResolved[tp]) localResolved[tp] = {};
      localResolved[tp] = { value: val, type: tok.$type || null };
    }

    // Store in multi result
    multiResult._meta.modes[label] = { combo: fullCombo, tokenCount: Object.keys(localResolved).length };

    for (const [tp, data] of Object.entries(localResolved)) {
      if (!multiResult.tokens[tp]) {
        multiResult.tokens[tp] = { type: data.type, modes: {} };
      }
      multiResult.tokens[tp].modes[label] = data.value;
      if (!multiResult.tokens[tp].type && data.type) multiResult.tokens[tp].type = data.type;
    }

    console.log(`  ✓ ${label}: ${Object.keys(localResolved).length} tokens`);
  }

  multiResult._meta.totalTokens = Object.keys(multiResult.tokens).length;
  fs.writeFileSync(MULTI_OUTPUT, JSON.stringify(multiResult, null, 2), 'utf8');
  console.log(`\n✅ Multi-combo written to: ${path.relative(process.cwd(), MULTI_OUTPUT)}\n`);
  process.exit(0);
}

// Always include 'static' and 'semantic' themes (they are base layers)
const alwaysInclude = ['static', 'semantic'];
for (const name of alwaysInclude) {
  if (!comboNames.includes(name)) comboNames.push(name);
}

// ── Determine active token sets ──────────────────────────────────────────────

// Collect selectedTokenSets from all chosen themes
// States: "source" = always included, "enabled" = active, "disabled" = off
const tokenSetStates = {};

for (const themeName of comboNames) {
  const theme = themes.find(t => t.name === themeName);
  if (!theme) {
    console.warn(`⚠ Theme "${themeName}" not found, skipping.`);
    continue;
  }
  for (const [setPath, state] of Object.entries(theme.selectedTokenSets || {})) {
    // "enabled" and "source" both mean active; later theme wins on conflict
    if (state === 'enabled' || state === 'source') {
      tokenSetStates[setPath] = state;
    } else if (state === 'disabled' && !tokenSetStates[setPath]) {
      tokenSetStates[setPath] = 'disabled';
    }
  }
}

// Build ordered list of active token sets (respecting $metadata.json order)
const activeSets = tokenSetOrder.filter(
  setPath => tokenSetStates[setPath] === 'enabled' || tokenSetStates[setPath] === 'source'
);

console.log(`\n🎯 Resolving tokens for combo: [${comboNames.join(', ')}]`);
console.log(`   Active token sets: ${activeSets.length}\n`);

// ── Load & flatten token JSON files ──────────────────────────────────────────

function flattenTokens(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // skip $type, $description at root
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('$value' in value) {
        // Leaf token
        result[path] = {
          $value: value.$value,
          $type: value.$type || undefined
        };
      } else {
        Object.assign(result, flattenTokens(value, path));
      }
    }
  }
  return result;
}

// Merge all active sets in order (later overrides earlier)
const mergedTokens = {};

for (const setPath of activeSets) {
  const filePath = path.join(THEMES_DIR, setPath + '.json');
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${setPath}.json`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const flat = flattenTokens(data);
  Object.assign(mergedTokens, flat);
}

console.log(`   Merged tokens: ${Object.keys(mergedTokens).length}`);

// ── Resolve references ───────────────────────────────────────────────────────



/**
 * Evaluate simple math: "1rem * 1" → "1rem", "0.375rem * 1" → "0.375rem"
 * Handles: value * multiplier, value / divisor
 */
function evalMathExpr(str) {
  if (typeof str !== 'string') return str;
  // Pattern: "<number><unit> * <number>" or "<number><unit> / <number>"
  return str.replace(/(\d+\.?\d*)(rem|px|em|%|ms|s)?\s*\*\s*(\d+\.?\d*)/g, (_, num, unit, mult) => {
    const result = parseFloat(num) * parseFloat(mult);
    return (unit ? `${result}${unit}` : `${result}`);
  }).replace(/(\d+\.?\d*)(rem|px|em|%|ms|s)?\s*\/\s*(\d+\.?\d*)/g, (_, num, unit, div) => {
    const result = parseFloat(num) / parseFloat(div);
    return (unit ? `${result}${unit}` : `${result}`);
  }).replace(/\(([^()]+)\)/g, (_, inner) => {
    // Evaluate parenthesized math: (1.25rem * 1 * 1) / 2
    let result = inner;
    result = result.replace(/(\d+\.?\d*)(rem|px|em|%|ms|s)?\s*\*\s*(\d+\.?\d*)/g, (__, n, u, m) => {
      return `${parseFloat(n) * parseFloat(m)}${u || ''}`;
    });
    result = result.replace(/(\d+\.?\d*)(rem|px|em|%|ms|s)?\s*\/\s*(\d+\.?\d*)/g, (__, n, u, d) => {
      return `${parseFloat(n) / parseFloat(d)}${u || ''}`;
    });
    return result;
  });
}

function resolveValue(tokenPath, visited = new Set()) {
  if (visited.has(tokenPath)) {
    return `⚠ CIRCULAR: ${[...visited, tokenPath].join(' → ')}`;
  }

  const token = mergedTokens[tokenPath];
  if (!token) return undefined;

  let val = token.$value;

  // Handle composite values (objects/arrays) — resolve refs inside them
  if (val && typeof val === 'object') {
    return resolveComposite(val, new Set(visited));
  }

  if (typeof val !== 'string') return val;

  // Check if it contains references
  if (!val.includes('{')) return evalMathExpr(val);

  visited.add(tokenPath);

  // Resolve all {references} in the value
  let resolved = val;
  let depth = 0;
  while (resolved.includes('{') && depth < MAX_DEPTH) {
    depth++;
    let changed = false;
    resolved = resolved.replace(REF_PATTERN, (match, refPath) => {
      const refToken = mergedTokens[refPath];
      if (!refToken) return `⚠ UNRESOLVED: ${refPath}`;
      changed = true;

      let refVal = refToken.$value;
      if (refVal && typeof refVal === 'object') {
        return JSON.stringify(resolveComposite(refVal, new Set(visited)));
      }
      if (typeof refVal === 'string' && refVal.includes('{')) {
        refVal = resolveValue(refPath, new Set(visited));
      }
      return typeof refVal === 'string' ? refVal : JSON.stringify(refVal);
    });
    if (!changed) break;
  }

  return evalMathExpr(resolved);
}

/** Recursively resolve references inside composite (object/array) values */
function resolveComposite(val, visited) {
  if (Array.isArray(val)) {
    return val.map(item => resolveComposite(item, visited));
  }
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = resolveComposite(v, visited);
    }
    return out;
  }
  if (typeof val === 'string' && val.includes('{')) {
    let resolved = val;
    resolved = resolved.replace(REF_PATTERN, (match, refPath) => {
      const rv = resolveValue(refPath, new Set(visited));
      return rv !== undefined ? (typeof rv === 'string' ? rv : JSON.stringify(rv)) : `⚠ UNRESOLVED: ${refPath}`;
    });
    return evalMathExpr(resolved);
  }
  return typeof val === 'string' ? evalMathExpr(val) : val;
}

// ── Build output ─────────────────────────────────────────────────────────────

const resolved = {};
const unresolved = [];

for (const [tokenPath, token] of Object.entries(mergedTokens)) {
  const val = resolveValue(tokenPath);
  if (typeof val === 'string' && val.includes('⚠')) {
    unresolved.push({ path: tokenPath, issue: val });
  }
  resolved[tokenPath] = {
    value: val,
    type: token.$type || null
  };
}

// ── Write output ─────────────────────────────────────────────────────────────

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const output = {
  _meta: {
    generated: new Date().toISOString(),
    combo: comboNames,
    activeSets: activeSets.length,
    totalTokens: Object.keys(resolved).length,
    unresolvedCount: unresolved.length
  },
  tokens: resolved
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

console.log(`   Resolved tokens: ${Object.keys(resolved).length - unresolved.length}`);
if (unresolved.length > 0) {
  console.log(`   ⚠ Unresolved: ${unresolved.length}`);
  for (const u of unresolved.slice(0, 10)) {
    console.log(`     - ${u.path}: ${u.issue}`);
  }
  if (unresolved.length > 10) {
    console.log(`     ... and ${unresolved.length - 10} more`);
  }
}
console.log(`\n✅ Written to: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
