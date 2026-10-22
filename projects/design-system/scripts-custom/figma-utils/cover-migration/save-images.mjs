// Decode the base64 PNGs a plugin script returned ("img" or "imgs": { name: base64 }) into files.
// usage: node save-images.mjs <result.json> <out-dir> [prefix]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const [resultFile, outDir, prefix = ''] = process.argv.slice(2);
const lines = readFileSync(resultFile, 'utf8').trim().split('\n');
const data = JSON.parse(lines[lines.length - 1]);
mkdirSync(outDir, { recursive: true });
const safe = s => s.replace(/[^A-Za-z0-9._-]+/g, '_');
const items = Object.entries(data.imgs || {});
if (data.img) items.push(['preview', data.img]);
for (const [name, b64] of items) { const f = `${outDir}/${prefix}${safe(name)}.png`; writeFileSync(f, Buffer.from(b64, 'base64')); console.log('saved', f); }
if (data.texts && !Array.isArray(data.texts)) { const f = `${outDir}/${prefix}old-texts.json`; writeFileSync(f, JSON.stringify(data.texts, null, 1)); console.log('saved', f); }
