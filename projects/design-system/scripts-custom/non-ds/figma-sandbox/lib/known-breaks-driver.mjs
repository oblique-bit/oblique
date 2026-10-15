#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadConfig, mayWrite } from './config.mjs';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SB = loadConfig().sandbox;
const res = JSON.parse(fs.readFileSync(path.join(here, 'snapshots/build-results.json'), 'utf8'));
const swaps = fs.existsSync(path.join(here, 'snapshots/swap-results.json')) ? JSON.parse(fs.readFileSync(path.join(here, 'snapshots/swap-results.json'), 'utf8')) : [];
const day = new Date().toISOString().slice(0, 10);
const rows = [];
for (const r of res) if (r.fixtures && r.fixtures.length) rows.push([r.name, r.fixtures.map((f) => (f.type === 'swap' ? 'instance-swap' : f.type)).join(', '), 'every override is kept', 'not run (baseline ' + day + ')']);
for (const s of swaps) if (!s.error) rows.push(['swap ' + s.from + ' -> ' + s.to, 'text, boolean before the swap', 'overrides kept after the swap', `built ${day}: ${s.textOverridesKept} of ${s.textOverridesBefore} text overrides kept, ${s.propsSameValueAfter} of ${s.propsBefore} property values equal`]);
console.log('rows', rows.length);
for (let i = 0; i < rows.length; i += 100) {
  const out = execFileSync('node', [path.join(here, 'lib/cdp-eval.mjs'), SB, path.join(here, 'scripts/build-known-breaks.js'), '--write', '--args', JSON.stringify({ rows: rows.slice(i, i + 100), title: 'Known breaks: expected result and last result per fixture group' })], { cwd: here, encoding: 'utf8', maxBuffer: 1 << 28 }).trim();
  console.log('chunk', i, out);
}
