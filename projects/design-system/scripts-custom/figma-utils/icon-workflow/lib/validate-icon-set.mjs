// validate-icon-set.mjs — check an icon set: names, SVG colors, lines, geometry, Figma facts
// ----------------------------------------------------------------------------
// WHY: the icons reach the developers as SVG. The names, colors and shapes
// inside those SVG files decide whether the set can be used without rework.
//
// INPUT (one of):
//   - a JSON file written by export-icon-set.js (SVG plus Figma facts per icon)
//   - a folder with .svg files (recursive; the file name is the icon name,
//     the Figma checks are skipped)
//
// usage:
//   node validate-icon-set.mjs <icon-set.json | folder> [options]
//
// options:
//   --rules <file>        rule file (default: icon-set-rules.json in the icon-workflow folder)
//   --json <file>         write every finding and the measured facts as JSON
//   --all                 list every icon per rule, not only the first examples
//   --fail-on <level>     exit code 1 from this severity up: error (default) | warn | info
//   --against <input>     reference set (folder or export JSON): names and geometry must match it
//   --gallery <icons.ts>  compare the Figma descriptions with the SDS gallery file (rules M06 to M08)
//   --profile <name>      rule set: figma (default for an export), git (default for a folder; the root id="a" is required)
//                         or export (a folder of SVG files without the id, as export-svg.mjs writes them: the build adds the id)
//   --target <name>       the library the icons belong to, from the "targets" block of the rule file
//                         (name prefix, expected variable): legacy-library, ds-library
//   --list-rules          print the rule catalogue and exit
//
// Every rule has an id (N naming, S svg, C color and line, F figma). Its severity
// can be changed or switched off in the rule file under "severity", for example
// { "severity": { "N01": "error", "S10": "off" } }.
//
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, parseDescription, parseGalleryFile, metadataFindings, galleryDiffs, galleryFormat } from './metadata.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- rule catalogue
const RULES = {
  N01: ['error', 'naming', 'name is lowercase, words joined by "_" or "-"'],
  N02: ['info', 'naming', 'name uses both "_" and "-" (check: "_" joins object and modifier, "-" joins words of one expression)'],
  N03: ['error', 'naming', 'name is unique (case and "-" / "_" ignored)'],
  N04: ['error', 'naming', 'name has no whitespace, upper case or non-ASCII character'],
  N05: ['error', 'naming', 'component name starts with the icon prefix, case included'],
  N06: ['error', 'naming', 'label has no whitespace around the name'],
  N07: ['error', 'naming', 'label equals the icon name'],
  N08: ['warn', 'naming', 'every icon has a label'],
  N09: ['info', 'naming', 'the prefix group does not repeat the page and section name in the Figma assets path'],
  N10: ['error', 'naming', 'every icon of the reference set exists in this set'],
  N11: ['warn', 'naming', 'every icon of this set exists in the reference set'],
  S01: ['error', 'svg', 'SVG is well-formed XML'],
  S02: ['error', 'svg', 'one <svg> root with the SVG namespace'],
  S03: ['error', 'svg', 'viewBox equals the set viewBox'],
  S04: ['error', 'svg', 'width and height, when present, equal the set size in px'],
  S05: ['error', 'svg', 'only the allowed elements are used'],
  S06: ['error', 'svg', 'no forbidden attributes (id, class, style, transform, clip-path, ...)'],
  S07: ['warn', 'svg', 'no comments, XML declaration or doctype'],
  S08: ['error', 'svg', 'path data parses'],
  S09: ['error', 'svg', 'the shape stays inside the viewBox'],
  S10: ['warn', 'svg', 'padding to the viewBox edge is at least the set minimum'],
  S11: ['warn', 'svg', 'no two icons have the same artwork'],
  S12: ['warn', 'svg', 'path numbers have at most the set maximum of decimals'],
  S13: ['warn', 'svg', 'root attributes match the rest of the set'],
  S14: ['warn', 'svg', 'file has no byte order mark'],
  S15: ['warn', 'svg', 'no id attributes (unused ids collide when SVG files are inlined)'],
  S16: ['error', 'svg', 'geometry equals the reference set'],
  S17: ['error', 'svg', 'the root <svg> carries the id the set requires (Git files: "a", which update-icons.ts replaces with the icon id)'],
  C01: ['error', 'color', 'fill color is of an allowed kind'],
  C02: ['error', 'color', 'no stroke (line) unless the set allows lines'],
  C03: ['error', 'color', 'no opacity or alpha unless the set allows it'],
  C04: ['warn', 'color', 'one fill color per icon'],
  C05: ['warn', 'color', 'fill color equals the set color'],
  C06: ['warn', 'color', 'every shape has a fill (otherwise it renders black)'],
  C08: ['error', 'color', 'every shape is painted (fill none without a line draws nothing)'],
  C07: ['warn', 'color', 'line width, cap and join match the rest of the set'],
  F01: ['error', 'figma', 'icon is a single component: no variants, no component properties'],
  F02: ['error', 'figma', 'component size equals the set size'],
  F03: ['error', 'figma', 'component holds exactly one vector'],
  F04: ['warn', 'figma', 'vector layer has the expected name'],
  F05: ['error', 'figma', 'vector fill is bound to the expected local variable'],
  F06: ['error', 'figma', 'the color written in the paint equals the resolved variable color'],
  F07: ['error', 'figma', 'no stroke, effect, rotation, hidden layer or opacity'],
  F08: ['warn', 'figma', 'no explicit variable mode on the component'],
  F09: ['warn', 'figma', 'description is present and has the expected parts'],
  F10: ['error', 'figma', 'SVG fill color equals the resolved Figma variable color'],
  F11: ['error', 'figma', 'every node named like an icon is a component (no frame, instance or component set)'],
  F12: ['error', 'figma', 'no style on the component layer, no style on the vector'],
  M01: ['error', 'metadata', 'the category in the description is one of the categories of the set'],
  M02: ['warn', 'metadata', 'keywords are not empty and no keyword is repeated'],
  M03: ['info', 'metadata', 'the description has the line "Purpose type:" (single or multi)'],
  M04: ['error', 'metadata', 'the purpose type is single or multi'],
  M05: ['info', 'metadata', 'the description has the line "Description:"'],
  M06: ['error', 'metadata', 'usage, category, keywords, purpose type, description, old name and deprecated purpose equal the gallery entry'],
  M07: ['error', 'metadata', 'every icon has an entry in the gallery file and every entry has an icon'],
  M08: ['warn', 'metadata', 'the gallery file keeps one keyword per entry'],
};

// Rules that come from the icon checklist of the design team; the others are added checks.
const CHECKLIST = new Set(['N01', 'N05', 'F01', 'F02', 'F03', 'F05', 'F07', 'F11', 'F12']);
// Checklist rules that come from OB legacy and are open for the design system.
const UNDER_REVIEW = new Set();

