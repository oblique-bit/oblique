/**
 * relink-variable-aliases.js — repoint local variable values off a dead library
 * ----------------------------------------------------------------------------
 * WHY: This is the SECOND way a "ghost" collection stays alive in the variable-
 * mode picker. unbind-variables.js covers the first one (a NODE consumes a
 * remote variable). This one covers the case where no node is involved at all:
 * a LOCAL variable's own value is an alias pointing at a variable in a remote
 * collection. Figma keeps that collection subscribed, and caches its last
 * published values inside the file, so it survives unpublishing or deleting the
 * source library. Nothing on the canvas shows it. Only the mode picker does.
 *
 * WHAT IT DOES: for every local variable value that aliases a remote variable,
 * it finds the local variable with the identical name and repoints the alias
 * there. It never drops a reference it cannot replace.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f relink-variable-aliases.js
 *  B) By hand: paste into the Desktop Bridge plugin console.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'   -> report only, change nothing (ALWAYS run this first)
    // 'relink' -> repoint the matched aliases to their local twin
    mode: 'scan',

    // Safety: refuse to run unless the open file has this key. null = any file.
    // Read the key from the file URL: figma.com/design/<KEY>/<name>
    fileKeyGuard: null,

    // Only touch aliases into these remote collection names. null = any.
    collectionFilter: null,

    // Compare the fully resolved value of each ghost target against its local
    // twin and report every value that would change. Costs a second pass.
    reportValueImpact: true,
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

  const vars = await figma.variables.getLocalVariablesAsync();
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const collById = {};
  for (const c of cols) collById[c.id] = c;
  const collName = (id) => (collById[id] ? collById[id].name : '(remote)');

  // --- index local variables by name; a duplicate name is not resolvable ---
  const byName = new Map();
  const duplicateNames = new Set();
  for (const v of vars) {
    if (byName.has(v.name)) duplicateNames.add(v.name);
    else byName.set(v.name, v);
  }
  for (const n of duplicateNames) byName.delete(n);

  const getColl = async (id) =>
    collById[id] || (await figma.variables.getVariableCollectionByIdAsync(id));

  // --- resolve a variable to a concrete value under a target MODE NAME ------
  // Aliases are followed across collections; when the next collection has no
  // mode of that name (e.g. a single-mode tier), its default mode is used.
  const resolveByModeName = async (v, modeName, depth) => {
    if (!v || depth > 15) return { err: 'unresolvable' };
    const c = await getColl(v.variableCollectionId);
    if (!c) return { err: 'no collection' };
    const m =
      c.modes.find((x) => x.name === modeName) ||
      c.modes.find((x) => x.modeId === c.defaultModeId) ||
      c.modes[0];
    const val = v.valuesByMode[m.modeId];
    if (val && val.type === 'VARIABLE_ALIAS') {
      return resolveByModeName(await figma.variables.getVariableByIdAsync(val.id), modeName, depth + 1);
    }
    return { val };
  };

  const to8 = (x) => Math.round(x * 255);
  const valueKey = (v) =>
    v && typeof v === 'object' && 'r' in v
      ? [to8(v.r), to8(v.g), to8(v.b), Math.round((v.a === undefined ? 1 : v.a) * 1000)].join(',')
      : JSON.stringify(v);

  // --- collect every local value that aliases a remote variable ------------
  // Remote variable ids carry the library key: 'VariableID:<40hex>/<node:id>'.
  // Local ids never contain '/', so it is a safe pre-filter; .remote confirms.
  const remoteCache = new Map();
  const plan = [];
  const blocked = [];

  for (const v of vars) {
    for (const [modeId, val] of Object.entries(v.valuesByMode)) {
      if (!(val && val.type === 'VARIABLE_ALIAS' && val.id.includes('/'))) continue;

      if (!remoteCache.has(val.id)) {
        const rv = await figma.variables.getVariableByIdAsync(val.id);
        const rc = rv ? await figma.variables.getVariableCollectionByIdAsync(rv.variableCollectionId) : null;
        remoteCache.set(val.id, rv && rv.remote ? { v: rv, coll: rc } : null);
      }
      const remote = remoteCache.get(val.id);
      if (!remote) { blocked.push({ variable: v.name, modeId, why: 'remote target unresolvable' }); continue; }

      const remoteColl = remote.coll ? remote.coll.name : '(unknown)';
      if (CONFIG.collectionFilter && !CONFIG.collectionFilter.includes(remoteColl)) continue;

      const twin = byName.get(remote.v.name);
      if (!twin) {
        blocked.push({
          variable: v.name, modeId, target: remote.v.name,
          why: duplicateNames.has(remote.v.name) ? 'local name is ambiguous' : 'no local twin by name',
        });
        continue;
      }
      if (twin.id === v.id) { blocked.push({ variable: v.name, modeId, why: 'twin is self' }); continue; }
      if (twin.resolvedType !== v.resolvedType) {
        blocked.push({ variable: v.name, modeId, why: `type mismatch ${v.resolvedType} vs ${twin.resolvedType}` });
        continue;
      }

      plan.push({
        varId: v.id, varName: v.name, varColl: collName(v.variableCollectionId), modeId,
        fromId: val.id, fromName: remote.v.name, fromColl: remoteColl,
        toId: twin.id, toName: twin.name, toColl: collName(twin.variableCollectionId),
      });
    }
  }

  // --- value impact: does the ghost still resolve to what the twin does? ----
  // The ghost is a frozen snapshot of an older publish. Where the two differ,
  // relinking moves the value to the file's current one — a visible change.
  const valueChanges = [];
  let valuesCompared = 0;
  if (CONFIG.reportValueImpact) {
    const seen = new Set();
    for (const p of plan) {
      if (seen.has(p.fromId)) continue;
      seen.add(p.fromId);
      const remote = remoteCache.get(p.fromId);
      const twin = byName.get(p.toName);
      if (!remote || !remote.coll || !twin) continue;
      for (const m of remote.coll.modes) {
        const raw = remote.v.valuesByMode[m.modeId];
        const ghost = raw && raw.type === 'VARIABLE_ALIAS'
          ? (await resolveByModeName(await figma.variables.getVariableByIdAsync(raw.id), m.name, 0)).val
          : raw;
        const local = await resolveByModeName(twin, m.name, 0);
        if (local.err) continue;
        valuesCompared++;
        const a = valueKey(ghost), b = valueKey(local.val);
        if (a !== b) valueChanges.push({ variable: p.fromName, mode: m.name, ghost: a, local: b });
      }
    }
  }

  // --- the other two channels, so a partial fix is never mistaken for a fix -
  // A remote collection also survives on a node binding (unbind-variables.js)
  // or on a node's explicit mode override. Both are reported, never touched.
  await figma.loadAllPagesAsync();
  let nodeBindings = 0, explicitModes = 0;
  const walk = (n) => {
    if (n.boundVariables) {
      const m = JSON.stringify(n.boundVariables).match(/VariableID:[0-9a-f]{40}\//g);
      if (m) nodeBindings += m.length;
    }
    if (n.explicitVariableModes) {
      for (const cid of Object.keys(n.explicitVariableModes)) if (cid.includes('/')) explicitModes++;
    }
    if (n.children) n.children.forEach(walk);
  };
  walk(figma.root);

  // --- summaries ------------------------------------------------------------
  const tally = (key) => plan.reduce((a, p) => ((a[p[key]] = (a[p[key]] || 0) + 1), a), {});

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    localVariables: vars.length,
    planned: plan.length,
    blocked,
    duplicateLocalNames: Array.from(duplicateNames),
    fromRemoteCollection: tally('fromColl'),
    inLocalCollection: tally('varColl'),
    toLocalCollection: tally('toColl'),
    valuesCompared,
    valuesThatChange: valueChanges.length,
    valueChanges,
    otherGhostChannels: { nodeBindingsToRemote: nodeBindings, nodeExplicitRemoteModes: explicitModes },
    relinked: 0,
    failed: [],
    remoteAliasesRemaining: null,
  };

  // --- apply ---------------------------------------------------------------
  if (CONFIG.mode === 'relink') {
    for (const p of plan) {
      try {
        const v = await figma.variables.getVariableByIdAsync(p.varId);
        const twin = await figma.variables.getVariableByIdAsync(p.toId);
        if (!v || !twin) { report.failed.push({ ...p, err: 'variable vanished mid-run' }); continue; }
        v.setValueForMode(p.modeId, figma.variables.createVariableAlias(twin));
        report.relinked++;
      } catch (e) {
        report.failed.push({ variable: p.varName, modeId: p.modeId, err: String(e) });
      }
    }
    // re-probe: anything still pointing out of the file?
    const after = await figma.variables.getLocalVariablesAsync();
    let remaining = 0;
    for (const v of after) {
      for (const val of Object.values(v.valuesByMode)) {
        if (val && val.type === 'VARIABLE_ALIAS' && val.id.includes('/')) remaining++;
      }
    }
    report.remoteAliasesRemaining = remaining;
    // The ghost collection stays cached in the file until it is reopened, even
    // at 0 references. Reopen the file before judging the picker.
    report.reopenFileToClearPicker = remaining === 0;
    // Rollback data: every original target, so the run can be reversed.
    report.rollback = plan.map((p) => ({ varId: p.varId, modeId: p.modeId, restoreTo: p.fromId }));
  }

  console.log('[relink-variable-aliases]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
