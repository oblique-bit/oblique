#!/usr/bin/env node
/**
 * build-icons.js — Icons docs builder: builds the whole "🧷 Icons" page of the design system file from a source.
 *
 * Case 0 of the icon workflow ("create a new set"). The builder ALWAYS asks for the Figma URL of the source: a file or
 * a branch that holds the icons (add the node-id of the section or frame with the icons when the file has more than one
 * icon page). It reads the icons there, then builds the page in the file that is open and active:
 *
 *   - the building blocks `_building_blocks/icons/purpose_box` and `_building_blocks/icons/label` on the page
 *     "Authoring Utilities" (made when they are missing)
 *   - the page "🧷 Icons" with its section, the header (the foundation bar), the two purpose boxes
 *   - one component `icon/<name>` and one label for every icon of the source
 *
 * The source must be readable by a script. Figma gives a script no access to a file that you can only view (for example
 * the live OB Library or a branch you may not edit): the builder stops and asks for an editable copy.
 * It never deletes or replaces an icon component that exists. See _readme.md.
 *
 * Usage:
 *   node build-icons.js                      # asks for the source URL, shows the plan, asks, builds
 *   node build-icons.js --dry-run            # asks for the source URL, reads it, shows the plan, writes nothing
 *   node build-icons.js --source <url>       # the URL on the command line (for scripts; the default is to ask)
 *   node build-icons.js --yes                # no question about the destination file
 *   node build-icons.js --registry <file> --work <folder> --batch <n>
 *
 * Prerequisites: Figma Desktop running, the destination file open and active (a branch or a copy of the design system
 * file: it needs the variables and the page "Authoring Utilities"), figma-ds-cli connected. Never call
 * `figma-ds-cli connect` while this runs: it restarts Figma. The builder only uses `daemon reconnect`.
 */
'use strict';

process.env.FIG_EVAL_TIMEOUT_MS = process.env.FIG_EVAL_TIMEOUT_MS || '1800000';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const CLI = process.env.FIG_CLI || 'figma-ds-cli';
const CLI_DIR = process.env.FIG_CLI_DIR || path.join(process.env.HOME || '', 'figma-cli');
const CDP_PORT = process.env.FIG_CDP_PORT || '9222';

const args = process.argv.slice(2);
const getArg = (name, def) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? args[i + 1] : def; };
const OPTS = {
  source: getArg('--source', null),
  dryRun: args.includes('--dry-run'),
  yes: args.includes('--yes'),
  registry: getArg('--registry', path.join(HERE, 'registry.json')),
  work: path.resolve(getArg('--work', './icon-sync')),
  batch: Number(getArg('--batch', '40')),
};
if (args.includes('--help') || args.includes('-h')) {
  const block = /\/\*\*([\s\S]*?)\*\//.exec(fs.readFileSync(__filename, 'utf8'))[1];
  console.log(block.split('\n').map((l) => l.replace(/^ ?\* ?/, '')).join('\n').trim());
  process.exit(0);
}

const step = (n, text) => console.log(`\n[${n}] ${text}`);
const fail = (msg, code = 1) => { console.error(`\nerror: ${msg}`); process.exit(code); };
const sleep = (s) => spawnSync('sleep', [String(s)]);

// ---------------------------------------------------------------- a Figma URL
// https://www.figma.com/design/<key>[/branch/<branchKey>]/<name>?node-id=a-b   or   figma://design/...
function parseFigmaUrl(raw) {
  let u;
  try { u = new URL(String(raw).trim()); } catch (e) { return null; }
  const parts = u.protocol === 'figma:' ? [u.host, ...u.pathname.split('/').filter(Boolean)] : u.pathname.split('/').filter(Boolean);
  if (!['design', 'file'].includes(parts[0]) || !parts[1]) return null;
  const fileKey = parts[1];
  const branchKey = parts[2] === 'branch' ? parts[3] : null;
  const slug = (branchKey ? parts[4] : parts[2]) || 'file';
  const nodeRaw = u.searchParams.get('node-id');
  const nodeId = nodeRaw ? nodeRaw.replace('-', ':') : null;
  const openKey = branchKey || fileKey;
  const deepLink = `figma://design/${fileKey}${branchKey ? `/branch/${branchKey}` : ''}/${slug}${nodeRaw ? `?node-id=${nodeRaw.replace(':', '-')}` : ''}`;
  return { fileKey, branchKey, openKey, slug, nodeId, deepLink };
}

// ---------------------------------------------------------------- questions
function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let answered = false;
    rl.question(question, (a) => { answered = true; rl.close(); resolve(a.trim()); });
    rl.on('close', () => { if (!answered) resolve(''); });
  });
}

// ---------------------------------------------------------------- figma-ds-cli
function generate(templateFile, input, outName) {
  const text = fs.readFileSync(path.join(HERE, templateFile), 'utf8');
  const marker = /\/\*__INPUT__\*\/[\s\S]*?\/\*__END__\*\//;
  if (!marker.test(text)) throw new Error(`${templateFile} has no INPUT block`);
  fs.mkdirSync(OPTS.work, { recursive: true });
  const out = path.join(OPTS.work, outName);
  fs.writeFileSync(out, text.replace(marker, () => JSON.stringify(input)));
  return out;
}

