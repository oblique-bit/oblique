// changelog.mjs — what changed between two states of the icon set (functions of the command changelog.mjs)
// ----------------------------------------------------------------------------
// WHY: the changelog per release was written by hand (Confluence table: "Added icon", "Changed name", "Changed icon").
// A script reads two states of the set (two Git refs) and lists the same kinds of change, plus the texts.
//
// A change is one of:
//   Added icon      an SVG file that exists only in the newer state and is not a rename
//   Changed name    an SVG file that exists only in the newer state and one that exists only in the older state, which count
//                   as one icon when, in this order and only if the match is unique: (1) the gallery entry of the new one
//                   names the old one in its field oldName (case of the letters ignored), (2) both files have the same
//                   content (the same Git blob), a pure rename, (3) the names are the same apart from the case of the
//                   letters. The gallery keeps the legacy name in oldName, which is not always the file name of the older
//                   state (14.2.1 to 15.0.0: arrow_down-left became arrow_down_left, oldName says arrow-down-left).
//                   A rename together with a redraw is found only through (1) or (3); otherwise it is listed as one
//                   removed and one added icon.
//   Changed icon    the shape differs beyond compare.shapeTolerance (the validator, rule S16); a renamed icon is compared
//                   under its old name, so a rename and a redraw in one release are both listed
//   Changed texts   a field of the gallery entry differs: usage, category, keywords (as a set), purpose type, description,
//                   old name, deprecated purpose (the comparison of metadata.mjs: quotes and white space do not count)
//   Removed icon    an SVG file that exists only in the older state and is not renamed
//
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { norm, kwSet } from './metadata.mjs';

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// fromNames, toNames: Sets of icon names (SVG file names without extension); toGallery: Map(name -> entry) or null;
// blobs: { from: Map(name -> Git blob), to: Map(name -> Git blob) } or null
// A match counts only when it is unique. The three kinds of evidence are tried in this order.
export function classify(fromNames, toNames, toGallery, blobs = null) {
  const onlyFrom = new Set([...fromNames].filter((n) => !toNames.has(n)));
  const renamed = [];
  const take = (to, from, foundBy) => { renamed.push({ from, to, foundBy }); onlyFrom.delete(from); };
  const groupBy = (names, key) => { const g = new Map(); for (const n of names) { const k = key(n); if (k) g.set(k, [...(g.get(k) || []), n]); } return g; };
  const only = (g, k) => (k && g.has(k) && g.get(k).length === 1 ? g.get(k)[0] : null);
  let pending = [...toNames].filter((n) => !fromNames.has(n)).sort(cmp);

  // 1 the gallery entry of the new icon names the old file (the case of the letters does not count)
  let gone = groupBy(onlyFrom, (n) => n.toLowerCase());
  pending = pending.filter((n) => {
    const entry = toGallery && toGallery.get(n);
    const hit = only(gone, entry && entry.oldName && entry.oldName.toLowerCase());
    if (hit && onlyFrom.has(hit)) { take(n, hit, 'old name in the gallery'); return false; }
    return true;
  });

  // 2 the same content under another name: exactly one file is gone and exactly one is new with this blob
  if (blobs) {
    gone = groupBy(onlyFrom, (n) => blobs.from.get(n));
    const fresh = groupBy(pending, (n) => blobs.to.get(n));
    pending = pending.filter((n) => {
      const b = blobs.to.get(n), hit = only(gone, b);
      if (hit && onlyFrom.has(hit) && only(fresh, b) === n) { take(n, hit, 'same file content'); return false; }
      return true;
    });
  }

  // 3 the same name apart from the case of the letters (13.2.0 Database, 14.0.0 database)
  gone = groupBy(onlyFrom, (n) => n.toLowerCase());
  const fresh = groupBy(pending, (n) => n.toLowerCase());
  const added = pending.filter((n) => {
    const hit = only(gone, n.toLowerCase());
    if (hit && onlyFrom.has(hit) && only(fresh, n.toLowerCase()) === n) { take(n, hit, 'same name apart from case'); return false; }
    return true;
  });

  renamed.sort((a, b) => cmp(a.to, b.to));
  return { added, renamed, removed: [...onlyFrom].sort(cmp), common: [...fromNames].filter((n) => toNames.has(n)).sort(cmp) };
}

