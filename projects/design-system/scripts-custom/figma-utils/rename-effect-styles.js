/**
 * rename-effect-styles.js — cosmetic prefix rename for local Figma EFFECT STYLES
 * ----------------------------------------------------------------------------
 * WHY: Same problem as rename-text-styles.js, one Figma primitive over. A
 * Figma effect style's name comes straight from the token path it was pushed
 * under, dots turned into "/" — e.g. "ob.s.shadow.sm" pushes as "s/shadow/sm".
 * The tier letter has to stay in the JSON (the dev CSS build only emits
 * "--ob-s"/"--ob-h" root variables — see rename-text-styles.js's WHY note),
 * but it is still noise in the effect styles panel.
 *
 * WHAT IT DOES: renames local EFFECT STYLES whose name starts with a
 * configured prefix, replacing that prefix and leaving the rest of the name
 * untouched. It never touches the underlying token JSON or the CSS build —
 * purely a Figma-side display name. Safe to re-run: a style already on its
 * target name is a no-op.
 *
 * CAUTION — same as rename-text-styles.js: this only stays stable across
 * re-exports if the underlying token PATH does not change again. If the
 * path changes, Token Studio can create a fresh style under the new
 * path-derived name instead of renaming the existing one, leaving this
 * rename's target orphaned. Reach for a JSON path rename instead of this
 * script whenever the token path was touched in the same round.
 *
 * COLLISIONS: a rename target can already be occupied by a leftover style
 * from a previous rename/export cycle. This script checks whether that
 * leftover still has live usage (any node's effectStyleId matches its id):
 *   - zero usage -> with `autoResolveCollisions: true`, deletes the leftover
 *     and proceeds with the rename. Safe: nothing was pointing at it.
 *   - nonzero usage -> always blocked, reported in `collisions` with the
 *     usage count. Relink those nodes first (setEffectStyleIdAsync onto the
 *     target style), then re-run.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f rename-effect-styles.js
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
    fileKeyGuard: null,

    // Fallback safety when figma.fileKey is unavailable in this eval context
    // (observed via figma-ds-cli — see rename-text-styles.js). null = any name.
    fileNameGuard: null,

    // In 'rename' mode, auto-delete a colliding leftover style IF it has
    // zero live usage. false = always block on any collision.
    autoResolveCollisions: false,

    // Ordered prefix-rename rules. First matching rule wins per style.
    // Verify the "from" prefix against the real style name in the Figma
    // effect styles panel before running 'rename' — literal string match,
    // not a token-path guess.
    renames: [
      { from: 's/shadow/', to: 'shadow/' },
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

  const styles = await figma.getLocalEffectStylesAsync();
  const byName = new Map(styles.map((s) => [s.name, s]));

  const matchRule = (name) => CONFIG.renames.find((r) => name.startsWith(r.from));

  const plan = [];
  const noop = [];
  const candidateCollisions = [];

  for (const s of styles) {
    const rule = matchRule(s.name);
    if (!rule) continue;
    const newName = rule.to + s.name.slice(rule.from.length);
    if (newName === s.name) {
      noop.push(s.name);
      continue;
    }
    const existing = byName.get(newName);
    if (existing && existing.id !== s.id) {
      candidateCollisions.push({ from: s.name, to: newName, collidesWithId: existing.id });
      continue;
    }
    plan.push({ id: s.id, from: s.name, to: newName });
  }

  // --- check live usage on every collision candidate, whole file -----------
  const collisions = [];
  const autoDeletable = [];
  if (candidateCollisions.length) {
    await figma.loadAllPagesAsync();
    const collisionIds = new Set(candidateCollisions.map((c) => c.collidesWithId));
    const usageCount = new Map();
    const walk = (n) => {
      if (n.effectStyleId && collisionIds.has(n.effectStyleId)) {
        usageCount.set(n.effectStyleId, (usageCount.get(n.effectStyleId) || 0) + 1);
      }
      if (n.children) n.children.forEach(walk);
    };
    figma.root.children.forEach(walk);

    for (const c of candidateCollisions) {
      const usage = usageCount.get(c.collidesWithId) || 0;
      const entry = { ...c, usage };
      if (usage === 0) autoDeletable.push(entry);
      else collisions.push({ ...entry, why: 'target name is occupied by a style with live usage — relink first (setEffectStyleIdAsync), then re-run' });
    }
  }

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    localEffectStyles: styles.length,
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
          const s = await figma.getStyleByIdAsync(c.collidesWithId);
          if (s) { s.remove(); report.deletedCollisions++; }
        } catch (e) {
          report.failed.push({ from: c.from, to: c.to, err: `collision delete failed: ${String(e)}` });
          continue;
        }
        const owner = styles.find((s) => s.name === c.from);
        if (owner) plan.push({ id: owner.id, from: c.from, to: c.to });
      }
      report.planned = plan.length;
    }

    for (const p of plan) {
      try {
        const s = await figma.getStyleByIdAsync(p.id);
        if (!s) { report.failed.push({ ...p, err: 'style vanished mid-run' }); continue; }
        s.name = p.to;
        report.renamed++;
      } catch (e) {
        report.failed.push({ from: p.from, to: p.to, err: String(e) });
      }
    }
    report.rollback = plan.map((p) => ({ id: p.id, restoreTo: p.from }));
    // Flush-delay before the eval process exits — same tight-synchronous-
    // loop caveat documented in _readme.md and rename-text-styles.js.
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('[rename-effect-styles]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
