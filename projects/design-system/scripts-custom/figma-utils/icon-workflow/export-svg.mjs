// export-svg.mjs — write the icons of the open Figma file as SVG files in the format of the Git set (Export)
// ----------------------------------------------------------------------------
// WHY: from the first publish the Figma library leads and Git follows (board "Icons Workflows", Case 0). The DS Developers
// receive SVG files that are ready for update-icons.ts. Decided on 2026-11-11: the build adds the id of an icon, the export
// writes no id and removes what the build would keep: width, height and the fills (see lib/normalize-svg.mjs).
//
//   1. fetch      the SVG files of the repository, pinned to one commit (the reference)       (skipped with --no-git or --git)
//   2. export     the icon page of the open Figma file, with the SVG of every icon
//   3. normalize  Figma format → Git format without id; an icon that cannot be normalized is reported, never guessed
//   4. check      the SVG file check on the normalized files (profile export) and the comparison with the reference
//   5. choose     by default only the icons that changed or are new (Git then sees a small difference); --all = every icon
//   6. write      the files into --out, optionally one zip; errors of the check stop the export (--force goes on)
//
// usage:
//   node export-svg.mjs --cli-dir <figma-cli folder> [options]
//
// options:
//   --out <folder>        where the SVG files go (default ./icon-export)
//   --all                 write every icon, not only the changed and the new ones (Case 0: the whole set)
//   --zip                 also write <out>.zip with the files (needs the zip command)
//   --only <a,b,c>        these icon names only
//   --no-git              do not compare with Git (implies --all)
//   --git <folder>        use this folder of SVG files as the reference instead of downloading
//   --target <name>       the library the file belongs to: legacy-library or ds-library
//   --page <text>         the Figma page whose name contains this text (default Icons)
//   --prefix <text>       component name prefix (default: from the target or the rule file)
//   --cli-dir <folder>    folder to run figma-ds-cli from (or set FIGMA_DS_CLI_DIR)
//   --work <folder>       working folder for downloads, exports and reports (default ./icon-sync)
//   --ref, --repo, --path as in fetch-icons.mjs
//   --rules <file>        rule file for the validator
//   --force               write the files although the check found errors
//
// The Figma tab of the file must be in front (Figma does not draw a tab in the background, and the SVG export waits for that).
// Open the file and run `figma-ds-cli daemon reconnect` after switching files. No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runNode, runFigma as runFigmaIn, generate } from './lib/figma-run.mjs';
import { normalizeSvg } from './lib/normalize-svg.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opts = { out: './icon-export', all: false, zip: false, only: null, noGit: false, git: null, target: null, page: null, prefix: null, cliDir: process.env.FIGMA_DS_CLI_DIR || process.cwd(), work: './icon-sync', ref: null, repo: null, path: null, rules: null, force: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') opts.out = args[++i];
  else if (a === '--all') opts.all = true;
  else if (a === '--zip') opts.zip = true;
  else if (a === '--only') opts.only = new Set(args[++i].split(',').map((x) => x.trim()).filter(Boolean));
  else if (a === '--no-git') { opts.noGit = true; opts.all = true; }
  else if (a === '--git') opts.git = args[++i];
  else if (a === '--target') opts.target = args[++i];
  else if (a === '--page') opts.page = args[++i];
  else if (a === '--prefix') opts.prefix = args[++i];
  else if (a === '--cli-dir') opts.cliDir = args[++i];
  else if (a === '--work') opts.work = args[++i];
  else if (a === '--ref') opts.ref = args[++i];
  else if (a === '--repo') opts.repo = args[++i];
  else if (a === '--path') opts.path = args[++i];
  else if (a === '--rules') opts.rules = args[++i];
  else if (a === '--force') opts.force = true;
  else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').reduce((acc, l) => (acc.stop || !l.startsWith('//') ? { ...acc, stop: true } : { ...acc, out: [...acc.out, l.replace(/^\/\/ ?/, '')] }), { out: [], stop: false }).out.join('\n')); process.exit(0); }
  else { console.error(`unknown option ${a}`); process.exit(2); }
}

