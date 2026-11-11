// write-metadata.mjs — copy the texts of the gallery file into the Figma component descriptions (one time)
// ----------------------------------------------------------------------------
// WHY: decided on 2026-11-10 and 2026-11-11: the Figma component description holds all texts of an icon, so it
// gets new lines next to Category and Keywords:
//     Purpose type: single | multi
//     Description: <neutral text about the shape>
//     Old name: <name before a rename>                      (only for renamed icons)
//     Deprecated purpose: <what the icon showed before>     (only where the gallery has one: headphones, id-card)
// The texts exist today in the SDS gallery file icons.ts, written by hand. This command copies them into
// the descriptions of the open Figma file. Afterwards the designers edit the lines in Figma, and the
// gallery file is written from them (Export).
//
// WHAT IT CHANGES: only the description of icon components, and only by adding the lines that are
// missing. The existing text stays as it is. Nothing is deleted. Running it twice changes nothing.
//
//   1. fetch     the gallery file icons.ts of the repository (or your own copy: --gallery <file>)
//   2. export    the descriptions of the icon page of the open Figma file (no SVG, fast)
//   3. plan      per icon: which lines would be added; icons without a gallery entry or without a
//                usable text are listed, never guessed
//   4. check     the same plan in Figma without writing (every component found, description unchanged)
//   5. apply     (mode apply only) saves a restore point in the version history, writes, exports again
//                and compares with the gallery file
//
// usage:
//   node write-metadata.mjs [options]          plan: shows what would be written, writes nothing
//   node write-metadata.mjs --apply            writes into the open Figma file
//
// options:
//   --apply               write into the open Figma file (default: only show the plan)
//   --yes                 apply writes into the file that is open in this run (shown in step 2)
//   --file-key <key>      Figma file key; optional, apply refuses to write when the open file has another key
//   --gallery <file>      your own copy of icons.ts; default: downloaded from the repository
//   --figma <export.json> plan from this export instead of the open file (nothing is written)
//   --only <a,b,c>        these icon names only
//   --page <text>         the Figma page whose name contains this text (default Icons)
//   --prefix <text>       component name prefix (default: from the rule file)
//   --target <name>       the library the file belongs to: legacy-library or ds-library
//   --cli-dir <folder>    folder to run figma-ds-cli from (or set FIGMA_DS_CLI_DIR)
//   --work <folder>       working folder for downloads and reports (default ./icon-sync)
//   --ref, --repo         as in fetch-icons.mjs
//   --rules <file>        rule file
//   --batch <n>           icons per Figma call (default 100)
//
// Open the Figma file and the page first and run `figma-ds-cli daemon reconnect` after switching
// files, so that the CLI talks to the right tab. figma-ds-cli must be installed and Figma Desktop running.
// ----------------------------------------------------------------------------

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runNode, runFigma as runFigmaIn, generate } from './lib/figma-run.mjs';
import { parseGalleryFile, withNewLines, compareMetadata } from './lib/metadata.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opts = { mode: 'scan', yes: false, fileKey: null, gallery: null, figma: null, only: null, page: null, prefix: null, target: null, cliDir: process.env.FIGMA_DS_CLI_DIR || process.cwd(), work: './icon-sync', ref: null, repo: null, rules: null, batch: 100 };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--apply') { opts.mode = 'apply'; opts.yes = true; }
  else if (a === '--yes') opts.yes = true;
  else if (a === '--file-key') opts.fileKey = args[++i];
  else if (a === '--gallery') opts.gallery = args[++i];
  else if (a === '--figma') opts.figma = args[++i];
  else if (a === '--only') opts.only = new Set(args[++i].split(',').map((x) => x.trim()).filter(Boolean));
  else if (a === '--page') opts.page = args[++i];
  else if (a === '--prefix') opts.prefix = args[++i];
  else if (a === '--target') opts.target = args[++i];
  else if (a === '--cli-dir') opts.cliDir = args[++i];
  else if (a === '--work') opts.work = args[++i];
  else if (a === '--ref') opts.ref = args[++i];
  else if (a === '--repo') opts.repo = args[++i];
  else if (a === '--rules') opts.rules = args[++i];
  else if (a === '--batch') opts.batch = Number(args[++i]);
  else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').reduce((acc, l) => (acc.stop || !l.startsWith('//') ? { ...acc, stop: true } : { ...acc, out: [...acc.out, l.replace(/^\/\/ ?/, '')] }), { out: [], stop: false }).out.join('\n')); process.exit(0); }
  else { console.error(`unknown option ${a}`); process.exit(2); }
}
if (opts.mode === 'apply' && opts.figma) { console.error('--figma is for the plan only: apply reads the open file'); process.exit(2); }
if (opts.mode === 'apply' && !opts.fileKey && !opts.yes) { console.error('apply writes into the open Figma file: add --yes to confirm, or --file-key <key> to name the file'); process.exit(2); }

