(async () => {
  /**
   * refresh-bound-paints.js — write the resolved variable color back into bound paints
   * ----------------------------------------------------------------------------
   * WHY: A paint bound with setBoundVariableForPaint can keep the black
   * placeholder as its cached color. The variable still resolves correctly, but
   * an export (exportAsync) renders the layer black. This script resolves every
   * bound fill and stroke for its own node, modes included, and writes that color
   * back into the paint.
   *
   * Run it after the explicit modes of the subtree are final, because the
   * resolved color depends on them. Layers inside nested instances are skipped,
   * they carry their own bindings.
   *
   * HOW TO RUN: figma-ds-cli eval -f refresh-bound-paints.js (the last
   * expression is the output). Set rootId in CONFIG and start with mode scan.
   * Keep "(async () => {" as the first line of this file. figma-ds-cli passes
   * only a file that starts with "(async" through unchanged; it wraps any other
   * file that contains "; return" and then prints nothing (see _readme.md).
   * ----------------------------------------------------------------------------
   */

  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'  -> count the paints with a stale cached color, change nothing
    // 'apply' -> write the resolved color back
    mode: 'scan',
    // Root of the subtree, for example the id of a component set
    rootId: '',
  };
  // ==========================================================================

  const root = await figma.getNodeByIdAsync(CONFIG.rootId);
  if (!root) return JSON.stringify({ ok: false, error: 'rootId not found: ' + CONFIG.rootId });

  const report = { ok: true, mode: CONFIG.mode, boundPaints: 0, stale: 0, rewritten: 0, errors: [] };
  const close = (a, b) => Math.abs(a - b) < 1 / 512;

  const nodes = [root, ...('findAll' in root ? root.findAll(() => true) : [])];
  for (const node of nodes) {
    let inInstance = false;
    for (let p = node.parent; p && p !== root; p = p.parent) {
      if (p.type === 'INSTANCE') { inInstance = true; break; }
    }
    if (inInstance) continue;

    for (const prop of ['fills', 'strokes']) {
      const paints = node[prop];
      // figma.mixed (per-range text fills) is not an array, skip it
      if (!Array.isArray(paints) || !paints.length) continue;
      let changed = false;
      const next = [];
      for (const p of paints) {
        const alias = p.type === 'SOLID' && p.boundVariables && p.boundVariables.color;
        const variable = alias ? await figma.variables.getVariableByIdAsync(alias.id) : null;
        let value = null;
        if (variable) {
          try { value = variable.resolveForConsumer(node).value; } catch (e) {
            report.errors.push({ id: node.id, name: node.name, error: String(e) });
          }
        }
        if (!value || value.r === undefined) { next.push(p); continue; }
        report.boundPaints++;
        const opacity = value.a !== undefined ? value.a : 1;
        const same = close(p.color.r, value.r) && close(p.color.g, value.g) && close(p.color.b, value.b) && close(p.opacity === undefined ? 1 : p.opacity, opacity);
        if (same) { next.push(p); continue; }
        report.stale++;
        changed = true;
        next.push(figma.variables.setBoundVariableForPaint({ ...p, color: { r: value.r, g: value.g, b: value.b }, opacity }, 'color', variable));
      }
      if (changed && CONFIG.mode === 'apply') { node[prop] = next; report.rewritten++; }
    }
  }

  // A same-tick batch of synchronous mutations can be lost before the bridge
  // flushes it, so wait before returning (see _readme.md).
  if (CONFIG.mode === 'apply') await new Promise((r) => setTimeout(r, 1500));
  return JSON.stringify(report);
})()
