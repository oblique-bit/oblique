/**
 * sort-deprecated-pages.js — move every "_deprecated" page below the separator
 * ----------------------------------------------------------------------------
 * WHY: every doc-builder's deprecateOldScratchPages() (and any ad-hoc manual
 * rename) marks a stale page by appending "_deprecated" to its name, but
 * never touches its POSITION in the page list — so a freshly-deprecated page
 * stays wherever it was created, mixed in with the real, current pages
 * instead of grouped at the bottom. This file has a literal
 * "_________________________________" (underscores) page as a visual
 * separator; everything named "*_deprecated" belongs below it, always.
 *
 * WHAT IT DOES: finds the separator page by exact name (CONFIG.separatorName),
 * finds every top-level page whose name ends with "_deprecated", and moves
 * each one (in its current relative order) to sit directly below the
 * separator — i.e. right after it, pushing down whatever else was already
 * below. Pages already below the separator, in the right relative order,
 * are a no-op. Never touches page CONTENT, only position in
 * figma.root.children.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f sort-deprecated-pages.js
 *  B) By hand: paste into the Desktop Bridge plugin console.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'  -> report the planned order, change nothing (ALWAYS run first)
    // 'apply' -> reorder pages for real
    mode: 'scan',

    // Exact name of the separator page. If it doesn't exist, the script
    // reports an error and changes nothing — it never creates one.
    separatorName: '_________________________________',

    // Suffix that marks a page as deprecated.
    deprecatedSuffix: '_deprecated',
  };
  // ==========================================================================

  const pages = figma.root.children;
  const sepIndex = pages.findIndex((p) => p.name === CONFIG.separatorName);
  if (sepIndex < 0) {
    return JSON.stringify({ ok: false, reason: 'separator page not found: "' + CONFIG.separatorName + '"' }, null, 2);
  }

  const deprecated = pages.filter((p) => p.name.endsWith(CONFIG.deprecatedSuffix));
  const alreadyBelow = deprecated.filter((p) => pages.indexOf(p) > sepIndex);
  const needsMove = deprecated.filter((p) => pages.indexOf(p) <= sepIndex);

  const report = {
    ok: true,
    mode: CONFIG.mode,
    separatorIndex: sepIndex,
    deprecatedCount: deprecated.length,
    alreadyBelowSeparator: alreadyBelow.map((p) => p.name),
    toMove: needsMove.map((p) => p.name),
    moved: 0,
  };

  if (CONFIG.mode === 'apply' && needsMove.length) {
    // Insert each one directly after the separator, in the order found —
    // repeated inserts at (sepIndex + 1) naturally stack them immediately
    // below the separator, above whatever was already deprecated there.
    for (const p of needsMove) {
      try {
        figma.root.insertChild(sepIndex + 1, p);
        report.moved++;
      } catch (e) {
        report.ok = false;
        (report.failed || (report.failed = [])).push({ name: p.name, err: String(e) });
      }
    }
  }

  console.log('[sort-deprecated-pages]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
