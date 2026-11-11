// metadata.mjs — the texts of an icon (usage, category, keywords, purpose type, description, old name, deprecated purpose)
// ----------------------------------------------------------------------------
// WHY: the same texts live in three places and are edited by hand: the Figma component description,
// the SDS gallery file icons.ts (code storage) and the Confluence table. The first two can be read by a
// program, so this module reads both, compares them and finds format problems. The Confluence table cannot.
//
// FIGMA DESCRIPTION (format of the 284 icons today, plus the new lines that are decided and written by write-metadata.mjs):
//   <usage text, one or more lines>
//
//   Category: <one of the 12 categories>
//
//   Keywords: <keyword>, <keyword>, ...
//
//   Purpose type: single | multi                  (new)
//   Description: <neutral text about the shape>   (new)
//   Old name: <name before a rename>              (new, only for renamed icons)
//   Deprecated purpose: <what the icon showed before, and which icon shows it now>   (new, only where the gallery has one)
//
// The Figma line "Keywords:" is the field `aliases` in the gallery file (both are search words).
//
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

export const CATEGORIES = [
  'Accessibility', 'Communication', 'Content and files', 'Data visualisation', 'Devices and tech', 'Interface',
  'Media player', 'Navigation', 'People and identity', 'Physical items and infrastructure', 'Social media', 'Status and feedback',
];

const LABELS = { 'Category': 'category', 'Keywords': 'keywords', 'Purpose type': 'purposeType', 'Description': 'description', 'Old name': 'oldName', 'Deprecated purpose': 'deprecatedPurpose' };

// ---------------------------------------------------------------- Figma description
export function parseDescription(text) {
  const out = { usage: '', category: null, keywords: null, purposeType: null, description: null, oldName: null, deprecatedPurpose: null, problems: [] };
  const src = String(text || '').replace(/\r\n?/g, '\n').trim();
  if (!src) { out.problems.push('description is empty'); return out; }
  let field = null; const usage = [];
  for (const line of src.split('\n')) {
    const m = /^(Category|Keywords|Purpose type|Description|Old name|Deprecated purpose):\s*(.*)$/.exec(line);
    if (m) { field = LABELS[m[1]]; out[field] = m[2].trim(); continue; }
    if (!line.trim()) { if (field) field = null; else if (usage.length) usage.push(''); continue; }
    if (field) out[field] += ' ' + line.trim();
    else usage.push(line.trim());
  }
  out.usage = usage.join('\n').trim();
  if (!out.usage) out.problems.push('no usage text before the labelled lines');
  if (out.keywords !== null) out.keywords = out.keywords.split(',').map((k) => k.trim()).filter(Boolean);
  return out;
}

