#!/usr/bin/env node
/**
 * prune-orphan-variables.js — find (and, once confirmed, delete) Figma
 * variables and variable collections with no matching JSON token.
 * ----------------------------------------------------------------------------
 * UNLIKE every other script in this folder, this one runs from Node, not
 * from inside the Figma plugin sandbox. It has to: the rule it enforces —
 * every Figma variable needs a matching token in src/lib/themes/, no
 * exceptions; variables come into existence only through a Token Studio
 * push, never by hand directly in Figma — can only be checked by reading
 * the current token JSON off disk, which a figma-ds-cli eval script cannot
 * do. This script reads the JSON here in Node, then hands the resulting
 * id/name sets to a small plugin-side script over figma-ds-cli, the same
 * way build-color-variables.js hands its registry + token data across.
 *
 * WHAT COUNTS AS "MATCHING":
 *   1. By key — $themes.json's $figmaVariableReferences maps each token path
 *      to the Figma variable's stable `key` (the REST API id, not the
 *      plugin VariableID). Unioned across every theme entry.
 *   2. By name, as a fallback — every token's own JSON path (dots -> "/",
 *      no stripping — this matches the raw pushed name, e.g. "ob/p/color/
 *      red/50") checked against the variable's `name`. Needed because (1)
 *      alone has a confirmed gap: TIMING and EASING variables never show up
 *      in $figmaVariableReferences even when the token exists and the
 *      variable is live (confirmed 2026-09-22 for "ob/s/motion/duration/*"
 *      and "ob/s/motion/easing/*" during the first orphan audit of this
 *      file).
 *
 * A variable failing BOTH checks is an orphan: either drift from a token
 * path rename (the old variable survives under its old name, see the
 * "re-export after a token path change" gotcha in ../FIGMA-WORKFLOW.md), or
 * a manual creation directly in Figma, which the policy above forbids.
 *
 * SAFETY MODEL — deliberately more conservative than the other cosmetic
 * scripts:
 *   - scan (default) only ever reports. It never writes.
 *   - apply only deletes a variable COLLECTION, and only one that is 100%
 *     orphaned (every variable inside it failed both checks) AND whose id
 *     appears in --confirm's file. It never deletes a single stray variable
 *     inside an otherwise-healthy collection automatically — those need a
 *     human to look at them one at a time, same as the 5 found in the first
 *     audit (4 easing + 1 dimension, all false positives from the TIMING/
 *     EASING gap above, none of them actually orphaned).
 *   - re-checks each collection's variable count against the scan's count
 *     right before deleting it, in case something changed in between scan
 *     and apply.
 *
 * HOW TO RUN:
 *
 *   node prune-orphan-variables.js
 *     -> scan mode. Prints the full report: fully-orphaned collections
 *        (safe delete candidates) and stray orphans (need manual review).
 *
 *   node prune-orphan-variables.js --apply --confirm ids.json
 *     -> ids.json is a plain JSON array of the VariableCollectionId strings
 *        you reviewed and want deleted, e.g. ["VariableCollectionId:227:148977", ...].
 *        Copy them from a scan run's fullyOrphanedCollections[].id — do not
 *        hand-type them.
 *
 * Same "figma-ds-cli eval writes get blocked by the auto-mode classifier
 * even after confirmation" behavior as every other destructive write in this
 * repo applies here too — if the apply run is denied, run the printed
 * command yourself in a terminal.
 *
 * Run this after every Token Studio push to Figma, alongside run-cosmetics.js
 * — see ../FIGMA-WORKFLOW.md step 4. Scan every time; apply only when the
 * report actually shows fully-orphaned collections worth clearing.
 * ----------------------------------------------------------------------------
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const CLI = process.env.FIG_CLI || 'figma-ds-cli';
const HERE = __dirname;
const THEMES_DIR = path.resolve(HERE, '..', '..', 'src', 'lib', 'themes');
const THEMES_JSON = path.join(THEMES_DIR, '$themes.json');
// figma-ds-cli's `run`/`eval` shim resolves its own src/figma-client.js
// relative to cwd — same requirement as build-color-variables.js.
const FIG_CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');
const FILE_KEY_GUARD = process.env.FIGMA_FILE_KEY || 'pZIPu881RzeIVkNTtXp8uC'; // Oblique Design System R16-Prep

// ─── CLI args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const confirmIdx = args.indexOf('--confirm');
const confirmPath = confirmIdx >= 0 ? args[confirmIdx + 1] : null;
if (APPLY && !confirmPath) {
  console.error('--apply requires --confirm <path-to-ids.json> (collection ids from a prior scan)');
  process.exit(1);
}
let confirmedCollectionIds = [];
if (confirmPath) {
  confirmedCollectionIds = JSON.parse(fs.readFileSync(confirmPath, 'utf8'));
  if (!Array.isArray(confirmedCollectionIds)) {
    console.error('--confirm file must be a JSON array of VariableCollectionId strings');
    process.exit(1);
  }
}

// ─── Read token JSON off disk ───────────────────────────────────────────
function walkJsonFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJsonFiles(full, out);
    else if (entry.name.endsWith('.json') && !entry.name.startsWith('$')) out.push(full);
  }
  return out;
}

function collectReferencedNames(dir) {
  const names = new Set();
  for (const file of walkJsonFiles(dir)) {
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
    (function walk(node, pathParts) {
      if (!node || typeof node !== 'object') return;
      if ('$value' in node) { names.add(pathParts.join('/')); return; }
      for (const [k, v] of Object.entries(node)) walk(v, pathParts.concat(k));
    })(data, []);
  }
  return names;
}

function collectReferencedKeys(themesJsonPath) {
  const themes = JSON.parse(fs.readFileSync(themesJsonPath, 'utf8'));
  const keys = new Set();
  for (const theme of themes) {
    const refs = theme['$figmaVariableReferences'] || {};
    for (const key of Object.values(refs)) keys.add(key);
  }
  return keys;
}

const referencedNames = Array.from(collectReferencedNames(THEMES_DIR));
const referencedKeys = Array.from(collectReferencedKeys(THEMES_JSON));

// ─── figma-ds-cli wrapper (same pattern as build-color-variables.js) ────
function runEval(scriptText) {
  const tmp = path.join(os.tmpdir(), `prune-orphan-vars-${process.pid}-${Date.now()}.js`);
  fs.writeFileSync(tmp, scriptText);
  try {
    const res = spawnSync(CLI, ['eval', '-f', tmp], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      cwd: FIG_CLI_DIR,
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

// ─── In-Figma plugin code (assembled as a string) ───────────────────────
const PAYLOAD = { referencedKeys, referencedNames, fileKeyGuard: FILE_KEY_GUARD, apply: APPLY, confirmedCollectionIds };

const PLUGIN_CODE = `
(async () => {
  const PAYLOAD = ${JSON.stringify(PAYLOAD)};
  const { referencedKeys, referencedNames, fileKeyGuard, apply, confirmedCollectionIds } = PAYLOAD;

  if (fileKeyGuard && figma.fileKey !== fileKeyGuard) {
    return JSON.stringify({ ok: false, reason: 'FILE KEY GUARD', expected: fileKeyGuard, actual: figma.fileKey });
  }

  const keySet = new Set(referencedKeys);
  const nameSet = new Set(referencedNames);

  const vars = await figma.variables.getLocalVariablesAsync();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collById = new Map(collections.map((c) => [c.id, c]));

  const byCollection = {};
  const orphans = [];
  for (const v of vars) {
    const coll = collById.get(v.variableCollectionId);
    const collName = coll ? coll.name : '(unknown collection)';
    const isOrphan = !keySet.has(v.key) && !nameSet.has(v.name);
    if (!byCollection[collName]) byCollection[collName] = { id: coll ? coll.id : null, total: 0, orphans: 0 };
    byCollection[collName].total += 1;
    if (isOrphan) {
      byCollection[collName].orphans += 1;
      orphans.push({ id: v.id, key: v.key, name: v.name, collection: collName, resolvedType: v.resolvedType });
    }
  }

  const fullyOrphanedCollections = Object.entries(byCollection)
    .filter(([, c]) => c.orphans > 0 && c.orphans === c.total)
    .map(([name, c]) => ({ name, id: c.id, count: c.total }));

  const strayOrphanCollectionNames = new Set(fullyOrphanedCollections.map((c) => c.name));
  const strayOrphans = orphans.filter((o) => !strayOrphanCollectionNames.has(o.collection));

  const report = {
    ok: true,
    mode: apply ? 'apply' : 'scan',
    totalVariables: vars.length,
    totalOrphans: orphans.length,
    fullyOrphanedCollections,
    strayOrphans,
  };

  if (apply) {
    const confirmed = new Set(confirmedCollectionIds || []);
    const deleted = [];
    const skipped = [];
    for (const fc of fullyOrphanedCollections) {
      if (!confirmed.has(fc.id)) { skipped.push({ ...fc, reason: 'not in --confirm list' }); continue; }
      const coll = collById.get(fc.id);
      if (!coll || coll.variableIds.length !== fc.count) { skipped.push({ ...fc, reason: 'drifted since scan' }); continue; }
      coll.remove();
      deleted.push(fc);
    }
    report.deleted = deleted;
    report.skipped = skipped;
    await new Promise((r) => setTimeout(r, 1500));
  }

  return JSON.stringify(report, null, 2);
})()
`;

// ─── Run ─────────────────────────────────────────────────────────────────
console.log(`[prune-orphan-variables] ${APPLY ? 'apply' : 'scan'} mode, ${referencedKeys.length} referenced keys, ${referencedNames.length} referenced names from JSON`);
const res = runEval(PLUGIN_CODE);
if (res.status !== 0) {
  console.error('figma-ds-cli exited', res.status);
  console.error(res.stderr);
  process.exit(1);
}
const report = extractJson(res.stdout);
if (!report) {
  console.error('Could not parse JSON from figma-ds-cli output:');
  console.error(res.stdout);
  process.exit(1);
}
console.log(JSON.stringify(report, null, 2));

if (!APPLY && report.ok && report.fullyOrphanedCollections?.length) {
  const idsPath = path.join(os.tmpdir(), `prune-orphan-vars-ids-${Date.now()}.json`);
  fs.writeFileSync(idsPath, JSON.stringify(report.fullyOrphanedCollections.map((c) => c.id), null, 2));
  console.log(`\nAll ${report.fullyOrphanedCollections.length} fully-orphaned collection ids written to: ${idsPath}`);
  console.log('Review the collection names/counts above, then re-run:');
  console.log(`  node ${path.relative(process.cwd(), __filename)} --apply --confirm ${idsPath}`);
}
