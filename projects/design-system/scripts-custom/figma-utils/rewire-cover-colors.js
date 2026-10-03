/**
 * rewire-cover-colors.js — rebind a detached cover page's literal colors to
 * this library's own LOCAL semantic variables, matched by resolved value
 * ----------------------------------------------------------------------------
 * WHY: cover/thumbnail artwork gets pulled from an older library file (e.g.
 * "DesignSystem@Tokens V9.7") into an isolated buffer, fully detached from
 * every remote component/variable binding (see the detach step this script
 * does not cover — instances via node.detachInstance(), variable bindings via
 * the same technique as unbind-variables.js), then pasted into the current
 * library (e.g. "Oblique Design System R16 Prep"). After detach the node's
 * colors are plain literals — the old variable names ("Background/white",
 * "Text/High Emphasis") don't correspond to current Oblique naming, so there
 * is nothing to rename; the only way back to live variables is to match each
 * literal's RESOLVED color value against this file's own local variables and
 * bind fresh. This script is that matching + binding step, generalized so it
 * can be re-run for every new cover/thumbnail variant (this library keeps at
 * least two: one for the internal org library, one sized for Figma
 * Community — see FIGMA-WORKFLOW.md).
 *
 * WHAT IT DOES: walks the subtree under CONFIG.rootNodeId. For every SOLID
 * fill / stroke / vector-network-region fill, looks up its hex in
 * CONFIG.colorMap (falling back to CONFIG.nodeOverrides for a specific node
 * id when the same hex is legitimately ambiguous — e.g. white can mean
 * "background" almost everywhere but "icon glyph on a dark chip" in one
 * specific spot) and binds it to that local variable from
 * CONFIG.compiledCollectionName. Never touches token JSON or the CSS build —
 * purely a Figma-side rebind of this one page's artwork.
 *
 * WHAT IT DELIBERATELY LEAVES LITERAL (not a bug, not incomplete):
 *   - Fixed brand/heraldry constants that are not, and should not become, a
 *     design token (the Swiss flag's red/white — every cover so far has used
 *     a slightly different literal red per source asset, e.g. #ff0000 vs
 *     #e30613 — plus the wordmark).
 *   - Node subtrees matched by CONFIG.excludeNamePatterns: a self-or-
 *     ancestor node name match skips that whole subtree even where a color
 *     would otherwise match CONFIG.colorMap. Ships with patterns for the
 *     known non-brand cases seen so far: a "safe area" guide overlay, a
 *     "~helper / thumbnail-status" WIP badge (its yellow/near-black have no
 *     current semantic equivalent), a Figma Presentation-mode chrome replica
 *     ("_helper / presentation-header" — literally reproduces Figma's own
 *     "Press Control+G to show grids" hint, unrelated to Oblique brand
 *     colors), and the flag icon wrapper (cover-to-cover this has been
 *     either a single vector node with the flag as vectorNetwork regions,
 *     name "logo / flag", or two sibling vector nodes under a generic
 *     "Group 15" wrapper — both patterns are covered).
 *   - Any color with no exact match in colorMap/nodeOverrides: silently
 *     skipped, reported under 'unmatched'. A near-miss is not a match —
 *     do not add a "closest color" fallback here.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) figma-ds-cli:  figma-ds-cli eval -f rewire-cover-colors.js
 *  B) By hand: paste into the Desktop Bridge plugin console.
 *
 * CONFIGURE the CONFIG block below per cover, then run. Start with 'scan' —
 * review 'plan' and 'unmatched' before switching to 'rewire'.
 *
 * KNOWN ISSUE — figma-ds-cli eval silently returns nothing for this file
 * with its header comment intact (confirmed 2026-09-14, both `eval -f` and
 * inline `eval "$(cat ...)"`; not a backtick issue, this file has none).
 * Root cause not diagnosed. Workaround: strip the leading /** ... *\/ block
 * before running through the CLI, e.g.:
 *   node -e "const fs=require('fs');fs.writeFileSync('/tmp/run.js',
 *     fs.readFileSync('rewire-cover-colors.js','utf8').replace(/\/\*\*[\s\S]*?\*\//,''))"
 *   figma-ds-cli eval -f /tmp/run.js
 * Pasting into the Desktop Bridge console (option B) does not need this.
 * ----------------------------------------------------------------------------
 */

