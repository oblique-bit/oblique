/**
 * unbind-variables.js — find & detach Figma variable bindings deterministically
 * ----------------------------------------------------------------------------
 * WHY: "Ghost" variable-mode pickers (e.g. typography_context / ui_scale from an
 * old library) never come from stale data on nodes. Figma shows a collection in
 * the "Apply variable mode" panel for as long as ANY node still *consumes* a
 * variable from it. Clear the bindings and the picker entry disappears.
 *
 * This script scans the whole file, reports every variable binding grouped by
 * collection, and (in detach mode) removes them. Dry-run by default.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) Via the figma-console MCP (ask Claude):
 *     "run scripts-custom/figma-utils/unbind-variables.js via figma_execute"
 *     Claude pastes the body into figma_execute and returns the report.
 *
 *  B) By hand in Figma: open the Desktop Bridge plugin console
 *     (Plugins -> Development -> open console) and paste this file's contents.
 *     The IIFE logs its report with console.log.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'   -> report only, change nothing (ALWAYS run this first)
    // 'detach' -> remove the matched bindings
    mode: 'scan',

    // Which bound properties to act on. null = every property.
    // Scalars (paragraphSpacing, fontSize, sizing...) detach via setBoundVariable;
    // paints ('fills','strokes') detach via setBoundVariableForPaint per paint.
    propertyFilter: ['paragraphSpacing', 'fills', 'strokes'],

    // Only match bindings whose collection name is in this list. null = any.
    // Example: ['typography_context', 'ui_scale', 'semantic']
    collectionFilter: null,

    // Safety net: only ever detach bindings to REMOTE (library) variables.
    // Keeps you from nuking this file's own local-variable bindings.
    remoteOnly: true,

    // 'file'      -> every page (use this to kill ghost pickers)
    // 'page'      -> current page only
    // 'selection' -> the current selection and its descendants
    scope: 'file',
  };
  // ==========================================================================

  const fieldOf = (path) => path.split('.')[0]; // 'paragraphSpacing.0' -> 'paragraphSpacing'

  // --- gather binding sites: {node, field, varId} -------------------------
  const sites = [];
  const collectFromBoundVars = (node) => {
    const bv = node.boundVariables;
    if (!bv) return;
    const rec = (obj, path) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.type === 'VARIABLE_ALIAS' && obj.id) {
        sites.push({ node, field: fieldOf(path), varId: obj.id });
        return;
      }
      for (const k in obj) rec(obj[k], path ? `${path}.${k}` : k);
    };
    rec(bv, '');
  };

  if (CONFIG.scope === 'file') await figma.loadAllPagesAsync();
  const roots =
    CONFIG.scope === 'file' ? figma.root.children
    : CONFIG.scope === 'selection' ? figma.currentPage.selection
    : [figma.currentPage];

  const walk = (node) => {
    collectFromBoundVars(node);
    if ('children' in node) node.children.forEach(walk);
  };
  roots.forEach(walk);

  // --- resolve each site's variable + collection (cached) -----------------
  const varCache = new Map();
  const colCache = new Map();
  const resolve = async (varId) => {
    if (varCache.has(varId)) return varCache.get(varId);
    let v = null;
    try { v = await figma.variables.getVariableByIdAsync(varId); } catch (e) {}
    let col = null;
    if (v) {
      if (colCache.has(v.variableCollectionId)) col = colCache.get(v.variableCollectionId);
      else {
        try { col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); } catch (e) {}
        colCache.set(v.variableCollectionId, col);
      }
    }
    const info = {
      varName: v ? v.name : '(unresolved)',
      collection: col ? col.name : '(unknown)',
      remote: col ? col.remote : false,
      modes: col ? col.modes.map((m) => m.name) : [],
    };
    varCache.set(varId, info);
    return info;
  };

  // --- filter to matched sites --------------------------------------------
  const matched = [];
  for (const s of sites) {
    if (CONFIG.propertyFilter && !CONFIG.propertyFilter.includes(s.field)) continue;
    const info = await resolve(s.varId);
    if (CONFIG.remoteOnly && !info.remote) continue;
    if (CONFIG.collectionFilter && !CONFIG.collectionFilter.includes(info.collection)) continue;
    matched.push({ ...s, ...info });
  }

  // --- summarise by collection --------------------------------------------
  const byCollection = {};
  for (const m of matched) {
    const c = (byCollection[m.collection] ||= { remote: m.remote, modes: m.modes, fields: {}, count: 0 });
    c.count++;
    c.fields[m.field] = (c.fields[m.field] || 0) + 1;
  }

  const report = {
    mode: CONFIG.mode,
    scope: CONFIG.scope,
    bindingSitesScanned: sites.length,
    matched: matched.length,
    byCollection,
    detached: 0,
    skippedInstanceInternal: 0,
    skippedMixedPaint: 0,
    errors: [],
  };

  // --- detach (instance-internal nodes inherit from main component) -------
  // Scalars clear with setBoundVariable(field, null). 'fills'/'strokes' are
  // paint arrays — their bindings live on each paint, so they must be cleared
  // with setBoundVariableForPaint and the array reassigned (setBoundVariable
  // throws "fills and strokes ... must be set on paints directly").
  if (CONFIG.mode === 'detach') {
    const PAINT_FIELDS = new Set(['fills', 'strokes']);
    const done = new Set(); // node.id + field — avoid clearing the same field twice
    for (const m of matched) {
      // ids containing ';' are nodes inside an instance — they clear when the
      // main component clears, so skip them to avoid creating overrides.
      if (m.node.id.includes(';')) { report.skippedInstanceInternal++; continue; }
      const key = `${m.node.id}::${m.field}`;
      if (done.has(key)) continue;
      done.add(key);
      try {
        if (PAINT_FIELDS.has(m.field)) {
          // figma.mixed (e.g. per-range text fills) is not an array — skip it.
          const paints = m.node[m.field];
          if (!Array.isArray(paints)) { report.skippedMixedPaint++; continue; }
          let changed = false;
          const next = paints.map((p) => {
            if (p && p.boundVariables && p.boundVariables.color) {
              changed = true;
              return figma.variables.setBoundVariableForPaint(p, 'color', null);
            }
            return p;
          });
          if (changed) { m.node[m.field] = next; report.detached++; }
        } else {
          m.node.setBoundVariable(m.field, null);
          report.detached++;
        }
      } catch (e) {
        report.errors.push({ id: m.node.id, name: m.node.name, field: m.field, error: String(e) });
      }
    }
  }

  console.log('[unbind-variables]', JSON.stringify(report, null, 2));
  return report;
})();