const DEFAULTS = {
  namePrefix: 'icon/',
  naming: {
    pattern: '^[a-z][a-z0-9]*([_-][a-z0-9]+)*$',
  },
  svg: {
    viewBox: '0 0 24 24',
    size: 24,
    allowedElements: ['svg', 'path'],
    forbiddenAttributes: ['class', 'style', 'transform', 'clip-path', 'mask', 'filter'],
    forbiddenAttributePrefixes: ['data-', 'on'],
    minPadding: null,
    maxDecimals: null,
    rootId: null,
  },
  colors: {
    allowedKinds: ['hex', 'currentColor', 'none'],
    expected: null,
    allowOpacity: false,
    allowImplicitFill: false,
  },
  stroke: { allowed: false },
  compare: { tolerance: 0.01, shapeTolerance: 0.05 },
  profiles: {},
  targets: {},
  figma: {
    expectedVariable: null,
    childName: null,
    descriptionPattern: 'Category:[\\s\\S]*Keywords:',
  },
  metadata: { categories: CATEGORIES, galleryPath: null },
  severity: {},
};

// ---------------------------------------------------------------- small helpers
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
const merge = (base, over) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(over || {})) out[k] = isObject(v) && isObject(base[k]) ? merge(base[k], v) : v;
  return out;
};
const count = (list) => list.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
const majority = (list) => {
  const sorted = [...count(list).entries()].sort((a, b) => b[1] - a[1]);
  return sorted.length ? { value: sorted[0][0], n: sorted[0][1], total: list.length } : null;
};
const show = (s) => JSON.stringify(s);
const listNames = (icons, max = 3) => icons.slice(0, max).map((x) => show(x.short)).join(', ') + (icons.length > max ? ` and ${icons.length - max} more` : '');

// ---------------------------------------------------------------- XML reader
function parseXml(source) {
  const info = { bom: false, xmlDecl: false, doctype: false, comments: 0 };
  const errors = [];
  let src = source;
  if (src.charCodeAt(0) === 0xfeff) { info.bom = true; src = src.slice(1); }
  const doc = { name: '#document', attrs: {}, children: [], parent: null };
  const stack = [doc];
  const tagRe = /<(\/)?([^\s/>!?][^\s/>]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/y;
  const attrRe = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
  const text = (t, at) => {
    if (!t.trim()) return;
    if (stack.length === 1) errors.push(`text outside the root element: ${show(t.trim().slice(0, 30))}`);
    else stack[stack.length - 1].text = true;
  };
  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) { text(src.slice(i)); break; }
    if (lt > i) text(src.slice(i, lt));
    if (src.startsWith('<!--', lt)) {
      const e = src.indexOf('-->', lt + 4);
      if (e < 0) { errors.push('unterminated comment'); break; }
      info.comments++; i = e + 3; continue;
    }
    if (src.startsWith('<![CDATA[', lt)) {
      const e = src.indexOf(']]>', lt);
      if (e < 0) { errors.push('unterminated CDATA section'); break; }
      stack[stack.length - 1].text = true; i = e + 3; continue;
    }
    if (src.startsWith('<?', lt)) {
      const e = src.indexOf('?>', lt);
      if (e < 0) { errors.push('unterminated processing instruction'); break; }
      if (/^<\?xml[\s?]/.test(src.slice(lt, lt + 7))) info.xmlDecl = true;
      i = e + 2; continue;
    }
    if (src.startsWith('<!', lt)) {
      const e = src.indexOf('>', lt);
      if (e < 0) { errors.push('unterminated declaration'); break; }
      info.doctype = true; i = e + 1; continue;
    }
    tagRe.lastIndex = lt;
    const m = tagRe.exec(src);
    if (!m) { errors.push(`malformed tag near ${show(src.slice(lt, lt + 30))}`); break; }
    i = tagRe.lastIndex;
    const closing = !!m[1];
    const name = m[2];
    let rest = m[3];
    if (closing) {
      const top = stack[stack.length - 1];
      if (stack.length === 1 || top.name !== name) errors.push(`closing </${name}> does not match ${stack.length === 1 ? 'any open element' : '<' + top.name + '>'}`);
      else stack.pop();
      continue;
    }
    const selfClosing = /\/\s*$/.test(rest);
    if (selfClosing) rest = rest.replace(/\/\s*$/, '');
    const attrs = {};
    let a;
    attrRe.lastIndex = 0;
    while ((a = attrRe.exec(rest))) {
      if (a[1] in attrs) errors.push(`duplicate attribute ${a[1]} on <${name}>`);
      attrs[a[1]] = a[2] !== undefined ? a[2] : (a[3] !== undefined ? a[3] : '');
    }
    const node = { name, attrs, children: [], parent: stack[stack.length - 1] };
    node.parent.children.push(node);
    if (!selfClosing) stack.push(node);
  }
  if (stack.length > 1) errors.push(`unclosed element <${stack[stack.length - 1].name}>`);
  const roots = doc.children;
  if (roots.length === 0) errors.push('no root element');
  if (roots.length > 1) errors.push(`${roots.length} root elements`);
  return { doc, root: roots[0] || null, errors, info };
}

const walk = (node, fn) => { fn(node); for (const c of node.children) walk(c, fn); };

// ---------------------------------------------------------------- colors
const NAMED = new Set(['black', 'white', 'red', 'green', 'blue', 'gray', 'grey', 'silver', 'maroon', 'purple', 'fuchsia', 'lime', 'olive', 'yellow', 'navy', 'teal', 'aqua', 'orange']);
function parseColor(value) {
  const v = String(value).trim();
  const l = v.toLowerCase();
  if (l === 'none') return { kind: 'none' };
  if (l === 'currentcolor') return { kind: 'currentColor' };
  if (l === 'transparent') return { kind: 'transparent', alpha: 0 };
  if (l === 'inherit') return { kind: 'inherit' };
  let m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(l);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    return { kind: 'hex', hex: '#' + h.slice(0, 6), alpha: h.length === 8 ? round(parseInt(h.slice(6), 16) / 255, 3) : 1 };
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/.exec(l);
  if (m) {
    const hx = [m[1], m[2], m[3]].map((x) => Math.round(Number(x)).toString(16).padStart(2, '0')).join('');
    let alpha = 1;
    if (m[4] !== undefined) alpha = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : Number(m[4]);
    return { kind: 'rgb', hex: '#' + hx, alpha };
  }
  if (l.startsWith('url(')) return { kind: 'url' };
  if (l.startsWith('var(')) return { kind: 'var' };
  if (NAMED.has(l)) return { kind: 'named' };
  return { kind: 'other' };
}
const colorKey = (c) => (c.hex ? c.hex : c.kind);

