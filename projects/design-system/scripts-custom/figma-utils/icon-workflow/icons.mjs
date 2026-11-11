// icons.mjs — the one command for the icon workflow: Git → Figma → validate
// ----------------------------------------------------------------------------
// WORKFLOW: Illustrator → SVG files in Git → this script → icon components in Figma.
//
//   1. fetch     download the SVG folder of the repository (fetch-icons.mjs)
//   2. check Git validate the SVG files as they are in Git (profile git); stop on errors
//   3. export    read the icon page of the open Figma file (export-icon-set.js)
//   4. compare   validate the Figma set against the Git set: which icons differ,
//                which are missing in Figma, which exist only in Figma; the texts of the
//                icons (Figma description) are compared with the gallery file icons.ts of the
//                same commit (rules M01 to M08)
//   5. apply     (mode apply only) write the changed and the missing icons into Figma
//                (import-icons.js), then export and validate again
//
// usage:
//   node icons.mjs [options]          plan: shows what differs, writes nothing
//   node icons.mjs --apply            writes the changes into the open Figma file
//
// options:
//   --apply               write into the open Figma file (default: only show the plan)
//   --mode scan|apply     the same as above, spelled out
//   --file-key <key>      Figma file key; optional, apply refuses to write when the open file has another key
//   --yes                 apply writes into the file that is open in this run (shown in step 3)
//   --target <name>       the library the file belongs to: legacy-library or ds-library; sets the
//                         name prefix and the expected variable from the rule file
//   --cli-dir <folder>    folder to run figma-ds-cli from (or set FIGMA_DS_CLI_DIR)
//   --work <folder>       working folder for downloads, exports and reports (default ./icon-sync)
//   --page <text>         the Figma page whose name contains this text (default Icons)
//   --prefix <text>       component name prefix (default: from the target or the rule file)
//   --only <a,b,c>        sync only these icon names
//   --ref, --repo, --path as in fetch-icons.mjs
//   --gallery <path>      the gallery file in the repository (default: metadata.galleryPath of the rule file)
//   --no-gallery          do not compare the texts of the icons with the gallery file
//   --rules <file>        rule file for the validator
//   --batch <n>           icons per Figma call (default 40)
//   --force               go on although the Git files have validation errors
//
// Open the Figma file and the page first and run `figma-ds-cli daemon reconnect`
// after switching files, so that the CLI talks to the right tab. figma-ds-cli
// must be installed and Figma Desktop running.
// ----------------------------------------------------------------------------

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runNode, runFigma as runFigmaIn, generate } from './lib/figma-run.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opts = { mode: 'scan', yes: false, target: null, fileKey: null, cliDir: process.env.FIGMA_DS_CLI_DIR || process.cwd(), work: './icon-sync', page: null, prefix: null, only: null, ref: null, repo: null, path: null, gallery: null, noGallery: false, rules: null, batch: 40, force: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--mode') opts.mode = args[++i];
  else if (a === '--file-key') opts.fileKey = args[++i];
  else if (a === '--yes') opts.yes = true;
  else if (a === '--apply') { opts.mode = 'apply'; opts.yes = true; }
  else if (a === '--target') opts.target = args[++i];
  else if (a === '--cli-dir') opts.cliDir = args[++i];
  else if (a === '--work') opts.work = args[++i];
  else if (a === '--page') opts.page = args[++i];
  else if (a === '--prefix') opts.prefix = args[++i];
  else if (a === '--only') opts.only = new Set(args[++i].split(',').map((x) => x.trim()).filter(Boolean));
  else if (a === '--ref') opts.ref = args[++i];
  else if (a === '--repo') opts.repo = args[++i];
  else if (a === '--path') opts.path = args[++i];
  else if (a === '--gallery') opts.gallery = args[++i];
  else if (a === '--no-gallery') opts.noGallery = true;
  else if (a === '--rules') opts.rules = args[++i];
  else if (a === '--batch') opts.batch = Number(args[++i]);
  else if (a === '--force') opts.force = true;
  else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').reduce((acc, l) => (acc.stop || !l.startsWith('//') ? { ...acc, stop: true } : { ...acc, out: [...acc.out, l.replace(/^\/\/ ?/, '')] }), { out: [], stop: false }).out.join('\n')); process.exit(0); }
  else { console.error(`unknown option ${a}`); process.exit(2); }
}
if (!['scan', 'apply'].includes(opts.mode)) { console.error('--mode is scan or apply'); process.exit(2); }
if (opts.mode === 'apply' && !opts.fileKey && !opts.yes) { console.error('apply writes into the open Figma file: add --yes to confirm, or --file-key <key> to name the file'); process.exit(2); }