function evalFile(file, timeoutMs = 30 * 60 * 1000) {
  const r = spawnSync(CLI, ['eval', '-f', file], { cwd: CLI_DIR, encoding: 'utf8', maxBuffer: 1 << 30, timeout: timeoutMs, env: process.env });
  if (r.error) return { error: `figma-ds-cli did not run: ${r.error.message}` };
  const lines = (r.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if (!last.startsWith('{')) return { error: `${((r.stdout || '') + (r.stderr || '')).trim().slice(-300) || 'no output'}` };
  try { return { json: JSON.parse(last) }; } catch (e) { return { error: `the output is not JSON: ${last.slice(0, 200)}` }; }
}

function probeFile() {
  const f = path.join(OPTS.work, 'probe.generated.js');
  fs.mkdirSync(OPTS.work, { recursive: true });
  fs.writeFileSync(f, '(async () => JSON.stringify({ ok: true, file: figma.root.name, fileKey: figma.fileKey }))()');
  return f;
}

function reconnect() { spawnSync(CLI, ['daemon', 'reconnect'], { cwd: CLI_DIR, encoding: 'utf8', timeout: 30000 }); }

async function cdpTabs() {
  try {
    const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
    return (await res.json()).filter((t) => t.type === 'page' && /figma\.com\/(design|file)\//.test(t.url || ''));
  } catch (e) { return []; }
}

// open a file in Figma Desktop and wait until the CLI talks to it; returns { ok, file, reason }
async function switchTo(target, label, waitSeconds) {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawnSync(opener, [target.deepLink]);
  const probe = probeFile();
  const t0 = Date.now();
  let lastError = '';
  while ((Date.now() - t0) / 1000 < waitSeconds) {
    sleep(4);
    reconnect();
    const r = evalFile(probe, 45000);
    if (r.json && r.json.ok) {
      if (r.json.fileKey === target.openKey) return { ok: true, file: r.json.file };
      lastError = `the CLI talks to "${r.json.file}" (${r.json.fileKey}), not to the ${label}`;
    } else lastError = r.error || '';
  }
  const tabs = await cdpTabs();
  const open = tabs.some((t) => (t.url || '').includes(target.openKey) || (t.url || '').includes(target.fileKey));
  return { ok: false, reason: lastError, tabOpen: open };
}

// ================================================================ main
(async () => {
  const registry = JSON.parse(fs.readFileSync(OPTS.registry, 'utf8'));
  console.log('Icons builder: builds the page "' + registry.page + '" from a source');

  // ---- the source: always asked
  let sourceUrl = OPTS.source;
  if (!sourceUrl) sourceUrl = await ask('\nFigma URL of the source (a file or branch with the icons; add the node-id of the section or frame with the icons): ');
  const source = parseFigmaUrl(sourceUrl);
  if (!source) fail('that is not a Figma design URL (https://www.figma.com/design/<key>/...)');

  // ---- the destination: the file that is open and active
  const tabs = await cdpTabs();
  if (!tabs.length) fail(`no Figma design file is open (nothing answers on port ${CDP_PORT}): open the destination file in Figma Desktop`);
  const destination = parseFigmaUrl(tabs[0].url);
  if (!destination) fail('the active Figma tab is not a design file');
  const destName = String(tabs[0].title || '').replace(/ – Figma$/, '');
  console.log(`\nDestination: "${destName}" (${destination.openKey}): the file that is open and active`);
  console.log(`Source:      ${source.slug}${source.branchKey ? ' (branch)' : ''} (${source.openKey})${source.nodeId ? `, node ${source.nodeId}` : ''}`);
  if (!OPTS.yes && !OPTS.dryRun) {
    const a = await ask(`\nBuild the page "${registry.page}" into "${destName}"? [y/N] `);
    if (!/^y(es)?$/i.test(a)) fail('stopped, nothing was changed', 0);
  }

  // ---- 1 read the source
  step(1, 'read the icons of the source');
  const sameFile = source.openKey === destination.openKey;
  if (!sameFile) {
    const sw = await switchTo(source, 'source', 90);
    if (!sw.ok) {
      console.error(`\nThe builder cannot read the source.`);
      if (sw.tabOpen) console.error('The file is open in Figma but gives scripts no access. That is the case for a file you can only view (it shows "Ask to edit")\nand for a file that does not allow copying. Make an editable copy of the source (File menu: Duplicate to your drafts, or ask for edit access)\nand run the builder again with the URL of the copy.');
      else console.error('The file did not open in Figma Desktop. Check the URL and your access, then run the builder again.');
      if (sw.reason) console.error(`(last answer: ${sw.reason.slice(0, 160)})`);
      await switchTo(destination, 'destination', 30); // best effort: show the destination file again
      process.exit(1);
    }
    console.log(`source file "${sw.file}" is open and readable`);
  }
  const readScript = generate('read-source.js', { nodeId: source.nodeId, pageName: 'Icons', prefixes: [registry.namePrefix, 'Icon/'], labelOffsetX: registry.grid.labelOffsetX, labelTolerance: 1.5, labelMaxDy: 12 }, 'read-source.generated.js');
  const read = evalFile(readScript);
  if (read.error) fail(read.error);
  if (!read.json.ok) fail(read.json.reason);
  const src = read.json;
  fs.writeFileSync(path.join(OPTS.work, 'source-icons.json'), JSON.stringify(src));
  console.log(`${src.icons.length} icons in "${src.source.file}" / ${src.source.container.type.toLowerCase()} "${src.source.container.name}"`);
  if (src.problems.length) {
    console.log(`${src.problems.length} components cannot be copied:`);
    for (const p of src.problems.slice(0, 12)) console.log(`  ${p}`);
  }
  if (!src.icons.length) fail('the source has no icon that can be copied');
  const icons = src.icons.slice().sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const differs = icons.filter((i) => i.label !== null && i.label !== i.name).map((i) => `${i.name} (label "${i.label}")`);
  if (differs.length) console.log(`${differs.length} icons whose label differs from the name, copied as they are: ${differs.slice(0, 6).join(', ')}`);

  // ---- 2 back to the destination
  if (!sameFile) {
    step(2, `back to the destination "${destName}"`);
    const sw = await switchTo(destination, 'destination', 90);
    if (!sw.ok) fail(`could not return to the destination: ${sw.reason || 'no answer'}. Open "${destName}" and run the builder again.`);
  } else step(2, 'the source is the destination file');

  const mode = OPTS.dryRun ? 'scan' : 'apply';
  const base = { mode, fileKeyGuard: destination.openKey, registry, restorePoint: true, label: 'Before icons builder', expected: Object.fromEntries(icons.map((i) => [i.name, i.label])), total: icons.length };
  const run = (phase, extra, name) => {
    const f = generate('build-page.js', { ...base, phase, ...extra }, `build-page.${name}.generated.js`);
    const r = evalFile(f);
    if (r.error) fail(`${phase}: ${r.error}`);
    if (!r.json.ok) { console.error(JSON.stringify(r.json.missingVariables || '', null, 0)); fail(`${phase}: ${r.json.reason}`); }
    for (const n of r.json.notes || []) console.log(`  note: ${n}`);
    return r.json;
  };

  // ---- 3 the plan
  step(3, 'check the destination');
  const plan = run('prepare', { mode: 'scan' }, 'scan');
  const s = plan.state;
  console.log(`destination "${plan.file}": page ${s.page ? 'exists' : 'missing'}, section ${s.section ? 'exists' : 'missing'}, ${s.existingIcons} icon components, building blocks ${s.blocksSection && s.labelBlock && s.purposeBox ? 'exist' : 'missing'}`);
  const scanIcons = run('icons', { mode: 'scan', batch: icons.map((i) => ({ name: i.name })) }, 'scan-icons');
  console.log(`plan: ${scanIcons.created} icons to create, ${scanIcons.kept} exist and stay as they are`);
  if (OPTS.dryRun) { console.log('\nDry run: nothing was written.'); process.exit(0); }

  // ---- 4 build
  step(4, 'build the page');
  const prep = run('prepare', {}, 'prepare');
  if (prep.made.blocks.length) console.log(`building blocks made: ${prep.made.blocks.join(', ')}`);
  console.log(`page ${prep.made.page ? 'made' : 'found'}, section ${prep.made.section ? 'made' : 'found'}; header ${Math.round(prep.header.w)} x ${Math.round(prep.header.h)} "${prep.header.title}"; ${prep.removedChrome.length ? `drawn again: ${prep.removedChrome.join(', ')}` : 'the header and the boxes are new'}`);
  let created = 0, kept = 0; const failed = [];
  for (let i = 0; i < icons.length; i += OPTS.batch) {
    const batch = icons.slice(i, i + OPTS.batch);
    const r = run('icons', { batch }, `icons-${Math.floor(i / OPTS.batch) + 1}`);
    created += r.created; kept += r.kept; failed.push(...r.failed);
    process.stdout.write(`  ${Math.min(i + OPTS.batch, icons.length)} / ${icons.length} icons\r`);
  }
  console.log(`\n${created} icons created, ${kept} existed and were left alone, ${failed.length} failed`);
  for (const f of failed.slice(0, 10)) console.log(`  ${f}`);

  // ---- 5 the check of the page
  step(5, 'check the page');
  const fin = run('finish', {}, 'finish');
  console.log(`${fin.icons} icons in ${fin.rows} rows, section height ${fin.sectionHeight}, fills bound ${fin.boundFills}, aspect ratio locked ${fin.lockedAspect}, labels right ${fin.labelsOk}`);
  console.log(fin.problemCount ? `${fin.problemCount} problems:\n${fin.problems.map((p) => `  ${p}`).join('\n')}` : 'no problems');
  console.log('\nNext: compare the page with Git (icons.mjs in figma-utils/icon-workflow) and write the texts with write-metadata.mjs. The restore point is "Before icons builder" in the version history.');
  process.exit(fin.problemCount || failed.length ? 1 : 0);
})().catch((e) => fail(e && e.stack || String(e)));