// ---------------------------------------------------------------- path data
function analyzePath(d) {
  const res = { error: null, bbox: null, subpaths: 0, unclosed: 0, maxDecimals: 0, norm: '' };
  const s = d;
  const n = s.length;
  let i = 0;
  const numRe = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/y;
  const skip = () => { while (i < n && /[\s,]/.test(s[i])) i++; };
  const num = () => {
    skip();
    numRe.lastIndex = i;
    const m = numRe.exec(s);
    if (!m) return null;
    i = numRe.lastIndex;
    res.maxDecimals = Math.max(res.maxDecimals, (m[0].split(/[eE]/)[0].split('.')[1] || '').length);
    return parseFloat(m[0]);
  };
  const flag = () => { skip(); const c = s[i]; if (c === '0' || c === '1') { i++; return Number(c); } return null; };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const pt = (x, y) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; };
  const cubic = (x0, y0, x1, y1, x2, y2, x3, y3) => { for (let k = 1; k <= 64; k++) { const t = k / 64, u = 1 - t; pt(u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3, u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3); } };
  const quad = (x0, y0, x1, y1, x2, y2) => { for (let k = 1; k <= 64; k++) { const t = k / 64, u = 1 - t; pt(u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2); } };
  const arc = (x1, y1, rx, ry, phiDeg, fa, fs, x2, y2) => {
    if (rx === 0 || ry === 0) { pt(x2, y2); return; }
    rx = Math.abs(rx); ry = Math.abs(ry);
    const phi = (phiDeg * Math.PI) / 180, cp = Math.cos(phi), sp = Math.sin(phi);
    const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
    const x1p = cp * dx + sp * dy, y1p = -sp * dx + cp * dy;
    const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (lam > 1) { const k = Math.sqrt(lam); rx *= k; ry *= k; }
    const num2 = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
    const co = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num2 / den));
    const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
    const cx = cp * cxp - sp * cyp + (x1 + x2) / 2, cy = sp * cxp + cp * cyp + (y1 + y2) / 2;
    const ang = (ux, uy, vx, vy) => { const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a; };
    let th1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
    let dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
    if (!fs && dth > 0) dth -= 2 * Math.PI;
    if (fs && dth < 0) dth += 2 * Math.PI;
    for (let k = 1; k <= 64; k++) { const t = th1 + (dth * k) / 64; pt(cp * rx * Math.cos(t) - sp * ry * Math.sin(t) + cx, sp * rx * Math.cos(t) + cp * ry * Math.sin(t) + cy); }
  };

  let cmd = null, cx = 0, cy = 0, sx = 0, sy = 0, open = false, lcx = 0, lcy = 0, lastCmd = null;
  const fail = (msg) => { res.error = `${msg} at position ${i}`; };
  const norm = [];
  const segs = [];
  res.segs = segs;
  while (!res.error) {
    skip();
    if (i >= n) break;
    const ch = s[i];
    if (/[A-Za-z]/.test(ch)) {
      if (!'MmLlHhVvCcSsQqTtAaZz'.includes(ch)) { fail(`unknown command ${ch}`); break; }
      cmd = ch; i++; norm.push(cmd);
      if (cmd === 'Z' || cmd === 'z') { if (open) open = false; cx = sx; cy = sy; lastCmd = 'Z'; segs.push(['Z']); continue; }
    } else {
      if (cmd === null) { fail('path data does not start with a command'); break; }
      if (cmd === 'Z' || cmd === 'z') { fail('number after Z'); break; }
      if (cmd === 'M') cmd = 'L'; else if (cmd === 'm') cmd = 'l';
    }
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const need = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }[C];
    const v = [];
    for (let k = 0; k < need; k++) {
      const x = C === 'A' && (k === 3 || k === 4) ? flag() : num();
      if (x === null) { fail(`command ${cmd} needs ${need} numbers`); break; }
      v.push(x);
    }
    if (res.error) break;
    norm.push(...v.map((x) => String(round(x, 3))));
    const ox = rel ? cx : 0, oy = rel ? cy : 0;
    if (C === 'M') {
      if (open) res.unclosed++;
      cx = v[0] + ox; cy = v[1] + oy; sx = cx; sy = cy; open = true; res.subpaths++; pt(cx, cy); segs.push(['M', cx, cy]);
    } else {
      if (lastCmd === 'Z') { sx = cx; sy = cy; open = true; res.subpaths++; }
      if (C === 'L') { cx = v[0] + ox; cy = v[1] + oy; pt(cx, cy); segs.push(['L', cx, cy]); }
      else if (C === 'H') { cx = v[0] + ox; pt(cx, cy); segs.push(['L', cx, cy]); }
      else if (C === 'V') { cy = v[0] + oy; pt(cx, cy); segs.push(['L', cx, cy]); }
      else if (C === 'C') { const x1 = v[0] + ox, y1 = v[1] + oy, x2 = v[2] + ox, y2 = v[3] + oy, x3 = v[4] + ox, y3 = v[5] + oy; cubic(cx, cy, x1, y1, x2, y2, x3, y3); segs.push(['C', x1, y1, x2, y2, x3, y3]); lcx = x2; lcy = y2; cx = x3; cy = y3; }
      else if (C === 'S') { const rx1 = (lastCmd === 'C' || lastCmd === 'S') ? 2 * cx - lcx : cx, ry1 = (lastCmd === 'C' || lastCmd === 'S') ? 2 * cy - lcy : cy; const x2 = v[0] + ox, y2 = v[1] + oy, x3 = v[2] + ox, y3 = v[3] + oy; cubic(cx, cy, rx1, ry1, x2, y2, x3, y3); segs.push(['C', rx1, ry1, x2, y2, x3, y3]); lcx = x2; lcy = y2; cx = x3; cy = y3; }
      else if (C === 'Q') { const x1 = v[0] + ox, y1 = v[1] + oy, x2 = v[2] + ox, y2 = v[3] + oy; quad(cx, cy, x1, y1, x2, y2); segs.push(['Q', x1, y1, x2, y2]); lcx = x1; lcy = y1; cx = x2; cy = y2; }
      else if (C === 'T') { const x1 = (lastCmd === 'Q' || lastCmd === 'T') ? 2 * cx - lcx : cx, y1 = (lastCmd === 'Q' || lastCmd === 'T') ? 2 * cy - lcy : cy; const x2 = v[0] + ox, y2 = v[1] + oy; quad(cx, cy, x1, y1, x2, y2); segs.push(['Q', x1, y1, x2, y2]); lcx = x1; lcy = y1; cx = x2; cy = y2; }
      else if (C === 'A') { const x2 = v[5] + ox, y2 = v[6] + oy; arc(cx, cy, v[0], v[1], v[2], v[3], v[4], x2, y2); segs.push(['A', v[0], v[1], v[2], v[3], v[4], x2, y2]); cx = x2; cy = y2; }
      open = true;
    }
    lastCmd = C;
  }
  if (!res.error && open) res.unclosed++;
  if (!res.error && res.subpaths === 0) res.error = 'path data has no drawing command';
  if (!res.error && minX !== Infinity) res.bbox = [minX, minY, maxX, maxY];
  res.norm = norm.join(' ');
  return res;
}

// Compare two lists of absolute segments. Returns null when equal within tol, else a short reason.
function geometryDiff(a, b, tol) {
  if (a.length !== b.length) return `${a.length} segments against ${b.length}`;
  for (let k = 0; k < a.length; k++) {
    const x = a[k], y = b[k];
    if (x[0] !== y[0]) return `segment ${k + 1} is ${x[0]} against ${y[0]}`;
    for (let j = 1; j < x.length; j++) {
      const isFlag = x[0] === 'A' && (j === 4 || j === 5);
      if (isFlag ? x[j] !== y[j] : Math.abs(x[j] - y[j]) > tol) return `segment ${k + 1} (${x[0]}) differs by ${round(Math.abs(x[j] - y[j]), 3)}`;
    }
  }
  return null;
}

