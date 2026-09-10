/**
 * rename-text-styles.js — cosmetic prefix rename for local Figma TEXT STYLES
 * ----------------------------------------------------------------------------
 * WHY: Figma text style names come straight from the token path Token Studio
 * pushed them under (dots -> "/", leading "ob." stripped). The dev CSS build
 * only emits root-level variables starting "--ob-s" or "--ob-h"
 * (style-dictionary-formats-token-store.mjs:24, a hardcoded
 * `/^--ob-[sh]/` filter) — anything else is silently dropped from the actual
 * CSS, no error. So every token that needs to reach CSS keeps a tier letter
 * in its path ("ob.s.*" / "ob.h.*"), even when that tier letter is noise for
 * a figma user picking a style ("s/authoring/...", "h/heading/..."). This
 * script is how that noise gets trimmed on the FIGMA side only, leaving the
 * JSON path — and the CSS it produces — untouched.
 *
 * CAUTION — this only stays stable across re-exports if the underlying token
 * PATH does not change again. Token Studio matches styles by name derived
 * from the current path; twice now (the typography "authoring" composites,
 * then the heading/body styles), a re-export after the token path had just
 * changed silently recreated a style under the new path-derived name
 * alongside the already-renamed one — the ref map for the OLD path no longer
 * matched anything, so Token Studio treated it as new. Once a path is
 * genuinely done changing, the cosmetic rename here is durable. If you are
 * still iterating on the token path, wait until it is settled before running
 * this — renaming now just creates the next collision.
 *
 * WHAT IT DOES: renames local TEXT STYLES whose name starts with a configured
 * prefix, replacing that prefix and leaving the rest of the name untouched.
 * It never touches the underlying token JSON, the CSS build, or variables —
 * purely a Figma-side display name. Safe to re-run: a style already on its
 * target name is a no-op.
 *
 * COLLISIONS: a rename target can already be occupied by a leftover style
 * from a previous rename/export cycle (see CAUTION above). This script
 * checks whether that leftover still has live node usage:
 *   - zero usage -> with `autoResolveCollisions: true`, deletes the leftover
 *     and proceeds with the rename. Safe: nothing was pointing at it.
 *   - nonzero usage -> always blocked, reported in `collisions` with the
 *     usage count. Fix by relinking those nodes first — see
 *     relink-text-style-usage.js — then re-run this script.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f rename-text-styles.js
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

    // In 'rename' mode, auto-delete a colliding leftover style IF it has zero
    // live node usage. false = always block on any collision, zero-usage or
    // not, and let a human decide. Has no effect in 'scan' mode — scan always
    // just reports.
    autoResolveCollisions: false,

    // Ordered prefix-rename rules. First matching rule wins per style.
    // Verify the "from" prefix against the real style name in the Figma
    // panel before running 'rename' — this is a literal string match, not a
    // token-path guess. Confirmed against the real panel (2026-09-10), both
    // token paths now final (see the tier-letter note in WHY above).
    //
    // "_authoring" keeps the leading underscore on purpose — it is the
    // authoring/maintainer-only composite family (see ticket 19), and the
    // underscore sorts it below "body" / "heading" in the panel instead of
    // competing with them for attention.
    renames: [
      { from: 's/authoring/', to: '_authoring/' },
      { from: 'h/heading/', to: 'heading/' },
      { from: 'h/body/', to: 'body/' },
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

  const styles = await figma.getLocalTextStylesAsync();
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
      if (n.type === 'TEXT' && n.textStyleId && collisionIds.has(n.textStyleId)) {
        usageCount.set(n.textStyleId, (usageCount.get(n.textStyleId) || 0) + 1);
      }
      if (n.children) n.children.forEach(walk);
    };
    figma.root.children.forEach(walk);

    for (const c of candidateCollisions) {
      const usage = usageCount.get(c.collidesWithId) || 0;
      const entry = { ...c, usage };
      if (usage === 0) autoDeletable.push(entry);
      else collisions.push({ ...entry, why: 'target name is occupied by a style with live usage — relink first (relink-text-style-usage.js), then re-run' });
    }
  }

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    localTextStyles: styles.length,
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
    // Rollback data: every original name, so the run can be reversed. Does
    // not cover collision deletes — those are gone for good.
    report.rollback = plan.map((p) => ({ id: p.id, restoreTo: p.from }));
    // Give the plugin bridge time to flush the batch before the eval process
    // exits. Confirmed via figma-ds-cli (2026-09-10): a bulk loop of style
    // mutations (rename or remove) that returns immediately after the loop
    // reports success but silently does not persist — a re-read in the very
    // next eval call shows the pre-mutation state. A single mutation with no
    // delay persists fine; it is specifically a same-tick batch that is lost.
    // A trailing delay before the process returns reliably fixes it.
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('[rename-text-styles]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
})()
