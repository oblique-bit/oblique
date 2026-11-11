// changelog.mjs — list what changed in the icon set between two releases (the changelog per release)
// ----------------------------------------------------------------------------
// WHY: the changelog per release was written by hand (decided on 2026-11-10: generate it by a script). The command reads two
// states of the set from Git and lists the changes in the words of the Confluence table: Added icon, Changed name,
// Changed icon. It lists Changed texts and Removed icon too (see lib/changelog.mjs for what each one means).
//
//   1. fetch     both states: the SVG files and the gallery file icons.ts of the two Git refs (each pinned to one commit)
//   2. compare   names (added, removed, renamed: through the old name of the gallery entry or the same file content), shapes
//                (the validator, rule S16; a renamed icon is compared under its old name), texts (the fields of the gallery entries)
//   3. write     changelog-<from>-to-<to>.md and .csv into --out (the csv has one row per icon and change)
//
// usage:
//   node changelog.mjs --from <ref> [--to <ref>] [options]
//   node changelog.mjs --from 16.0.0 --to 16.0.4
//
// options:
//   --from <ref>          the older state: a tag, a branch or a commit (required)
//   --to <ref>            the newer state (default master)
//   --out <folder>        where the files go (default ./icon-changelog)
//   --work <folder>       working folder for downloads and reports (default ./icon-sync)
//   --repo <owner/name>, --path <folder>, --token <token>   as in lib/fetch-icons.mjs
//   --gallery <path>      the gallery file in the repository (default: metadata.galleryPath of the rule file)
//   --no-gallery          compare the SVG files only (no renames, no texts)
//   --rules <file>        rule file for the validator
//
// It reads Git over the network and writes only into --out and --work; it does not touch Figma. A ref that has no gallery
// file is compared by its SVG files only (renames are then found by the file content alone, texts are not compared).
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runNode } from './lib/figma-run.mjs';
import { parseGalleryFile } from './lib/metadata.mjs';
import { classify, textChanges, renderMarkdown, renderCsv } from './lib/changelog.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opts = { from: null, to: 'master', out: './icon-changelog', work: './icon-sync', repo: null, path: null, token: null, gallery: null, noGallery: false, rules: null };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--from') opts.from = args[++i];
  else if (a === '--to') opts.to = args[++i];
  else if (a === '--out') opts.out = args[++i];
  else if (a === '--work') opts.work = args[++i];
  else if (a === '--repo') opts.repo = args[++i];
  else if (a === '--path') opts.path = args[++i];
  else if (a === '--token') opts.token = args[++i];
  else if (a === '--gallery') opts.gallery = args[++i];
  else if (a === '--no-gallery') opts.noGallery = true;
  else if (a === '--rules') opts.rules = args[++i];
  else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').reduce((acc, l) => (acc.stop || !l.startsWith('//') ? { ...acc, stop: true } : { ...acc, out: [...acc.out, l.replace(/^\/\/ ?/, '')] }), { out: [], stop: false }).out.join('\n')); process.exit(0); }
  else { console.error(`unknown option ${a}`); process.exit(2); }
}

const fail = (msg) => { console.error(`\nerror: ${msg}`); process.exit(1); };
if (!opts.from) { console.error('usage: node changelog.mjs --from <ref> [--to <ref>] [options]\nexample: node changelog.mjs --from 16.0.0 --to 16.0.4\n(a ref is a tag, a branch or a commit; --help lists the options)'); process.exit(2); }
if (opts.from === opts.to) fail('--from and --to are the same ref');

const rulesFile = opts.rules || join(HERE, 'icon-set-rules.json');
let ruleSet = {};
try { ruleSet = JSON.parse(readFileSync(rulesFile, 'utf8')); } catch { ruleSet = {}; }
const galleryPath = opts.noGallery ? null : (opts.gallery || (ruleSet.metadata && ruleSet.metadata.galleryPath) || null);
const work = resolve(opts.work);
const safe = (ref) => ref.replace(/[^A-Za-z0-9._-]+/g, '_');
const step = (n, text) => console.log(`\n[${n}] ${text}`);
const list = (a, max = 8) => (a.length ? ` ${a.slice(0, max).join(', ')}${a.length > max ? ` and ${a.length - max} more` : ''}` : '');