const rulesFile = opts.rules || join(HERE, 'icon-set-rules.json');
let ruleSet = {};
try { ruleSet = JSON.parse(readFileSync(rulesFile, 'utf8')); } catch { ruleSet = {}; }
const targetRules = opts.target ? (ruleSet.targets || {})[opts.target] : null;
if (opts.target && !targetRules) { console.error(`unknown target ${opts.target}; the rule file knows: ${Object.keys(ruleSet.targets || {}).join(', ') || 'none'}`); process.exit(2); }
opts.prefix = opts.prefix || (targetRules && targetRules.namePrefix) || ruleSet.namePrefix || 'icon/';
opts.page = opts.page || (targetRules && targetRules.page) || ruleSet.page || 'Icons';

const work = resolve(opts.work);
mkdirSync(work, { recursive: true });
const step = (n, text) => console.log(`\n[${n}] ${text}`);
const fail = (msg) => { console.error(`\nerror: ${msg}`); process.exit(1); };
const runFigma = (scriptFile) => runFigmaIn(scriptFile, opts.cliDir);
const shortName = (name) => (name.toLowerCase().startsWith(opts.prefix.toLowerCase()) ? name.slice(opts.prefix.length) : name);
const list = (a, max = 12) => (a.length ? ` ${a.slice(0, max).join(', ')}${a.length > max ? ` and ${a.length - max} more` : ''}` : '');

function exportDescriptions(name) {
  const script = generate('export-icon-set.js', { pageName: opts.page, namePrefix: opts.prefix, includeSvg: false }, join(work, `${name}.generated.js`));
  const json = runFigma(script);
  const data = JSON.parse(json);
  if (!data.ok) throw new Error(`the export reports a problem: ${data.reason || json.slice(0, 200)}`);
  writeFileSync(join(work, `${name}.json`), json);
  return data;
}

// ---------------------------------------------------------------- 1 the gallery file
step(1, 'read the gallery file icons.ts');
let galleryFile = opts.gallery ? resolve(opts.gallery) : join(work, 'icons-gallery.ts');
if (opts.gallery) {
  if (!existsSync(galleryFile)) fail(`${galleryFile} does not exist`);
  console.log(`own copy ${galleryFile}`);
} else {
  const galleryPath = ruleSet.metadata && ruleSet.metadata.galleryPath;
  if (!galleryPath) fail('the rule file has no metadata.galleryPath: pass --gallery <icons.ts>');
  const fetchArgs = ['--out', join(work, 'git'), '--gallery', galleryPath, '--gallery-out', galleryFile];
  for (const k of ['ref', 'repo']) if (opts[k]) fetchArgs.push(`--${k}`, opts[k]);
  const fetched = runNode('fetch-icons.mjs', fetchArgs);
  console.log(fetched.out.trim());
  if (fetched.status !== 0) fail('the download failed');
}
const gallery = parseGalleryFile(readFileSync(galleryFile, 'utf8'));
if (!gallery.size) fail(`no icon entry found in ${galleryFile}`);
console.log(`${gallery.size} entries`);

// ---------------------------------------------------------------- 2 the Figma descriptions
step(2, opts.figma ? `read the export ${opts.figma}` : 'export the descriptions from Figma');
let before;
try { before = opts.figma ? JSON.parse(readFileSync(resolve(opts.figma), 'utf8')) : exportDescriptions('descriptions-before'); } catch (e) { fail(e.message); }
if (!before.icons) fail('the export has no icons');
const source = before.source || { file: '(export file)', page: '', fileKey: null };
console.log(`${before.icons.length} icons in "${source.file}" / "${source.page}"${source.fileKey ? ` (file key ${source.fileKey})` : ''}`);
if (opts.mode === 'apply' && opts.fileKey && source.fileKey !== opts.fileKey) fail(`refusing to write: the open file is ${source.fileKey}, --file-key says ${opts.fileKey}`);