// ---------------------------------------------------------------- gallery file icons.ts
const strings = (value) => [...String(value).matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)]
  .map((m) => (m[1] ?? m[2] ?? m[3]).replace(/\\(['"`\\nrt])/g, (x, c) => ({ n: '\n', r: '\r', t: '\t' }[c] || c)));

export function parseGalleryFile(src) {
  const entries = new Map(); let cur = null, key = null;
  const finish = () => {
    const f = (k) => (cur[k] === undefined ? null : strings(cur[k]).join(''));
    const name = f('name');
    if (name) entries.set(name, { name, purposeType: f('purpose'), usage: f('usage'), category: f('category'), keywords: cur.aliases === undefined ? [] : strings(cur.aliases), description: f('description'), oldName: f('oldName'), deprecatedPurpose: f('deprecatedPurpose') });
  };
  for (const raw of String(src).split('\n')) {
    if (/^\t\{\s*$/.test(raw)) { cur = {}; key = null; continue; }
    if (!cur) continue;
    if (/^\t\},?\s*$/.test(raw)) { finish(); cur = null; key = null; continue; }
    const m = /^\t\t(\w+):\s*(.*)$/.exec(raw);
    if (m) { key = m[1]; cur[key] = m[2]; continue; }
    if (key && raw.startsWith('\t\t\t')) cur[key] += '\n' + raw.trim();
  }
  return entries;
}

// ---------------------------------------------------------------- checks (used by validate-icon-set.mjs, rules M01 to M08)
export const norm = (s) => String(s ?? '').replace(/["'`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
export const kwSet = (list) => new Set((list || []).flatMap((x) => String(x).split(/[,\n]+/)).map((x) => x.trim().toLowerCase()).filter(Boolean));
const fmt = (s) => String(s ?? '').replace(/\s+/g, ' ').slice(0, 90);

// format of one parsed Figma description: M01 category, M02 keywords, M03 and M04 purpose type, M05 description
export function metadataFindings(p, categories = CATEGORIES) {
  const out = [];
  if (p.category !== null && !categories.includes(p.category)) out.push({ rule: 'M01', message: `category "${p.category}" is not one of the ${categories.length}` });
  if (p.keywords !== null) {
    if (!p.keywords.length) out.push({ rule: 'M02', message: 'keywords are empty' });
    const low = p.keywords.map((k) => k.toLowerCase());
    const dup = [...new Set(low.filter((k, i) => low.indexOf(k) !== i))];
    if (dup.length) out.push({ rule: 'M02', message: `repeated keywords: ${dup.join(', ')}` });
  }
  if (p.purposeType === null) out.push({ rule: 'M03', message: 'no line "Purpose type:" (single or multi)' });
  else if (!['single', 'multi'].includes(p.purposeType)) out.push({ rule: 'M04', message: `purpose type "${p.purposeType}" is not single or multi` });
  if (p.description === null) out.push({ rule: 'M05', message: 'no line "Description:"' });
  return out;
}

// M06: the texts of the Figma description against the gallery entry (new lines only when the description has them)
export function galleryDiffs(p, g) {
  const diffs = [];
  const add = (field, a, b) => diffs.push({ field, figma: fmt(a), gallery: fmt(b) });
  if (norm(p.usage) !== norm(g.usage)) add('usage', p.usage, g.usage);
  if (p.category !== g.category) add('category', p.category, g.category);
  const a = kwSet(p.keywords), b = kwSet(g.keywords);
  if (a.size !== b.size || [...a].some((k) => !b.has(k))) add('keywords', [...a].filter((k) => !b.has(k)).join(', ') || '(nothing more)', [...b].filter((k) => !a.has(k)).join(', ') || '(nothing more)');
  if (p.purposeType !== null && p.purposeType !== g.purposeType) add('purpose type', p.purposeType, g.purposeType);
  if (p.description !== null && norm(p.description) !== norm(g.description)) add('description', p.description, g.description);
  // the old name: compared when the description has the line, or when the new lines are written and the gallery has an old name
  const newLines = p.purposeType !== null || p.description !== null;
  if (p.oldName !== null ? p.oldName !== (g.oldName || '') : newLines && g.oldName) add('old name', p.oldName ?? '(no line)', g.oldName);
  // the deprecated purpose: the same rule as the old name
  if (p.deprecatedPurpose !== null ? norm(p.deprecatedPurpose) !== norm(g.deprecatedPurpose || '') : newLines && g.deprecatedPurpose) add('deprecated purpose', p.deprecatedPurpose ?? '(no line)', g.deprecatedPurpose);
  return diffs;
}

// The fields of the Figma description p that have a value and differ from the gallery entry g: what an export has to write
// (gallery-file.mjs). The counterpart of galleryDiffs for writing: a line that the description does not have or leaves
// empty never counts, so an export never deletes a field of the gallery. Same comparison as galleryDiffs (quotes and
// white space do not count, keywords are compared as a set).
export function changedFields(p, g) {
  const out = [];
  if (p.usage && norm(p.usage) !== norm(g.usage)) out.push('usage');
  if (p.category && p.category !== g.category) out.push('category');
  if (p.keywords && p.keywords.length) {
    const a = kwSet(p.keywords), b = kwSet(g.keywords);
    if (a.size !== b.size || [...a].some((k) => !b.has(k))) out.push('keywords');
  }
  if (p.purposeType && p.purposeType !== g.purposeType) out.push('purposeType');
  if (p.description && norm(p.description) !== norm(g.description)) out.push('description');
  if (p.oldName && p.oldName !== (g.oldName || '')) out.push('oldName');
  if (p.deprecatedPurpose && norm(p.deprecatedPurpose) !== norm(g.deprecatedPurpose || '')) out.push('deprecatedPurpose');
  return out;
}

// M08: the gallery keeps one keyword per entry
export function galleryFormat(g) {
  return g.keywords.some((k) => /[,\n]/.test(k)) ? ['several keywords are stored in one text'] : [];
}

// ---------------------------------------------------------------- the new lines (write-metadata.mjs)
// The description with the lines "Purpose type:", "Description:", "Old name:" and "Deprecated purpose:" taken from the gallery entry.
// The existing text stays byte for byte; only lines that are missing are added. Returns { text, added, skipped }:
// text is null when there is nothing to add; skipped names a line the gallery cannot give.
export function withNewLines(text, g) {
  const p = parseDescription(text);
  const lines = [], added = [], skipped = [];
  if (p.purposeType === null) {
    if (['single', 'multi'].includes(g.purposeType)) { lines.push(`Purpose type: ${g.purposeType}`); added.push('Purpose type'); }
    else skipped.push(`Purpose type (gallery says ${g.purposeType === null ? 'nothing' : `"${g.purposeType}"`})`);
  }
  if (p.description === null) {
    if (g.description && !/[\r\n]/.test(g.description)) { lines.push(`Description: ${g.description}`); added.push('Description'); }
    else skipped.push(g.description ? 'Description (several lines)' : 'Description (gallery has none)');
  }
  if (p.oldName === null && g.oldName) { lines.push(`Old name: ${g.oldName}`); added.push('Old name'); }
  if (p.deprecatedPurpose === null && g.deprecatedPurpose) {
    if (!/[\r\n]/.test(g.deprecatedPurpose)) { lines.push(`Deprecated purpose: ${g.deprecatedPurpose}`); added.push('Deprecated purpose'); }
    else skipped.push('Deprecated purpose (several lines)');
  }
  if (!lines.length) return { text: null, added, skipped };
  const hasNew = p.purposeType !== null || p.description !== null || p.oldName !== null || p.deprecatedPurpose !== null;
  return { text: String(text || '').replace(/\s+$/, '') + (hasNew ? '\n' : '\n\n') + lines.join('\n'), added, skipped };
}

// ---------------------------------------------------------------- comparison of two whole sets (compare-metadata.mjs)
// figma: Map(name -> description text); gallery: Map from parseGalleryFile
export function compareMetadata(figma, gallery) {
  const r = { names: figma.size, onlyInFigma: [], onlyInGallery: [], diffs: [], figmaProblems: [], galleryProblems: [], notYetWritten: { purposeType: [], description: [] }, equal: { usage: 0, category: 0, keywords: 0 } };
  for (const [name, desc] of figma) {
    const g = gallery.get(name);
    const p = parseDescription(desc);
    for (const x of p.problems) r.figmaProblems.push({ name, problem: x });
    for (const m of metadataFindings(p)) {
      if (m.rule === 'M03') r.notYetWritten.purposeType.push(name);
      else if (m.rule === 'M05') r.notYetWritten.description.push(name);
      else r.figmaProblems.push({ name, problem: m.message });
    }
    if (!g) { r.onlyInFigma.push(name); continue; }
    const diffs = galleryDiffs(p, g);
    for (const d of diffs) r.diffs.push({ name, ...d });
    for (const f of ['usage', 'category', 'keywords']) if (!diffs.some((d) => d.field === f)) r.equal[f]++;
  }
  for (const [name, g] of gallery) {
    if (!figma.has(name)) r.onlyInGallery.push(name);
    for (const m of galleryFormat(g)) r.galleryProblems.push({ name, problem: m });
  }
  return r;
}