// ---------------------------------------------------------------- 1 fetch
// the folder of a state is made new every time: fetch-icons.mjs does not delete, a file that left the ref would stay
function fetchState(ref) {
  const dir = join(work, 'changelog', safe(ref));
  const galleryFile = join(work, 'changelog', `${safe(ref)}-gallery.ts`);
  rmSync(dir, { recursive: true, force: true });
  rmSync(galleryFile, { force: true });
  const base = ['--out', dir, '--ref', ref];
  for (const k of ['repo', 'path', 'token']) if (opts[k]) base.push(`--${k}`, opts[k]);
  let withGallery = Boolean(galleryPath), note = null;
  let r = runNode('fetch-icons.mjs', withGallery ? [...base, '--gallery', galleryPath, '--gallery-out', galleryFile] : base);
  if (r.status !== 0 && withGallery && /gallery file .* does not exist/.test(r.out)) {
    r = runNode('fetch-icons.mjs', base);
    withGallery = false;
    note = `there is no gallery file at ${ref}`;
  }
  console.log(r.out.trim());
  if (r.status !== 0) fail(`the download of ${ref} failed`);
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const files = new Map(manifest.files.map((f) => [basename(f.file).replace(/\.svg$/i, ''), f.file]));
  const blobs = new Map(manifest.files.map((f) => [basename(f.file).replace(/\.svg$/i, ''), f.blob]));
  const seenLower = new Set();
  for (const n of files.keys()) {
    if (seenLower.has(n.toLowerCase())) fail(`two SVG files of ${ref} differ only by case (${n}): a case-insensitive file system cannot hold both`);
    seenLower.add(n.toLowerCase());
  }
  return { ref, dir, manifest, files, blobs, names: new Set(files.keys()), gallery: withGallery ? parseGalleryFile(readFileSync(galleryFile, 'utf8')) : null, note };
}
step(1, `fetch the older state (${opts.from}) and the newer state (${opts.to}) from Git`);
const older = fetchState(opts.from), newer = fetchState(opts.to);
const notes = [];
if (!opts.noGallery) {
  if (older.note) notes.push(`${older.note}: the texts of the older state are not compared`);
  if (newer.note) notes.push(`${newer.note}: renames are found by the file content only; the texts are not compared`);
}
if (opts.noGallery) notes.push('compared without the gallery file (--no-gallery): renames and texts are not listed');

// ---------------------------------------------------------------- 2 compare
step(2, 'compare names, shapes and texts');
const cls = classify(older.names, newer.names, newer.gallery, { from: older.blobs, to: newer.blobs });
console.log(`${older.names.size} icons in ${older.ref}, ${newer.names.size} in ${newer.ref}: ${cls.added.length} added, ${cls.renamed.length} renamed, ${cls.removed.length} removed`);