const rulesFile = opts.rules || join(HERE, 'icon-set-rules.json');
let ruleSet = {};
try { ruleSet = JSON.parse(readFileSync(rulesFile, 'utf8')); } catch { ruleSet = {}; }
const targetRules = opts.target ? (ruleSet.targets || {})[opts.target] : null;
if (opts.target && !targetRules) { console.error(`unknown target ${opts.target}; the rule file knows: ${Object.keys(ruleSet.targets || {}).join(', ') || 'none'}`); process.exit(2); }
opts.prefix = opts.prefix || (targetRules && targetRules.namePrefix) || ruleSet.namePrefix || 'icon/';
opts.page = opts.page || (targetRules && targetRules.page) || ruleSet.page || 'Icons';
const rulesArg = opts.rules ? ['--rules', opts.rules] : [];

const work = resolve(opts.work);
mkdirSync(work, { recursive: true });
const step = (n, text) => console.log(`\n[${n}] ${text}`);
const fail = (msg) => { console.error(`\nerror: ${msg}`); process.exit(1); };
const runFigma = (scriptFile) => runFigmaIn(scriptFile, opts.cliDir);
const list = (a, max = 12) => (a.length ? ` ${a.slice(0, max).join(', ')}${a.length > max ? ` and ${a.length - max} more` : ''}` : '');
const shortName = (name) => (name.toLowerCase().startsWith(opts.prefix.toLowerCase()) ? name.slice(opts.prefix.length) : name);

// ---------------------------------------------------------------- 1 fetch
const gitDir = opts.git ? resolve(opts.git) : join(work, 'git');
if (opts.noGit) step(1, 'no comparison with Git (--no-git)');
else if (opts.git) { step(1, `reference: ${gitDir}`); if (!existsSync(gitDir)) fail(`${gitDir} does not exist`); }
else {
  step(1, 'fetch the SVG files from Git (the reference)');
  const fetchArgs = ['--out', gitDir];
  for (const k of ['ref', 'repo', 'path']) if (opts[k]) fetchArgs.push(`--${k}`, opts[k]);
  const fetched = runNode('fetch-icons.mjs', fetchArgs);
  console.log(fetched.out.trim());
  if (fetched.status !== 0) fail('the download failed');
}

// ---------------------------------------------------------------- 2 export
step(2, 'export the icon page from Figma (with the SVG of every icon)');
let data;
try {
  const script = generate('export-icon-set.js', { pageName: opts.page, namePrefix: opts.prefix, includeSvg: true }, join(work, 'svg-export.generated.js'));
  const json = runFigma(script);
  data = JSON.parse(json);
  if (!data.ok) throw new Error(`the export reports a problem: ${data.reason || json.slice(0, 200)}`);
  writeFileSync(join(work, 'svg-export.json'), json);
} catch (e) { fail(e.message); }
console.log(`${data.count} icons in "${data.source.file}" / "${data.source.page}" (file key ${data.source.fileKey}), prefix ${opts.prefix}`);

// ---------------------------------------------------------------- 3 normalize
step(3, 'normalize the SVG files (Figma format → Git format without id)');
const normDir = join(work, 'normalized');
rmSync(normDir, { recursive: true, force: true });
mkdirSync(normDir, { recursive: true });
const normalized = new Map(), problems = [], noted = [], fills = new Map();
for (const icon of data.icons) {
  const short = shortName(icon.name);
  if (opts.only && !opts.only.has(short)) continue;
  const bbox = icon.children && icon.children[0] && icon.children[0].bbox ? icon.children[0].bbox : null;
  const r = normalizeSvg(icon.svg, { bbox });
  if (!r.ok) { problems.push(`${short}: ${r.reason}`); continue; }
  normalized.set(short, r.svg);
  writeFileSync(join(normDir, `${short}.svg`), r.svg);
  fills.set(r.fill, (fills.get(r.fill) || 0) + 1);
  for (const n of r.notes) noted.push(`${short}: ${n}`);
}
console.log(`${normalized.size} normalized, ${problems.length} not normalizable${problems.length ? ':' : ''}`);
for (const p of problems.slice(0, 12)) console.log(`  ${p}`);
console.log(`fill removed from the paths: ${[...fills].map(([c, n]) => `${c} x ${n}`).join(', ') || 'none'}`);
for (const n of noted.slice(0, 12)) console.log(`  ${n}`);
if (!normalized.size) fail('no icon could be normalized');

