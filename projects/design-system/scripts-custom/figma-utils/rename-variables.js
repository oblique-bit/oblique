/**
 * rename-variables.js — cosmetic prefix rename for local Figma VARIABLES
 * ----------------------------------------------------------------------------
 * WHY: Figma variable names come from the token path Token Studio pushed
 * them under (dots -> "/", leading "ob." stripped), same as text styles —
 * but nothing in this repo turns that trim into reusable code for variables.
 * The one place it has been done (compiled-tier S3 color variables, "ob/s/"
 * trimmed for panel usability — see build-color-variables.js /
 * build-color-pairings.js, which already expect the trim and reconstruct the
 * real token path for display) was applied once by hand and never captured
 * as a script. This is that script, so the same trim can be reapplied or
 * extended without repeating the manual work.
 *
 * WHAT IT DOES: renames local VARIABLES whose name starts with a configured
 * prefix, replacing that prefix and leaving the rest of the name untouched.
 * A rename is in place (same variable id) — bindings reference a variable by
 * id, not name, so existing fills/strokes/sizing/etc. that use the variable
 * keep working with no relink step needed. It never touches the underlying
 * token JSON, the CSS build, or text styles — purely a Figma-side display
 * name. Safe to re-run: a variable already on its target name is a no-op.
 *
 * CAUTION — same as rename-text-styles.js: this only stays stable across
 * re-exports if the underlying token PATH does not change again. Token
 * Studio matches by name derived from the current path; if the path changes,
 * a re-export can create a fresh variable under the new path-derived name
 * instead of renaming the existing one, leaving this rename's target
 * orphaned. Reach for a JSON path rename instead of this script whenever the
 * token path was touched in the same round.
 *
 * COLLISIONS: a rename target can already be occupied by a leftover variable
 * from a previous rename/export cycle. This script checks whether that
 * leftover still has live usage (any node's boundVariables references its
 * id, anywhere in the file):
 *   - zero usage -> with `autoResolveCollisions: true`, deletes the leftover
 *     and proceeds with the rename. Safe: nothing was pointing at it.
 *   - nonzero usage -> always blocked, reported in `collisions` with the
 *     usage count. A variable rename never needs relinking (ids don't
 *     change), so a blocked collision here means the leftover is a genuine
 *     second variable still in active use — resolve that by hand before
 *     re-running.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f rename-variables.js
 *  B) By hand: paste into the Desktop Bridge plugin console.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 */

