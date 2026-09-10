/**
 * rename-text-styles.js — cosmetic prefix rename for local Figma TEXT STYLES
 * ----------------------------------------------------------------------------
 * WHY: Figma text style names come straight from the token path Token Studio
 * pushed them under (dots -> "/", leading "ob." stripped). Some of those paths
 * are structurally necessary in the JSON but noisy for a Figma user picking a
 * style. Same pattern already used for the compiled-tier color variables,
 * which trim the "ob/s/" prefix for panel usability — this is the text-style
 * equivalent.
 *
 * CAUTION — this only stays stable across re-exports if the underlying token
 * PATH does not change again. Token Studio matches styles by name derived
 * from the current path; the first time this ran against the typography
 * "authoring" composites (then at "ob.s.typography.grouped.*"), every
 * re-export from Token Studio silently recreated the old-named style
 * alongside the renamed one, because the token path itself had just changed
 * and the ref map no longer matched. The fix there was to shorten the token
 * path itself (now "ob.s.authoring.*") so no cosmetic rename is needed at
 * all. Reach for a JSON path rename over this script whenever the token path
 * was touched in the same round — use this script only for a name that is
 * purely presentational and the underlying path is otherwise stable.
 *
 * WHAT IT DOES: renames local TEXT STYLES whose name starts with a configured
 * prefix, replacing that prefix and leaving the rest of the name untouched.
 * It never touches the underlying token JSON, the CSS build, or variables —
 * purely a Figma-side display name. Safe to re-run: a style already on its
 * target name is a no-op.
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
    // 'rename' -> apply the matched renames
    mode: 'scan',

    // Safety: refuse to run unless the open file has this key. null = any file.
    // Read the key from the file URL: figma.com/design/<KEY>/<name>
    fileKeyGuard: null,

    // Ordered prefix-rename rules. First matching rule wins per style.
    // Verify the "from" prefix against the real style name in the Figma
    // panel before running 'rename' — this is a literal string match, not a
    // token-path guess.
    //
    // The typography "authoring" composites no longer need a rule here — the
    // token path itself is short now ("ob.s.authoring.*"), so Token Studio
    // already pushes the right name. The rule below is confirmed against the
    // real panel (2026-09-10): html heading/body styles push as
    // "html/heading/..." and "html/body/..." (not "h/..." — that shorter
    // prefix was the now-removed "h/link/..." duplicate), and that token path
    // has been stable since, so this cosmetic rename is safe to keep.
    renames: [
      { from: 'html/heading/', to: 'heading/' },
      { from: 'html/body/', to: 'body/' },
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
  const collisions = [];

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
      collisions.push({ from: s.name, to: newName, why: 'a style already has the target name' });
      continue;
    }
    plan.push({ id: s.id, from: s.name, to: newName });
  }

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    localTextStyles: styles.length,
    planned: plan.length,
    alreadyOnTarget: noop.length,
    collisions,
    plan,
    renamed: 0,
    failed: [],
  };

  // --- apply ---------------------------------------------------------------
  if (CONFIG.mode === 'rename') {
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
    // Rollback data: every original name, so the run can be reversed.
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
