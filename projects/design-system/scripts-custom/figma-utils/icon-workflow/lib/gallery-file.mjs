#!/usr/bin/env node
// gallery-file.mjs — write the SDS gallery file icons.ts from the Figma descriptions (the export of the texts)
// ----------------------------------------------------------------------------
// WHY: from the first publish the Figma library leads (board "Icons Workflows", Case F). The texts of an icon live in its
// Figma description; the Figma line "Keywords:" is the field `aliases` of the gallery. The DS Developers take the SVG files
// and this file in one pull request and run nothing of ours.
//
// The file in Git is the base, so the pull request shows real changes only:
//   - an entry or a field that already says what the description says stays byte for byte
//   - a field that differs is written again in the style of the file: tabs, single quotes (double quotes when the text has
//     more single ones), a line of at most 120 characters, a value that does not fit goes to the next line (how Prettier
//     writes this repository: .prettierrc.yml and .editorconfig)
//   - an icon without an entry is added at the end of the file, like the latest additions in Git; the order is for the
//     developers to change
//   - nothing is deleted: an entry without an icon stays; a line that the description does not have never removes a field
//   - an icon whose description cannot be read (no usage text, a category outside the 12, a purpose type that is not single
//     or multi, a new icon without the lines the gallery needs) is skipped and listed; its entry stays as it is
// After writing, the result is read back and compared with the descriptions: a mismatch is an error, nothing is returned.
//
// As a command (offline, from an export of the open Figma file made by export-icon-set.js):
//   node gallery-file.mjs --figma <export.json> --gallery <icons.ts> --out <file> [--prefix icon/] [--only a,b] [--json <report>]
// export-svg.mjs uses buildGallery() and writes the file next to the SVG files.
//
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseGalleryFile, parseDescription, changedFields, CATEGORIES } from './metadata.mjs';

const PRINT_WIDTH = 120; // .editorconfig: max_line_length
const TAB_WIDTH = 2; // no tab width in .editorconfig: Prettier counts a tab as 2 columns
const ORDER = ['oldName', 'name', 'purpose', 'usage', 'category', 'aliases', 'description', 'deprecatedPurpose'];
const KEY = { oldName: 'oldName', purposeType: 'purpose', usage: 'usage', category: 'category', keywords: 'aliases', description: 'description', deprecatedPurpose: 'deprecatedPurpose' };
const LABEL = { oldName: 'old name', purposeType: 'purpose type', usage: 'usage', category: 'category', keywords: 'keywords', description: 'description', deprecatedPurpose: 'deprecated purpose' };

// ---------------------------------------------------------------- reading the file
// head (lines before the first entry), entries (the lines of each, split into fields, with the parsed data), tail
export function splitGallery(src) {
  const eol = String(src).includes('\r\n') ? '\r\n' : '\n';
  const lines = String(src).split(/\r?\n/);
  const head = [], tail = [], blocks = [];
  let i = 0, cur = null;
  while (i < lines.length && !/^\t\{\s*$/.test(lines[i])) head.push(lines[i++]);
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (!cur && /^\t\{\s*$/.test(l)) { cur = [l]; continue; }
    if (cur) { cur.push(l); if (/^\t\},?\s*$/.test(l)) { blocks.push(cur); cur = null; } continue; }
    tail.push(l);
  }
  if (cur) throw new Error('the gallery file ends inside an entry');
  const entries = blocks.map((b) => {
    const parsed = parseGalleryFile(b.join('\n'));
    if (parsed.size !== 1) throw new Error(`an entry of the gallery file has no name:\n${b.join('\n')}`);
    const fields = [];
    for (const l of b.slice(1, -1)) {
      const m = /^\t\t(\w+):/.exec(l);
      if (m) fields.push({ key: m[1], lines: [l] });
      else if (fields.length) fields[fields.length - 1].lines.push(l);
    }
    return { lines: b, fields, data: [...parsed.values()][0] };
  });
  return { eol, head, entries, tail };
}

// ---------------------------------------------------------------- writing in the style of the file
const width = (s) => [...s].length;
const columns = (line) => { const tabs = /^\t*/.exec(line)[0].length; return tabs * TAB_WIDTH + width(line.slice(tabs)); };

