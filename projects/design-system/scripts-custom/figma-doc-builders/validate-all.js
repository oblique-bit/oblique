#!/usr/bin/env node
/**
 * validate-all.js — cross-page foundations validator
 * ----------------------------------------------------------------------------
 * WHY: each doc-builder already validates its own page (row counts, dup
 * frames, description mismatches — see each build-<name>.js's own
 * validatePage()), but nothing checks two things that only became relevant
 * once _docs/shared/section_bar grew a "tier" variant and a badge system:
 *
 *   1. Every section_bar on every page actually uses that live component
 *      (not the "_docs/shared/section_bar_deprecated" one a stale page can
 *      still be pointing at) and picked the variant matching its own tier —
 *      wrong-variant bugs render the wrong accent-colour theme even while
 *      every text property reads correctly, so nothing in a per-builder
 *      validator catches it (fixed in dimension/color-pairings/viewport this
 *      session — see commits 6307d71d7, 92894ccfe, b08c9a513).
 *   2. The Color Bar strip and the three maintainer/contributor/consumer
 *      badges are hidden everywhere. Both default ON in the shared
 *      component; none of these pages has ever used them.
 *
 * This script is read-only both parts: it never writes to Figma or to a
 * token/registry file. Safe to run anytime.
 *
 * WHAT IT DOES, IN TWO INDEPENDENT PASSES:
 *   1. Structural — shells out to each doc-builder's own `--validate` (or
 *      `--mode validate` for color-pairings), which re-checks row counts,
 *      duplicate frames, description mismatches etc. against the currently
 *      connected Figma file. Requires `figma-ds-cli connect` to already be
 *      pointed at the right file — this script does not connect itself.
 *   2. Section-bar sweep (the new check) — one Figma eval that walks every
 *      canonical page, finds every section_bar-named INSTANCE, and checks
 *      it against the two invariants above, plus non-empty/non-placeholder
 *      title and $description text.
 *
 * Usage:
 *   node validate-all.js                    # both passes
 *   node validate-all.js --structural-only   # just the five builders' own --validate
 *   node validate-all.js --sweep-only        # just the section-bar sweep
 *
 * Exit code: 1 if either pass finds an error, 0 otherwise (warnings only -> 0).
 * ----------------------------------------------------------------------------
 */
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const HERE = __dirname;
const CLI = process.env.FIG_CLI || 'figma-ds-cli';
const FIG_CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');

const args = process.argv.slice(2);
const STRUCTURAL_ONLY = args.includes('--structural-only');
const SWEEP_ONLY = args.includes('--sweep-only');

// One entry per doc-builder. `flag` is passed as separate argv entries.
const BUILDERS = [
  { name: 'typography', dir: 'typography', script: 'build-typography.js', flag: ['--validate'] },
  { name: 'dimension', dir: 'dimension', script: 'build-dimension.js', flag: ['--validate'] },
  { name: 'viewport', dir: 'viewport', script: 'build-viewport.js', flag: ['--validate'] },
  { name: 'color-variables', dir: 'color-variables', script: 'build-color-variables.js', flag: ['--validate'] },
  { name: 'color-pairings', dir: 'color-pairings', script: 'build-color-pairings.js', flag: ['--mode', 'validate'] },
];

// Canonical page names, read from each builder's own registry.json `page` /
// `targetPageName` field at the time this script was written (2026-09-14) —
// update here if a page is renamed, this script does not read the
// registries dynamically.
const CANONICAL_PAGES = [
  '🎨 Colors - Variables',
  '🎨  Colors – Contrast Pairing Light',
  '🎨  Colors – Contrast Pairing Dark',
  '📐 Dimension – Spacing & Sizing',
  '🔤 Typography – Styles & Specimens',
  '📱 Responsiveness',
];