// the fields of two gallery entries that differ (a: older, b: newer)
export function textChanges(a, b) {
  const out = [];
  if (norm(a.usage) !== norm(b.usage)) out.push('usage');
  if ((a.category || '') !== (b.category || '')) out.push('category');
  const ka = kwSet(a.keywords), kb = kwSet(b.keywords);
  if (ka.size !== kb.size || [...ka].some((k) => !kb.has(k))) out.push('keywords');
  if ((a.purposeType || '') !== (b.purposeType || '')) out.push('purpose type');
  if (norm(a.description) !== norm(b.description)) out.push('description');
  if ((a.oldName || '') !== (b.oldName || '')) out.push('old name');
  if (norm(a.deprecatedPurpose) !== norm(b.deprecatedPurpose)) out.push('deprecated purpose');
  return out;
}

// ---------------------------------------------------------------- output
const cell = (s) => String(s ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
const csvField = (s) => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));

// report: { from, to: { ref, commit, date, count }, added: [{ name, category, purposeType, usage }], renamed: [{ from, to }],
//           shapeChanged: [{ name, detail }], textsChanged: [{ name, fields }], removed: [name], notes: [text] }
export function renderMarkdown(report) {
  const { from, to } = report;
  const label = (s) => `${s.ref} (${String(s.commit).slice(0, 9)}, ${String(s.date).slice(0, 10)})`;
  const L = [];
  L.push(`# Icon changelog ${from.ref} to ${to.ref}`, '');
  L.push('| | Older state | Newer state |', '|---|---|---|');
  L.push(`| Git ref | ${cell(label(from))} | ${cell(label(to))} |`, `| Icons | ${from.count} | ${to.count} |`, '');
  L.push(`Added icons: ${report.added.length}. Changed names: ${report.renamed.length}. Changed icons: ${report.shapeChanged.length}. Changed texts: ${report.textsChanged.length}. Removed icons: ${report.removed.length}.`, '');
  for (const n of report.notes) L.push(`Note: ${n}`, '');
  const table = (title, rows, head, line) => {
    L.push(`## ${title} (${rows.length})`, '');
    if (!rows.length) { L.push('None.', ''); return; }
    L.push(`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${line(r).map(cell).join(' | ')} |`), '');
  };
  table('Added icons', report.added, ['Icon', 'Category', 'Purpose type', 'Usage'], (a) => [a.name, a.category, a.purposeType, a.usage]);
  table('Changed names', report.renamed, ['New name', 'Old name', 'Found by'], (r) => [r.to, r.from, r.foundBy]);
  table('Changed icons', report.shapeChanged, ['Icon', 'Difference'], (s) => [s.name, s.detail]);
  table('Changed texts', report.textsChanged, ['Icon', 'Fields'], (t) => [t.name, t.fields.join(', ')]);
  table('Removed icons', report.removed, ['Icon'], (n) => [n]);
  return L.join('\n');
}

// one row per icon and kind of change: icon, change, detail (the words of the Confluence table)
export function renderCsv(report) {
  const rows = [['icon', 'change', 'detail']];
  for (const a of report.added) rows.push([a.name, 'Added icon', a.category || '']);
  for (const r of report.renamed) rows.push([r.to, 'Changed name', `was ${r.from}`]);
  for (const s of report.shapeChanged) rows.push([s.name, 'Changed icon', s.detail]);
  for (const t of report.textsChanged) rows.push([t.name, 'Changed texts', t.fields.join('; ')]);
  for (const n of report.removed) rows.push([n, 'Removed icon', '']);
  return rows.map((r) => r.map(csvField).join(',')).join('\n') + '\n';
}