(async () => { try {
  // ====================== CONFIG — edit this block ==========================
  const CONFIG = {
    // 'scan'   -> report only, change nothing (ALWAYS run this first)
    // 'rewire' -> apply the matched bindings
    mode: 'scan',

    // Fallback safety when figma.fileKey is unavailable in this eval context
    // (observed via figma-ds-cli — see rename-text-styles.js). null = any name.
    fileNameGuard: 'Oblique Design System R16 Prep',

    // The frame/group holding this one cover's pasted content, e.g. the id
    // from the Figma URL's node-id after pasting into the library file.
    rootNodeId: null,

    // Local variable collection to bind against. This library's final,
    // single-mode semantic tier — see rename-variables.js's WHY note for how
    // this collection relates to the s1/s2 raw tiers.
    compiledCollectionName: '03_semantic/color/compiled',

    // hex (lowercase, no '#') -> variable name in compiledCollectionName.
    // Extend this as new covers surface new literal colors worth tokenizing.
    colorMap: {
      ffffff: 'color/neutral/bg/contrast_highest/inversity_normal',
      '1c2834': 'color/neutral/fg/contrast_high/inversity_normal',
      dfe4e9: 'color/neutral/border/subtle/inversity_normal',
    },

    // Per-node exceptions where colorMap's hex->variable choice is wrong for
    // that specific spot (e.g. white-as-background vs white-as-icon-on-dark).
    // { '<nodeId>': '<variable name>' }
    nodeOverrides: {},

    // Self-or-ancestor node name patterns (RegExp) — a match skips the whole
    // subtree, even for an otherwise-matching color. See WHAT IT DELIBERATELY
    // LEAVES LITERAL above for why each of these exists.
    excludeNamePatterns: [
      /presentation-header/i,
      /^logo\s*\/\s*flag$/i,
      /^Group 15$/,
      /safe area/i,
      /thumbnail-status/i,
    ],
  };
  // ==========================================================================

  if (CONFIG.fileNameGuard && figma.root.name !== CONFIG.fileNameGuard) {
    return JSON.stringify({
      ok: false,
      reason: 'FILE NAME GUARD — refusing to run',
      expected: CONFIG.fileNameGuard,
      open: { fileKey: figma.fileKey, name: figma.root.name },
    }, null, 2);
  }
  if (!CONFIG.rootNodeId) {
    return JSON.stringify({ ok: false, reason: 'CONFIG.rootNodeId is required (set it to this covers frame id)' });
  }

  const root = await figma.getNodeByIdAsync(CONFIG.rootNodeId);
  if (!root) {
    return JSON.stringify({ ok: false, reason: 'node ' + CONFIG.rootNodeId + ' not found' });
  }

  const allVars = await figma.variables.getLocalVariablesAsync();
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const compiledCol = cols.find((c) => c.name === CONFIG.compiledCollectionName);
  if (!compiledCol) {
    return JSON.stringify({ ok: false, reason: 'collection "' + CONFIG.compiledCollectionName + '" not found', collections: cols.map((c) => c.name) });
  }
  const varByName = new Map(allVars.filter((v) => v.variableCollectionId === compiledCol.id).map((v) => [v.name, v]));

  const toHex = (c) => [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const isExcluded = (name) => CONFIG.excludeNamePatterns.some((re) => re.test(name));

  const plan = []; // { nodeId, name, prop, hex, variable, regionIndex? }
  const unmatched = [];
  const missingVariables = new Set();

  const resolveVariableFor = (nodeId, hex) => {
    const varName = CONFIG.nodeOverrides[nodeId] || CONFIG.colorMap[hex];
    if (!varName) return null;
    const v = varByName.get(varName);
    if (!v) { missingVariables.add(varName); return null; }
    return v;
  };

  (function walk(n, excludedByAncestor) {
    const excluded = excludedByAncestor || isExcluded(n.name);
    if (!excluded) {
      if (Array.isArray(n.fills)) {
        n.fills.forEach((f, i) => {
          if (f && f.type === 'SOLID') {
            const hex = toHex(f.color);
            const v = resolveVariableFor(n.id, hex);
            if (v) plan.push({ nodeId: n.id, name: n.name, prop: 'fills', index: i, hex: '#' + hex, variable: v.name, varId: v.id });
            else unmatched.push({ nodeId: n.id, name: n.name, prop: 'fills[' + i + ']', hex: '#' + hex });
          }
        });
      }
      if (Array.isArray(n.strokes)) {
        n.strokes.forEach((f, i) => {
          if (f && f.type === 'SOLID') {
            const hex = toHex(f.color);
            const v = resolveVariableFor(n.id, hex);
            if (v) plan.push({ nodeId: n.id, name: n.name, prop: 'strokes', index: i, hex: '#' + hex, variable: v.name, varId: v.id });
            else unmatched.push({ nodeId: n.id, name: n.name, prop: 'strokes[' + i + ']', hex: '#' + hex });
          }
        });
      }
      if (n.vectorNetwork && n.vectorNetwork.regions && n.vectorNetwork.regions.length) {
        n.vectorNetwork.regions.forEach((r, ri) => {
          (r.fills || []).forEach((f, i) => {
            if (f && f.type === 'SOLID') {
              const hex = toHex(f.color);
              const v = resolveVariableFor(n.id, hex);
              if (v) plan.push({ nodeId: n.id, name: n.name, prop: 'vectorRegion', regionIndex: ri, index: i, hex: '#' + hex, variable: v.name, varId: v.id });
              else unmatched.push({ nodeId: n.id, name: n.name, prop: 'vectorRegion[' + ri + '].fills[' + i + ']', hex: '#' + hex });
            }
          });
        });
      }
    }
    if (n.children) n.children.forEach((c) => walk(c, excluded));
  })(root, false);

  const report = {
    ok: true,
    mode: CONFIG.mode,
    file: { name: figma.root.name, fileKey: figma.fileKey },
    root: { id: root.id, name: root.name },
    planned: plan.length,
    unmatched,
    missingVariables: [...missingVariables],
    plan,
    applied: { fills: 0, strokes: 0, vectorRegion: 0 },
    failed: [],
  };

  // --- apply -----------------------------------------------------------------
  if (CONFIG.mode === 'rewire') {
    // setBoundVariableForPaint's third argument must be the Variable object
    // itself (not its id) — resolve every id used in the plan up front.
    const varByIdForApply = new Map(allVars.filter((v) => v.variableCollectionId === compiledCol.id).map((v) => [v.id, v]));

    // Group plan entries by node id x prop so paint arrays / vector networks
    // are only reassigned once per node, with every matched index applied.
    const byNode = new Map(); // nodeId -> { fills: Map<index, varId>, strokes: Map, vectorRegion: Map<'ri:i', varId> }
    for (const p of plan) {
      const entry = byNode.get(p.nodeId) || { fills: new Map(), strokes: new Map(), vectorRegion: new Map() };
      if (p.prop === 'vectorRegion') entry.vectorRegion.set(p.regionIndex + ':' + p.index, p.varId);
      else entry[p.prop].set(p.index, p.varId);
      byNode.set(p.nodeId, entry);
    }

    for (const [nodeId, entry] of byNode) {
      const n = await figma.getNodeByIdAsync(nodeId);
      if (!n) { report.failed.push({ nodeId, err: 'node vanished mid-run' }); continue; }
      try {
        if (entry.fills.size && Array.isArray(n.fills)) {
          const next = n.fills.map((f, i) => {
            if (!entry.fills.has(i)) return f;
            const variable = varByIdForApply.get(entry.fills.get(i));
            const bound = figma.variables.setBoundVariableForPaint(f, 'color', variable);
            report.applied.fills++;
            return bound;
          });
          n.fills = next;
        }
        if (entry.strokes.size && Array.isArray(n.strokes)) {
          const next = n.strokes.map((f, i) => {
            if (!entry.strokes.has(i)) return f;
            const variable = varByIdForApply.get(entry.strokes.get(i));
            const bound = figma.variables.setBoundVariableForPaint(f, 'color', variable);
            report.applied.strokes++;
            return bound;
          });
          n.strokes = next;
        }
        if (entry.vectorRegion.size && n.vectorNetwork) {
          const vn = n.vectorNetwork;
          const newRegions = vn.regions.map((r, ri) => ({
            ...r,
            fills: r.fills.map((f, i) => {
              const key = ri + ':' + i;
              if (!entry.vectorRegion.has(key)) return f;
              const variable = varByIdForApply.get(entry.vectorRegion.get(key));
              const bound = figma.variables.setBoundVariableForPaint(f, 'color', variable);
              report.applied.vectorRegion++;
              return bound;
            }),
          }));
          await n.setVectorNetworkAsync({ ...vn, regions: newRegions });
        }
      } catch (e) {
        report.failed.push({ nodeId, err: String(e) });
      }
    }

    // Flush-delay before the eval process exits — same tight-synchronous-
    // loop caveat documented in _readme.md and every other script here.
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('[rewire-cover-colors]', JSON.stringify(report, null, 2));
  return JSON.stringify(report, null, 2);
  } catch (e) {
    return JSON.stringify({ ok: false, error: String(e), stack: e && e.stack });
  }
})()
