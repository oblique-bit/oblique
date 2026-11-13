#!/usr/bin/env node
/**
 * build-icons.js — Icons docs builder: builds the whole "🧷 Icons" page of the design system file from a source.
 *
 * Case 0 of the icon workflow ("create a new set"). The builder ALWAYS asks where the icons come from and where the
 * page is built:
 *   - the source, first its type: 1 = a Figma file or 2 = a Git repo
 *       Figma file: the URL of the page with the icons (open the page, click an empty spot so that nothing is selected and
 *       copy the URL: its node-id is the page). The builder looks at the whole page, in every section and frame, and
 *       finds the icons itself: every component whose name starts with "icon" or "icons" (any case) and a separator,
 *       for example icon/arrow, Icon/arrow, Icons/arrow, icons/arrow, icon_arrow or icon arrow. A URL with the node-id
 *       of a section or frame reads only that part
 *       Git repo: the repository (default oblique-bit/oblique) and a branch, tag or commit (default master). The SVG
 *       files of the folder projects/oblique/icons are downloaded and checked with the validator of the icon workflow,
 *       the texts of the icons come from the gallery file of the same commit
 *   - the destination: the URL of the branch or the copy of the design system file where the page is built (it needs
 *     the variables and the page "Authoring Utilities")
 * It opens the Figma files itself, reads the icons of the source, shows the plan, asks and builds in the destination:
 *
 *   - the building block `_building_blocks/icons/purpose_box` on the page "Authoring Utilities" (made when it is missing)
 *   - the page "🧷 Icons" with its section, the header (the foundation bar), the two purpose boxes
 *   - one component `icon/<name>` and one label (a plain text layer, no component) for every icon of the source
 *
 * The source must be readable and the destination writable by a script. Figma gives a script no access to a file that
 * you can only view (for example the live OB Library or a branch you may not edit): the builder stops and asks for an
 * editable copy. It never deletes or replaces an icon component that exists. See _readme.md.
 *
 * Usage:
 *   node build-icons.js                      # asks for the source type, the source and the destination, reads the source, shows the plan, asks, builds
 *   node build-icons.js --dry-run            # the same, but writes nothing
 *   node build-icons.js --source-type figma --source <url> --destination <url>   # for scripts: what is not given is asked
 *   node build-icons.js --source-type git [--git-repo <owner/name>] [--git-ref <branch|tag|sha>] [--git-path <folder>] [--force]
 *                                            # --force goes on although the SVG files have validation errors
 *   node build-icons.js --yes                # no question before the build
 *   node build-icons.js --blocks-only        # asks only for the destination and makes only the building blocks for icons
 *                                            # (no source, no page, no icons): for a branch that is merged into the main file first
 *   node build-icons.js --registry <file> --work <folder> --batch <n>
 *
 * Prerequisites: Figma Desktop running and connected to figma-ds-cli. Never call `figma-ds-cli connect` while this runs:
 * it restarts Figma. The builder only uses `daemon reconnect`.
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
  sourceType: getArg('--source-type', null),
  source: getArg('--source', null),
  gitRepo: getArg('--git-repo', null),
  gitRef: getArg('--git-ref', null),
  gitPath: getArg('--git-path', null),
  force: args.includes('--force'),
  destination: getArg('--destination', null),
  blocksOnly: args.includes('--blocks-only'),
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

async function cdpAlive() {
  try { const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`); return res.ok; } catch (e) { return false; }
}

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

// ---------------------------------------------------------------- the source type: a Figma file or a Git repo
const ICON_WORKFLOW = path.resolve(HERE, '..', '..', 'figma-utils', 'icon-workflow');
const GIT_DEFAULTS = { repo: 'oblique-bit/oblique', ref: 'master', path: 'projects/oblique/icons' };

async function askSourceType() {
  const parse = (s) => (/^(1|f)/i.test(String(s).trim()) ? 'figma' : /^(2|g)/i.test(String(s).trim()) ? 'git' : null);
  if (OPTS.sourceType) {
    const t = parse(OPTS.sourceType);
    if (!t) fail('--source-type is figma or git');
    return t;
  }
  for (let tries = 0; tries < 3; tries++) {
    const t = parse(await ask('\nSource of the icons: 1 = Figma file (a page with the icons), 2 = Git repo (the SVG files of a repository) [1/2]: '));
    if (t) return t;
    console.log('Type 1 or 2.');
  }
  return fail('no source type chosen');
}

async function askGit() {
  const raw = OPTS.gitRepo || (await ask(`\nGit repository, owner/name [${GIT_DEFAULTS.repo}]: `)) || GIT_DEFAULTS.repo;
  const m = /^(?:https?:\/\/github\.com\/)?([^/\s]+)\/([^/\s]+?)(?:\.git)?(?:\/.*)?$/.exec(raw.trim());
  if (!m) fail(`"${raw}" is not a GitHub repository (owner/name)`);
  const ref = OPTS.gitRef || (await ask(`Branch, tag or commit [${GIT_DEFAULTS.ref}]: `)) || GIT_DEFAULTS.ref;
  return { repo: `${m[1]}/${m[2]}`, ref: ref.trim(), path: OPTS.gitPath || GIT_DEFAULTS.path };
}

// The icons of a Git repo: the SVG files are downloaded and checked with the tools of the icon workflow (fetch-icons.mjs,
// validate-icon-set.mjs), the texts of the icons come from the gallery file of the same commit (metadata.mjs).
async function readFromGit(git) {
  const rules = JSON.parse(fs.readFileSync(path.join(ICON_WORKFLOW, 'icon-set-rules.json'), 'utf8'));
  const galleryPath = rules.metadata && rules.metadata.galleryPath;
  const gitDir = path.join(OPTS.work, 'git');
  const galleryFile = path.join(OPTS.work, 'icons-gallery.ts');
  fs.mkdirSync(OPTS.work, { recursive: true });

  step(1, `download the icons from Git: ${git.repo} @ ${git.ref}`);
  const fetchArgs = [path.join(ICON_WORKFLOW, 'lib', 'fetch-icons.mjs'), '--repo', git.repo, '--ref', git.ref, '--path', git.path, '--out', gitDir];
  if (galleryPath) fetchArgs.push('--gallery', galleryPath, '--gallery-out', galleryFile);
  const f = spawnSync(process.execPath, fetchArgs, { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (f.status !== 0) fail(`the download from Git failed:\n${((f.stdout || '') + (f.stderr || '')).trim().slice(-600)}\nCheck the repository, the branch and the network. A GITHUB_TOKEN raises the limit of the GitHub API.`);
  const manifest = JSON.parse(fs.readFileSync(path.join(gitDir, 'manifest.json'), 'utf8'));
  console.log(`${manifest.count} SVG files from ${manifest.repository}@${String(manifest.commit).slice(0, 9)} (${manifest.ref}, ${String(manifest.commitDate).slice(0, 10)})`);

  const v = spawnSync(process.execPath, [path.join(ICON_WORKFLOW, 'lib', 'validate-icon-set.mjs'), gitDir, '--json', path.join(OPTS.work, 'git-validation.json'), '--all'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const vOut = (v.stdout || '') + (v.stderr || '');
  fs.writeFileSync(path.join(OPTS.work, 'git-validation.txt'), vOut);
  console.log(vOut.split('\n').filter((l) => /^(ERROR|WARN |Result:)/.test(l)).join('\n'));
  if (v.status === 2) fail(vOut.trim().slice(-600));
  if (v.status !== 0 && !OPTS.force) fail(`the SVG files have validation errors, see ${path.join(OPTS.work, 'git-validation.txt')} (--force goes on anyway)`);

  const meta = await import(require('url').pathToFileURL(path.join(ICON_WORKFLOW, 'lib', 'metadata.mjs')).href);
  const gallery = fs.existsSync(galleryFile) ? meta.parseGalleryFile(fs.readFileSync(galleryFile, 'utf8')) : new Map();
  // the same format as the descriptions of the icons in Figma: usage, category, keywords, then the lines Purpose type, Description, Old name, Deprecated purpose
  const describe = (g) => {
    if (!g) return '';
    const parts = [];
    if (g.usage) parts.push(g.usage);
    if (g.category) parts.push(`Category: ${g.category}`);
    // an entry of the gallery can hold several keywords in one text ("west,\nback"): they are split
    const keywords = (g.keywords || []).flatMap((k) => String(k).split(/[,\n]+/)).map((k) => k.trim()).filter(Boolean);
    if (keywords.length) parts.push(`Keywords: ${keywords.join(', ')}`);
    const base = parts.join('\n\n');
    return (meta.withNewLines(base, g).text || base).trim();
  };
  const files = fs.readdirSync(gitDir).filter((n) => n.toLowerCase().endsWith('.svg')).sort();
  const icons = files.map((file) => {
    const name = file.replace(/\.svg$/i, '');
    return { name, description: describe(gallery.get(name)), label: null, svg: fs.readFileSync(path.join(gitDir, file), 'utf8') };
  });
  fs.writeFileSync(path.join(OPTS.work, 'git-icons.json'), JSON.stringify({ source: { repository: manifest.repository, ref: manifest.ref, commit: manifest.commit }, icons: icons.map((i) => ({ name: i.name, description: i.description })) }));
  const withText = icons.filter((i) => i.description).length;
  console.log(`${icons.length} icons${galleryPath ? `, ${withText} with texts from the gallery file${withText < icons.length ? ` (${icons.length - withText} without an entry: empty description)` : ''}` : ' (no gallery file: empty descriptions)'}`);
  if (!icons.length) fail('the folder has no SVG file');
  return { icons, sourceName: `${manifest.repository}@${String(manifest.commit).slice(0, 9)}` };
}

// ================================================================ main
(async () => {
  const registry = JSON.parse(fs.readFileSync(OPTS.registry, 'utf8'));
  console.log('Icons builder: builds the page "' + registry.page + '" from a source');

  if (!(await cdpAlive())) fail(`Figma Desktop is not connected to figma-ds-cli (nothing answers on port ${CDP_PORT}). Start Figma Desktop and run \`figma-ds-cli connect\` once (it restarts Figma), then start the builder again.`);

  const askUrl = async (given, question, what) => {
    const parsed = parseFigmaUrl(given || await ask(question));
    if (!parsed) fail(`the ${what} is not a Figma design URL (https://www.figma.com/design/<key>/...)`);
    return parsed;
  };

  // why a script cannot use a file
  const cannotOpen = (role, sw) => {
    console.error(`\nThe builder cannot ${role === 'source' ? 'read the source' : 'write into the destination'}.`);
    if (sw.tabOpen) {
      console.error('The file is open in Figma but gives scripts no access. That is the case for a file you can only view (it shows "Ask to edit")\nand for a file that does not allow copying. If you only just got edit access, reload the file in Figma (Cmd+R) and run the builder again.');
      console.error(role === 'source'
        ? 'Make an editable copy of the source (File menu: Duplicate to your drafts, or ask for edit access)\nand run the builder again with the URL of the copy.'
        : 'Use a branch or a copy that you may edit (File menu: Duplicate to your drafts, or ask for edit access)\nand run the builder again.');
    } else console.error('The file did not open in Figma Desktop. Check the URL and your access, then run the builder again.');
    if (sw.reason) console.error(`(last answer: ${sw.reason.slice(0, 160)})`);
    process.exit(1);
  };

  // the source has no icons: the most likely cause is a source and a destination that were swapped
  const sourceFail = (reason) => fail(`${reason}\nThe source is the file that holds the icons (the first URL you gave). The page "${registry.page}" in the destination is made by the builder when it does not exist. Did you swap the source and the destination?`);

  // runs one phase of build-page.js in the open file
  const makeRun = (base) => (phase, extra, name) => {
    const f = generate('build-page.js', { ...base, phase, ...extra }, `build-page.${name}.generated.js`);
    const r = evalFile(f);
    if (r.error) fail(`${phase}: ${r.error}`);
    if (!r.json.ok) { console.error(JSON.stringify(r.json.missingVariables || '', null, 0)); fail(`${phase}: ${r.json.reason}`); }
    for (const n of r.json.notes || []) console.log(`  note: ${n}`);
    return r.json;
  };

  // ---- only the building blocks (--blocks-only): no source, no page and no icons.
  // For a branch that is merged into the main file first: a new branch made from the main file then has the building blocks.
  if (OPTS.blocksOnly) {
    const destination = await askUrl(OPTS.destination, '\nFigma URL of the destination (the branch or copy of the design system file where the building blocks are made): ', 'destination');
    step(1, 'open the destination');
    const dstOpen = await switchTo(destination, 'destination', 90);
    if (!dstOpen.ok) cannotOpen('destination', dstOpen);
    console.log(`destination file "${dstOpen.file}" (${destination.openKey}) is open`);
    const runBlocks = makeRun({ mode: OPTS.dryRun ? 'scan' : 'apply', fileKeyGuard: destination.openKey, registry, restorePoint: true, label: 'Before icons builder', expected: {}, total: 0 });

    step(2, 'check the destination');
    const plan = runBlocks('blocks', { mode: 'scan' }, 'blocks-scan');
    const st = plan.state;
    console.log(`building blocks in "${plan.file}": section ${registry.blocksSection} ${st.blocksSection ? 'exists' : 'missing'}, ${registry.components.purposeBox} ${st.purposeBox ? 'exists' : 'missing'}`);
    if (st.blocksSection && st.purposeBox) { console.log('\nThe building blocks exist already: nothing to do.'); process.exit(0); }
    if (OPTS.dryRun) { console.log('\nDry run: nothing was written.'); process.exit(0); }
    if (!OPTS.yes) {
      const a = await ask(`\nMake the building blocks for icons in "${dstOpen.file}"? No page and no icons are made. [y/N] `);
      if (!/^y(es)?$/i.test(a)) { console.log('\nStopped, nothing was changed.'); process.exit(0); }
    }

    step(3, 'make the building blocks');
    const made = runBlocks('blocks', {}, 'blocks');
    console.log(`made: ${made.made.blocks.join(', ') || 'nothing'}`);
    console.log(made.problems.length ? `${made.problems.length} problems:\n${made.problems.map((p) => `  ${p}`).join('\n')}` : 'no problems');
    console.log('\nNext: merge this branch into the main file in Figma. Then make a new branch from the main file and run the builder there without --blocks-only: it finds the building blocks and builds the page. The restore point is "Before icons builder" in the version history.');
    process.exit(made.problems.length ? 1 : 0);
  }

  // ---- the source and the destination: both are always asked, the source as a Figma file or as a Git repo
  const sourceType = await askSourceType();
  let source = null, git = null;
  if (sourceType === 'figma') source = await askUrl(OPTS.source, '\nFigma URL of the SOURCE (the file that has the icons, its page with the icons: open the page, click an empty spot so that nothing is selected, copy the URL from the address bar): ', 'source');
  else git = await askGit();
  const destination = await askUrl(OPTS.destination, '\nFigma URL of the DESTINATION (the branch or copy of the design system file where the page is built; the page is made when it does not exist): ', 'destination');
  const sameFile = !!source && source.openKey === destination.openKey;

  // ---- 1 the source: nothing is written. A Figma file is opened in Figma and read, a Git repo is downloaded.
  // The name of a Figma file is the name Figma has for it: a Figma URL carries the name of the main file even for a branch.
  let icons, sourceName, srcOpen = null;
  if (git) ({ icons, sourceName } = await readFromGit(git));
  else {
    step(1, 'open the source and read the icons');
    srcOpen = await switchTo(source, 'source', 90);
    if (!srcOpen.ok) cannotOpen('source', srcOpen);
    console.log(`source file "${srcOpen.file}" (${source.openKey}) is open and readable`);
    const readFrom = (nodeId) => evalFile(generate('read-source.js', { nodeId, pageName: 'icon', labelOffsetX: registry.grid.labelOffsetX, labelTolerance: 1.5, labelMaxDy: 12 }, 'read-source.generated.js'));
    let read = readFrom(source.nodeId);
    if (read.error) fail(read.error);
    if (!read.json.ok && read.json.noIcons && (read.json.pages || []).length) {
      // The URL points to a page without icons (the address bar of a file shows the page you looked at last, for example the cover).
      // The file has a page with "icon" in its name: offer it.
      const pages = read.json.pages;
      console.log(`\nThe page of the URL has no icons. Pages of this file with "icon" in their name: ${pages.map((p) => `"${p.name}"`).join(', ')}`);
      let pick = null;
      if (pages.length === 1) {
        const a = OPTS.yes ? 'y' : await ask(`Read the page "${pages[0].name}" instead? [Y/n] `);
        if (!/^n/i.test(a)) pick = pages[0];
      } else if (!OPTS.yes) {
        pages.forEach((p, i) => console.log(`  ${i + 1} = ${p.name}`));
        pick = pages[Number(await ask('Which page? number (Enter = none): ')) - 1] || null;
      }
      if (!pick) sourceFail(read.json.reason);
      console.log(`reading the page "${pick.name}"`);
      read = readFrom(pick.id);
      if (read.error) fail(read.error);
    }
    if (!read.json.ok) sourceFail(read.json.reason);
    const src = read.json;
    fs.writeFileSync(path.join(OPTS.work, 'source-icons.json'), JSON.stringify(src));
    const cont = src.source.container;
    console.log(`${src.icons.length} icons in "${src.source.file}" / ${cont.type.toLowerCase()} ${cont.name ? `"${cont.name}"` : 'without a name'}`);
    const written = Object.entries(src.prefixes || {}).map(([p, n]) => `${p} x ${n}`).join(', ');
    if (written) console.log(`names start with: ${written}`);
    if (src.otherComponents && src.otherComponents.count) console.log(`${src.otherComponents.count} other components there do not start with icon or icons and are ignored (for example ${src.otherComponents.samples.slice(0, 4).map((n) => `"${n}"`).join(', ')})`);
    if (src.problems.length) {
      console.log(`${src.problems.length} components cannot be copied:`);
      for (const p of src.problems.slice(0, 12)) console.log(`  ${p}`);
    }
    if (!src.icons.length) fail('the source has no icon that can be copied');
    icons = src.icons;
    sourceName = src.source.file;
    const differs = icons.filter((i) => i.label !== null && i.label !== i.name).map((i) => `${i.name} (label "${i.label}")`);
    if (differs.length) console.log(`${differs.length} icons whose label differs from the name, copied as they are: ${differs.slice(0, 6).join(', ')}`);
  }
  icons = icons.slice().sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  // ---- 2 the destination
  let destFile = srcOpen ? srcOpen.file : null;
  if (sameFile) step(2, 'the source is also the destination');
  else {
    step(2, 'open the destination');
    const dstOpen = await switchTo(destination, 'destination', 90);
    if (!dstOpen.ok) cannotOpen('destination', dstOpen);
    destFile = dstOpen.file;
    console.log(`destination file "${destFile}" (${destination.openKey}) is open`);
  }

  const mode = OPTS.dryRun ? 'scan' : 'apply';
  const base = { mode, fileKeyGuard: destination.openKey, registry, restorePoint: true, label: 'Before icons builder', expected: Object.fromEntries(icons.map((i) => [i.name, i.label])), total: icons.length };
  const run = makeRun(base);

  // ---- 3 the plan
  step(3, 'check the destination');
  const plan = run('prepare', { mode: 'scan' }, 'scan');
  const s = plan.state;
  console.log(`destination "${plan.file}": page ${s.page ? 'exists' : 'missing'}, section ${s.section ? 'exists' : 'missing'}, ${s.existingIcons} icon components, building blocks ${s.blocksSection && s.purposeBox ? 'exist' : 'missing'}`);
  const scanIcons = run('icons', { mode: 'scan', batch: icons.map((i) => ({ name: i.name })) }, 'scan-icons');
  console.log(`plan: ${scanIcons.created} icons to create, ${scanIcons.kept} exist and stay as they are`);
  if (!s.page) console.log(`The page "${registry.page}" does not exist in the destination: the builder makes it.`);
  if (!(s.blocksSection && s.purposeBox)) console.log('The building block for icons is missing in the destination: the builder makes it.');
  if (sameFile) console.log('Note: the source is the destination file itself. The icons stay as they are, the header and the two boxes are drawn again and missing building blocks are made.');
  if (OPTS.dryRun) { console.log('\nDry run: nothing was written.'); process.exit(0); }
  if (!OPTS.yes) {
    const a = await ask(`\nBuild the page "${registry.page}" into "${destFile}" with the icons of "${sourceName}"? [y/N] `);
    if (!/^y(es)?$/i.test(a)) { console.log('\nStopped, nothing was changed.'); process.exit(0); }
  }

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