// the name prefix and the page come from the target in the rule file; nothing is tied to one file
const rulesFile = opts.rules || join(HERE, 'icon-set-rules.json');
let ruleSet = {};
try { ruleSet = JSON.parse(readFileSync(rulesFile, 'utf8')); } catch { ruleSet = {}; }
const targetRules = opts.target ? (ruleSet.targets || {})[opts.target] : null;
if (opts.target && !targetRules) { console.error(`unknown target ${opts.target}; the rule file knows: ${Object.keys(ruleSet.targets || {}).join(', ') || 'none'}`); process.exit(2); }
opts.prefix = opts.prefix || (targetRules && targetRules.namePrefix) || ruleSet.namePrefix || 'icon/';
opts.page = opts.page || (targetRules && targetRules.page) || ruleSet.page || 'Icons';
const targetArg = opts.target ? ['--target', opts.target] : [];

const work = resolve(opts.work);
mkdirSync(work, { recursive: true });
const gitDir = join(work, 'git');
// the gallery file with the texts of the icons: path in the repository, local copy next to the SVG folder
const galleryPath = opts.noGallery ? null : (opts.gallery || (ruleSet.metadata && ruleSet.metadata.galleryPath) || null);
const galleryFile = join(work, 'icons-gallery.ts');
const step = (n, text) => console.log(`\n[${n}] ${text}`);
const fail = (msg) => { console.error(`\nerror: ${msg}`); process.exit(1); };

const runFigma = (scriptFile) => runFigmaIn(scriptFile, opts.cliDir);

function summary(out) {
  return out.split('\n').filter((l) => /^(Profile:|ERROR|WARN |Result:|  against reference)/.test(l)).join('\n');
}

function exportFigma(name) {
  const script = generate('export-icon-set.js', { pageName: opts.page, namePrefix: opts.prefix }, join(work, `${name}.generated.js`));
  const json = runFigma(script);
  const data = JSON.parse(json);
  if (!data.ok) throw new Error(`the export reports a problem: ${data.reason || json.slice(0, 200)}`);
  writeFileSync(join(work, `${name}.json`), json);
  return data;
}

function compare(exportFile, tag) {
  const rulesArg = opts.rules ? ['--rules', opts.rules] : [];
  const galleryArg = galleryPath ? ['--gallery', galleryFile] : [];
  const r = runNode('validate-icon-set.mjs', [exportFile, '--against', gitDir, ...galleryArg, '--all', '--json', join(work, `${tag}.json`), ...rulesArg, ...targetArg]);
  writeFileSync(join(work, `${tag}.txt`), r.out);
  const result = JSON.parse(readFileSync(join(work, `${tag}.json`), 'utf8'));
  return { status: r.status, text: r.out, findings: result.findings };
}

// ---------------------------------------------------------------- 1 fetch
step(1, 'fetch the SVG files from Git');
const fetchArgs = ['--out', gitDir];
for (const k of ['ref', 'repo', 'path']) if (opts[k]) fetchArgs.push(`--${k}`, opts[k]);
if (galleryPath) fetchArgs.push('--gallery', galleryPath, '--gallery-out', galleryFile);
const fetched = runNode('fetch-icons.mjs', fetchArgs);
console.log(fetched.out.trim());
if (fetched.status !== 0) fail('the download failed');

// ---------------------------------------------------------------- 2 check Git
step(2, 'validate the SVG files in Git (profile git)');
const rulesArg = opts.rules ? ['--rules', opts.rules] : [];
const gitCheck = runNode('validate-icon-set.mjs', [gitDir, '--json', join(work, 'git-validation.json'), '--all', ...rulesArg, ...targetArg]);
writeFileSync(join(work, 'git-validation.txt'), gitCheck.out);
console.log(summary(gitCheck.out));
if (gitCheck.status === 2) fail(gitCheck.out.trim());
if (gitCheck.status !== 0 && !opts.force) fail(`the Git files have validation errors, see ${join(work, 'git-validation.txt')} (--force goes on anyway)`);

// ---------------------------------------------------------------- 3 export
step(3, 'export the icon page from Figma');
let before;
try { before = exportFigma('figma-export'); } catch (e) { fail(e.message); }
console.log(`${before.count} icons in "${before.source.file}" / "${before.source.page}" (file key ${before.source.fileKey})${opts.target ? `, target ${opts.target}, prefix ${opts.prefix}` : ''}`);
if (!opts.target) {
  const counts = Object.entries(ruleSet.targets || {}).map(([name, t]) => [name, before.icons.filter((i) => i.name.startsWith(t.namePrefix)).length]).sort((a, b) => b[1] - a[1]);
  if (counts.length && counts[0][1] > 0 && (counts.length === 1 || counts[0][1] > counts[1][1])) {
    opts.target = counts[0][0];
    opts.prefix = ruleSet.targets[opts.target].namePrefix;
    targetArg.push('--target', opts.target);
    console.log(`target ${opts.target} (found from the icon names, prefix ${opts.prefix})`);
  }
}
if (opts.mode === 'apply' && opts.fileKey && before.source.fileKey !== opts.fileKey) fail(`refusing to write: the open file is ${before.source.fileKey}, --file-key says ${opts.fileKey}`);

