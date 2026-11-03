/**
 * repoint-explicit-modes.js — move node mode overrides onto a library's collection
 * ----------------------------------------------------------------------------
 * WHY: This is the THIRD way a "ghost" collection stays alive in the variable-
 * mode picker. A node (frame, instance...) carries an explicit mode override
 * (`explicitVariableModes`) for a remote collection, for example "viewport = md"
 * set on a template frame. Figma keeps that collection subscribed for as long as
 * one node overrides it. unbind-variables.js (node bindings) and
 * relink-variable-aliases.js (local variable values) do not touch overrides.
 *
 * WHAT IT DOES: for every node whose override points at a collection named
 * CONFIG.collectionName that is NOT the target library's, it sets the same-named
 * mode of the target library's collection and clears the old override. A node is
 * skipped (and reported) when the target has no mode of that name.
 *
 * HOW TO RUN: figma-ds-cli eval -f repoint-explicit-modes.js
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * Reopen the file before judging the picker; Figma caches the old collection.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'    -> report only, change nothing (ALWAYS run this first)
    // 'repoint' -> apply the overrides on the target collection, clear the old
    mode: 'scan',

    // Safety: refuse to run unless the open file has this key. null = any file.
    fileKeyGuard: null,

    // Name of the collection to move (same name in the old and the new library).
    collectionName: 'viewport',

    // Name of the enabled team library that holds the target collection.
    targetLibraryName: 'DesignSystem@Tokens V10.0',
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

  await figma.loadAllPagesAsync();

  // --- target collection: import one variable so the library collection exists locally ---
  const libCols = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const lib = libCols.find((c) => c.name === CONFIG.collectionName && c.libraryName === CONFIG.targetLibraryName);
  if (!lib) {
    return JSON.stringify({ ok: false, reason: `no "${CONFIG.collectionName}" in "${CONFIG.targetLibraryName}"` }, null, 2);
  }
  const [first] = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lib.key);
  const imported = await figma.variables.importVariableByKeyAsync(first.key);
  const target = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId);

  const nodes = [];
  for (const page of figma.root.children) (function walk(n) { nodes.push(n); if (n.children) n.children.forEach(walk); })(page);

  const report = { mode: CONFIG.mode, found: 0, repointed: 0, skipped: [], plan: [] };
  for (const n of nodes) {
    if (!n.explicitVariableModes) continue;
    for (const cid of Object.keys(n.explicitVariableModes)) {
      if (cid === target.id) continue;
      const old = await figma.variables.getVariableCollectionByIdAsync(cid);
      if (!old || old.name !== CONFIG.collectionName || old.key === target.key) continue;
      report.found++;
      const oldMode = old.modes.find((m) => m.modeId === n.explicitVariableModes[cid]);
      const newMode = oldMode && target.modes.find((m) => m.name === oldMode.name);
      if (!newMode) { report.skipped.push({ node: n.id, name: n.name, mode: oldMode && oldMode.name, why: 'no same-named mode in target' }); continue; }
      report.plan.push({ node: n.id, name: n.name, mode: oldMode.name });
      if (CONFIG.mode === 'repoint') {
        n.setExplicitVariableModeForCollection(target, newMode.modeId);
        n.clearExplicitVariableModeForCollection(old);
        report.repointed++;
      }
    }
  }

  console.log('[repoint-explicit-modes]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
