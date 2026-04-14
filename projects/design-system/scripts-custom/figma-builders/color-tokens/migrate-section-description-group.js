/**
 * migrate-section-description-group.js
 *
 * One-time migration for the _Section Bar component and all four Section Bar
 * instances on the 🎨  Colors – Maintainer page.
 *
 * Changes made to component `_Section Bar` (9544:35238):
 *   - Renames text layer `purpose`   → `description`  (in Description Group)
 *   - Deletes text layer `guideline`                  (in Description Group)
 *
 * Then populates each Section Bar instance with the $description taken from
 * the token_family_docs node in the corresponding source token JSON file:
 *   - Primitive  ← src/lib/themes/02_primitive/color.json
 *   - S1         ← src/lib/themes/03_semantic/color/s1_lightness/light.json
 *   - S2         ← src/lib/themes/03_semantic/color/s2_emphasis/high.json
 *   - S3         ← src/lib/themes/03_semantic/color/compiled.json
 *
 * Run via Figma MCP `figma_execute` with this file's inner async IIFE, or
 * paste directly into the Figma Console when the Desktop Bridge plugin is active.
 *
 * ⚠ Safe to re-run: if `guideline` is already gone or `purpose` is already
 *   named `description`, those steps are skipped cleanly.
 */

// ── Figma script payload (run via figma_execute / Figma Console) ─────────────

(async () => {
  // ── IDs ──────────────────────────────────────────────────────────────────

  const COMPONENT_ID  = '9544:35238';  // _Section Bar (base component)
  const PURPOSE_ID    = '9544:35253';  // purpose TEXT (to rename → description)
  const GUIDELINE_ID  = '9544:35254';  // guideline TEXT (to delete)

  // Descriptions from token_family_docs.$description in source JSON files
  const SECTION_BARS = [
    {
      tier:        'primitive',
      instanceId:  '9544:34305',
      description: 'Scales provided by Bundeskanzlei Design System and additional Oblique custom primitive colors.',
    },
    {
      tier:        's1',
      instanceId:  '9544:34471',
      description: 'Source file for S1 color tokens in the Light theme. Usage guidelines are documented per color family — see Neutral, Interaction, Status, and Free.',
    },
    {
      tier:        's2',
      instanceId:  '9544:34787',
      description: 'State-based color mapping for interaction elements. Interactive state colors for components. Both Lightness (Light/Dark) and Emphasis (High/Low) modes affect resolved values across all 4 columns. Do: Reference when authoring compiled interaction tokens that require emphasis resolution. Avoid: Do not assign directly to component tokens — use compiled S-tier tokens instead.',
    },
    {
      tier:        's3',
      instanceId:  '9544:34878',
      description: 'Fully resolved semantic color tokens — neutral, interaction, status, free, and brand. No mode resolution required. Use these tokens in component and HTML token files. Do: Use when assigning color values in component and HTML token files. Compiled tokens are fully resolved — mode handling is integrated. Avoid: Do not reference S1 tokens directly in components — S1 is a bridging layer where mode handling is partial. Always use compiled tokens.',
    },
  ];

  const log = [];

  // ── Step 1: Modify _Section Bar component ─────────────────────────────────

  const comp = await figma.getNodeByIdAsync(COMPONENT_ID);
  if (!comp) return { error: 'Component ' + COMPONENT_ID + ' not found' };

  const purposeNode   = await figma.getNodeByIdAsync(PURPOSE_ID);
  const guidelineNode = await figma.getNodeByIdAsync(GUIDELINE_ID);

  if (purposeNode && purposeNode.type === 'TEXT' && purposeNode.name !== 'description') {
    purposeNode.name = 'description';
    log.push({ action: 'renamed', from: 'purpose', to: 'description' });
  } else if (purposeNode?.name === 'description') {
    log.push({ action: 'skipped', note: 'purpose already renamed to description' });
  } else {
    log.push({ action: 'warning', note: 'purpose node not found' });
  }

  if (guidelineNode) {
    guidelineNode.remove();
    log.push({ action: 'deleted', node: 'guideline' });
  } else {
    log.push({ action: 'skipped', note: 'guideline node not found (already deleted)' });
  }

  // ── Step 2: Preload fonts ─────────────────────────────────────────────────

  for (const style of ['Regular', 'Medium', 'SemiBold', 'Bold', 'Light']) {
    try { await figma.loadFontAsync({ family: 'Noto Sans', style }); } catch (e) {}
  }

  // ── Step 3: Populate description text in each instance ────────────────────

  for (const { tier, instanceId, description } of SECTION_BARS) {
    const inst = await figma.getNodeByIdAsync(instanceId);
    if (!inst) { log.push({ tier, ok: false, error: 'instance not found' }); continue; }

    const descNode = inst.findOne(n => n.name === 'description' && n.type === 'TEXT');
    if (!descNode) { log.push({ tier, ok: false, error: 'description text node not found' }); continue; }

    try {
      await figma.loadFontAsync(descNode.fontName);
      descNode.characters = description;
      log.push({ tier, ok: true, textLength: description.length });
    } catch (e) {
      log.push({ tier, ok: false, error: String(e) });
    }
  }

  return { log };
})()