function runStructural() {
  console.log('\n── structural (per-builder --validate) ─────────────────────────────\n');
  const results = [];
  for (const b of BUILDERS) {
    const cwd = path.join(HERE, b.dir);
    process.stdout.write('  ' + b.name + '... ');
    const res = spawnSync('node', [b.script, ...b.flag], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const ok = res.status === 0;
    console.log(ok ? 'OK' : 'FAIL (exit ' + res.status + ')');
    if (!ok) {
      const out = ((res.stdout || '') + (res.stderr || '')).trim();
      console.log(out.split('\n').map((l) => '    ' + l).join('\n'));
    }
    results.push({ name: b.name, ok });
  }
  return results;
}

const SWEEP_PLUGIN_CODE = `
const PAGE_ALLOWLIST = ${JSON.stringify(CANONICAL_PAGES)};
const DEFAULT_PLACEHOLDERS = ['Tier title', 'Purpose: Description text', 'Guideline: Description text'];

function pathOf(n) {
  const parts = [];
  let p = n;
  while (p && p.type !== 'PAGE') { parts.unshift(p.name); p = p.parent; }
  return parts.join(' / ');
}

(async () => {
  await figma.loadAllPagesAsync();
  const findings = [];
  let barsChecked = 0;

  for (const page of figma.root.children) {
    if (!PAGE_ALLOWLIST.includes(page.name)) continue;

    const bars = [];
    (function walk(n) {
      if (n.type === 'INSTANCE' && /section_bar/i.test(n.name)) bars.push(n);
      if (n.children) n.children.forEach(walk);
    })(page);

    for (const sb of bars) {
      barsChecked++;
      const variant = sb.mainComponent ? sb.mainComponent.name : '(unresolved)';
      const loc = { page: page.name, path: pathOf(sb) };

      if (!sb.mainComponent || /deprecated/i.test(variant)) {
        findings.push({ ...loc, severity: 'error', code: 'DEPRECATED_COMPONENT', msg: 'bound to ' + variant + ', not the live section_bar' });
        continue;
      }

      // Color Bar / showBadge* only mean what they look like on the real
      // shared _docs/shared/section_bar COMPONENT_SET. A different
      // component (e.g. typography's own _docs/typography/section_bar) can
      // expose identically-named properties left over from a divergent
      // lineage with no matching visual node — confirmed 2026-09-14: that
      // component's "Badge: Bundeskanzlei" node is repurposed to show the
      // interface/prose mode chip, and Maintainer/Consumer have no node at
      // all, so showBadgeMaintainer/Consumer=true there is inert, not a bug.
      const isSharedComponent = sb.mainComponent.parent && sb.mainComponent.parent.name === '_docs/shared/section_bar';
      if (isSharedComponent) {
        const colorBar = sb.findOne((n) => n.name === 'Color Bar');
        if (colorBar && colorBar.visible) {
          findings.push({ ...loc, severity: 'error', code: 'COLOR_BAR_VISIBLE', msg: 'Color Bar strip visible (variant ' + variant + ')' });
        }

        const props = sb.componentProperties || {};
        for (const bare of ['showBadgeMaintainer', 'showBadgeConsumer', 'showBadgeBundeskanzlei']) {
          const key = Object.keys(props).find((k) => k === bare || k.split('#')[0] === bare);
          if (key && props[key] && props[key].value === true) {
            findings.push({ ...loc, severity: 'error', code: 'BADGE_VISIBLE', msg: bare + ' is on (variant ' + variant + ')' });
          }
        }
      }

      const titleNode = sb.findOne((n) => n.type === 'TEXT' && n.name === '__sectionTitle');
      const titleText = titleNode ? String(titleNode.characters || '').trim() : '';
      if (!titleText) findings.push({ ...loc, severity: 'error', code: 'TITLE_EMPTY', msg: '__sectionTitle empty or missing' });
      else if (DEFAULT_PLACEHOLDERS.indexOf(titleText) >= 0) findings.push({ ...loc, severity: 'error', code: 'TITLE_PLACEHOLDER', msg: '__sectionTitle is the default: "' + titleText + '"' });

      const descNode = sb.findOne((n) => n.type === 'TEXT' && n.name === '$description');
      const descText = descNode ? String(descNode.characters || '').trim() : '';
      if (!descText) findings.push({ ...loc, severity: 'warning', code: 'DESC_EMPTY', msg: '$description empty or missing' });
      else if (DEFAULT_PLACEHOLDERS.indexOf(descText) >= 0) findings.push({ ...loc, severity: 'error', code: 'DESC_PLACEHOLDER', msg: '$description is the default: "' + descText + '"' });
    }
  }

  // Deliberately flat and unfiltered here — summarising (errors/warnings
  // split, counts) is left to the Node side in runSweep(). A near-identical
  // Figma-side script that pre-computed and returned that summary object
  // reliably produced empty output through figma-ds-cli, while this flat
  // shape (and every smaller variant tested down to just barsChecked) did
  // not — bisected 2026-09-14, root cause not identified, not comment size
  // or script length. Keep the return shape here flat; do heavier shaping
  // to the result outside this string.
  return JSON.stringify({ pagesChecked: PAGE_ALLOWLIST.length, barsChecked, findings }, null, 2);
})()
`;

function runSweep() {
  console.log('\n── section-bar sweep (tier / Color Bar / badges / title / description) ──\n');
  const tmp = path.join(os.tmpdir(), 'validate-all-sweep-' + process.pid + '-' + Date.now() + '.js');
  fs.writeFileSync(tmp, SWEEP_PLUGIN_CODE);
  let res;
  try {
    res = spawnSync(CLI, ['run', tmp], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, cwd: FIG_CLI_DIR });
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
  const stdout = res.stdout || '';
  const i = stdout.search(/[{[]/);
  let raw = null;
  if (i >= 0) {
    for (let end = stdout.length; end > i; end--) {
      try { raw = JSON.parse(stdout.slice(i, end)); break; } catch {}
    }
  }
  if (!raw) {
    console.log('  Could not parse sweep output. Raw output:');
    console.log((stdout + (res.stderr || '')).trim());
    return { ok: false, errorCount: null };
  }
  // Summarise here, not in the Figma-side script — see SWEEP_PLUGIN_CODE's
  // own comment for why.
  const errors = raw.findings.filter((f) => f.severity === 'error');
  const warnings = raw.findings.filter((f) => f.severity === 'warning');
  const report = { ok: errors.length === 0, pagesChecked: raw.pagesChecked, barsChecked: raw.barsChecked, errorCount: errors.length, warningCount: warnings.length, findings: raw.findings };
  console.log('  pages checked: ' + report.pagesChecked + '  |  section bars checked: ' + report.barsChecked);
  console.log('  errors: ' + report.errorCount + '  |  warnings: ' + report.warningCount);
  if (report.findings.length) {
    console.log('');
    for (const f of report.findings) {
      console.log('  [' + f.severity.toUpperCase() + ' ' + f.code + '] ' + f.page + ' / ' + f.path);
      console.log('    ' + f.msg);
    }
  }
  return report;
}

let structural = null;
let sweep = null;
if (!SWEEP_ONLY) structural = runStructural();
if (!STRUCTURAL_ONLY) sweep = runSweep();

console.log('\n── summary ──────────────────────────────────────────────────────────\n');
let failed = false;
if (structural) {
  const bad = structural.filter((r) => !r.ok);
  console.log('  structural: ' + (structural.length - bad.length) + '/' + structural.length + ' ok' + (bad.length ? '  (failed: ' + bad.map((r) => r.name).join(', ') + ')' : ''));
  if (bad.length) failed = true;
}
if (sweep) {
  console.log('  sweep: ' + (sweep.ok ? 'ok' : sweep.errorCount + ' error(s)') + (sweep.warningCount ? ', ' + sweep.warningCount + ' warning(s)' : ''));
  if (!sweep.ok) failed = true;
}
console.log('');
process.exit(failed ? 1 : 0);