// ---------------------------------------------------------------- 3 plan
step(3, 'plan: which lines would be added');
const items = {};
const counts = { 'Purpose type': 0, Description: 0, 'Old name': 0, 'Deprecated purpose': 0 };
const complete = [], noEntry = [], skipped = [];
for (const icon of before.icons) {
  const short = shortName(icon.name);
  if (opts.only && !opts.only.has(short)) continue;
  const g = gallery.get(short);
  if (!g) { noEntry.push(short); continue; }
  const r = withNewLines(icon.description, g);
  if (r.skipped.length) skipped.push(`${short}: ${r.skipped.join(', ')}`);
  if (!r.text) { if (!r.skipped.length) complete.push(short); continue; }
  items[short] = { expected: icon.description, description: r.text };
  for (const k of r.added) counts[k]++;
}
const names = Object.keys(items);
console.log(`${names.length} icons get lines: Purpose type ${counts['Purpose type']}, Description ${counts.Description}, Old name ${counts['Old name']}, Deprecated purpose ${counts['Deprecated purpose']}`);
console.log(`${complete.length} icons have all their lines already`);
console.log(`${noEntry.length} icons without a gallery entry (left alone),${list(noEntry)}`);
console.log(`${skipped.length} icons where the gallery cannot give a line (left alone),${list(skipped, 6)}`);
const planFile = join(work, 'metadata-plan.json');
writeFileSync(planFile, JSON.stringify({ gallery: galleryFile, source, items }, null, 2));
const examples = [...new Set([names.find((n) => items[n].description.includes('Old name:')), names.find((n) => items[n].description.includes('Deprecated purpose:')), names[0]].filter(Boolean))].slice(0, 2);
for (const example of examples) console.log(`\nExample, ${example}:\n${items[example].description.split('\n').map((l) => `    | ${l}`).join('\n')}`);
console.log(`\nPlan file: ${planFile}`);

// ---------------------------------------------------------------- 4 check in Figma, 5 apply
const run = (mode, batchItems, firstBatch) => {
  const script = generate('write-descriptions.js', { mode, fileKeyGuard: opts.fileKey || source.fileKey, pageName: opts.page, namePrefix: opts.prefix, restorePoint: firstBatch, label: 'Before icon metadata', items: batchItems }, join(work, `write-descriptions-${mode}.generated.js`));
  const res = JSON.parse(runFigma(script));
  if (!res.ok) throw new Error(`the write script reports a problem: ${res.reason}`);
  return res.results;
};
const tally = (results) => results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});

if (!names.length) {
  console.log('\nNothing to write.');
  process.exit(0);
}
if (opts.figma) {
  console.log('\nPlan from an export file: nothing was checked in Figma and nothing was written.');
  process.exit(0);
}

step(4, 'check in Figma (nothing is written)');
let results = [];
try {
  for (let k = 0; k < names.length; k += opts.batch) results.push(...run('scan', Object.fromEntries(names.slice(k, k + opts.batch).map((n) => [n, items[n]])), false));
} catch (e) { fail(e.message); }
const scanned = tally(results);
console.log(Object.entries(scanned).map(([s, n]) => `${n} ${s}`).join(', '));
const notOk = results.filter((r) => r.status !== 'would-write');
for (const r of notOk.slice(0, 12)) console.log(`  ${r.status.padEnd(12)} ${r.name}: ${r.reason}`);
if (opts.mode === 'scan') {
  console.log(`\nPlan done. Run with --apply to write into this file${notOk.length ? ` (${notOk.length} icons would be skipped)` : ''}.`);
  process.exit(notOk.length ? 1 : 0);
}

step(5, 'write into Figma');
const ready = names.filter((n) => results.find((r) => r.name === n && r.status === 'would-write'));
const written = [];
try {
  for (let k = 0; k < ready.length; k += opts.batch) written.push(...run('apply', Object.fromEntries(ready.slice(k, k + opts.batch).map((n) => [n, items[n]])), k === 0));
} catch (e) { fail(e.message); }
writeFileSync(join(work, 'metadata-write-results.json'), JSON.stringify(written, null, 2));
console.log(Object.entries(tally(written)).map(([s, n]) => `${n} ${s}`).join(', '));
for (const r of written.filter((x) => x.status !== 'written').slice(0, 12)) console.log(`  ${r.status.padEnd(12)} ${r.name}: ${r.reason}`);

step(6, 'export again and compare with the gallery file');
let after;
try { after = exportDescriptions('descriptions-after'); } catch (e) { fail(e.message); }
const cmp = compareMetadata(new Map(after.icons.map((i) => [shortName(i.name), i.description])), gallery);
console.log(`new lines still missing: Purpose type ${cmp.notYetWritten.purposeType.length}, Description ${cmp.notYetWritten.description.length}`);
console.log(`texts that differ from the gallery file: ${cmp.diffs.length}${cmp.diffs.length ? ` (${[...new Set(cmp.diffs.map((d) => d.name))].slice(0, 8).join(', ')})` : ''}`);
const bad = written.filter((r) => r.status !== 'written').length;
console.log(`\n${written.filter((r) => r.status === 'written').length} descriptions written, ${bad} not written. The restore point is "Before icon metadata" in the version history of the file.`);
process.exit(bad ? 1 : 0);
