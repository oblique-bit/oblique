/**
 * run-cosmetics.js — one post-export step for the figma cosmetic scripts
 * ----------------------------------------------------------------------------
 * WHY: trim, scoping and text/effect-style rename+relink were separate
 * scripts run by hand after every Token Studio export, in an order that had
 * to be remembered each time — relink before rename when a rename target is
 * already occupied by a leftover with live usage, everything re-applied
 * after every export because Token Studio always re-derives names from the
 * token path. Forgetting a step, or running them out of order, is how the
 * library drifts out of its cosmetic state between exports. This script runs
 * all of them together, in the right order, from one CONFIG block.
 *
 * WHAT IT DOES, IN ORDER:
 *   1. relink   — move node usage off text styles about to be renamed onto
 *                 their new-path twin, when the twin already exists and the
 *                 old style would otherwise block the rename with live usage
 *   2. rename + delete text styles — cosmetic prefix trim, plus outright
 *                 deletion of styles that must never surface in the panel
 *                 (e.g. "h/link/*" — Token Studio recreates these on every
 *                 export regardless of the token set's Enabled/Source/
 *                 Disabled status, so deleting them is the only fix)
 *   3. rename effect styles — same cosmetic prefix trim, for shadows/blurs
 *   4. rename variables — same cosmetic prefix trim, for variables (e.g. the
 *                 compiled-tier "ob/s/color/" trim)
 *   5. scope variables — bulk scopes/hiddenFromPublishing pass
 *
 * Each step is independently toggleable (set its CONFIG section's `enabled`
 * to false to skip it) and uses the same scan-then-apply safety pattern as
 * the standalone scripts it replaces — nothing changes until `mode: 'apply'`.
 * A step with an empty rule list is a no-op even in apply mode.
 *
 * CAUTION — same as every script here: a cosmetic rename only stays durable
 * across re-exports if the underlying token PATH does not change in the same
 * round. If a path just changed, expect the next export to recreate a style
 * under the new path-derived name — fix the JSON path, not this script's
 * rules, and only add/adjust a rule here once the path is settled.
 *
 * HOW TO RUN:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f run-cosmetics.js
 *  B) By hand: paste into the Desktop Bridge plugin console.
 *
 * Run this after every Token Studio export (or Publish Library), before
 * trusting the panel state. See ../FIGMA-WORKFLOW.md for the full pipeline
 * this fits into.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode: 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'  -> report every step, change nothing (ALWAYS run this first)
    // 'apply' -> run every enabled step for real, in order
    mode: 'scan',

    fileKeyGuard: null,
    fileNameGuard: null,

    // In apply mode, auto-delete a rename-collision leftover IF it has zero
    // live usage, for every step below that supports it (text styles,
    // effect styles, variables). false = always block and report instead.
    autoResolveCollisions: false,

    relink: {
      enabled: true,
      pageName: '🔤 Typography – Styles & Specimens',
      // {oldPrefix, newPrefix} — old style's remainder after oldPrefix must
      // match a real current style under newPrefix, or it is reported
      // blocked, not guessed. Empty by default: only needed right after a
      // token path change recreates styles under a new name while old ones
      // still have live usage on a doc page. Fill in only when that applies.
      prefixPairs: [],
    },

    textStyles: {
      enabled: true,
      // {from, to} cosmetic prefix trims.
      renames: [
        { from: 's/typography/authoring/', to: '~authoring/' },
        { from: 'h/heading/', to: 'heading/' },
        { from: 'h/body/', to: 'body/' },
      ],
      // Prefixes to delete outright, no rename target. "h/link/*" recreates
      // on every export regardless of the token set's Enabled/Source/
      // Disabled status — deleting is the only known fix.
      deletePrefixes: ['h/link/'],
    },

    effectStyles: {
      enabled: true,
      renames: [
        { from: 's/shadow/', to: 'shadow/' },
      ],
    },

    variables: {
      enabled: false, // no rule needed yet — see rename-variables.js
      collectionName: null,
      renames: [],
    },

    // scope-variables.js's own CONFIG shape — see that script's header for
    // field meanings. Disabled by default; this pass does not use the
    // scan/apply collision machinery the others do, it just writes what is
    // configured here directly in apply mode.
    scopeVariables: {
      enabled: false,
      namePrefixes: [],
      collectionNames: [],
      resolvedTypes: [],
      currentScopes: null,
      setScopes: null,
      setHiddenFromPublishing: null,
    },
  };
  // ==========================================================================

  if (CONFIG.fileKeyGuard && figma.fileKey !== CONFIG.fileKeyGuard) {
    return JSON.stringify({ ok: false, reason: 'FILE KEY GUARD', expected: CONFIG.fileKeyGuard, open: { fileKey: figma.fileKey, name: figma.root.name } }, null, 2);
  }
  if (CONFIG.fileNameGuard && figma.root.name !== CONFIG.fileNameGuard) {
    return JSON.stringify({ ok: false, reason: 'FILE NAME GUARD', expected: CONFIG.fileNameGuard, open: { fileKey: figma.fileKey, name: figma.root.name } }, null, 2);
  }

  const APPLY = CONFIG.mode === 'apply';
  const report = { ok: true, mode: CONFIG.mode, file: { name: figma.root.name, fileKey: figma.fileKey }, steps: {} };
  const flush = () => new Promise((r) => setTimeout(r, 1500));

  // ── shared helpers ─────────────────────────────────────────────────────
  function planRenames(items, renames) {
    const byName = new Map(items.map((s) => [s.name, s]));
    const plan = []; const noop = []; const candidateCollisions = [];
    for (const s of items) {
      const rule = renames.find((r) => s.name.startsWith(r.from));
      if (!rule) continue;
      const newName = rule.to + s.name.slice(rule.from.length);
      if (newName === s.name) { noop.push(s.name); continue; }
      const existing = byName.get(newName);
      if (existing && existing.id !== s.id) { candidateCollisions.push({ from: s.name, to: newName, collidesWithId: existing.id }); continue; }
      plan.push({ id: s.id, from: s.name, to: newName });
    }
    return { plan, noop, candidateCollisions };
  }

  async function usageForCollisions(candidateCollisions, matchNode) {
    const collisions = []; const autoDeletable = [];
    if (!candidateCollisions.length) return { collisions, autoDeletable };
    await figma.loadAllPagesAsync();
    const ids = new Set(candidateCollisions.map((c) => c.collidesWithId));
    const usage = new Map();
    const walk = (n) => {
      const hitId = matchNode(n, ids);
      if (hitId) usage.set(hitId, (usage.get(hitId) || 0) + 1);
      if (n.children) n.children.forEach(walk);
    };
    figma.root.children.forEach(walk);
    for (const c of candidateCollisions) {
      const u = usage.get(c.collidesWithId) || 0;
      const entry = { ...c, usage: u };
      if (u === 0) autoDeletable.push(entry); else collisions.push(entry);
    }
    return { collisions, autoDeletable };
  }

  async function applyPlan(plan, autoDeletable, getById, allItemsByName) {
    const result = { renamed: 0, deletedCollisions: 0, failed: [] };
    if (CONFIG.autoResolveCollisions) {
      for (const c of autoDeletable) {
        try {
          const v = await getById(c.collidesWithId);
          if (v) { v.remove(); result.deletedCollisions++; }
        } catch (e) { result.failed.push({ from: c.from, to: c.to, err: 'collision delete failed: ' + String(e) }); continue; }
        const owner = allItemsByName.get(c.from);
        if (owner) plan.push({ id: owner.id, from: c.from, to: c.to });
      }
    }
    for (const p of plan) {
      try {
        const v = await getById(p.id);
        if (!v) { result.failed.push({ ...p, err: 'vanished mid-run' }); continue; }
        v.name = p.to;
        result.renamed++;
      } catch (e) { result.failed.push({ from: p.from, to: p.to, err: String(e) }); }
    }
    return result;
  }

  // ── 1. relink ───────────────────────────────────────────────────────────
  if (CONFIG.relink.enabled) {
    const styles = await figma.getLocalTextStylesAsync();
    const byName = new Map(styles.map((s) => [s.name, s]));
    const idToTwin = new Map(); const blocked = [];
    for (const pair of CONFIG.relink.prefixPairs) {
      for (const s of styles) {
        if (!s.name.startsWith(pair.oldPrefix)) continue;
        const suffix = s.name.slice(pair.oldPrefix.length);
        const twin = byName.get(pair.newPrefix + suffix);
        if (!twin) { blocked.push({ old: s.name, expected: pair.newPrefix + suffix }); continue; }
        idToTwin.set(s.id, { oldName: s.name, twinId: twin.id, twinName: twin.name });
      }
    }
    await figma.loadAllPagesAsync();
    const pages = CONFIG.relink.pageName
      ? figma.root.children.filter((p) => p.name === CONFIG.relink.pageName)
      : figma.root.children;
    const plan = []; const skippedMixed = [];
    const walk = (n) => {
      if (n.type === 'TEXT') {
        if (n.textStyleId === figma.mixed) skippedMixed.push({ id: n.id, name: n.name });
        else if (n.textStyleId && idToTwin.has(n.textStyleId)) plan.push({ nodeId: n.id, ...idToTwin.get(n.textStyleId) });
      }
      if (n.children) n.children.forEach(walk);
    };
    pages.forEach(walk);

    const stepReport = { blockedStyles: blocked, nodesMatched: plan.length, skippedMixed: skippedMixed.length, relinked: 0, failed: [] };
    if (APPLY) {
      for (const p of plan) {
        try {
          const node = await figma.getNodeByIdAsync(p.nodeId);
          const twin = await figma.getStyleByIdAsync(p.twinId);
          if (!node || !twin) { stepReport.failed.push({ ...p, err: 'vanished mid-run' }); continue; }
          await node.setTextStyleIdAsync(p.twinId);
          stepReport.relinked++;
        } catch (e) { stepReport.failed.push({ nodeId: p.nodeId, err: String(e) }); }
      }
      await flush();
    }
    report.steps.relink = stepReport;
  }

  // ── 2. text styles: rename + delete ───────────────────────────────────
  if (CONFIG.textStyles.enabled) {
    const styles = await figma.getLocalTextStylesAsync();
    const { plan, noop, candidateCollisions } = planRenames(styles, CONFIG.textStyles.renames);
    const { collisions, autoDeletable } = await usageForCollisions(candidateCollisions, (n, ids) =>
      n.type === 'TEXT' && n.textStyleId && ids.has(n.textStyleId) ? n.textStyleId : null
    );
    const toDelete = styles.filter((s) => CONFIG.textStyles.deletePrefixes.some((p) => s.name.startsWith(p)));

    const stepReport = { planned: plan.length, alreadyOnTarget: noop.length, collisions, autoDeletableCollisions: autoDeletable, toDelete: toDelete.map((s) => s.name), renamed: 0, deletedCollisions: 0, deleted: 0, failed: [] };
    if (APPLY) {
      const applyResult = await applyPlan(plan, autoDeletable, figma.getStyleByIdAsync.bind(figma), new Map(styles.map((s) => [s.name, s])));
      Object.assign(stepReport, applyResult);
      for (const s of toDelete) {
        try { s.remove(); stepReport.deleted++; } catch (e) { stepReport.failed.push({ name: s.name, err: String(e) }); }
      }
      await flush();
    }
    report.steps.textStyles = stepReport;
  }

  // ── 3. effect styles: rename ──────────────────────────────────────────
  if (CONFIG.effectStyles.enabled) {
    const styles = await figma.getLocalEffectStylesAsync();
    const { plan, noop, candidateCollisions } = planRenames(styles, CONFIG.effectStyles.renames);
    const { collisions, autoDeletable } = await usageForCollisions(candidateCollisions, (n, ids) =>
      n.effectStyleId && ids.has(n.effectStyleId) ? n.effectStyleId : null
    );
    const stepReport = { planned: plan.length, alreadyOnTarget: noop.length, collisions, autoDeletableCollisions: autoDeletable, renamed: 0, deletedCollisions: 0, failed: [] };
    if (APPLY) {
      const applyResult = await applyPlan(plan, autoDeletable, figma.getStyleByIdAsync.bind(figma), new Map(styles.map((s) => [s.name, s])));
      Object.assign(stepReport, applyResult);
      await flush();
    }
    report.steps.effectStyles = stepReport;
  }

  // ── 4. variables: rename ──────────────────────────────────────────────
  if (CONFIG.variables.enabled) {
    const allVars = await figma.variables.getLocalVariablesAsync();
    const cols = await figma.variables.getLocalVariableCollectionsAsync();
    const collById = new Map(cols.map((c) => [c.id, c]));
    const vars = CONFIG.variables.collectionName
      ? allVars.filter((v) => { const c = collById.get(v.variableCollectionId); return c && c.name === CONFIG.variables.collectionName; })
      : allVars;
    const { plan, noop, candidateCollisions } = planRenames(vars, CONFIG.variables.renames);
    const { collisions, autoDeletable } = await usageForCollisions(candidateCollisions, (n, ids) => {
      if (!n.boundVariables) return null;
      const json = JSON.stringify(n.boundVariables);
      for (const id of ids) if (json.includes(id)) return id;
      return null;
    });
    const stepReport = { collectionScope: CONFIG.variables.collectionName || 'all collections', planned: plan.length, alreadyOnTarget: noop.length, collisions, autoDeletableCollisions: autoDeletable, renamed: 0, deletedCollisions: 0, failed: [] };
    if (APPLY) {
      const applyResult = await applyPlan(plan, autoDeletable, figma.variables.getVariableByIdAsync.bind(figma.variables), new Map(vars.map((v) => [v.name, v])));
      Object.assign(stepReport, applyResult);
      await flush();
    }
    report.steps.variables = stepReport;
  }

  // ── 5. scope variables ─────────────────────────────────────────────────
  if (CONFIG.scopeVariables.enabled) {
    const sv = CONFIG.scopeVariables;
    const allVars = await figma.variables.getLocalVariablesAsync();
    const cols = await figma.variables.getLocalVariableCollectionsAsync();
    const collById = new Map(cols.map((c) => [c.id, c]));
    const matched = allVars.filter((v) => {
      if (sv.namePrefixes.length && !sv.namePrefixes.some((p) => v.name.startsWith(p))) return false;
      if (sv.collectionNames.length) {
        const c = collById.get(v.variableCollectionId);
        if (!c || !sv.collectionNames.includes(c.name)) return false;
      }
      if (sv.resolvedTypes.length && !sv.resolvedTypes.includes(v.resolvedType)) return false;
      if (sv.currentScopes && !sv.currentScopes.some((set) => JSON.stringify([...v.scopes].sort()) === JSON.stringify([...set].sort()))) return false;
      return true;
    });
    const stepReport = { matched: matched.length, updated: 0, failed: [] };
    if (APPLY) {
      for (const v of matched) {
        try {
          if (sv.setScopes !== null) v.scopes = sv.setScopes;
          if (sv.setHiddenFromPublishing !== null) v.hiddenFromPublishing = sv.setHiddenFromPublishing;
          stepReport.updated++;
        } catch (e) { stepReport.failed.push({ name: v.name, err: String(e) }); }
      }
      await flush();
    }
    report.steps.scopeVariables = stepReport;
  }

  console.log('[run-cosmetics]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
