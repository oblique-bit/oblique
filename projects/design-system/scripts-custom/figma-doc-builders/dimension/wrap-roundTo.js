#!/usr/bin/env node
/**
 * wrap-roundTo.js — One-off: wrap every math $value in dimension token JSONs
 * with roundTo(<expr>, 2). Idempotent (skips already-wrapped). Dry-run by
 * default; pass --apply to write changes.
 *
 * Scope: src/lib/themes/03_semantic/dimension/{density,ui_scale,typography_context}/<mode>.json
 *        (static files have literal values, no math — skipped automatically)
 *
 * Targets: $value strings that contain math operators (*, /, +, -). Pure
 * single-reference values like "{ob.p.dimension.px.56}" are left alone.
 *
 * Usage:
 *   node wrap-roundTo.js              # dry-run, report counts
 *   node wrap-roundTo.js --apply      # write changes
 *   node wrap-roundTo.js --apply --decimals 3   # override precision
 */
'use strict';

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const REPO_ROOT = path.resolve(HERE, '..', '..', '..');
const DIM_ROOT  = path.join(REPO_ROOT, 'src/lib/themes/03_semantic/dimension');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const di = args.indexOf('--decimals');
const DECIMALS = (di >= 0 && args[di + 1]) ? parseInt(args[di + 1], 10) : 2;

if (!Number.isFinite(DECIMALS) || DECIMALS < 0) {
  console.error('bad --decimals: ' + args[di + 1]);
  process.exit(2);
}

// Find every <mode>.json under each dimension collection folder. Skip 'static.json'.
function listTargetFiles() {
  const out = [];
  for (const sub of fs.readdirSync(DIM_ROOT, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const dir = path.join(DIM_ROOT, sub.name);
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json') || f === 'static.json') continue;
      out.push(path.join(dir, f));
    }
  }
  return out;
}

// True if the string looks like a math expression (has operators outside of
// reference braces). We strip { ... } first so token paths like
// "ob.p.dimension.px.56" don't trigger false positives on internal '.'.
function isMathExpression(s) {
  if (typeof s !== 'string') return false;
  if (/^\s*roundTo\s*\(/.test(s)) return false; // already wrapped
  const stripped = s.replace(/\{[^}]+\}/g, 'X');
  return /[+\-*/]/.test(stripped);
}

// Walk a token tree, calling `cb(leaf, path)` for each leaf object with a
// string $value. (Some leaves use $type "dimension", others "spacing" — we
// accept any leaf whose $value is a string that looks like math.)
function walkTokens(node, cb, pathStack = []) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.$value === 'string' && typeof node.$type === 'string') {
    cb(node, pathStack.join('.'));
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    walkTokens(v, cb, [...pathStack, k]);
  }
}

const files = listTargetFiles();
let totalChanged = 0, totalSkippedNoMath = 0, totalSkippedAlready = 0;
const perFile = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const tree = JSON.parse(raw);
  let changed = 0, skippedNoMath = 0, skippedAlready = 0;
  walkTokens(tree, (leaf, p) => {
    const v = leaf.$value;
    if (/^\s*roundTo\s*\(/.test(v)) { skippedAlready++; return; }
    if (!isMathExpression(v)) { skippedNoMath++; return; }
    leaf.$value = 'roundTo(' + v.trim() + ', ' + DECIMALS + ')';
    changed++;
  });
  totalChanged += changed;
  totalSkippedNoMath += skippedNoMath;
  totalSkippedAlready += skippedAlready;
  perFile.push({ file: path.relative(REPO_ROOT, file), changed, skippedNoMath, skippedAlready });
  if (APPLY && changed > 0) {
    fs.writeFileSync(file, JSON.stringify(tree, null, 2) + '\n');
  }
}

console.log((APPLY ? 'WROTE' : 'DRY-RUN') + ' wrap-roundTo with decimals=' + DECIMALS);
console.log('');
for (const r of perFile) {
  console.log('  ' + r.file.padEnd(70) + ' changed=' + r.changed + '  alreadyWrapped=' + r.skippedAlready + '  notMath=' + r.skippedNoMath);
}
console.log('');
console.log('Totals: changed=' + totalChanged + '  alreadyWrapped=' + totalSkippedAlready + '  notMath=' + totalSkippedNoMath);
if (!APPLY) console.log('\n(dry-run; re-run with --apply to write)');
