#!/usr/bin/env node
// Put the central cover template into one Figma file or FigJam board, asking in the terminal.
// It reads the old cover, proposes a value for every field, lets you confirm or change each one, shows a
// summary and only then changes the file. Without --yes nothing is written before you answer "y".
//
// usage:
//   node cover-wizard.mjs "<figma url>" [options]
//     --template-key <key>    file that owns the cover template   (or env COVER_TEMPLATE_KEY)
//     --template-node <id>    node id of the template component   (or env COVER_TEMPLATE_NODE)
//     --library <name>        library to enable in the file       (or env COVER_LIBRARY_NAME, default "OB Library Utilities")
//     --values <file.json>    take the values from a file instead of asking
//     --dry-run               read, propose, ask, print the plan, change nothing
//     --yes                   accept the proposals without asking and do not ask for confirmation
//     --force                 run even when the file already has the new cover (it is added a second time)
//     --use-history           with --yes: also take a missing modified date from the version history
//     --own-since <YYYY-MM-DD>  own versions from this day on are ignored when the date comes from the history (default: today)
// When the old cover has no date and FIGMA_TOKEN is set, the wizard proposes the month of the last real change from
// the version history (see last-real-change.mjs). In a terminal you confirm or change it; with --yes it is used only
// together with --use-history.
//     --out <dir>             where previews and backups go (default ./cover-wizard-out)
// Needs the same tools as the README: figma-ds-cli, Figma Desktop with the debug port, zsh, node.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import readline from 'node:readline/promises';
import { propose, checkValues, statusesFor, DISTRIBUTIONS, normalizeTickets, formatModified, internalOwner, INTERNAL_OWNER, TEAM_OWNER } from './propose.mjs';
import { lastRealChange, fetchMeta } from './last-real-change.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const has = name => argv.includes(name);
const url = argv.find(a => /^https?:\/\//.test(a));
if (!url || has('--help')) { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1).filter((l, i, all) => all.slice(0, i + 1).every(x => x.startsWith('//'))).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(url ? 0 : 1); }

const TEMPLATE_KEY = flag('--template-key') || process.env.COVER_TEMPLATE_KEY;
const TEMPLATE_NODE = flag('--template-node') || process.env.COVER_TEMPLATE_NODE;
const LIBRARY = flag('--library') || process.env.COVER_LIBRARY_NAME || 'OB Library Utilities';
const OUT = flag('--out') || './cover-wizard-out';
const DRY = has('--dry-run'), YES = has('--yes'), FORCE = has('--force');

