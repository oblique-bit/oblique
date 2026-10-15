#!/usr/bin/env node
// node lib/snapshot.mjs <tag> [--no-png] [--png-ids id1,id2]
// Writes snapshots/<tag>/snapshot.json (state of every fixture and swap) and png/<id>.png plus png-hashes.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadConfig, mayWrite } from './config.mjs';
const here = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SB = process.env.SANDBOX_KEY || loadConfig().sandbox; // SANDBOX_KEY snapshots another file with the same structure
const [tag, ...flags] = process.argv.slice(2);
const dir = path.join(here, 'snapshots', tag); fs.mkdirSync(path.join(dir, 'png'), { recursive: true });
const ev = (script, args, out, write) => execFileSync('node', [path.join(here, 'lib/cdp-eval.mjs'), SB, path.join(here, 'scripts', script), ...(write ? ['--write'] : []), ...(args ? ['--args', JSON.stringify(args)] : []), ...(out ? ['--out', out] : [])], { cwd: here, encoding: 'utf8', maxBuffer: 1 << 29 });
const t0 = Date.now();
// Warm the file first and take the data snapshot until two reads in a row are identical: right after a Figma restart
// nested library content loads lazily and a single read can be incomplete (false differences in a compare).
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
ev('warm.js', null, null, true);
let stable = false, prev = null;
for (let i = 0; i < 6 && !stable; i++) {
  ev('snapshot.js', null, path.join(dir, 'snapshot.json'));
  const cur = fs.readFileSync(path.join(dir, 'snapshot.json'), 'utf8');
  stable = prev !== null && cur === prev; prev = cur;
  if (!stable) { console.log(tag, 'read', i + 1, 'not yet stable, waiting'); sleepSync(8000); }
}
if (!stable) { console.error(tag, 'WARNING: data reads never became identical, the snapshot may be incomplete'); }
const rows = JSON.parse(fs.readFileSync(path.join(dir, 'snapshot.json'), 'utf8'));
console.log(tag, 'instances', rows.length, 'data in', Math.round((Date.now() - t0) / 1000), 's');
let ids = rows.map((r) => r.id);
const pi = flags.indexOf('--png-ids'); if (pi >= 0) ids = flags[pi + 1].split(',');
const hashes = {};
if (!flags.includes('--no-png')) {
  for (let i = 0; i < ids.length; i += 60) {
    const chunk = ids.slice(i, i + 60);
    const res = JSON.parse(ev('export-png.js', { ids: chunk }));
    for (const [id, b64] of Object.entries(res)) {
      if (!b64) { hashes[id] = null; continue; }
      const buf = Buffer.from(b64, 'base64');
      fs.writeFileSync(path.join(dir, 'png', id.replace(/[:;]/g, '_') + '.png'), buf);
      hashes[id] = crypto.createHash('sha1').update(buf).digest('hex');
    }
  }
}
fs.writeFileSync(path.join(dir, 'png-hashes.json'), JSON.stringify(hashes));
console.log(tag, 'png', Object.keys(hashes).length, 'total', Math.round((Date.now() - t0) / 1000), 's');
