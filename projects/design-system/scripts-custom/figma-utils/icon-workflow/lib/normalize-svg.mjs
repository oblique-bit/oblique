// normalize-svg.mjs — an SVG string as Figma exports it → the file format of the Git set, without the id
// ----------------------------------------------------------------------------
// WHY: decided on 2026-11-11: the build (update-icons.ts) adds the id of an icon, so the export does not write one. But the
// build changes only the id, the XML declaration and the line breaks. It keeps every other attribute, so the export has to
// write the format of the Git files itself:
//
//   Figma export (exportAsync)                         Git file                                  export (this module)
//   <svg width height viewBox fill="none" xmlns>       <svg id="a" xmlns viewBox>                <svg xmlns viewBox>
//     <path d fill="#1C2834"/>                          <path d/>                                 <path d/>
//
// - width, height and fill="none" on the root are removed. The icon scales with the font size and takes its colour from the
//   page (Git files carry no fill, so CSS colours the icon).
// - the fixed fill on the path is removed for the same reason.
// - the XML declaration and one single line are kept as in the Git files; the file has no line break at the end.
// - Figma wraps three icons (star, star_filled, exclamation_diamond) in <g clip-path> with a clipPath rectangle of the whole
//   24 x 24 area. That clip is removed when the shape lies inside the area (checked with the bounding box of the vector), so it
//   cuts nothing.
// - anything else (another viewBox, more than one path, other elements or attributes) is not guessed: the icon is reported.
//
// normalizeSvg(svg, { bbox }) → { ok: true, svg, fill, notes } or { ok: false, reason }
// bbox = [x, y, width, height] of the vector inside the 24 x 24 component (from export-icon-set.js), optional.
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const attrs = (text) => Object.fromEntries([...String(text).matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

export function normalizeSvg(svg, { bbox = null, viewBox = '0 0 24 24' } = {}) {
  const fail = (reason) => ({ ok: false, reason });
  const notes = [];
  const text = String(svg || '').trim();
  const root = /^<svg\b([^>]*)>([\s\S]*)<\/svg>$/.exec(text);
  if (!root) return fail('not an <svg> document');
  const rootAttrs = attrs(root[1]);
  if (rootAttrs.viewBox !== viewBox) return fail(`viewBox ${rootAttrs.viewBox === undefined ? 'missing' : `"${rootAttrs.viewBox}"`} instead of "${viewBox}"`);
  let body = root[2].trim();

  // the clip of the whole icon area
  const clip = /^<g clip-path="url\(#([^)]+)\)">\s*([\s\S]*?)\s*<\/g>\s*<defs>\s*<clipPath id="([^"]+)">\s*<rect([^>]*)\/>\s*<\/clipPath>\s*<\/defs>$/.exec(body);
  if (clip) {
    if (clip[1] !== clip[3]) return fail('the clip-path and the clipPath have different ids');
    const r = attrs(clip[4]);
    const [, , w, h] = viewBox.split(' ').map(Number);
    const whole = (r.x === undefined || Number(r.x) === 0) && (r.y === undefined || Number(r.y) === 0) && Number(r.width) === w && Number(r.height) === h;
    if (!whole) return fail('the clip is not the whole icon area');
    if (!bbox) return fail('the shape is clipped and no bounding box is known to show that the clip cuts nothing');
    if (bbox[0] < 0 || bbox[1] < 0 || bbox[0] + bbox[2] > w || bbox[1] + bbox[3] > h) return fail('the shape reaches outside the icon area and the clip would cut it');
    body = clip[2];
    notes.push('clip of the whole icon area removed (the shape lies inside it)');
  }

  const paths = [...body.matchAll(/<path\b([^>]*?)\/>/g)];
  const rest = body.replace(/<path\b[^>]*?\/>/g, '').trim();
  if (rest) return fail(`elements other than <path>: ${rest.slice(0, 60)}`);
  if (paths.length !== 1) return fail(`${paths.length} paths instead of one`);
  const p = attrs(paths[0][1]);
  const extra = Object.keys(p).filter((k) => !['d', 'fill', 'fill-rule', 'clip-rule'].includes(k));
  if (extra.length) return fail(`path attributes not handled: ${extra.join(', ')}`);
  if (!p.d) return fail('the path has no d');

  // fill-rule and clip-rule change how the shape is drawn, so they stay; the colour goes
  const keep = ['fill-rule', 'clip-rule'].filter((k) => p[k] !== undefined).map((k) => ` ${k}="${p[k]}"`).join('');
  return { ok: true, svg: `${XML_HEADER}<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path d="${p.d}"${keep}/></svg>`, fill: p.fill || null, notes };
}