// Outline distance between two shapes, so that a different path notation (Figma turns
// quadratic curves into cubic ones and adds or drops closing segments) does not count as a
// different shape. Returns the largest distance from a point of one outline to the other.
function flatten(segs, steps = 16) {
  const polys = [];
  let cur = null, cx = 0, cy = 0, sx = 0, sy = 0;
  const push = (x, y) => { cur.push([x, y]); cx = x; cy = y; };
  for (const g of segs) {
    if (g[0] === 'M') { cur = []; polys.push(cur); push(g[1], g[2]); sx = cx; sy = cy; }
    else if (g[0] === 'Z') { if (cur) push(sx, sy); }
    else if (g[0] === 'P') { cur = null; }
    else {
      if (!cur) { cur = []; polys.push(cur); cur.push([cx, cy]); }
      const x0 = cx, y0 = cy;
      if (g[0] === 'L') push(g[1], g[2]);
      else if (g[0] === 'C') { for (let k = 1; k <= steps; k++) { const t = k / steps, u = 1 - t; push(u ** 3 * x0 + 3 * u * u * t * g[1] + 3 * u * t * t * g[3] + t ** 3 * g[5], u ** 3 * y0 + 3 * u * u * t * g[2] + 3 * u * t * t * g[4] + t ** 3 * g[6]); } }
      else if (g[0] === 'Q') { for (let k = 1; k <= steps; k++) { const t = k / steps, u = 1 - t; push(u * u * x0 + 2 * u * t * g[1] + t * t * g[3], u * u * y0 + 2 * u * t * g[2] + t * t * g[4]); } }
      else if (g[0] === 'A') push(g[6], g[7]);
    }
  }
  return polys.filter((p) => p.length > 1);
}
function distToPolys(x, y, polys) {
  let best = Infinity;
  for (const poly of polys) {
    for (let k = 1; k < poly.length; k++) {
      const [ax, ay] = poly[k - 1], [bx, by] = poly[k];
      const dx = bx - ax, dy = by - ay;
      const len2 = dx * dx + dy * dy;
      const t = len2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2)) : 0;
      const ex = ax + t * dx - x, ey = ay + t * dy - y;
      const d = ex * ex + ey * ey;
      if (d < best) best = d;
    }
  }
  return Math.sqrt(best);
}
function shapeDistance(segsA, segsB) {
  const a = flatten(segsA), b = flatten(segsB);
  let worst = 0;
  for (const poly of a) for (const [x, y] of poly) worst = Math.max(worst, distToPolys(x, y, b));
  for (const poly of b) for (const [x, y] of poly) worst = Math.max(worst, distToPolys(x, y, a));
  return worst;
}

// ---------------------------------------------------------------- one icon
const SHAPES = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon']);
// Shapes inside these containers are not drawn, so their paint does not count.
const NOT_RENDERED = new Set(['defs', 'clipPath', 'mask', 'pattern', 'marker', 'symbol', 'filter', 'linearGradient', 'radialGradient']);
const isRendered = (node) => { for (let n = node.parent; n && n.name !== '#document'; n = n.parent) if (NOT_RENDERED.has(n.name)) return false; return true; };
const STYLE_PROPS = /(fill|stroke|opacity|fill-opacity|stroke-opacity|stroke-width|stroke-linecap|stroke-linejoin)\s*:\s*([^;]+)/g;

function inspectSvg(icon, cfg) {
  const out = { parse: null, root: null, elements: [], fills: [], strokes: [], opacity: false, forbidden: [], ids: [], badElements: [], paths: [], bbox: null, decimals: 0, norm: '', unclosed: 0, noFill: false, viewBox: null, segs: [] };
  if (typeof icon.svg !== 'string') return out;
  out.bytes = Buffer.byteLength(icon.svg);
  const parsed = parseXml(icon.svg);
  out.parse = parsed;
  const root = parsed.root;
  out.root = root;
  if (!root) return out;
  const allowed = new Set(cfg.svg.allowedElements);
  const forbiddenAttr = new Set(cfg.svg.forbiddenAttributes);
  const prefixes = cfg.svg.forbiddenAttributePrefixes;
  let transformSeen = false;
  walk(root, (node) => {
    out.elements.push(node.name);
    if (!allowed.has(node.name)) out.badElements.push(node.name);
    if ('id' in node.attrs) out.ids.push(`${node.attrs.id} on <${node.name}>`);
    for (const a of Object.keys(node.attrs)) {
      if (forbiddenAttr.has(a) || prefixes.some((p) => a.startsWith(p) && (p !== 'on' || /^on[a-z]+$/.test(a)))) out.forbidden.push(`${a} on <${node.name}>`);
      if (a === 'transform') transformSeen = true;
    }
  });
  out.transform = transformSeen;
  out.viewBox = root.attrs.viewBox !== undefined ? root.attrs.viewBox.trim().split(/[\s,]+/).map(Number) : null;

  // paint resolution with inheritance and style="" values
  const attr = (node, name) => {
    if (name in node.attrs) return node.attrs[name];
    if (node.attrs.style) { let m; STYLE_PROPS.lastIndex = 0; while ((m = STYLE_PROPS.exec(node.attrs.style))) if (m[1] === name) return m[2].trim(); }
    return undefined;
  };
  const inherited = (node, name) => { for (let n = node; n && n.name !== '#document'; n = n.parent) { const v = attr(n, name); if (v !== undefined) return v; } return undefined; };
  walk(root, (node) => {
    for (const p of ['opacity', 'fill-opacity', 'stroke-opacity']) { const v = attr(node, p); if (v !== undefined && Number(v) < 1) out.opacity = true; }
    if (!SHAPES.has(node.name) || !isRendered(node)) return;
    const fill = inherited(node, 'fill');
    if (fill === undefined) out.noFill = true;
    const strokeRaw = inherited(node, 'stroke');
    if (fill !== undefined && parseColor(fill).kind === 'none' && (strokeRaw === undefined || parseColor(strokeRaw).kind === 'none')) out.unpainted = true;
    const fc = parseColor(fill === undefined ? '#000000' : fill);
    out.fills.push({ el: node.name, raw: fill, color: fc, implicit: fill === undefined });
    if (fc.alpha !== undefined && fc.alpha < 1 && fc.kind !== 'transparent') out.opacity = true;
    const stroke = inherited(node, 'stroke');
    if (stroke !== undefined && parseColor(stroke).kind !== 'none') {
      out.strokes.push({ el: node.name, color: parseColor(stroke), width: inherited(node, 'stroke-width'), cap: inherited(node, 'stroke-linecap'), join: inherited(node, 'stroke-linejoin') });
      if (parseColor(stroke).alpha !== undefined && parseColor(stroke).alpha < 1) out.opacity = true;
    }
    if (node.name === 'path') {
      const d = analyzePath(node.attrs.d || '');
      out.paths.push(d);
    }
  });
  const ok = out.paths.filter((p) => !p.error && p.bbox);
  if (ok.length && !out.transform) out.bbox = [Math.min(...ok.map((p) => p.bbox[0])), Math.min(...ok.map((p) => p.bbox[1])), Math.max(...ok.map((p) => p.bbox[2])), Math.max(...ok.map((p) => p.bbox[3]))];
  out.decimals = Math.max(0, ...out.paths.map((p) => p.maxDecimals));
  out.unclosed = out.paths.reduce((a, p) => a + p.unclosed, 0);
  out.norm = out.paths.map((p) => p.norm).join(' | ');
  out.segs = out.paths.filter((p) => !p.error).flatMap((p, k) => (k ? [['P']] : []).concat(p.segs));
  return out;
}

