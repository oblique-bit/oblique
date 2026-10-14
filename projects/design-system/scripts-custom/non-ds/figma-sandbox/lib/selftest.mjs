#!/usr/bin/env node
// Self test of the snapshot and compare tools: change 3 fixtures on purpose, the compare must list exactly these 3, revert, compare must be empty.
// Needs an earlier snapshot tag as the baseline: node lib/selftest.mjs s1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SB = 'EEb38qX1Gxzq8XUCAvivge';
const base = process.argv[2] || 's1';
const ev = (script, args) => execFileSync('node', [path.join(here, 'lib/cdp-eval.mjs'), SB, path.join(here, 'scripts', script), '--write', ...(args ? ['--args', JSON.stringify(args)] : [])], { cwd: here, encoding: 'utf8', maxBuffer: 1 << 28 }).trim();
const snap = (tag, ids) => execFileSync('node', [path.join(here, 'lib/snapshot.mjs'), tag, '--png-ids', ids.join(',')], { cwd: here, encoding: 'utf8' });
const cmp = (a, b) => { const r = spawnSync('python3', [path.join(here, 'lib/compare.py'), a, b, '--json', path.join(here, 'snapshots', `${a}-${b}.json`)], { cwd: here, encoding: 'utf8' }); return { code: r.status, out: r.stdout }; };
const changes = JSON.parse(ev('selftest-change.js'));
const ids = changes.map((c) => c.id);
console.log('changed on purpose:', ids, changes.map((c) => c.kind));
let ok = true; const result = { changed: changes };
try {
  snap('st-changed', ids);
  const c1 = cmp(base, 'st-changed'); console.log(c1.out.split('\n').slice(0, 14).join('\n'));
  const listed = Object.keys(JSON.parse(fs.readFileSync(path.join(here, 'snapshots', `${base}-st-changed.json`), 'utf8')));
  const dataListed = listed.filter((i) => true);
  result.listedAfterChange = dataListed; result.expected = ids;
  const exact = dataListed.length === ids.length && ids.every((i) => dataListed.includes(i));
  console.log('STEP 1 exactly the ' + ids.length + ' changed fixtures listed:', exact); ok = ok && exact;
} finally {
  ev('selftest-revert.js', { changes });
}
snap('st-reverted', ids);
const c2 = cmp(base, 'st-reverted'); console.log(c2.out.split('\n').slice(0, 8).join('\n'));
const emptyData = c2.code === 0 || c2.code === 3;
result.afterRevertCompareExit = c2.code;
console.log('STEP 2 compare after revert is empty in data:', emptyData); ok = ok && emptyData;
result.pass = ok;
fs.writeFileSync(path.join(here, 'snapshots/selftest-result.json'), JSON.stringify(result, null, 1));
console.log(ok ? 'SELF TEST PASSED (' + ids.length + ' of ' + ids.length + ', then empty)' : 'SELF TEST FAILED');
process.exit(ok ? 0 : 1);
