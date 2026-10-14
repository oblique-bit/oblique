#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SB = 'EEb38qX1Gxzq8XUCAvivge';
const out = [];
for (const page of ['Components', 'Swaps']) {
  let total = Infinity;
  for (let from = 0; from < total; from += 150) {
    const r = JSON.parse(execFileSync('node', [path.join(here, 'lib/cdp-eval.mjs'), SB, path.join(here, 'scripts/measure-overrides.js'), '--write', '--args', JSON.stringify({ page, from, to: from + 150 })], { cwd: here, encoding: 'utf8', maxBuffer: 1 << 28 }));
    total = r.total; for (const row of r.rows) out.push([page, ...row]);
    console.log(page, from, '/', total);
  }
}
fs.writeFileSync(path.join(here, 'snapshots/measure-overrides.json'), JSON.stringify(out));
const none = out.filter((r) => r[4].length === 0);
console.log('fixtures', out.length, 'without any override:', none.length);
for (const r of none.slice(0, 40)) console.log(' ', r[0], r[2], r[3]);