// The validator compares two folders by file name. Every icon gets one key that is the same in both folders (a renamed icon
// has its old file in the older folder and its new file in the newer one under the same key). Names cannot be used: names
// that differ only by case (13.2.0 Stop, 14.0.0 stop) would be one file on a case-insensitive file system.
const items = [
  ...cls.common.map((n) => ({ a: n, b: n })),
  ...cls.renamed.map((r) => ({ a: r.from, b: r.to })),
  ...cls.removed.map((n) => ({ a: n, b: null })),
  ...cls.added.map((n) => ({ a: null, b: n })),
].map((it, i) => ({ ...it, key: `i${String(i).padStart(4, '0')}` }));
const compareDir = (label) => join(work, 'changelog', `compare-${label}`);
for (const d of [compareDir('older'), compareDir('newer')]) { rmSync(d, { recursive: true, force: true }); mkdirSync(d, { recursive: true }); }
for (const it of items) {
  if (it.a) copyFileSync(join(older.dir, older.files.get(it.a)), join(compareDir('older'), `${it.key}.svg`));
  if (it.b) copyFileSync(join(newer.dir, newer.files.get(it.b)), join(compareDir('newer'), `${it.key}.svg`));
}
const jsonFile = join(work, 'changelog', 'shape-compare.json');
const v = runNode('validate-icon-set.mjs', [compareDir('newer'), '--profile', 'git', '--against', compareDir('older'), '--all', '--json', jsonFile, ...(opts.rules ? ['--rules', opts.rules] : [])]);
if (v.status === 2) fail(v.out.trim());
const findings = JSON.parse(readFileSync(jsonFile, 'utf8')).findings;
const byKey = new Map(items.map((it) => [it.key, it]));
const shapeChanged = findings.filter((f) => f.rule === 'S16').map((f) => {
  const m = /up to ([0-9.]+) px/.exec(f.message);
  return { name: byKey.get(f.icon).b, detail: m ? `shape differs by up to ${m[1]} px` : 'shape differs' };
}).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
// the validator must find the same added and removed icons as the names do
const keysOf = (rule) => findings.filter((f) => f.rule === rule).map((f) => f.icon).sort();
const keysWhere = (pred) => items.filter(pred).map((it) => it.key).sort();
if (JSON.stringify(keysOf('N10')) !== JSON.stringify(keysWhere((it) => !it.b)) || JSON.stringify(keysOf('N11')) !== JSON.stringify(keysWhere((it) => !it.a))) notes.push('the validator and the names disagree about added or removed icons');

// texts: the fields of the gallery entries of icons that exist in both states (a renamed icon by its two names)
const textsChanged = [];
if (older.gallery && newer.gallery) {
  const pairs = [...cls.common.map((n) => [n, n]), ...cls.renamed.map((r) => [r.from, r.to])];
  let noEntry = 0;
  for (const [a, b] of pairs) {
    const ea = older.gallery.get(a), eb = newer.gallery.get(b);
    if (!ea || !eb) { noEntry++; continue; }
    let fields = textChanges(ea, eb);
    if (a !== b) fields = fields.filter((f) => f !== 'old name');
    if (fields.length) textsChanged.push({ name: b, fields });
  }
  textsChanged.sort((x, y) => (x.name < y.name ? -1 : x.name > y.name ? 1 : 0));
  if (noEntry) notes.push(`${noEntry} icons have no gallery entry in one of the two states: their texts are not compared`);
}

const report = {
  from: { ref: older.ref, commit: older.manifest.commit, date: older.manifest.commitDate, count: older.names.size },
  to: { ref: newer.ref, commit: newer.manifest.commit, date: newer.manifest.commitDate, count: newer.names.size },
  added: cls.added.map((n) => { const e = newer.gallery && newer.gallery.get(n); return { name: n, category: e ? e.category : '', purposeType: e ? e.purposeType : '', usage: e ? e.usage : '' }; }),
  renamed: cls.renamed,
  shapeChanged,
  textsChanged,
  removed: cls.removed,
  notes,
};
console.log(`Added icons: ${report.added.length}${list(report.added.map((a) => a.name))}`);
console.log(`Changed names: ${report.renamed.length}${list(report.renamed.map((r) => `${r.from} → ${r.to}`))}`);
console.log(`Changed icons: ${report.shapeChanged.length}${list(report.shapeChanged.map((s) => s.name))}`);
console.log(`Changed texts: ${report.textsChanged.length}${list(report.textsChanged.map((t) => t.name))}`);
console.log(`Removed icons: ${report.removed.length}${list(report.removed)}`);
for (const n of notes) console.log(`Note: ${n}`);

// ---------------------------------------------------------------- 3 write
step(3, 'write the changelog');
const out = resolve(opts.out);
mkdirSync(out, { recursive: true });
const stem = join(out, `changelog-${safe(opts.from)}-to-${safe(opts.to)}`);
writeFileSync(`${stem}.md`, renderMarkdown(report));
writeFileSync(`${stem}.csv`, renderCsv(report));
writeFileSync(join(work, 'changelog', 'report.json'), JSON.stringify(report, null, 2));
console.log(`${stem}.md\n${stem}.csv`);
