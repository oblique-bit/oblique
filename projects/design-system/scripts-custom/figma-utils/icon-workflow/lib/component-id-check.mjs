// component-id-check.mjs — the Component ID check: no published icon may lose its component
// ----------------------------------------------------------------------------
// WHY: the files of the consumers link every icon instance to the key of its component in the
// published library. When a component is deleted and made again, even with the same name, it
// gets a new key: the instances of the consumers lose their link and get no update any more.
// The check compares the icon page with the last published library before the library is merged
// or published.
//
// WHAT IT CHECKS:
//   ID01 error  an icon of the published library has no component in the file (found neither by
//               its key nor by its node id): it was deleted or made again
//   ID02 error  an icon of the published library has another name in the file, and its description
//               has no line "Old name:" with the published name (a rename needs that line)
//   ID03 info   an icon of the file is not in the published library yet (a new icon)
//   ID04 error  an icon that was in the file at the start of a run is gone, or its key or its name
//               changed during the run (icons.mjs compares its exports before and after writing)
//
// THE PUBLISHED LIBRARY comes from the Figma REST API: GET /v1/files/<file key>/components lists
// the published components of a library file. It needs the key of the main file (a branch cannot
// publish) and a personal access token with the scope library_content:read in the environment
// variable FIGMA_TOKEN. The token is never written into a file. An icon is found by its key first
// and by its node id second (a component keeps its node id in a branch of the file).
//
// usage:
//   node component-id-check.mjs --current <export.json> --library <url or file key>   # downloads the list
//   node component-id-check.mjs --current <export.json> --published <components.json>
//   node component-id-check.mjs --current <export.json> --before <export.json>        # check of a run
// options:
//   --current <file>      export of the icon page (export-icon-set.js; the SVG strings are not needed)
//   --library <url|key>   the main file of the published library; downloads the list (needs FIGMA_TOKEN)
//   --published <file>    the list as saved before (the answer of the REST API or an array of components)
//   --save <file>         write the downloaded list into this file
//   --before <file>       export of the same page before a run (rule ID04)
//   --prefix <text>       the icon name prefix (default: the prefix of the export)
//   --json <file>         write the findings as JSON
// exit status: 0 no error, 1 errors, 2 the check could not run
// ----------------------------------------------------------------------------

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RULES = {
  ID01: { severity: 'error', text: 'an icon of the published library has a component in the file (by key or node id)' },
  ID02: { severity: 'error', text: 'a published icon keeps its name, or its description names the published name in "Old name:"' },
  ID03: { severity: 'info', text: 'an icon of the file is not in the published library yet' },
  ID04: { severity: 'error', text: 'an icon keeps its component, key and name during a run' },
};

// the file key from a Figma URL (main file or branch) or a bare key
export function fileKeyOf(text) {
  const m = /figma\.com\/(?:design|file)\/([A-Za-z0-9]+)/.exec(text || '');
  return m ? m[1] : (text || '').trim();
}

export function isBranchUrl(text) {
  return /figma\.com\/(?:design|file)\/[A-Za-z0-9]+\/branch\//.test(text || '');
}

// the published components of a library file, through the REST API
export async function fetchPublished(fileKey, token) {
  if (!token) throw new Error('FIGMA_TOKEN is not set (a personal access token with the scope library_content:read)');
  const res = await fetch(`https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/components`, { headers: { 'X-Figma-Token': token } });
  const body = await res.text();
  if (!res.ok) throw new Error(`the Figma REST API answered ${res.status}: ${body.slice(0, 200)}`);
  return JSON.parse(body);
}

// the answer of the REST API, or an array of components
export function publishedList(data) {
  const list = Array.isArray(data) ? data : data && data.meta && Array.isArray(data.meta.components) ? data.meta.components : null;
  if (!list) throw new Error('the published list has no components (expected the answer of GET /v1/files/<key>/components)');
  return list.map((c) => ({ key: c.key, nodeId: c.node_id || c.nodeId || null, name: c.name }));
}

const lower = (s) => (s || '').toLowerCase();
const shortName = (name, prefix) => (lower(name).startsWith(lower(prefix)) ? name.slice(prefix.length) : name);

// the names in the line "Old name:" of a description (several names separated by commas)
export function oldNames(description) {
  const m = /^Old name:[ \t]*(.+)$/m.exec(description || '');
  return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
}

// the published library against the file
export function checkPublished(published, current, prefix) {
  const icons = published.filter((p) => lower(p.name).startsWith(lower(prefix)));
  const byKey = new Map(current.map((c) => [c.key, c]));
  const byId = new Map(current.map((c) => [c.id, c]));
  const findings = [];
  const matched = new Set();
  let viaKey = 0;
  let viaNodeId = 0;
  for (const p of icons) {
    const name = shortName(p.name, prefix);
    let c = p.key ? byKey.get(p.key) : null;
    if (c) viaKey++;
    else if (p.nodeId && byId.get(p.nodeId)) { c = byId.get(p.nodeId); viaNodeId++; }
    if (!c) { findings.push({ rule: 'ID01', severity: 'error', icon: name, message: `published icon "${p.name}" (key ${p.key}, node ${p.nodeId}) has no component in the file: deleted or made again` }); continue; }
    matched.add(c.id);
    const now = shortName(c.name, prefix);
    if (now !== name && !oldNames(c.description).includes(name)) {
      findings.push({ rule: 'ID02', severity: 'error', icon: name, message: `published as "${p.name}", now "${c.name}" without the line "Old name: ${name}"` });
    }
  }
  for (const c of current) if (!matched.has(c.id)) findings.push({ rule: 'ID03', severity: 'info', icon: shortName(c.name, prefix), message: `"${c.name}" is not in the published library yet` });
  return { findings, published: icons.length, inFile: current.length, viaKey, viaNodeId };
}

