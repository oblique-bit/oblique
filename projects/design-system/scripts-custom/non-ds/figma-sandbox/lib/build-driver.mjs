#!/usr/bin/env node
// Run scripts/build-fixtures.js over the staged instances in chunks. Resumable (the script skips done items).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadConfig, mayWrite } from './config.mjs';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SB = loadConfig().sandbox;
const map = JSON.parse(fs.readFileSync(path.join(here, 'snapshots/staging-map.json'), 'utf8')).filter((m) => m.ok);
const inv = JSON.parse(fs.readFileSync(path.join(here, 'snapshots/inventory-library.json'), 'utf8'));
const defsByName = new Map(inv.map((x) => [x.name, x.defs]));
const groupOf = (page) => page.replace(/^\P{L}+/u, '').trim();
const items = map.map((m) => ({ nodeId: m.nodeId, name: m.name, group: groupOf(m.page), defs: m.page.includes('Icons') ? null : defsByName.get(m.name) }));
const order = ['Components', 'Utilities', 'End of life', 'Icons'];
items.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
const swapSources = items.filter((i) => i.group === 'Icons').slice(0, 4).map((i) => i.nodeId);
const resFile = path.join(here, 'snapshots/build-results.json');
const results = fs.existsSync(resFile) ? JSON.parse(fs.readFileSync(resFile, 'utf8')) : [];
const doneNames = new Set(results.filter((r) => r.fixtures && r.fixtures.length).map((r) => r.name));
const only = process.env.ONLY ? new Set(process.env.ONLY.split('|')) : null;
const todo = items.filter((i) => !doneNames.has(i.name) && (!only || only.has(i.name)));
console.log(new Date().toISOString(), 'items', items.length, 'todo', todo.length);
for (let i = 0; i < todo.length;) {
  const grp = todo[i].group;
  const size = grp === 'Icons' ? 50 : 10;
  const chunk = [];
  while (i < todo.length && chunk.length < size && todo[i].group === grp) chunk.push(todo[i++]);
  let out;
  try {
    out = execFileSync('node', [path.join(here, 'lib/cdp-eval.mjs'), SB, path.join(here, 'scripts/build-fixtures.js'), '--write', '--args', JSON.stringify({ items: chunk, swapSources })], { cwd: here, encoding: 'utf8', maxBuffer: 1 << 28 }).trim();
    const rows = JSON.parse(out);
    for (const r of rows) { const k = results.findIndex((x) => x.name === r.name); if (k >= 0) results[k] = r; else results.push(r); }
    fs.writeFileSync(resFile, JSON.stringify(results, null, 1));
    const fx = rows.reduce((a, r) => a + (r.fixtures ? r.fixtures.length : 0), 0);
    console.log(new Date().toISOString(), grp, 'chunk of', chunk.length, 'fixtures', fx, 'errors', rows.filter((r) => r.error).map((r) => r.name + ': ' + r.error));
  } catch (e) { console.log('CHUNK FAILED', grp, chunk.map((c) => c.name).slice(0, 3), String(e.message).slice(0, 300)); }
}
console.log(new Date().toISOString(), 'DONE results', results.length);