// a string literal as Prettier writes it with singleQuote: true (double quotes when the text has more single quotes than double)
export function literal(value) {
  const raw = String(value).replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  const singles = (raw.match(/'/g) || []).length, doubles = (raw.match(/"/g) || []).length;
  const q = singles > doubles ? '"' : "'";
  return q + raw.split(q).join('\\' + q) + q;
}

// the lines of one field: `key: 'value',` or, when that is too wide, the value on the next line; an array in one line or one item per line
export function formatField(key, value) {
  if (key === 'aliases') {
    const items = value.map(literal);
    const one = `\t\taliases: [${items.join(', ')}],`;
    return columns(one) <= PRINT_WIDTH ? [one] : ['\t\taliases: [', ...items.map((s) => `\t\t\t${s},`), '\t\t],'];
  }
  const lit = literal(value);
  const one = `\t\t${key}: ${lit},`;
  // Prettier keeps a value on the line of a short key (shorter than tab width + 3) even when it is too wide
  if (columns(one) <= PRINT_WIDTH || key.length < TAB_WIDTH + 3) return [one];
  return [`\t\t${key}:`, `\t\t\t${lit},`];
}

// a whole entry from its data (a new icon)
export function formatEntry(d) {
  const lines = ['\t{'];
  if (d.oldName) lines.push(...formatField('oldName', d.oldName));
  lines.push(...formatField('name', d.name), ...formatField('purpose', d.purposeType), ...formatField('usage', d.usage), ...formatField('category', d.category));
  if (d.keywords && d.keywords.length) lines.push(...formatField('aliases', d.keywords));
  lines.push(...formatField('description', d.description));
  if (d.deprecatedPurpose) lines.push(...formatField('deprecatedPurpose', d.deprecatedPurpose));
  lines.push('\t},');
  return lines;
}

// an entry of the file with some fields written again; a field the entry does not have goes to its place in the order of the file
function patchEntry(entry, p, fields) {
  const segments = entry.fields.map((f) => ({ key: f.key, lines: f.lines }));
  for (const f of fields) {
    const key = KEY[f];
    const lines = formatField(key, f === 'keywords' ? p.keywords : p[f]);
    const at = segments.findIndex((s) => s.key === key);
    if (at >= 0) segments[at] = { key, lines };
    else {
      const next = segments.findIndex((s) => ORDER.indexOf(s.key) > ORDER.indexOf(key));
      segments.splice(next >= 0 ? next : segments.length, 0, { key, lines });
    }
  }
  return [entry.lines[0], ...segments.flatMap((s) => s.lines), entry.lines[entry.lines.length - 1]];
}

// ---------------------------------------------------------------- the build
// src: the gallery file of Git. icons: [{ name, description }] (name without prefix, description = the Figma description).
// only: a Set of icon names; the other icons count as present in Figma but are not touched.
// Returns { text, same, changed: [{ name, fields }], added: [name], unchanged, skipped: [{ name, reason }], onlyInGallery: [name], kept: [{ name, field }] }.
// Throws when the result does not equal the descriptions after it is read back.
export function buildGallery(src, icons, { categories = CATEGORIES, only = null } = {}) {
  const g = splitGallery(src);
  const byName = new Map(g.entries.map((e) => [e.data.name.toLowerCase(), e]));
  const res = { text: null, same: false, changed: [], added: [], unchanged: 0, skipped: [], onlyInGallery: [], kept: [] };
  const fresh = [], parsed = new Map(), seen = new Set();
  const newFormat = (p) => p.purposeType !== null || p.description !== null;

  for (const icon of [...icons].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const name = icon.name, key = name.toLowerCase();
    seen.add(key);
    if (only && !only.has(name)) continue;
    const p = parseDescription(icon.description);
    const skip = (reason) => res.skipped.push({ name, reason });
    if (!p.usage) { skip(p.problems[0] || 'no usage text'); continue; }
    if (p.category && !categories.includes(p.category)) { skip(`category "${p.category}" is not one of the ${categories.length}`); continue; }
    if (p.purposeType && !['single', 'multi'].includes(p.purposeType)) { skip(`purpose type "${p.purposeType}" is not single or multi`); continue; }
    const entry = byName.get(key);
    if (entry) {
      const fields = changedFields(p, entry.data);
      // a field of the gallery that the description lacks stays as it is; only the lines decided on 2026-11-10 are worth a note
      for (const f of ['oldName', 'deprecatedPurpose']) if (entry.data[f] && !p[f] && newFormat(p)) res.kept.push({ name: entry.data.name, field: LABEL[f] });
      if (!fields.length) { res.unchanged++; continue; }
      entry.patched = patchEntry(entry, p, fields);
      res.changed.push({ name: entry.data.name, fields: fields.map((f) => LABEL[f]) });
      parsed.set(key, p);
    } else {
      const missing = [];
      if (!p.category) missing.push('Category');
      if (!p.purposeType) missing.push('Purpose type');
      if (!p.description) missing.push('Description');
      if (missing.length) { skip(`new icon: the description lacks the ${missing.length === 1 ? 'line' : 'lines'} ${missing.map((m) => `"${m}:"`).join(', ')}`); continue; }
      fresh.push({ name, lines: formatEntry({ name, oldName: p.oldName, purposeType: p.purposeType, usage: p.usage, category: p.category, keywords: p.keywords, description: p.description, deprecatedPurpose: p.deprecatedPurpose }) });
      res.added.push(name);
      parsed.set(key, p);
    }
  }
  for (const e of g.entries) if (!seen.has(e.data.name.toLowerCase())) res.onlyInGallery.push(e.data.name);

  if (!res.changed.length && !res.added.length) { res.text = String(src); res.same = true; return res; }

  const lines = [...g.head];
  g.entries.forEach((e, i) => {
    let l = e.patched || e.lines;
    // an entry that gets a successor needs its comma
    if (fresh.length && i === g.entries.length - 1 && /^\t\}\s*$/.test(l[l.length - 1])) l = [...l.slice(0, -1), '\t},'];
    lines.push(...l);
  });
  for (const f of fresh) lines.push(...f.lines);
  lines.push(...g.tail);
  res.text = lines.join(g.eol);

  // read back: the new file must hold every entry once and say what the descriptions say
  const back = parseGalleryFile(res.text);
  if (back.size !== g.entries.length + fresh.length) throw new Error(`the new gallery file has ${back.size} entries instead of ${g.entries.length + fresh.length}`);
  const bad = [];
  for (const [key, p] of parsed) { const e = back.get(byName.has(key) ? byName.get(key).data.name : [...res.added].find((n) => n.toLowerCase() === key)); const rest = e ? changedFields(p, e) : ['the entry'] ; if (rest.length) bad.push(`${key} (${rest.join(', ')})`); }
  if (bad.length) throw new Error(`the new gallery file does not equal the descriptions for: ${bad.slice(0, 8).join('; ')}`);
  return res;
}

// a few lines of text for the log of a command
export function summarize(res, max = 10) {
  const list = (a) => a.slice(0, max).join(', ') + (a.length > max ? ` and ${a.length - max} more` : '');
  const out = [];
  out.push(`entries: ${res.changed.length} changed, ${res.added.length} new, ${res.unchanged} equal, ${res.skipped.length} skipped${res.same ? ' (the file is the same as in Git)' : ''}`);
  if (res.changed.length) out.push(`  changed: ${list(res.changed.map((c) => `${c.name} (${c.fields.join(', ')})`))}`);
  if (res.added.length) out.push(`  new (added at the end): ${list(res.added)}`);
  if (res.skipped.length) { out.push('  skipped:'); for (const s of res.skipped.slice(0, max)) out.push(`    ${s.name}: ${s.reason}`); if (res.skipped.length > max) out.push(`    ... ${res.skipped.length - max} more`); }
  if (res.onlyInGallery.length) out.push(`  ${res.onlyInGallery.length} entries have no icon in Figma and stay: ${list(res.onlyInGallery)}`);
  if (res.kept.length) out.push(`  ${res.kept.length} fields that the gallery has and the description lacks stay: ${list(res.kept.map((k) => `${k.name} (${k.field})`))}`);
  return out;
}

// ---------------------------------------------------------------- command
function main() {
  const args = process.argv.slice(2);
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const figmaPath = opt('--figma'), galleryPath = opt('--gallery'), outPath = opt('--out'), jsonOut = opt('--json');
  const prefix = (opt('--prefix') || 'icon/').toLowerCase();
  const only = opt('--only') ? new Set(opt('--only').split(',').map((x) => x.trim()).filter(Boolean)) : null;
  if (!figmaPath || !galleryPath || !outPath) { console.error('usage: node gallery-file.mjs --figma <export.json> --gallery <icons.ts> --out <file> [--prefix icon/] [--only a,b] [--json <report>]'); return 2; }
  const raw = JSON.parse(readFileSync(figmaPath, 'utf8'));
  const icons = (raw.icons || []).map((i) => ({ name: i.name.toLowerCase().startsWith(prefix) ? i.name.slice(prefix.length) : i.name, description: i.description ?? (i.figma && i.figma.description) ?? '' }));
  const res = buildGallery(readFileSync(galleryPath, 'utf8'), icons, { only });
  console.log(summarize(res).join('\n'));
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ ...res, text: undefined }, null, 2));
  if (res.same) { console.log('Nothing to write: the descriptions equal the gallery file.'); return res.skipped.length ? 1 : 0; }
  writeFileSync(outPath, res.text);
  console.log(`written: ${resolve(outPath)}`);
  return res.skipped.length ? 1 : 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.exitCode = main(); } catch (e) { console.error(`error: ${e.message}`); process.exitCode = 2; }
}