// ---------------------------------------------------------------- the checks
function validate(icons, cfg, origin, strays = [], source = {}, reference = null, gallery = null) {
  const findings = [];
  const sev = (id) => (cfg.severity[id] !== undefined ? cfg.severity[id] : RULES[id][0]);
  const add = (id, icon, message) => { const s = sev(id); if (s !== 'off') findings.push({ rule: id, severity: s, icon: icon.short, message }); };
  const prefix = cfg.namePrefix || '';
  const pattern = new RegExp(cfg.naming.pattern);
  const vb = cfg.svg.viewBox.trim().split(/[\s,]+/).map(Number);

  for (const icon of icons) icon.short = prefix && icon.name.toLowerCase().startsWith(prefix.toLowerCase()) ? icon.name.slice(prefix.length) : icon.name;
  const inspected = new Map(icons.map((i) => [i, inspectSvg(i, cfg)]));

  // --- naming
  const groups = new Map();
  for (const icon of icons) {
    const n = icon.short;
    if (origin === 'figma' && prefix && !icon.name.startsWith(prefix)) add('N05', icon, `name ${show(icon.name)} does not start with ${show(prefix)}`);
    if (/\s/.test(n) || /[A-Z]/.test(n) || /[^\x21-\x7e]/.test(n)) add('N04', icon, `name ${show(n)} has whitespace, upper case or a non-ASCII character`);
    else {
      if (!pattern.test(n)) add('N01', icon, `name ${show(n)} does not match ${cfg.naming.pattern}`);
      if (n.includes('-') && n.includes('_')) add('N02', icon, `name ${show(n)} uses "_" and "-"`);
    }
    const key = n.toLowerCase().replace(/-/g, '_');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(icon);
    if (origin === 'figma') {
      const f = icon.figma;
      if (f.label === null || f.label === undefined) add('N08', icon, 'no label found next to the icon');
      else {
        if (f.label !== f.label.trim()) add('N06', icon, `label ${show(f.label)} has whitespace around the name`);
        if (f.label.trim() !== n) add('N07', icon, `label ${show(f.label.trim())} differs from the name ${show(n)}`);
      }
    }
  }
  for (const [, members] of groups) if (members.length > 1) for (const m of members) add('N03', m, `name clashes with ${listNames(members.filter((x) => x !== m))}`);

  // --- svg
  const rootSigs = [];
  const colorSets = [];
  const strokeSigs = [];
  const artwork = new Map();
  for (const icon of icons) {
    const r = inspected.get(icon);
    if (typeof icon.svg !== 'string') continue;
    if (r.parse.info.bom) add('S14', icon, 'file starts with a byte order mark');
    if (r.parse.errors.length) { add('S01', icon, r.parse.errors.join('; ')); continue; }
    if (r.parse.info.comments || r.parse.info.xmlDecl || r.parse.info.doctype) add('S07', icon, `contains ${[r.parse.info.comments && `${r.parse.info.comments} comment(s)`, r.parse.info.xmlDecl && 'an XML declaration', r.parse.info.doctype && 'a doctype'].filter(Boolean).join(', ')}`);
    const root = r.root;
    if (root.name !== 'svg' || root.attrs.xmlns !== 'http://www.w3.org/2000/svg') add('S02', icon, `root is <${root.name}> with xmlns ${show(root.attrs.xmlns)}`);
    if (!r.viewBox) add('S03', icon, 'viewBox is missing');
    else if (r.viewBox.length !== 4 || r.viewBox.some((x, k) => x !== vb[k])) add('S03', icon, `viewBox is ${show(root.attrs.viewBox)}, expected ${show(cfg.svg.viewBox)}`);
    for (const a of ['width', 'height']) {
      if (root.attrs[a] !== undefined) { const m = /^(\d+(?:\.\d+)?)(px)?$/.exec(root.attrs[a].trim()); if (!m || Number(m[1]) !== cfg.svg.size) add('S04', icon, `${a} is ${show(root.attrs[a])}, expected ${cfg.svg.size}`); }
    }
    if (r.badElements.length) add('S05', icon, `element not allowed: ${[...new Set(r.badElements)].map((e) => '<' + e + '>').join(', ')}`);
    if (r.forbidden.length) add('S06', icon, `forbidden attribute: ${r.forbidden.join(', ')}`);
    // the id the set requires on the root (git profile: "a") is expected, so it is neither a finding of S15 nor missing
    if (cfg.svg.rootId) {
      if (root.attrs.id !== cfg.svg.rootId) add('S17', icon, root.attrs.id === undefined ? `root <svg> has no id, expected ${show(cfg.svg.rootId)}` : `root <svg> has id ${show(root.attrs.id)}, expected ${show(cfg.svg.rootId)}`);
    }
    const otherIds = cfg.svg.rootId ? r.ids.filter((x) => x !== `${cfg.svg.rootId} on <svg>`) : r.ids;
    if (otherIds.length) add('S15', icon, `id attribute: ${otherIds.join(', ')}`);
    for (const p of r.paths) if (p.error) add('S08', icon, p.error);
    if (r.bbox && r.viewBox && r.viewBox.length === 4) {
      const [x0, y0, x1, y1] = r.bbox;
      const [vx, vy, vw, vh] = r.viewBox;
      const pad = Math.min(x0 - vx, y0 - vy, vx + vw - x1, vy + vh - y1);
      icon.padding = round(pad, 2);
      icon.extent = [round(x1 - x0, 2), round(y1 - y0, 2)];
      if (pad < -0.01) add('S09', icon, `shape reaches ${round(-pad, 2)} outside the viewBox`);
      else if (cfg.svg.minPadding !== null && pad < cfg.svg.minPadding - 0.01) add('S10', icon, `padding ${round(pad, 2)} is below ${cfg.svg.minPadding}`);
    }
    if (cfg.svg.maxDecimals !== null && r.decimals > cfg.svg.maxDecimals) add('S12', icon, `${r.decimals} decimals, maximum ${cfg.svg.maxDecimals}`);
    rootSigs.push(Object.keys(root.attrs).sort().join(',') + (root.attrs.fill ? ` fill=${root.attrs.fill}` : ''));
    if (r.norm) { if (!artwork.has(r.norm)) artwork.set(r.norm, []); artwork.get(r.norm).push(icon); }

    // --- colors and lines
    const kinds = r.fills.map((f) => f.color.kind);
    for (const f of r.fills) if (!f.implicit && !cfg.colors.allowedKinds.includes(f.color.kind)) add('C01', icon, `fill ${show(f.raw)} is of kind ${f.color.kind}; allowed: ${cfg.colors.allowedKinds.join(', ')}`);
    if (r.noFill && !cfg.colors.allowImplicitFill) add('C06', icon, 'a shape has no fill, it renders black');
    if (r.unpainted) add('C08', icon, 'a shape has fill none and no line, it draws nothing');
    if (r.strokes.length && !cfg.stroke.allowed) add('C02', icon, `line (stroke) on ${[...new Set(r.strokes.map((s) => '<' + s.el + '>'))].join(', ')}${r.strokes[0].width ? `, width ${r.strokes[0].width}` : ''}`);
    if (r.opacity && !cfg.colors.allowOpacity) add('C03', icon, 'opacity or alpha below 1');
    const set = [...new Set(r.fills.filter((f) => !['none', 'currentColor'].includes(f.color.kind) || f.implicit).map((f) => (f.implicit ? 'implicit' : colorKey(f.color))))].sort();
    colorSets.push({ icon, set });
    if (set.length > 1) add('C04', icon, `${set.length} fill colors: ${set.join(', ')}`);
    if (r.strokes.length && cfg.stroke.allowed) strokeSigs.push({ icon, sig: r.strokes.map((s) => `${s.width || '-'}|${s.cap || '-'}|${s.join || '-'}`).sort().join(';') });
  }
  const rootMaj = majority(rootSigs);
  if (rootMaj) for (const icon of icons) { const r = inspected.get(icon); if (r.root && !r.parse.errors.length) { const sig = Object.keys(r.root.attrs).sort().join(',') + (r.root.attrs.fill ? ` fill=${r.root.attrs.fill}` : ''); if (sig !== rootMaj.value) add('S13', icon, `root attributes ${show(sig)} differ from ${rootMaj.n} of ${rootMaj.total} icons: ${show(rootMaj.value)}`); } }
  for (const [, members] of artwork) if (members.length > 1) for (const m of members) add('S11', m, `same artwork as ${listNames(members.filter((x) => x !== m))}`);
  let expectedColor = cfg.colors.expected ? cfg.colors.expected.toLowerCase() : null;
  const colorMaj = majority(colorSets.map((c) => c.set.join('+')));
  if (!expectedColor && colorMaj && colorMaj.value) expectedColor = colorMaj.value;
  if (expectedColor) for (const { icon, set } of colorSets) if (set.length === 1 && set[0].startsWith('#') && set[0] !== expectedColor) add('C05', icon, `fill ${set[0]} differs from the set color ${expectedColor}${cfg.colors.expected ? '' : ` (used by ${colorMaj.n} of ${colorMaj.total} icons)`}`);
  const strokeMaj = majority(strokeSigs.map((s) => s.sig));
  if (strokeMaj) for (const s of strokeSigs) if (s.sig !== strokeMaj.value) add('C07', s.icon, `line ${show(s.sig)} differs from ${strokeMaj.n} of ${strokeMaj.total}: ${show(strokeMaj.value)}`);

  // --- figma
  if (origin === 'figma') {
    const descRe = cfg.figma.descriptionPattern ? new RegExp(cfg.figma.descriptionPattern) : null;
    for (const icon of icons) {
      const f = icon.figma;
      if (f.parentType === 'COMPONENT_SET' || f.componentProperties.length) add('F01', icon, f.parentType === 'COMPONENT_SET' ? 'icon is a variant of a component set' : `component properties: ${f.componentProperties.join(', ')}`);
      if (f.width !== cfg.svg.size || f.height !== cfg.svg.size) add('F02', icon, `component is ${f.width}x${f.height}, expected ${cfg.svg.size}x${cfg.svg.size}`);
      if (f.children.length !== 1 || f.children[0].type !== 'VECTOR') { add('F03', icon, `children: ${f.children.map((c) => c.type).join(', ') || 'none'}; expected one VECTOR`); }
      const v = f.children[0];
      if (v && v.type === 'VECTOR') {
        if (cfg.figma.childName && v.name !== cfg.figma.childName) add('F04', icon, `vector layer is named ${show(v.name)}, expected ${show(cfg.figma.childName)}`);
        const paints = Array.isArray(v.fills) ? v.fills : [];
        if (paints.length !== 1) add('F05', icon, `${paints.length} fills on the vector`);
        else {
          const p = paints[0];
          const expectedVars = [].concat(cfg.figma.expectedVariable || []);
          if (expectedVars.length && !expectedVars.includes(p.boundVariable)) add('F05', icon, `fill is bound to ${show(p.boundVariable)}, expected ${expectedVars.map(show).join(' or ')}`);
          else if (!expectedVars.length && !p.boundVariable) add('F05', icon, 'fill is not bound to a variable');
          if (p.variableRemote) add('F05', icon, 'fill is bound to a remote library variable, not a local one');
          if (p.boundVariable && p.resolvedHex && p.writtenHex !== p.resolvedHex) add('F06', icon, `paint holds ${p.writtenHex}, the variable resolves to ${p.resolvedHex}`);
          if (!p.visible || p.opacity !== 1) add('F07', icon, 'vector fill is hidden or has opacity below 1');
          const svgHex = (inspected.get(icon).fills[0] || {}).color;
          if (p.resolvedHex && svgHex && svgHex.hex && svgHex.hex !== p.resolvedHex.toLowerCase()) add('F10', icon, `SVG fill ${svgHex.hex} differs from the Figma color ${p.resolvedHex}`);
        }
        if (v.styles && Object.keys(v.styles).length) add('F12', icon, `vector has ${Object.entries(v.styles).map(([k, n]) => `${k.replace('StyleId', '')} style ${show(n)}`).join(', ')}`);
        if (v.strokes || v.effects || v.rotation || !v.visible || v.opacity !== 1) add('F07', icon, `vector has ${[v.strokes && 'a stroke', v.effects && 'an effect', v.rotation && 'a rotation', !v.visible && 'is hidden', v.opacity !== 1 && 'opacity ' + v.opacity].filter(Boolean).join(', ')}`);
      }
      if (f.strokes || f.effects || !f.visible || f.opacity !== 1 || (Array.isArray(f.fills) ? f.fills.length : f.fills)) add('F07', icon, 'the component itself has a fill, stroke, effect, is hidden or has opacity below 1');
      if (f.styles && Object.keys(f.styles).length) add('F12', icon, `component layer has ${Object.entries(f.styles).map(([k, n]) => `${k.replace('StyleId', '')} style ${show(n)}`).join(', ')}`);
      if (f.explicitModes) add('F08', icon, `${f.explicitModes} explicit variable mode(s) on the component`);
      if (!f.description || !f.description.trim()) add('F09', icon, 'description is empty');
      else if (descRe && !descRe.test(f.description)) add('F09', icon, `description does not match ${cfg.figma.descriptionPattern}`);
    }
  }

  // --- metadata: the texts in the Figma description (M01 to M05), and against the gallery file icons.ts when it is given (M06 to M08)
  // M07 and M08 also run on a folder of SVG files; M06 needs the Figma description.
  const seenInGallery = new Set();
  for (const icon of icons) {
    const parsed = origin === 'figma' ? parseDescription(icon.figma.description) : null;
    if (parsed) for (const m of metadataFindings(parsed, cfg.metadata.categories)) add(m.rule, icon, m.message);
    if (!gallery) continue;
    seenInGallery.add(icon.short);
    const g = gallery.get(icon.short);
    if (!g) { add('M07', icon, 'no entry in the gallery file'); continue; }
    if (parsed) {
      const diffs = galleryDiffs(parsed, g);
      if (diffs.length) add('M06', icon, diffs.map((d) => `${d.field}: figma [${d.figma}] gallery [${d.gallery}]`).join('; '));
    }
    for (const msg of galleryFormat(g)) add('M08', icon, msg);
  }
  if (gallery) for (const name of gallery.keys()) if (!seenInGallery.has(name)) add('M07', { short: name }, 'entry in the gallery file, but no icon in this set');

  const compare = { equal: 0, sameShape: 0, differ: 0, onlyHere: 0, onlyReference: 0 };
  if (reference) {
    const shortOf = (icon, org) => (org === 'figma' && prefix && icon.name.toLowerCase().startsWith(prefix.toLowerCase()) ? icon.name.slice(prefix.length) : icon.name);
    const refMap = new Map(reference.icons.map((r) => [shortOf(r, reference.origin), r]));
    const mine = new Set(icons.map((i) => i.short));
    for (const icon of icons) {
      const r = refMap.get(icon.short);
      if (!r) { compare.onlyHere++; add('N11', icon, 'not in the reference set'); continue; }
      const a = inspected.get(icon);
      const b = inspectSvg(r, cfg);
      if (!a.segs.length || !b.segs.length) continue;
      const d = geometryDiff(a.segs, b.segs, cfg.compare.tolerance);
      if (!d) { compare.equal++; continue; }
      const dist = shapeDistance(a.segs, b.segs);
      if (dist <= cfg.compare.shapeTolerance) { compare.sameShape++; continue; }
      compare.differ++;
      add('S16', icon, `shape differs from the reference by up to ${round(dist, 2)} px (${d})`);
    }
    for (const name of refMap.keys()) if (!mine.has(name) && sev('N10') !== 'off') compare.onlyReference++;
    for (const name of refMap.keys()) if (!mine.has(name) && sev('N10') !== 'off') findings.push({ rule: 'N10', severity: sev('N10'), icon: name, message: 'exists in the reference set, missing here' });
  }

  if (origin === 'figma' && prefix) {
    const word = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/s$/, '');
    const levels = [['page', source.page], ...[...new Set(icons.map((i) => i.figma.parentName).filter(Boolean))].map((n) => ['section', n]), ['group', prefix.replace(/\/$/, '')]];
    const group = word(prefix.replace(/\/$/, ''));
    const same = levels.filter(([, n]) => word(n) === group);
    const s9 = sev('N09');
    if (same.length >= 2 && s9 !== 'off') findings.push({ rule: 'N09', severity: s9, icon: '(set)', message: `the assets panel path repeats one word: ${levels.map(([k, n]) => `${k} ${show(n)}`).join(' / ')}` });
  }

  for (const st of strays) { const s = sev('F11'); if (s !== 'off') findings.push({ rule: 'F11', severity: s, icon: st.name, message: `${st.type} ${show(st.name)} (${st.id}) carries the icon prefix but is not a component` }); }

  // --- measured facts about the set
  const withSvg = icons.filter((i) => typeof i.svg === 'string');
  const facts = {
    icons: icons.length,
    viewBox: Object.fromEntries(count(withSvg.map((i) => (inspected.get(i).root && inspected.get(i).root.attrs.viewBox) || 'none'))),
    elements: Object.fromEntries(count(withSvg.flatMap((i) => [...new Set(inspected.get(i).elements)]))),
    fillColors: Object.fromEntries(count(colorSets.flatMap((c) => c.set))),
    iconsWithStroke: withSvg.filter((i) => inspected.get(i).strokes.length).length,
    pathsPerIcon: Object.fromEntries(count(withSvg.map((i) => inspected.get(i).paths.length))),
    maxDecimals: withSvg.length ? Math.max(...withSvg.map((i) => inspected.get(i).decimals)) : null,
    bytes: withSvg.length ? { min: Math.min(...withSvg.map((i) => inspected.get(i).bytes)), max: Math.max(...withSvg.map((i) => inspected.get(i).bytes)) } : null,
    separators: { snake: icons.filter((i) => i.short.includes('_') && !i.short.includes('-')).length, hyphen: icons.filter((i) => i.short.includes('-') && !i.short.includes('_')).length, both: icons.filter((i) => i.short.includes('-') && i.short.includes('_')).length, none: icons.filter((i) => !i.short.includes('-') && !i.short.includes('_')).length },
  };
  const pads = icons.filter((i) => i.padding !== undefined).map((i) => i.padding);
  if (pads.length) { const sorted = [...pads].sort((a, b) => a - b); facts.padding = { min: sorted[0], median: sorted[Math.floor(sorted.length / 2)], max: sorted[sorted.length - 1] }; }
  const ext = icons.filter((i) => i.extent).map((i) => Math.max(...i.extent));
  if (ext.length) { const sorted = [...ext].sort((a, b) => a - b); facts.longestSide = { min: sorted[0], median: sorted[Math.floor(sorted.length / 2)], max: sorted[sorted.length - 1] }; }
  if (reference) facts.compare = compare;
  const measured = icons.map((i) => { const r = inspected.get(i); return { name: i.short, padding: i.padding, extent: i.extent, decimals: r.decimals, bytes: r.bytes, paths: r.paths.length, fills: [...new Set(r.fills.map((f) => (f.implicit ? '#000000 (implicit)' : colorKey(f.color))))] }; });
  return { findings, facts, measured };
}

