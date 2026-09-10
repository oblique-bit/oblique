/**
 * relink-text-style-usage.js — repoint nodes off a renamed text style onto its twin
 * ----------------------------------------------------------------------------
 * WHY: A token path rename (e.g. "ob.semantic.static.xs.normal" ->
 * "ob.s.typography.grouped.static.xs.normal") makes Token Studio push a NEW
 * Figma text style under the new name — it does not rename the old style in
 * place, because it matches styles by name on push. The old style survives,
 * orphaned, and every node still using it (typically the typography
 * documentation page, which applies each style to a sample text node) stays
 * bound to the dead one. Deleting the old style before relinking would strip
 * those nodes down to a plain, unlinked local text style.
 *
 * WHAT IT DOES: for every configured old-prefix -> new-prefix pair, finds the
 * old style's twin by matching the remainder of the name after the prefix,
 * then walks the configured scope (a named page, or the whole file) and
 * repoints every TEXT node whose textStyleId is one of the old styles onto
 * its twin. It never deletes a style — that stays a manual step in Figma
 * once every node has moved off it.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f relink-text-style-usage.js
 *  B) By hand: paste into the Desktop Bridge plugin console.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'   -> report only, change nothing (ALWAYS run this first)
    // 'relink' -> repoint matched nodes onto the twin style
    mode: 'scan',

    // Safety: refuse to run unless the open file has this key. null = any file.
    // Read the key from the file URL: figma.com/design/<KEY>/<name>
    fileKeyGuard: null,

    // Fallback safety when figma.fileKey is unavailable in this eval context
    // (observed via figma-ds-cli): refuse to run unless the open file has
    // this exact name. null = any name.
    fileNameGuard: 'Oblique Design System TEST (Tokens)',

    // Scope the walk to one page by name (recommended — this file has more
    // than one page, and other pages may use these styles legitimately for
    // other reasons). null = every page in the file.
    pageName: '🔤 Typography – Styles & Specimens',

    // Ordered old-prefix -> new-prefix pairs. A style's remainder after the
    // old prefix must match a real style with the new prefix, or it is
    // reported as blocked, not guessed.
    prefixPairs: [
      { oldPrefix: 'semantic/static/', newPrefix: 's/typography/grouped/static/' },
      { oldPrefix: 'semantic/dynamic/', newPrefix: 's/typography/grouped/dynamic/' },
    ],
  };
  // ==========================================================================

  if (CONFIG.fileKeyGuard && figma.fileKey !== CONFIG.fileKeyGuard) {
    return JSON.stringify({
      ok: false,
      reason: 'FILE KEY GUARD — refusing to run',
      expected: CONFIG.fileKeyGuard,
      open: { fileKey: figma.fileKey, name: figma.root.name },
    }, null, 2);
  }
  if (CONFIG.fileNameGuard && figma.root.name !== CONFIG.fileNameGuard) {
    return JSON.stringify({
      ok: false,
      reason: 'FILE NAME GUARD — refusing to run',
      expected: CONFIG.fileNameGuard,
      open: { fileKey: figma.fileKey, name: figma.root.name },
    }, null, 2);
  }

  const styles = await figma.getLocalTextStylesAsync();
  const byName = new Map(styles.map((s) => [s.name, s]));

  // --- build old style id -> twin style, per configured prefix pair --------
  const idToTwin = new Map();
  const blocked = [];
  for (const pair of CONFIG.prefixPairs) {
    for (const s of styles) {
      if (!s.name.startsWith(pair.oldPrefix)) continue;
      const suffix = s.name.slice(pair.oldPrefix.length);
      const twin = byName.get(pair.newPrefix + suffix);
      if (!twin) {
        blocked.push({ old: s.name, expectedTwin: pair.newPrefix + suffix, why: 'no style with that name' });
        continue;
      }
      idToTwin.set(s.id, { oldName: s.name, twinId: twin.id, twinName: twin.name });
    }
  }

  // --- find the page(s) to walk ---------------------------------------------
  await figma.loadAllPagesAsync();
  const pages = CONFIG.pageName
    ? figma.root.children.filter((p) => p.name === CONFIG.pageName)
    : figma.root.children;

  if (CONFIG.pageName && pages.length === 0) {
    return JSON.stringify({
      ok: false,
      reason: 'PAGE NOT FOUND',
      expected: CONFIG.pageName,
      availablePages: figma.root.children.map((p) => p.name),
    }, null, 2);
  }

  // --- walk and match --------------------------------------------------------
  const plan = [];
  const skippedMixed = [];
  const walk = (n) => {
    if (n.type === 'TEXT') {
      if (n.textStyleId === figma.mixed) {
        skippedMixed.push({ id: n.id, name: n.name });
      } else if (n.textStyleId && idToTwin.has(n.textStyleId)) {
        const t = idToTwin.get(n.textStyleId);
        plan.push({ nodeId: n.id, nodeName: n.name, fromStyleId: n.textStyleId, ...t });
      }
    }
    if (n.children) n.children.forEach(walk);
  };
  pages.forEach(walk);

  const tally = (key) => plan.reduce((a, p) => ((a[p[key]] = (a[p[key]] || 0) + 1), a), {});

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    scope: CONFIG.pageName || 'whole file',
    localTextStyles: styles.length,
    stylesConsidered: idToTwin.size,
    blockedStyles: blocked,
    nodesMatched: plan.length,
    byOldStyle: tally('oldName'),
    skippedMixed: skippedMixed.length,
    skippedMixedNodes: skippedMixed,
    relinked: 0,
    failed: [],
  };

  // --- apply ---------------------------------------------------------------
  if (CONFIG.mode === 'relink') {
    for (const p of plan) {
      try {
        const node = await figma.getNodeByIdAsync(p.nodeId);
        const twin = await figma.getStyleByIdAsync(p.twinId);
        if (!node || !twin) { report.failed.push({ ...p, err: 'node or twin style vanished mid-run' }); continue; }
        await node.setTextStyleIdAsync(p.twinId);
        report.relinked++;
      } catch (e) {
        report.failed.push({ nodeId: p.nodeId, err: String(e) });
      }
    }
    // Rollback data: every original style id, so the run can be reversed.
    report.rollback = plan.map((p) => ({ nodeId: p.nodeId, restoreTo: p.fromStyleId }));
  }

  console.log('[relink-text-style-usage]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
