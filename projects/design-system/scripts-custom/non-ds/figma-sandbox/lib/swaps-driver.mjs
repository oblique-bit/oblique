#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SB = 'EEb38qX1Gxzq8XUCAvivge';
const map = JSON.parse(fs.readFileSync(path.join(here, 'snapshots/staging-map.json'), 'utf8')).filter((m) => m.ok);
const by = new Map(map.map((m) => [m.name, m]));
const names = [...by.keys()];
const eol = (frag) => names.find((n) => n.includes('(end of life)') && n.includes(frag));
const wanted = [
  ['text-input (legacy)', 'text-input'], ['text-area (legacy)', 'text-area'], ['select (legacy)', 'select'],
  ['text-input', 'text-input (legacy)'], ['text-area', 'text-area (legacy)'], ['select', 'select (legacy)'],
  [eol('form / input / text (end of life)'), 'text-input'],
  [eol('form / input / text-area (end of life)'), 'text-area'],
  [eol('form / input / autocomplete (end of life)'), 'autocomplete'],
  [eol('11.0.0-F1.2 / table (end of life)'), 'table'],
  [eol('table – building blocks / cells (end of life)'), 'table – building blocks / cells'],
  [eol('table – building blocks / columns (end of life)'), 'table – building blocks / columns'],
  [eol('form – building blocks / menu (end of life)'), 'form – building blocks / menu'],
  [eol('menu / cells (end of life)'), 'form – building blocks / menu cells'],
  [eol('header (end of life)'), 'master-layout – building blocks / header'],
  [eol('footer (end of life)') && names.find((n) => n.endsWith('/ footer (end of life)')), 'master-layout – building blocks / footer'],
];
const pairs = wanted.filter(([f, t]) => f && t && by.has(f) && by.has(t)).map(([f, t]) => ({ fromNodeId: by.get(f).nodeId, toNodeId: by.get(t).nodeId, fromName: f, toName: t }));
console.log('pairs', pairs.length, pairs.map((p) => p.fromName.slice(0, 40) + ' -> ' + p.toName.slice(0, 30)));
const out = execFileSync('node', [path.join(here, 'lib/cdp-eval.mjs'), SB, path.join(here, 'scripts/build-swaps.js'), '--write', '--args', JSON.stringify({ pairs })], { cwd: here, encoding: 'utf8', maxBuffer: 1 << 28 }).trim();
fs.writeFileSync(path.join(here, 'snapshots/swap-results.json'), out);
const rows = JSON.parse(out);
for (const r of rows) console.log(r.error || `${r.from.slice(0, 34)} -> ${r.to.slice(0, 28)} | main after: ${r.mainAfter} | text overrides ${r.textOverridesKept}/${r.textOverridesBefore} kept | props same ${r.propsSameValueAfter}/${r.propsBefore}${r.swapErr ? ' | ERR ' + r.swapErr : ''}`);
