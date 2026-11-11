#!/usr/bin/env node
// compare-metadata.mjs — compare the icon texts of the Figma descriptions with the SDS gallery file icons.ts
// ----------------------------------------------------------------------------
// usage:
//   node compare-metadata.mjs --figma <export.json | descriptions.json> --gallery <icons.ts> [--json <file>] [--all]
//
//   --figma     the export of export-icon-set.js ({ icons: [{ name, figma: { description } }] })
//               or a list of [name, description] pairs; the prefix "icon/" of the name is ignored
//   --gallery   projects/sds/src/app/code-examples/code-examples/icons/previews/icons-gallery/icons.ts
//   --json      write every finding as JSON
//   --all       list every finding, not only the first ones
//
// Exit code 1 when a text differs, a name is missing on one side or a format problem exists. Writes nothing else.
// ----------------------------------------------------------------------------
import { readFileSync, writeFileSync } from 'node:fs';
import { parseGalleryFile, compareMetadata, CATEGORIES } from './metadata.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const figmaPath = opt('--figma'), galleryPath = opt('--gallery'), jsonOut = opt('--json'), all = args.includes('--all');
if (!figmaPath || !galleryPath) { console.error('usage: node compare-metadata.mjs --figma <export.json> --gallery <icons.ts> [--json <file>] [--all]'); process.exit(2); }

const raw = JSON.parse(readFileSync(figmaPath, 'utf8'));
const pairs = Array.isArray(raw) ? raw : (raw.icons || []).map((i) => [i.name, (i.figma && i.figma.description) || '']);
const figma = new Map(pairs.map(([name, desc]) => [String(name).replace(/^icon\//i, '').toLowerCase(), desc]));
const gallery = parseGalleryFile(readFileSync(galleryPath, 'utf8'));
const r = compareMetadata(figma, gallery);

const lim = (list) => (all ? list : list.slice(0, 8));
const lines = [];
lines.push(`Icon metadata: ${figma.size} in Figma, ${gallery.size} in the gallery file (${CATEGORIES.length} categories known)`);
lines.push(`Same text in both places: usage ${r.equal.usage}, category ${r.equal.category}, keywords ${r.equal.keywords} of ${figma.size - r.onlyInFigma.length}`);
const sec = (title, list, show) => { if (!list.length) return; lines.push('', `${title}: ${list.length}`); for (const x of lim(list)) lines.push('  ' + show(x)); if (!all && list.length > 8) lines.push(`  ... ${list.length - 8} more (--all)`); };
sec('Only in Figma', r.onlyInFigma, (x) => x);
sec('Only in the gallery file', r.onlyInGallery, (x) => x);
sec('Texts that differ', r.diffs, (d) => `${d.name} ${d.field}: figma [${d.figma}] gallery [${d.gallery}]`);
sec('Format problems in the Figma descriptions', r.figmaProblems, (p) => `${p.name}: ${p.problem}`);
sec('Format problems in the gallery file', r.galleryProblems, (p) => `${p.name}: ${p.problem}`);
lines.push('', `New lines not yet in the Figma descriptions: purpose type ${r.notYetWritten.purposeType.length}, description ${r.notYetWritten.description.length} (decided 2026-11-10, to be written)`);
console.log(lines.join('\n'));
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(r, null, 2));
process.exitCode = (r.diffs.length || r.onlyInFigma.length || r.onlyInGallery.length || r.figmaProblems.length || r.galleryProblems.length) ? 1 : 0;