// the same page before and after a run
export function checkRun(before, after) {
  const byId = new Map(after.map((c) => [c.id, c]));
  const findings = [];
  for (const b of before) {
    const a = byId.get(b.id);
    if (!a) findings.push({ rule: 'ID04', severity: 'error', icon: b.name, message: `the component ${b.id} of "${b.name}" is gone after the run` });
    else if (b.key && a.key !== b.key) findings.push({ rule: 'ID04', severity: 'error', icon: b.name, message: `the key of "${b.name}" changed during the run` });
    else if (a.name !== b.name) findings.push({ rule: 'ID04', severity: 'error', icon: b.name, message: `"${b.name}" was renamed to "${a.name}" during the run` });
  }
  return { findings, before: before.length, after: after.length };
}

// short text for the console
export function summarize(result, label) {
  const n = (rule) => result.findings.filter((f) => f.rule === rule).length;
  const errors = result.findings.filter((f) => f.severity === 'error');
  const lines = [];
  if ('published' in result) {
    lines.push(`${label}: ${result.published} published icons, ${result.inFile} in the file; found by key ${result.viaKey}, by node id ${result.viaNodeId}; missing ${n('ID01')}, renamed without "Old name:" ${n('ID02')}, new ${n('ID03')}`);
  } else {
    lines.push(`${label}: ${result.before} icons before, ${result.after} after; changed or gone ${n('ID04')}`);
  }
  for (const f of errors.slice(0, 20)) lines.push(`  ERROR ${f.rule} ${f.message}`);
  if (errors.length > 20) lines.push(`  and ${errors.length - 20} more errors`);
  const fresh = result.findings.filter((f) => f.rule === 'ID03').map((f) => f.icon);
  if (fresh.length) lines.push(`  new: ${fresh.slice(0, 20).join(', ')}${fresh.length > 20 ? ` and ${fresh.length - 20} more` : ''}`);
  return lines.join('\n');
}

// ---------------------------------------------------------------- command
async function main() {
  const args = process.argv.slice(2);
  const opts = { current: null, library: null, published: null, save: null, before: null, prefix: null, json: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    const key = a.replace(/^--/, '');
    if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); return 0; }
    if (a.startsWith('--') && key in opts) opts[key] = args[++i];
    else { console.error(`unknown option ${a}`); return 2; }
  }
  if (!opts.current) { console.error('--current <export.json> is needed'); return 2; }
  if (!opts.library && !opts.published && !opts.before) { console.error('give --library, --published or --before'); return 2; }
  let current;
  try { current = JSON.parse(readFileSync(opts.current, 'utf8')); } catch (e) { console.error(`cannot read ${opts.current}: ${e.message}`); return 2; }
  if (!current.ok || !Array.isArray(current.icons)) { console.error(`${opts.current} is not an export of export-icon-set.js`); return 2; }
  const prefix = opts.prefix || (current.config && current.config.namePrefix) || 'icon/';
  if (current.icons.some((c) => !c.key)) { console.error('the export has no component keys: export again with the current export-icon-set.js'); return 2; }

  const findings = [];
  if (opts.library || opts.published) {
    let data;
    try {
      if (opts.library) {
        if (isBranchUrl(opts.library)) { console.error('--library needs the main file: a branch cannot publish'); return 2; }
        data = await fetchPublished(fileKeyOf(opts.library), process.env.FIGMA_TOKEN);
        if (opts.save) writeFileSync(opts.save, JSON.stringify(data));
      } else data = JSON.parse(readFileSync(opts.published, 'utf8'));
      const r = checkPublished(publishedList(data), current.icons, prefix);
      console.log(summarize(r, 'Published library'));
      findings.push(...r.findings);
    } catch (e) { console.error(`the published list: ${e.message}`); return 2; }
  }
  if (opts.before) {
    let before;
    try { before = JSON.parse(readFileSync(opts.before, 'utf8')); } catch (e) { console.error(`cannot read ${opts.before}: ${e.message}`); return 2; }
    const r = checkRun(before.icons, current.icons);
    console.log(summarize(r, 'Run'));
    findings.push(...r.findings);
  }
  if (opts.json) writeFileSync(opts.json, JSON.stringify({ rules: RULES, findings }, null, 2));
  const errors = findings.filter((f) => f.severity === 'error').length;
  console.log(`Component ID check: ${errors ? `${errors} errors` : 'no error'}`);
  return errors ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().then((code) => process.exit(code), (e) => { console.error(e.message); process.exit(2); });
}