const keyFrom = u => { const b = u.match(/\/branch\/([A-Za-z0-9]+)/); const m = u.match(/figma\.com\/(?:design|board|slides|file)\/([A-Za-z0-9]+)/); return b ? b[1] : m && m[1]; };
const KEY = keyFrom(url);
if (!KEY) { console.error('no file key in the URL'); process.exit(1); }
const q = s => "'" + String(s).replace(/'/g, "'\\''") + "'";
const sh = cmd => { const r = spawnSync('zsh', ['-c', `source ${q(join(HERE, 'cover-tools.zsh'))}; ${cmd}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); if (r.stderr && r.status) console.error(r.stderr.trim()); return (r.stdout || '').trim(); };
const lastJson = out => { const l = out.split('\n').reverse().find(x => x.startsWith('{')); try { return l ? JSON.parse(l) : null; } catch { return null; } };
const run = (key, script, args = {}) => lastJson(sh(`ct_run ${q(key)} ${script} ${q(JSON.stringify(args))}`));
const open = (u, key) => sh(`ct_open ${q(u)} ${q(key)}`);
const rl = readline.createInterface({ input: process.stdin });
const lines = rl[Symbol.asyncIterator]();
// reads one line; works for a terminal and for piped input (lines that arrive early are kept)
const readLine = async text => { process.stdout.write(text); const r = await lines.next(); if (!r.done && !process.stdin.isTTY) process.stdout.write(r.value + '\n'); return r.done ? '' : r.value; };
const ask = async (label, def, hint = '') => { if (YES) return def; const a = (await readLine(`${label}${hint ? ' (' + hint + ')' : ''} [${def}]: `)).trim(); return a === '' ? def : a === '-' ? '' : a; };
const step = t => console.log('\n== ' + t);
const savePreview = (res, name) => { mkdirSync(OUT, { recursive: true }); const f = join(tmpdir(), `cw-${Date.now()}.json`); writeFileSync(f, JSON.stringify(res)); console.log(sh(`node ${q(join(HERE, 'save-images.mjs'))} ${q(f)} ${q(OUT)} ${q(name + '-')}`)); };

step('1. Read the file');
open(url, KEY);
const old = run(KEY, 'read-cover.js');
if (!old || old.wrongFile || old.error) { console.error('Could not read the file:', JSON.stringify(old)); process.exit(1); }
const isFigjam = old.editor === 'figjam';
console.log(`${old.name} (${isFigjam ? 'FigJam board' : 'design file'}), cover page "${old.coverPage}", thumbnail: ${old.thumbnail ? old.thumbnail.name : 'none'}`);
(old.frames || []).forEach(f => { console.log(`  ${f.type} ${f.name} ${f.w}x${f.h}`); f.texts.forEach(t => console.log('      ' + t)); });

if ((old.frames || []).some(f => f.texts.some(t => t.startsWith('Ownership label=')))) {
  console.log('\nThis file already has the new cover. Change its fields in the right panel of Figma, or run again with --force.');
  if (!FORCE) { rl.close(); process.exit(0); }
}
step('2. Values for the new cover');
let values = propose(old);
if (!values.modified && process.env.FIGMA_TOKEN && !flag('--values') && (!YES || has('--use-history'))) {
  try {
    const h = await lastRealChange(KEY, process.env.FIGMA_TOKEN, { since: flag('--own-since') });
    if (h) { values.modified = h.monthYear; console.log(`Modified is proposed from the version history: last change ${h.date.slice(0, 10)} by ${h.by}${h.label ? ' (named version "' + h.label + '")' : ''}.`); }
    else console.log('The version history has no change before the migration: no modified date is proposed.');
  } catch (e) { console.log('Version history not available (' + e.message + '): no modified date is proposed.'); }
}
if (flag('--values')) values = { ...values, ...JSON.parse(readFileSync(flag('--values'), 'utf8')) };
else {
  console.log('Enter keeps the proposal, "-" makes the field empty (an empty version, date or purpose hides that row).');
  for (;;) { values.distribution = await ask('distribution', values.distribution, 'internal = team only, external = other teams or Figma Community'); if (DISTRIBUTIONS.includes(values.distribution)) break; console.log('  internal or external'); if (YES) process.exit(1); }
  if (values.distribution === 'external') { values.tickets = ''; if (!values.docs) values.docs = 'oblique.bit.admin.ch'; if (values.owner !== TEAM_OWNER) values.owner = TEAM_OWNER; }
  else {
    values.docs = '';
    if (!INTERNAL_OWNER.test(values.owner || '') && process.env.FIGMA_TOKEN) {
      try { const m = await fetchMeta(KEY, process.env.FIGMA_TOKEN); if (m.creator && m.creator.handle) { values.owner = internalOwner(m.creator.handle); console.log(`Owner is proposed from the creator of the file (${m.creator.handle}). The creator is not always the owner: check it.`); } } catch (e) { console.log('Creator not available (' + e.message + ').'); }
    }
    if (!INTERNAL_OWNER.test(values.owner || '')) values.owner = '';
  }
  values.product = await ask('product', values.product, 'Oblique <release number>, or Oblique DS');
  values.doc = await ask('doc name', values.doc, 'says what the file is; ticket numbers go to tickets');
  if (values.distribution === 'internal') values.tickets = normalizeTickets(await ask('tickets', values.tickets, 'KEY-123, at most 3, main ticket first'));
  if (values.distribution === 'internal') values.git = await ask('git', values.git, 'branch name, optional; empty hides the row');
  values.purpose = await ask('purpose', values.purpose, 'one sentence about what the file contains');
  values.version = await ask('version', values.version, 'no letter V');
  values.modified = await ask('modified', values.modified, 'month of the last real change, three letters: Oct 2026; empty hides the row, never use today by default');
  values.owner = await ask('owner', values.owner, values.distribution === 'internal' ? 'initials of the owner: BIT / Oblique / DR' : 'the team');
  if (values.distribution === 'external') values.docs = await ask('docs', values.docs);
  const allowed = statusesFor(values.distribution);
  for (;;) { values.status = await ask('status', allowed.includes(values.status) ? values.status : allowed[0], allowed.join(' | ')); if (allowed.includes(values.status)) break; console.log('  not a status of an ' + values.distribution + ' cover'); if (YES) process.exit(1); }
}
values.modified = formatModified(values.modified);
const check = checkValues(values);
console.table(values);
check.warnings.forEach(w => console.log('  warning: ' + w));
if (check.errors.length) { check.errors.forEach(e => console.error('  error: ' + e)); console.error('Fix these values first. Nothing was changed.'); rl.close(); process.exit(1); }
if (DRY) { console.log('Dry run: nothing was changed.'); rl.close(); process.exit(0); }
if (!TEMPLATE_KEY || !TEMPLATE_NODE) { console.error('Set --template-key and --template-node (or COVER_TEMPLATE_KEY / COVER_TEMPLATE_NODE).'); process.exit(1); }
if (!YES && (await readLine('Change the file with these values? [y/N] ')).trim().toLowerCase() !== 'y') { console.log('Stopped, nothing was changed.'); process.exit(0); }

step('3. Copy the template');
open(`https://www.figma.com/design/${TEMPLATE_KEY}/template?node-id=0-1`, TEMPLATE_KEY);
console.log(JSON.stringify(run(TEMPLATE_KEY, 'select-node.js', { nodeId: TEMPLATE_NODE })));
sh(`node ${q(join(HERE, 'cdp.mjs'))} ${q(TEMPLATE_KEY)} key c`);
if (sh('ct_clipboard_file') !== TEMPLATE_KEY) { console.error('The clipboard does not hold the template. Stopped.'); process.exit(1); }

step('4. Paste into the file');
open(url, KEY);
if (!isFigjam) { const r = sh(`ct_enable_library ${q(KEY)} ${q(LIBRARY)}`); console.log(r); if (!/enabled/.test(r)) { console.error('The library is not enabled. Stopped.'); process.exit(1); } }
const prep = run(KEY, 'prepare-paste.js');
console.log(JSON.stringify(prep));
if (!prep || prep.stop || prep.error || prep.wrongFile) { console.error('No cover page to paste into. Stopped.'); process.exit(1); }
if (sh('ct_clipboard_file') !== TEMPLATE_KEY) { console.error('The clipboard changed. Stopped.'); process.exit(1); }
sh(`node ${q(join(HERE, 'cdp.mjs'))} ${q(KEY)} key v`);
await new Promise(r => setTimeout(r, 5000));
const pasted = run(KEY, 'read-pasted.js');
console.log(JSON.stringify(pasted));
if (!pasted || pasted.count !== 1 || pasted.type !== 'INSTANCE' || !/remote=true/.test(pasted.main || '')) { console.error('The paste is not a linked instance of the template. Stopped; check the file by hand.'); process.exit(1); }

step('5. Fill the cover');
const res = run(KEY, isFigjam ? 'fill-figjam.js' : 'fill-cover.js', { instanceId: pasted.id, values });
if (!res || res.error || res.wrongFile || res.stop) { console.error('Fill failed:', JSON.stringify(res)); process.exit(1); }
console.log((res.log || []).join('\n'));
console.log('file thumbnail is now:', res.thumbnail, res.thumbErr ? '(error: ' + res.thumbErr + ')' : '');
savePreview(res, KEY);

if ((res.children || []).some(c => /_depr @/.test(c))) {
  step('6. Old cover frames');
  console.log('Kept, renamed "..._depr", and moved below the new cover.');
  if (!YES && (await readLine('Back up (PNG and text) and remove them now? [y/N] ')).trim().toLowerCase() === 'y') {
    const bk = run(KEY, 'backup-old-covers.js', { namePattern: '_depr$' });
    if (bk && bk.stage === 'backup' && bk.count > 0) {
      savePreview(bk, 'old-' + KEY);
      const keep = (res.children.find(c => /(FRAME|SECTION) file_thumbnail @/.test(c)) || '').match(/@(-?\d+),(-?\d+)/) || [0, 0, 0];
      console.log(JSON.stringify(run(KEY, 'remove-old-covers.js', { namePattern: '_depr$', keepName: 'file_thumbnail', move: { x: +keep[1], y: +keep[2] } })));
    } else console.log('No backup made, nothing removed.');
  }
}
console.log('\nDone. Look at the preview in', OUT, 'and close the file: Figma refreshes the thumbnail when the file is closed.');
rl.close();
