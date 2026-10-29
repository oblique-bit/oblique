/**
 * annotate-button-contrast.js — measure Button contrast per cell, write Accessibility annotations
 * ----------------------------------------------------------------------------
 * WHY: a demo frame shows the Button in many mode contexts (cells with explicit
 * color_scheme / emphasis / elevation modes). Contrast depends on the context,
 * so it must be measured in every cell, not on the component sheet.
 *
 * For each cell (direct FRAME child of CONFIG.rootId) the script composites the
 * cell fills, the Button fill and the label / icon paints, then checks:
 *   - label text  >= 4.5:1  (WCAG 1.4.3, 3:1 for large text)
 *   - icon        >= 3:1    (WCAG 1.4.11)
 * Only AA fails are annotated. Fill or border against the surface is not
 * checked: the label identifies the button, so 1.4.11 does not require it.
 * Disabled variants are skipped (inactive components are exempt in WCAG).
 *
 * Each run first removes the annotations it wrote before (label starts with
 * MARKER), then writes one annotation on each Button instance with an AA fail.
 * Other annotations are kept. Figma lists an annotation on an instance as an
 * `annotations` override (metadata only, colours and behaviour still come from
 * the main). When the last annotation of this script leaves an instance whose
 * only override is `annotations`, the instance is reset so the flag goes away.
 *
 * HOW TO RUN: paste into the Desktop Bridge plugin console, or through the CLI
 * with this header stripped (the CLI returns nothing while it is in place, same
 * issue as rewire-cover-colors.js):
 *   node -e "const fs=require('fs');fs.writeFileSync('/tmp/run.js',
 *     fs.readFileSync('annotate-button-contrast.js','utf8').replace(/\/\*\*[\s\S]*?\*\//,''))"
 *   figma-ds-cli eval -f /tmp/run.js
 * Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'  -> report only, change nothing (ALWAYS run this first)
    // 'write' -> replace this script's annotations on the Button instances
    mode: 'scan',
    fileKeyGuard: 'QOcr0cvwuFDH9AAUdjMZgx', // DesignSystem@Tokens V10.0
    rootId: '4027:330', // Elevation demo
    componentSetName: 'button/button_standard',
    category: 'Accessibility',
    MARKER: '**Contrast**', // own annotations start with this (older runs wrote '**Contrast check**')
  };
  // ==========================================================================

  if (figma.fileKey !== CONFIG.fileKeyGuard) return JSON.stringify({ ok: false, reason: 'wrong file ' + figma.fileKey });
  const root = await figma.getNodeByIdAsync(CONFIG.rootId);
  if (!root) return JSON.stringify({ ok: false, reason: 'root not found' });
  let page = root; while (page.type !== 'PAGE') page = page.parent;
  const pageBg = (page.backgrounds && page.backgrounds[0] && page.backgrounds[0].color) || { r: 1, g: 1, b: 1 };

  const layers = paints => Array.isArray(paints) ? paints.filter(p => p.visible !== false && p.type === 'SOLID').map(p => ({ c: p.color, a: p.opacity === undefined ? 1 : p.opacity })) : [];
  const over = (stack, base) => stack.reduce((c, l) => ({ r: l.c.r * l.a + c.r * (1 - l.a), g: l.c.g * l.a + c.g * (1 - l.a), b: l.c.b * l.a + c.b * (1 - l.a) }), base);
  const lum = c => { const f = x => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const fmt = r => (Math.floor(r * 100) / 100).toFixed(2) + ':1';
  const isLarge = t => t.fontSize >= 24 || (t.fontSize >= 18.66 && /bold|black|heavy|extra/i.test(t.fontName.style));

  const report = [];
  for (const cell of root.children.filter(n => n.type === 'FRAME')) {
    const surface = over(layers(cell.fills), pageBg);
    for (const b of cell.findAllWithCriteria({ types: ['INSTANCE'] })) {
      const m = await b.getMainComponentAsync();
      if (!m || !m.parent || m.parent.name !== CONFIG.componentSetName || /availability=disabled/.test(m.name)) continue;
      const v = Object.fromEntries(m.name.split(', ').map(s => s.split('=')));
      const bg = over(layers(b.fills), surface);
      const label = b.findOne(n => n.type === 'TEXT'), icon = b.findOne(n => n.type === 'VECTOR');
      const fails = [];
      if (label) { const need = isLarge(label) ? 3 : 4.5; const t = ratio(over(layers(label.fills), bg), bg); if (t < need) fails.push(`label ${fmt(t)} (needs ${need}:1)`); }
      if (icon) { const t = ratio(over(layers(icon.fills), bg), bg); if (t < 3) fails.push(`icon ${fmt(t)} (needs 3:1)`); }
      if (!fails.length) continue;
      report.push({ node: b, cell: cell.name, button: `${v.priority} ${v.interaction}`, text: `${CONFIG.MARKER} AA fail: ${fails.join(', ')}` });
    }
  }

  let written = 0, removed = 0, reset = 0;
  if (CONFIG.mode === 'write') {
    const cat = (await figma.annotations.getAnnotationCategoriesAsync()).find(c => c.label === CONFIG.category);
    const targets = new Set(report.map(r => r.node.id));
    const own = a => (a.labelMarkdown || a.label || '').startsWith(CONFIG.MARKER.replace(/\*+$/, ''));
    const mineOf = n => n.annotations.filter(own);
    // paint bindings of text and vectors, to see whether an instance still matches its main after a reset
    const bindings = n => n.findAll(x => x.type === 'TEXT' || x.type === 'VECTOR').map(x => { const p = Array.isArray(x.fills) && x.fills[0]; return p && p.boundVariables && p.boundVariables.color ? p.boundVariables.color.id : '-'; }).join();
    for (const n of [root, ...root.findAll(x => 'annotations' in x && x.annotations.length > 0)]) {
      const count = mineOf(n).length; if (!count) continue;
      n.annotations = n.annotations.filter(a => !own(a)); removed += count;
      const onlyAnnotationOverride = n.type === 'INSTANCE' && !n.annotations.length && (n.overrides || []).every(o => o.overriddenFields.every(f => f === 'annotations'));
      if (onlyAnnotationOverride && !targets.has(n.id)) {
        n.resetOverrides(); reset++;
        // Figma quirk: after a reset, nested icons can show their own colour instead of the main's
        // override; switching a variant property off and on again re-instantiates the instance
        const m = await n.getMainComponentAsync(); const inv = n.componentProperties.inverse;
        if (inv && bindings(n) !== bindings(m)) { const val = inv.value; n.setProperties({ inverse: val === 'true' ? 'false' : 'true' }); n.setProperties({ inverse: val }); }
      }
    }
    for (const r of report) { r.node.annotations = [...r.node.annotations, { labelMarkdown: r.text, ...(cat ? { categoryId: cat.id } : {}) }]; written++; }
    await new Promise(r => setTimeout(r, 1500));
  }
  const out = JSON.stringify({ ok: true, mode: CONFIG.mode, buttonsWithFindings: report.length, written, removed, reset, findings: report.map(r => ({ cell: r.cell, button: r.button, text: r.text })) });
  console.log(out);
  return out;
})()