// ---------------------------------------------------------------- input
function loadInput(path) {
  if (!existsSync(path)) throw new Error(`input not found: ${path}`);
  if (statSync(path).isDirectory()) {
    const files = [];
    const scan = (dir) => { for (const e of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) scan(p); else if (extname(e.name).toLowerCase() === '.svg') files.push(p); } };
    scan(path);
    files.sort();
    return { origin: 'folder', source: { folder: resolve(path) }, prefix: '', icons: files.map((f) => ({ name: basename(f, extname(f)), file: f, svg: readFileSync(f, 'utf8') })) };
  }
  const raw = readFileSync(path, 'utf8');
  let bundle;
  try { bundle = JSON.parse(raw); } catch (e) { throw new Error(`${path} is not valid JSON; it starts with ${JSON.stringify(raw.slice(0, 60))}. Run the export again and keep only its last output line.`); }
  if (!bundle.ok) throw new Error(`the export reports a problem: ${bundle.reason || JSON.stringify(bundle)}`);
  return {
    origin: 'figma',
    source: bundle.source,
    prefix: bundle.config && bundle.config.namePrefix,
    icons: bundle.icons.map((i) => ({ name: i.name, svg: i.svg, figma: i })),
    strays: bundle.strays || [],
  };
}

// ---------------------------------------------------------------- report
function report(result, input, cfg, opts) {
  const { findings, facts } = result;
  const lines = [];
  const where = input.origin === 'figma' ? `${input.source.file} / ${input.source.page}` : input.source.folder;
  lines.push(`Icon set validation: ${facts.icons} icons, source: ${where}`);
  lines.push(`Profile: ${opts.profile}${opts.target ? `, target: ${opts.target}` : ''}${opts.against ? `, compared with ${opts.against}` : ''}${opts.gallery ? `, metadata compared with ${opts.gallery}` : ''}`);
  if (input.origin === 'folder') lines.push('Folder input: the Figma checks (F rules, labels) are skipped.');
  lines.push('');
  const order = { error: 0, warn: 1, info: 2 };
  const byRule = new Map();
  for (const f of findings) { if (!byRule.has(f.rule)) byRule.set(f.rule, []); byRule.get(f.rule).push(f); }
  const ids = [...byRule.keys()].sort((a, b) => order[byRule.get(a)[0].severity] - order[byRule.get(b)[0].severity] || a.localeCompare(b));
  for (const id of ids) {
    const list = byRule.get(id);
    lines.push(`${list[0].severity.toUpperCase().padEnd(5)} ${id}  ${RULES[id][2]}: ${list.length} icon${list.length === 1 ? '' : 's'}`);
    const shown = opts.all ? list : list.slice(0, 6);
    for (const f of shown) lines.push(`        ${f.icon}: ${f.message}`);
    if (shown.length < list.length) lines.push(`        ... ${list.length - shown.length} more (use --all)`);
  }
  if (!ids.length) lines.push('No findings.');
  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of findings) counts[f.severity]++;
  const affected = new Set(findings.filter((f) => f.severity === 'error').map((f) => f.icon)).size;
  lines.push('');
  lines.push(`Result: ${counts.error} error${counts.error === 1 ? '' : 's'} on ${affected} icons, ${counts.warn} warning${counts.warn === 1 ? '' : 's'}.`);
  lines.push('');
  lines.push('Measured in the set (no pass or fail, for reading the set):');
  lines.push(`  viewBox:      ${Object.entries(facts.viewBox).map(([k, v]) => `${show(k)} x${v}`).join(', ')}`);
  lines.push(`  elements:     ${Object.entries(facts.elements).map(([k, v]) => `<${k}> in ${v}`).join(', ')}`);
  lines.push(`  fill colors:  ${Object.entries(facts.fillColors).map(([k, v]) => `${k} x${v}`).join(', ') || 'none'}`);
  lines.push(`  paths/icon:   ${Object.entries(facts.pathsPerIcon).map(([k, v]) => `${k} path${k === '1' ? '' : 's'} x${v}`).join(', ')}; icons with a line (stroke): ${facts.iconsWithStroke}`);
  if (facts.padding) lines.push(`  padding:      min ${facts.padding.min}, median ${facts.padding.median}, max ${facts.padding.max}; longest side min ${facts.longestSide.min}, median ${facts.longestSide.median}, max ${facts.longestSide.max}`);
  lines.push(`  decimals:     up to ${facts.maxDecimals}; file size ${facts.bytes ? `${facts.bytes.min} to ${facts.bytes.max} bytes` : 'n/a'}`);
  if (facts.compare) lines.push(`  against reference: ${facts.compare.equal} identical, ${facts.compare.sameShape} same shape in another notation, ${facts.compare.differ} different, ${facts.compare.onlyReference} only in the reference, ${facts.compare.onlyHere} only here`);
  lines.push(`  separators:   snake_case ${facts.separators.snake}, hyphen ${facts.separators.hyphen}, both ${facts.separators.both}, none ${facts.separators.none}`);
  return { text: lines.join('\n'), counts };
}