// ---------------------------------------------------------------- 4 check
step(4, `SVG file check (profile export)${opts.noGit ? '' : ' and comparison with Git'}`);
const checkJson = join(work, 'export-check.json');
const againstArg = opts.noGit ? [] : ['--against', gitDir];
const check = runNode('validate-icon-set.mjs', [normDir, '--profile', 'export', ...againstArg, '--all', '--json', checkJson, ...rulesArg, ...(opts.target ? ['--target', opts.target] : [])]);
writeFileSync(join(work, 'export-check.txt'), check.out);
if (check.status === 2) fail(check.out.trim());
const findings = JSON.parse(readFileSync(checkJson, 'utf8')).findings;
const COMPARE = new Set(['S16', 'N10', 'N11']);
const errors = findings.filter((f) => f.severity === 'error' && !COMPARE.has(f.rule));
console.log(check.out.split('\n').filter((l) => /^(Profile:|ERROR|WARN |Result:|  against reference)/.test(l)).filter((l) => !/^ERROR (S16|N10|N11)/.test(l)).join('\n'));
const names = (rule) => [...new Set(findings.filter((f) => f.rule === rule).map((f) => f.icon))];
const changed = names('S16'), onlyHere = names('N11'), onlyGit = names('N10');
if (!opts.noGit) console.log(`\nagainst Git: ${changed.length} changed${list(changed)}; ${onlyHere.length} new${list(onlyHere)}; ${onlyGit.length} only in Git (never deleted)${list(onlyGit)}`);

// ---------------------------------------------------------------- 5 choose, 6 write
const chosen = [...normalized.keys()].filter((n) => opts.all || changed.includes(n) || onlyHere.includes(n)).sort();
step(5, opts.all ? `every icon (${chosen.length})` : `the changed and the new icons (${chosen.length})`);
if (errors.length && !opts.force) {
  console.error(`\nthe SVG file check found ${errors.length} errors, nothing was written (see ${join(work, 'export-check.txt')}; --force goes on anyway)`);
  process.exit(1);
}
if (!chosen.length) {
  console.log('\nNothing to write: the Figma set equals the files in Git.');
  process.exit(problems.length ? 1 : 0);
}
step(6, `write ${chosen.length} SVG files into ${resolve(opts.out)}`);
const out = resolve(opts.out);
mkdirSync(out, { recursive: true });
for (const n of chosen) writeFileSync(join(out, `${n}.svg`), normalized.get(n));
if (opts.zip) {
  const zipFile = `${out}.zip`;
  rmSync(zipFile, { force: true });
  try { execFileSync('zip', ['-jq', zipFile, '-@'], { input: chosen.map((n) => join(out, `${n}.svg`)).join('\n') }); console.log(`zip: ${zipFile}`); }
  catch (e) { fail(`the zip command failed: ${e.message}`); }
}
writeFileSync(join(work, 'export-report.json'), JSON.stringify({ source: data.source, written: chosen, changed, new: onlyHere, notNormalizable: problems, checkErrors: errors.length }, null, 2));
console.log(`\n${chosen.length} files written${opts.all ? '' : ` (${changed.length} changed, ${onlyHere.length} new)`}, ${problems.length} icons not normalizable, ${errors.length} check errors. Report: ${join(work, 'export-report.json')}`);
process.exit(problems.length || (errors.length && !opts.force) ? 1 : 0);