// ---------------------------------------------------------------- 4 compare
step(4, 'validate the Figma set against Git');
const first = compare(join(work, 'figma-export.json'), 'compare-before');
console.log(summary(first.text));
const names = (rule) => [...new Set(first.findings.filter((f) => f.rule === rule).map((f) => f.icon))].filter((n) => !opts.only || opts.only.has(n));
const update = names('S16');
const create = names('N10');
const orphans = names('N11');
const list = (a) => (a.length ? ` ${a.slice(0, 30).join(', ')}${a.length > 30 ? ` and ${a.length - 30} more` : ''}` : '');
console.log(`\nPlan: ${update.length} to update,${list(update)}`);
console.log(`      ${create.length} to create,${list(create)}`);
console.log(`      ${orphans.length} only in Figma (never deleted),${list(orphans)}`);
if (galleryPath) {
  // the texts of the icons, in plain words (rules M01 to M08 of the validator)
  const WORDS = { M01: 'a category outside the 12', M02: 'a repeated or empty keyword', M04: 'a purpose type that is not single or multi', M06: 'texts that differ from the gallery file', M07: 'no entry in the gallery file (or an entry without icon)', M08: 'several keywords in one text of the gallery file' };
  const meta = (rule) => [...new Set(first.findings.filter((f) => f.rule === rule).map((f) => f.icon))];
  const parts = Object.keys(WORDS).map((r) => [r, meta(r).length]).filter(([, n]) => n).map(([r, n]) => `${n} with ${WORDS[r]} (${r})`);
  const open = Math.max(meta('M03').length, meta('M05').length);
  console.log(`Texts: ${parts.length ? parts.join('; ') : 'the descriptions equal the gallery file'}${open ? `; the lines "Purpose type" and "Description" are not written yet in ${open} icons (write-metadata.mjs)` : ''}`);
}

const icons = {};
for (const n of update) icons[n] = { action: 'update', svg: readFileSync(join(gitDir, `${n}.svg`), 'utf8') };
for (const n of create) icons[n] = { action: 'create', svg: readFileSync(join(gitDir, `${n}.svg`), 'utf8') };

// ---------------------------------------------------------------- 5 apply (or the dry check)
const all = Object.keys(icons);
const done = [];
if (all.length) {
  step(5, opts.mode === 'apply' ? 'write the changes into Figma' : 'check that the changes can be written (nothing is written)');
  for (let k = 0; k < all.length; k += opts.batch) {
    const batch = Object.fromEntries(all.slice(k, k + opts.batch).map((n) => [n, icons[n]]));
    const script = generate('import-icons.js', { mode: opts.mode, fileKeyGuard: opts.fileKey || before.source.fileKey, pageName: opts.page, namePrefix: opts.prefix, restorePoint: k === 0, icons: batch }, join(work, `import-${k / opts.batch + 1}.generated.js`));
    let res;
    try { res = JSON.parse(runFigma(script)); } catch (e) { fail(e.message); }
    if (!res.ok) fail(`the import reports a problem: ${res.reason}`);
    for (const r of res.results) { done.push(r); console.log(`  ${r.status.padEnd(12)} ${r.name}${r.reason ? `: ${r.reason}` : ''}`); }
  }
  writeFileSync(join(work, 'import-results.json'), JSON.stringify(done, null, 2));
} else {
  step(5, 'nothing to write');
}

if (opts.mode === 'scan') {
  const bad = done.filter((r) => r.status === 'error').length;
  console.log(`\nScan done. Run with --apply to write into this file${all.length ? '' : ' (nothing differs)'}.`);
  process.exit(bad ? 1 : 0);
}

// ---------------------------------------------------------------- 6 validate again
step(6, 'export again and validate against Git');
let after;
try { after = exportFigma('figma-export-after'); } catch (e) { fail(e.message); }
const second = compare(join(work, 'figma-export-after.json'), 'compare-after');
console.log(summary(second.text));
const remaining = second.findings.filter((f) => ['S16', 'N10'].includes(f.rule)).length;
const errors = done.filter((r) => r.status === 'error').length;
console.log(`\n${done.filter((r) => ['updated', 'created'].includes(r.status)).length} icons written, ${errors} errors, ${remaining} icons still differ from Git. Report: ${join(work, 'compare-after.txt')}`);
process.exit(errors || remaining ? 1 : second.status);