(async () => {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'   -> report only, change nothing (ALWAYS run this first)
    // 'rename' -> apply the matched renames (and collision deletes, if any)
    mode: 'scan',

    // Safety: refuse to run unless the open file has this key. null = any file.
    // Read the key from the file URL: figma.com/design/<KEY>/<name>
    fileKeyGuard: null,

    // Fallback safety when figma.fileKey is unavailable in this eval context
    // (observed via figma-ds-cli — see rename-text-styles.js for the same
    // note). null = any name.
    fileNameGuard: null,

    // In 'rename' mode, auto-delete a colliding leftover variable IF it has
    // zero live usage. false = always block on any collision and let a
    // human decide. Has no effect in 'scan' mode.
    autoResolveCollisions: false,

    // Restrict to one variable collection by name; null = every collection.
    // Recommended when trimming a specific tier (e.g. only the compiled S3
    // color collection) so an accidental prefix match elsewhere is not
    // silently renamed too.
    collectionName: null,

    // Ordered prefix-rename rules. First matching rule wins per variable.
    // Verify the "from" prefix against the real variable name in the Figma
    // variables panel before running 'rename' — this is a literal string
    // match, not a token-path guess. Example for the known S3 color trim:
    // { from: 'ob/s/color/', to: 'color/' }
    renames: [],
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

  const allVars = await figma.variables.getLocalVariablesAsync();
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const collById = new Map(cols.map((c) => [c.id, c]));

  const vars = CONFIG.collectionName
    ? allVars.filter((v) => {
        const c = collById.get(v.variableCollectionId);
        return c && c.name === CONFIG.collectionName;
      })
    : allVars;

  const byName = new Map(vars.map((v) => [v.name, v]));

  const matchRule = (name) => CONFIG.renames.find((r) => name.startsWith(r.from));

  const plan = [];
  const noop = [];
  const candidateCollisions = [];

  for (const v of vars) {
    const rule = matchRule(v.name);
    if (!rule) continue;
    const newName = rule.to + v.name.slice(rule.from.length);
    if (newName === v.name) {
      noop.push(v.name);
      continue;
    }
    const existing = byName.get(newName);
    if (existing && existing.id !== v.id) {
      candidateCollisions.push({ from: v.name, to: newName, collidesWithId: existing.id });
      continue;
    }
    plan.push({ id: v.id, from: v.name, to: newName });
  }

  // --- check live usage on every collision candidate, whole file -----------
  // Same generic technique as unbind-variables.js: stringify boundVariables
  // and look for the variable's id, rather than enumerating every possible
  // bindable property. Remote-style ids contain "/"; local ones (what we
  // care about here) do not, so a plain id search is unambiguous.
  const collisions = [];
  const autoDeletable = [];
  if (candidateCollisions.length) {
    await figma.loadAllPagesAsync();
    const idUsage = new Map(candidateCollisions.map((c) => [c.collidesWithId, 0]));
    const walk = (n) => {
      if (n.boundVariables) {
        const json = JSON.stringify(n.boundVariables);
        for (const id of idUsage.keys()) {
          if (json.includes(id)) idUsage.set(id, idUsage.get(id) + 1);
        }
      }
      if (n.children) n.children.forEach(walk);
    };
    figma.root.children.forEach(walk);

    for (const c of candidateCollisions) {
      const usage = idUsage.get(c.collidesWithId) || 0;
      const entry = { ...c, usage };
      if (usage === 0) autoDeletable.push(entry);
      else collisions.push({ ...entry, why: 'target name is occupied by a variable with live usage — resolve by hand, a rename never needs relinking' });
    }
  }

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    collectionScope: CONFIG.collectionName || 'all collections',
    localVariablesConsidered: vars.length,
    planned: plan.length,
    alreadyOnTarget: noop.length,
    collisions,
    autoDeletableCollisions: autoDeletable.map(({ from, to, usage }) => ({ from, to, usage })),
    plan,
    deletedCollisions: 0,
    renamed: 0,
    failed: [],
  };

  // --- apply ---------------------------------------------------------------
  if (CONFIG.mode === 'rename') {
    if (CONFIG.autoResolveCollisions) {
      for (const c of autoDeletable) {
        try {
          const v = await figma.variables.getVariableByIdAsync(c.collidesWithId);
          if (v) { v.remove(); report.deletedCollisions++; }
        } catch (e) {
          report.failed.push({ from: c.from, to: c.to, err: `collision delete failed: ${String(e)}` });
          continue;
        }
        const owner = vars.find((v) => v.name === c.from);
        if (owner) plan.push({ id: owner.id, from: c.from, to: c.to });
      }
      report.planned = plan.length;
    }

    for (const p of plan) {
      try {
        const v = await figma.variables.getVariableByIdAsync(p.id);
        if (!v) { report.failed.push({ ...p, err: 'variable vanished mid-run' }); continue; }
        v.name = p.to;
        report.renamed++;
      } catch (e) {
        report.failed.push({ from: p.from, to: p.to, err: String(e) });
      }
    }
    // Rollback data: every original name, so the run can be reversed. Does
    // not cover collision deletes — those are gone for good.
    report.rollback = plan.map((p) => ({ id: p.id, restoreTo: p.from }));
    // Flush-delay before the eval process exits — same tight-synchronous-
    // loop caveat documented in _readme.md and rename-text-styles.js.
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('[rename-variables]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
