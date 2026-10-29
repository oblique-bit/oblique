/**
 * annotate-button-contrast.js — measure Button contrast per cell, write Accessibility annotations
 * ----------------------------------------------------------------------------
 * WHY: a demo frame shows the Button in many mode contexts (cells with explicit
 * color_scheme / emphasis / elevation modes). Contrast depends on the context,
 * so it must be measured in every cell, not on the component sheet.
 *
 * For each cell (direct FRAME child of CONFIG.rootId) the script composites the
 * cell fills, the Button fill and the label / icon / border paints, then checks:
 *   - label text  >= 4.5:1  (WCAG 1.4.3, AA fail otherwise)
 *   - icon        >= 3:1    (WCAG 1.4.11, AA fail otherwise)
 *   - fill/border >= 3:1    against the cell surface, for filled priorities and
 *                           borders (informative only: 1.4.11 does not require a
 *                           boundary when text identifies the button, and not
 *                           for colour changes between states)
 * Disabled variants are skipped (inactive components are exempt in WCAG).
 *
 * Each run first removes the annotations it wrote before (label starts with
 * MARKER), then writes one annotation per cell with findings. Other
 * annotations are kept. Button instances are never touched.
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
    // 'write' -> replace this script's annotations on the cells
    mode: 'scan',
    fileKeyGuard: 'QOcr0cvwuFDH9AAUdjMZgx', // DesignSystem@Tokens V10.0
    rootId: '4027:330', // Elevation demo
    componentSetName: 'button/button_standard',
    filledPriorities: ['primary'], // priorities whose fill is the button shape
    category: 'Accessibility',
    MARKER: '**Contrast check**',
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
  const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const fmt = r => (Math.floor(r * 100) / 100).toFixed(2) + ':1';
  const isLarge = t => t.fontSize >= 24 || (t.fontSize >= 18.66 && /bold|black|heavy|extra/i.test(t.fontName.style));

  const report = [];
  for (const cell of root.children.filter(n => n.type === 'FRAME')) {
    const surface = over(layers(cell.fills), pageBg);
    const fails = [], info = {}; let minText = Infinity;
    for (const b of cell.findAllWithCriteria({ types: ['INSTANCE'] })) {
      const m = await b.getMainComponentAsync();
      if (!m || !m.parent || m.parent.name !== CONFIG.componentSetName || /availability=disabled/.test(m.name)) continue;
      const v = Object.fromEntries(m.name.split(', ').map(s => s.split('=')));
      const bg = over(layers(b.fills), surface);
      const label = b.findOne(n => n.type === 'TEXT'), icon = b.findOne(n => n.type === 'VECTOR');
      if (label) { const t = ratio(over(layers(label.fills), bg), bg), need = isLarge(label) ? 3 : 4.5; minText = Math.min(minText, t); if (t < need) fails.push(`${v.priority} ${v.interaction} label ${fmt(t)} (needs ${need}:1, 1.4.3)`); }
      if (icon) { const t = ratio(over(layers(icon.fills), bg), bg); if (t < 3) fails.push(`${v.priority} ${v.interaction} icon ${fmt(t)} (needs 3:1, 1.4.11)`); }
      const stroke = layers(b.strokes);
      const edge = stroke.length ? ['border', ratio(over(stroke, surface), surface)] : CONFIG.filledPriorities.includes(v.priority) ? ['fill', ratio(bg, surface)] : null;
      if (edge && edge[1] < 3) { const k = `${v.priority} ${edge[0]}`; (info[k] = info[k] || []).push(`${v.interaction} ${fmt(edge[1])}`); }
    }
    if (!fails.length && !Object.keys(info).length) continue;
    const lines = [`${CONFIG.MARKER} (WCAG 2.1, ${new Date().toISOString().slice(0, 10)}), surface ${hex(surface)}`];
    if (fails.length) lines.push('', '**AA fail:** ' + fails.join('; ') + '.');
    for (const [k, vals] of Object.entries(info)) lines.push('', `**Not an AA fail (1.4.11, informative):** ${k} against the surface: ${vals.join(', ')}. A boundary is not required when the label identifies the button.`);
    if (minText !== Infinity) lines.push('', `Label text: lowest ${fmt(minText)}.`);
    report.push({ cell, name: cell.name, text: lines.join('\n') });
  }

  let written = 0, removed = 0;
  if (CONFIG.mode === 'write') {
    const cat = (await figma.annotations.getAnnotationCategoriesAsync()).find(c => c.label === CONFIG.category);
    for (const cell of root.children.filter(n => 'annotations' in n)) {
      const keep = cell.annotations.filter(a => !((a.labelMarkdown || a.label || '').startsWith(CONFIG.MARKER)));
      removed += cell.annotations.length - keep.length;
      const mine = report.find(r => r.cell === cell);
      cell.annotations = mine ? [...keep, { labelMarkdown: mine.text, ...(cat ? { categoryId: cat.id } : {}) }] : keep;
      if (mine) written++;
    }
    await new Promise(r => setTimeout(r, 1500));
  }
  const out = JSON.stringify({ ok: true, mode: CONFIG.mode, cellsWithFindings: report.length, written, removed, findings: report.map(r => ({ cell: r.name, text: r.text })) });
  console.log(out);
  return out;
})()