// ---------------------------------------------------------------- main
function main() {
  const args = process.argv.slice(2);
  const opts = { all: false, failOn: 'error', rules: join(HERE, '..', 'icon-set-rules.json'), json: null, input: null, list: false, against: null, gallery: null, profile: null, target: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--all') opts.all = true;
    else if (a === '--list-rules') opts.list = true;
    else if (a === '--rules') opts.rules = args[++i];
    else if (a === '--json') opts.json = args[++i];
    else if (a === '--fail-on') opts.failOn = args[++i];
    else if (a === '--against') opts.against = args[++i];
    else if (a === '--gallery') opts.gallery = args[++i];
    else if (a === '--profile') opts.profile = args[++i];
    else if (a === '--target') opts.target = args[++i];
    else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').reduce((acc, l) => (acc.stop || !l.startsWith('//') ? { ...acc, stop: true } : { ...acc, out: [...acc.out, l.replace(/^\/\/ ?/, '')] }), { out: [], stop: false }).out.join('\n')); return 0; }
    else if (!a.startsWith('--')) opts.input = a;
    else { console.error(`unknown option ${a}`); return 2; }
  }
  if (opts.list) {
    { console.log('id    severity group  from       rule'); for (const [id, [s, g, t]] of Object.entries(RULES)) console.log(`${id}  ${s.padEnd(5)}    ${g.padEnd(6)} ${(CHECKLIST.has(id) ? (UNDER_REVIEW.has(id) ? 'list, open' : 'team list') : 'added').padEnd(10)} ${t}`); }
    return 0;
  }
  if (!opts.input) { console.error('usage: node validate-icon-set.mjs <icon-set.json | folder> [--rules file] [--json file] [--all] [--fail-on error|warn|info]'); return 2; }
  let fileCfg = {};
  if (existsSync(opts.rules)) {
    try { fileCfg = JSON.parse(readFileSync(opts.rules, 'utf8')); } catch (e) { throw new Error(`rule file ${opts.rules} is not valid JSON: ${e.message}`); }
  }
  const input = loadInput(opts.input);
  opts.profile = opts.profile || (input.origin === 'figma' ? 'figma' : 'git');
  const base = merge(DEFAULTS, fileCfg);
  if (!(opts.profile in (base.profiles || {})) && opts.profile !== 'figma' && opts.profile !== 'git') throw new Error(`unknown profile ${opts.profile}`);
  let cfg = merge(base, (base.profiles || {})[opts.profile] || {});
  if (opts.target) {
    const tg = (base.targets || {})[opts.target];
    if (!tg) throw new Error(`unknown target ${opts.target}; the rule file knows: ${Object.keys(base.targets || {}).join(', ') || 'none'}`);
    cfg = merge(cfg, tg);
  }
  if (input.origin === 'folder') cfg.namePrefix = '';
  const reference = opts.against ? loadInput(opts.against) : null;
  const gallery = opts.gallery ? parseGalleryFile(readFileSync(opts.gallery, 'utf8')) : null;
  if (opts.gallery && !gallery.size) throw new Error(`no icon entry found in ${opts.gallery}`);
  const result = validate(input.icons, cfg, input.origin, input.strays || [], input.source || {}, reference, gallery);
  const { text, counts } = report(result, input, cfg, opts);
  console.log(text);
  if (opts.json) writeFileSync(opts.json, JSON.stringify({ source: input.source, config: cfg, facts: result.facts, findings: result.findings, measured: result.measured }, null, 2));
  const rank = { error: 0, warn: 1, info: 2 };
  const limit = rank[opts.failOn] === undefined ? 0 : rank[opts.failOn];
  return result.findings.some((f) => rank[f.severity] <= limit) ? 1 : 0;
}

try {
  process.exitCode = main();
} catch (e) {
  console.error(`error: ${e.message}`);
  process.exitCode = 2;
}
